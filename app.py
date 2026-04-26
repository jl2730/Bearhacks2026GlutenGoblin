import os
import base64
import requests
import re
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

#VISION_API_KEY = os.environ.get("VISION_API_KEY")
VISION_API_KEY = "AIzaSyAA5_SEGOqVI_rq3VOgcl6UpuE_BgY3xzM"


@app.route("/")
def home():
    return render_template("index.html")


def load_blacklist():
    try:
        with open("gluten_ingredients.txt", "r") as f:
            return [line.strip().lower() for line in f if line.strip()]
    except FileNotFoundError:
        return ["wheat", "barley", "rye", "malt", "brewer's yeast", "regular oats"]


def contains_gluten_term(text, term):
    pattern = r"\b" + re.escape(term) + r"\b"
    return re.search(pattern, text) is not None


def extract_text_with_vision(image_bytes):
    if not VISION_API_KEY:
        raise Exception("VISION_API_KEY is not set.")

    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    url = f"https://vision.googleapis.com/v1/images:annotate?key={VISION_API_KEY}"

    payload = {
        "requests": [
            {
                "image": {"content": image_base64},
                "features": [
                    {"type": "TEXT_DETECTION"},
                    {"type": "LOGO_DETECTION"}
                ]
            }
        ]
    }

    response = requests.post(url, json=payload)
    data = response.json()

    if "error" in data:
        raise Exception(data["error"].get("message", "Vision API error"))

    vision_response = data["responses"][0]

    text = ""
    if "textAnnotations" in vision_response:
        text = vision_response["textAnnotations"][0]["description"]

    logo_found = "logoAnnotations" in vision_response

    return text.lower().replace("\n", " "), logo_found


def analyze_gluten_label(label_text, logo_found):
    gluten_blacklist = load_blacklist()

    certification_markers = [
    "gfco",
    "certified gluten free",
    "certified gluten-free",
    "gluten free certified",
    "gluten-free certified",
    "certified gf",
    "gf certified",
    "certified by",
    "gluten-free certification",
    "gluten free certification",
    "cca",
    "beyond celiac",
    "celiac association",
    "certified gluten",
    "certified free from gluten",
    "gluten-free food program",
    "gffp"
]

    has_certification = logo_found or any(marker in label_text for marker in certification_markers)

    has_claim = (
        "gluten free" in label_text
        or "gluten-free" in label_text
    )

    warned_in_may_contain = False
    found_in_ingredients = []

    if "may contain" in label_text:
        parts = label_text.split("may contain", 1)
        ingredient_section = parts[0]
        warning_section = parts[1]

        found_in_ingredients = [
            item for item in gluten_blacklist
            if contains_gluten_term(ingredient_section, item)
        ]

        if any(word in warning_section for word in ["wheat", "barley", "rye", "gluten"]):
            warned_in_may_contain = True

    else:
        found_in_ingredients = [
            item for item in gluten_blacklist
            if contains_gluten_term(label_text, item)
        ]

    if found_in_ingredients:
        return {
            "status": "AVOID",
            "goblin_message": "🚫 THE GOBLIN SCREAMS! Back away from the snack!",
            "explanation": (
                f"🛡️ GLUTEN-FREE SAFETY ANALYSIS REPORT<br><br>"
                f"🔴 STATUS: NOT SAFE<br>"
                f"❌ Danger: Found gluten-risk ingredient(s): {', '.join(found_in_ingredients).upper()}<br>"
                f"👉 Do not consume if you need to avoid gluten for celiac safety."
            )
        }

    if warned_in_may_contain:
        if has_certification:
            explanation = (
                f"🛡️ GLUTEN-FREE SAFETY ANALYSIS REPORT<br><br>"
                f"🟡 STATUS: CAUTION<br>"
                f"⚠️ Gluten-free certification/marker was detected, but the label also mentions a possible cross-contact warning.<br>"
                f"👉 This often means shared facility or equipment. Certification usually involves controls/testing, but this app cannot guarantee safety."
            )
        else:
            explanation = (
                f"🛡️ GLUTEN-FREE SAFETY ANALYSIS REPORT<br><br>"
                f"🟡 STATUS: CAUTION<br>"
                f"⚠️ Warning: Product may contain wheat/gluten or has cross-contact risk.<br>"
                f"👉 No certification was detected to verify safety in a shared facility."
            )

        return {
            "status": "CAUTION",
            "goblin_message": "⚠️ Suspicious crumbs detected.",
            "explanation": explanation
        }

    if has_certification:
        return {
            "status": "SAFE",
            "goblin_message": "🎶 The goblin sings! You may feast, traveler!",
            "explanation": (
                f"🛡️ GLUTEN-FREE SAFETY ANALYSIS REPORT<br><br>"
                f"🟢 STATUS: SAFE<br>"
                f"✅ Gluten-free certification/marker detected.<br>"
                f"👉 No obvious gluten-risk ingredients or warning text were found.<br>"
                f"⚠️ This app cannot guarantee zero risk, but this appears to be a safer choice."
            )
        }

    if has_claim:
        return {
            "status": "CAUTION",
            "goblin_message": "⚠️ The goblin sees a gluten-free claim, but wants proof.",
            "explanation": (
                f"🛡️ GLUTEN-FREE SAFETY ANALYSIS REPORT<br><br>"
                f"🟡 STATUS: CAUTION<br>"
                f"⚠️ Manufacturer claims gluten-free, but certification was not clearly detected.<br>"
                f"👉 It may be okay, but certification gives stronger confidence for celiac safety."
            )
        }

    return {
        "status": "UNKNOWN",
        "goblin_message": "👹 The goblin cannot decide.",
        "explanation": (
            f"🛡️ GLUTEN-FREE SAFETY ANALYSIS REPORT<br><br>"
            f"⚪ STATUS: UNKNOWN<br>"
            f"❔ No clear gluten-free certification, gluten-free claim, gluten-risk ingredient, or warning was found.<br>"
            f"👉 Try a clearer photo of the ingredients/allergen statement or check manually."
        )
    }


