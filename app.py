import base64
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)
API_KEY = "AIzaSyAA5_SEGOqVI_rq3VOgcl6UpuE_BgY3xzM"

def load_blacklist():
    try:
        with open("gluten_ingredients.txt", "r") as f:
            return [line.strip().lower() for line in f if line.strip()]
    except FileNotFoundError:
        return ["wheat", "barley", "rye", "malt"]

def analyze_image(image_bytes, front_bytes=None):
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    payload = {
        "requests": [{
            "image": {"content": image_b64},
            "features": [
                {"type": "TEXT_DETECTION"},
                {"type": "LOGO_DETECTION"}
            ]
        }]
    }
    resp = requests.post(
        f"https://vision.googleapis.com/v1/images:annotate?key={API_KEY}",
        json=payload,
        timeout=15,
    )
    resp.raise_for_status()
    response = resp.json()["responses"][0]

    gluten_blacklist = load_blacklist()

    all_text = ""
    if "textAnnotations" in response:
        all_text = response["textAnnotations"][0]["description"].lower().replace("\n", " ")

    has_certification = False
    cert_info = "None"
    if "logoAnnotations" in response:
        has_certification = True
        cert_info = "Certified GF"
    elif any(m in all_text for m in ["gfco", "certified gluten", "cca"]):
        has_certification = True
        cert_info = "Certified GF"

    # Also check front image for certification logos if provided
    if not has_certification and front_bytes:
        front_b64 = base64.b64encode(front_bytes).decode("utf-8")
        front_resp = requests.post(
            f"https://vision.googleapis.com/v1/images:annotate?key={API_KEY}",
            json={"requests": [{"image": {"content": front_b64}, "features": [{"type": "LOGO_DETECTION"}, {"type": "TEXT_DETECTION"}]}]},
            timeout=15,
        )
        if front_resp.ok:
            front_response = front_resp.json()["responses"][0]
            if "logoAnnotations" in front_response:
                has_certification = True
                cert_info = "Certified GF"
            else:
                front_text = ""
                if "textAnnotations" in front_response:
                    front_text = front_response["textAnnotations"][0]["description"].lower()
                if any(m in front_text for m in ["gfco", "certified gluten", "cca"]):
                    has_certification = True
                    cert_info = "Certified GF"

    has_claim = "gluten free" in all_text or "gluten-free" in all_text

    found_in_ingredients = []
    warned_in_may_contain = False

    if "may contain" in all_text:
        parts = all_text.split("may contain")
        ingredient_section = parts[0]
        warning_section = parts[1]
        found_in_ingredients = [i for i in gluten_blacklist if i in ingredient_section]
        if any(g in warning_section for g in ["wheat", "barley", "rye", "gluten"]):
            warned_in_may_contain = True
    else:
        found_in_ingredients = [i for i in gluten_blacklist if i in all_text]

    if found_in_ingredients:
        status, color, emoji = "NOT SAFE", "#e53935", "🔴"
        messages = [
            f"Contains: {', '.join(found_in_ingredients).upper()}",
            "Do not consume — these are definite gluten sources.",
        ]
    elif warned_in_may_contain:
        status, color, emoji = "CAUTION", "#fb8c00", "🟡"
        if has_certification:
            messages = [
                f"Detected: {cert_info}",
                "Label mentions potential cross-contact (may contain wheat).",
                "Certified safe (<20 ppm), but shared facility warning present.",
            ]
        else:
            messages = [
                "Potential cross-contamination (may contain wheat).",
                "No certification found to verify safety.",
            ]
    elif has_certification:
        status, color, emoji = "SAFE", "#43a047", "🟢"
        messages = [
            f"Verified: {cert_info} detected.",
            "High confidence — certified and no warnings found.",
        ]
    elif has_claim:
        status, color, emoji = "CAUTION", "#fb8c00", "🟡"
        messages = ["Manufacturer claims 'Gluten Free' but no certification detected."]
    else:
        status, color, emoji = "UNKNOWN", "#757575", "⚪"
        messages = ["Could not determine gluten status from the label."]

    return {
        "status": status,
        "color": color,
        "emoji": emoji,
        "messages": messages,
        "ocr_found": bool(all_text),
        "certification": cert_info,
        "gf_claim": has_claim,
        "facility_warning": warned_in_may_contain,
        "found_in_ingredients": found_in_ingredients,
    }


@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files.get("photo")
    if not file or file.filename == "":
        return jsonify({"error": "No photo uploaded."}), 400
    try:
        front_file = request.files.get("front_photo")
        front_bytes = front_file.read() if front_file else None
        result = analyze_image(file.read(), front_bytes)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # 0.0.0.0 makes the server reachable from other devices on the same Wi-Fi
    app.run(host="0.0.0.0", port=5000, debug=False)
