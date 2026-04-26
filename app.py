import os
import base64
import requests
import re
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

VISION_API_KEY = os.environ.get("VISION_API_KEY")


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
            "headline": "🔴 AVOID",
            "goblin_message": "🚫 The goblin screams! Step away from the snack.",
            "explanation": f"""
            Gluten ingredients were detected.<br><br>
            <b>Why:</b><br>
            • {', '.join(found_in_ingredients).title()}<br><br>
            <b>Goblin Tip:</b><br>
            Choose a certified gluten-free alternative.
            """
        }

    if warned_in_may_contain:
        return {
            "status": "CAUTION",
            "headline": "🟡 USE CAUTION",
            "goblin_message": "⚠️ The goblin smells suspicious crumbs.",
            "explanation": """
            This product may have cross-contact risk.<br><br>
            <b>Why:</b><br>
            • “May contain” allergen warning detected<br>
            • Shared facility/equipment possible<br><br>
            <b>Goblin Tip:</b><br>
            Choose certified gluten-free if highly sensitive.
            """
        }

    if has_certification:
        return {
            "status": "SAFE",
            "headline": "🟢 SAFE TO ENJOY",
            "goblin_message": "🎉 The goblin approves this snack.",
            "explanation": """
            No obvious gluten risks were detected.<br><br>
            <b>Why:</b><br>
            • Gluten-free certification or trusted marker found<br>
            • No wheat, barley, rye, or malt detected<br><br>
            <b>Goblin Tip:</b><br>
            Always re-check labels when packaging changes.
            """
        }

    if has_claim:
        return {
            "status": "CAUTION",
            "headline": "🟡 LIKELY SAFE",
            "goblin_message": "🙂 The goblin sees a gluten-free claim.",
            "explanation": """
            Product claims to be gluten-free, but certification was not confirmed.<br><br>
            <b>Why:</b><br>
            • Gluten-free wording detected<br>
            • No major gluten ingredients found<br><br>
            <b>Goblin Tip:</b><br>
            Certified products offer stronger confidence.
            """
        }

    return {
        "status": "UNKNOWN",
        "headline": "⚪ NEEDS REVIEW",
        "goblin_message": "🤔 The goblin needs more clues.",
        "explanation": """
        The goblin could not confirm this product from the photos.<br><br>

        <b>Why:</b><br>
        • Ingredients or allergen warnings may be blurry/incomplete<br>
        • Certification marks may not be visible<br>
        • Some gluten risks depend on manufacturing details<br><br>

        <b>Goblin Tip:</b><br>
        Retake clear photos of the ingredients list and allergen statement, or check the brand’s official product page.
        """
    }


@app.route("/analyze", methods=["POST"])
def analyze():
    if "front_image" not in request.files or "back_image" not in request.files:
        return jsonify({
            "status": "ERROR",
            "headline": "ERROR",
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

        result = analyze_gluten_label(combined_text, logo_found) or {
            "status": "UNKNOWN",
            "headline": "⚪ NEEDS REVIEW",
            "goblin_message": "🤔 The goblin needs more clues.",
            "explanation": "Retake clearer front and back photos."
            }

        result["product_name"] = "Photo Scan Result"
        result["front_text"] = front_text
        result["back_text"] = back_text

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "status": "ERROR",
            "headline": "ERROR",
            "product_name": "Photo Scan Result",
            "goblin_message": "👹 The goblin tripped over the Vision API wires.",
            "explanation": str(e)
        }), 500




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)