@app.route("/analyze", methods=["POST"])
def analyze():
    if "front_image" not in request.files or "back_image" not in request.files:
        return jsonify({
            "status": "ERROR",
            "product_name": "Photo Scan Result",
            "goblin_message": "👹 The goblin needs both sides.",
            "explanation": "Please upload/take a front and back photo of the product."
        }), 400

    try:
        front_file = request.files["front_image"]
        back_file = request.files["back_image"]

        front_text, front_logo = extract_text_with_vision(front_file.read())
        back_text, back_logo = extract_text_with_vision(back_file.read())

        combined_text = f"{front_text} {back_text}"
        logo_found = front_logo or back_logo

        result = analyze_gluten_label(combined_text, logo_found)

        result["product_name"] = "Photo Scan Result"
        result["explanation"] += (
            f"<br><br>"
            f"Detected from: Cloud Vision front + back photo scan<br>"
            f"Front OCR Text Found: {'Yes' if front_text else 'No'}<br>"
            f"Back OCR Text Found: {'Yes' if back_text else 'No'}<br>"
            f"Certification/Logo Detected: {'Yes' if logo_found else 'No'}"
        )

        result["front_text"] = front_text
        result["back_text"] = back_text

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "status": "ERROR",
            "product_name": "Photo Scan Result",
            "goblin_message": "👹 The goblin tripped over the Vision API wires.",
            "explanation": str(e)
        }), 500


@app.route("/analyze-barcode", methods=["POST"])
def analyze_barcode():
    data = request.get_json()
    barcode = data.get("barcode", "").strip()

    if not barcode:
        return jsonify({
            "status": "ERROR",
            "product_name": "",
            "goblin_message": "👹 The goblin needs a barcode.",
            "explanation": "Please enter or scan a barcode."
        }), 400

    try:
        url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"

        response = requests.get(
            url,
            headers={"User-Agent": "GlutenGoblin/1.0"},
            timeout=10
        )

        if response.status_code != 200:
            return jsonify({
                "status": "ERROR",
                "product_name": "",
                "goblin_message": "👹 The goblin could not contact the snack library.",
                "explanation": f"API returned status {response.status_code}"
            })

        product_data = response.json()

        if product_data.get("status") != 1:
            return jsonify({
                "status": "UNKNOWN",
                "product_name": "Unknown product",
                "goblin_message": "👹 The goblin could not find this snack.",
                "explanation": "This barcode was not found in Open Food Facts. Try another product or use the photo scan backup."
            })

        product = product_data.get("product", {})

        product_name = product.get("product_name", "Unknown product")
        brand = product.get("brands", "Unknown brand")

        ingredients = product.get("ingredients_text", "").lower()
        allergens = " ".join(product.get("allergens_tags", [])).lower()
        traces = " ".join(product.get("traces_tags", [])).lower()
        labels = " ".join(product.get("labels_tags", [])).lower()

        print("PRODUCT:", product_name)
        print("BRAND:", brand)
        print("INGREDIENTS:", ingredients)
        print("ALLERGENS:", allergens)
        print("TRACES:", traces)
        print("LABELS:", labels)

        combined_text = f"{ingredients} {allergens} {traces} {labels}"

        result = analyze_gluten_label(combined_text, logo_found=False)
        result["product_name"] = product_name
        result["explanation"] += (
            f"<br><br>"
            f"Product: {product_name}<br>"
            f"Brand: {brand}<br>"
            f"Detected from: Open Food Facts barcode database<br>"
            f"Ingredients found: {'Yes' if ingredients else 'No'}<br>"
            f"Allergen data found: {'Yes' if allergens else 'No'}<br>"
            f"Trace warning data found: {'Yes' if traces else 'No'}<br>"
            f"Label data found: {'Yes' if labels else 'No'}<br><br>"
            f"Why this result happened:<br>"
            f"The barcode database may have the product name/brand but may not include enough ingredient, allergen, trace, or certification data to make a confident gluten-safety decision.<br>"
            f"If this says UNKNOWN, use the front/back photo scan so Cloud Vision can read the actual package."
        )

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "status": "ERROR",
            "product_name": "",
            "goblin_message": "👹 The goblin dropped the barcode scanner.",
            "explanation": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)