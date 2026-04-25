import os
import json
from flask import Flask, render_template, request, jsonify
from google.cloud import vision
from google import genai

app = Flask(__name__)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

@app.route("/")
def home():
    return render_template("index.html")
import os
import json
import re
from flask import Flask, render_template, request, jsonify
from google.cloud import vision
from google import genai

app = Flask(__name__)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")


@app.route("/")
def home():
    return render_template("index.html")


def extract_text_from_image(image_bytes):
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=image_bytes)

    response = client.text_detection(image=image)

    if response.error.message:
        raise Exception(response.error.message)

    texts = response.text_annotations
    return texts[0].description if texts else ""


def extract_json_from_text(text):
    try:
        return json.loads(text)
    except:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError("Gemini did not return valid JSON.")


def add_goblin_effects(result):
    status = result.get("status", "CAUTION").upper()
    result["status"] = status

    if status == "SAFE":
        result["animation"] = "happy"
        result["audio"] = "/static/audio/safe.mp3"
    elif status == "AVOID":
        result["animation"] = "scream"
        result["audio"] = "/static/audio/avoid.mp3"
    else:
        result["animation"] = "caution"
        result["audio"] = "/static/audio/caution.mp3"

    return result


def analyze_gluten_risk(label_text):
    if not GEMINI_API_KEY:
        raise Exception("GEMINI_API_KEY is not set.")

    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = f"""
You are Gluten Goblin, a fun but careful assistant for people with celiac disease.

Analyze this food label text for gluten risk.

Return ONLY valid JSON in this exact format:
{{
  "status": "SAFE or CAUTION or AVOID",
  "goblin_message": "A short funny goblin reaction",
  "explanation": "A calm explanation for the user"
}}

Rules:
- If it contains wheat, barley, rye, malt, brewer's yeast, or regular oats as ingredients, status should usually be AVOID.
- If it says may contain wheat and has no certification, status should be CAUTION.
- If it is certified gluten-free but says may contain wheat, explain calmly that certification usually involves controls/testing, but do not guarantee safety.
- Never say 100% safe.
- Keep the tone reassuring, not scary.
- If the image text is unclear or incomplete, use CAUTION.

Food label text:
{label_text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    result = extract_json_from_text(response.text.strip())
    return add_goblin_effects(result)


@app.route("/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    try:
        image_file = request.files["image"]
        image_bytes = image_file.read()

        extracted_text = extract_text_from_image(image_bytes)
        result = analyze_gluten_risk(extracted_text)

        result["extracted_text"] = extracted_text
        return jsonify(result)

    except Exception as e:
        return jsonify({
            "status": "ERROR",
            "goblin_message": "👹 The goblin tripped over the API wires.",
            "explanation": str(e),
            "animation": "caution",
            "audio": "/static/audio/caution.mp3"
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)

def extract_text_from_image(image_bytes):
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=image_bytes)

    response = client.text_detection(image=image)
    texts = response.text_annotations

    if response.error.message:
        raise Exception(response.error.message)

    if texts:
        return texts[0].description

    return ""


def analyze_gluten_risk(label_text):
    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = f"""
    You are Gluten Goblin, a fun but careful assistant for people with celiac disease.

    Analyze this food label text for gluten risk.

    Return ONLY valid JSON in this exact format:
    {{
      "status": "SAFE or CAUTION or AVOID",
      "goblin_message": "A short funny goblin reaction",
      "explanation": "A calm explanation for the user"
    }}

    Rules:
    - If it contains wheat, barley, rye, malt, brewer's yeast, or regular oats, status should usually be AVOID.
    - If it says may contain wheat and has no certification, status should be CAUTION.
    - If it is certified gluten-free but says may contain wheat, explain calmly that certification usually involves controls/testing, but do not guarantee safety.
    - Never say 100% safe.
    - Keep the tone reassuring, not scary.

    Food label text:
    {label_text}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    try:
        return json.loads(text)
    except:
        return {
            "status": "CAUTION",
            "goblin_message": "Hmm... the goblin is confused by this label.",
            "explanation": text
        }


@app.route("/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    image_bytes = image_file.read()

    extracted_text = extract_text_from_image(image_bytes)
    result = analyze_gluten_risk(extracted_text)

    result["extracted_text"] = extracted_text

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)