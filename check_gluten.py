import json
import subprocess

def analyze_label():
    api_key = "AIzaSyB4WY2wfsyJg_-IFOyz51Hv9S0X6FhcI9U"
    
    # --- STEP 1: LOAD BLACKLIST ---
    try:
        with open("gluten_ingredients.txt", "r") as f:
            gluten_blacklist = [line.strip().lower() for line in f if line.strip()]
    except FileNotFoundError:
        gluten_blacklist = ["wheat", "barley", "rye", "malt"]

    # --- STEP 2: CALL GOOGLE VISION API ---
    command = f'curl -s -X POST -H "Content-Type: application/json" --data-binary @request.json "https://vision.googleapis.com/v1/images:annotate?key={api_key}"'
    result = subprocess.check_output(command, shell=True)
    data = json.loads(result)
    response = data['responses'][0]

    # --- STEP 3: DATA EXTRACTION ---
    all_text = ""
    if 'textAnnotations' in response:
        all_text = response['textAnnotations'][0]['description'].lower().replace('\n', ' ')

    # 1. Detect Certification
    has_certification = False
    cert_info = "None"
    if 'logoAnnotations' in response:
        has_certification = True
        cert_info = "Certified GF"
    elif any(marker in all_text for marker in ["gfco", "certified gluten", "cca"]):
        has_certification = True
        cert_info = "Certified GF"

    # 2. Detect Manufacturer's Claim
    has_claim = "gluten free" in all_text or "gluten-free" in all_text

    # 3. ADVANCED ANALYSIS: Ingredients vs. Warnings
    found_in_ingredients = []
    warned_in_may_contain = False
    
    # Split text at "may contain" to separate the actual ingredients from the warning
    if "may contain" in all_text:
        parts = all_text.split("may contain")
        ingredient_section = parts[0]
        warning_section = parts[1]
        
        # Check if wheat/barley/rye is in the actual ingredient list
        found_in_ingredients = [item for item in gluten_blacklist if item in ingredient_section]
        
        # Check if the warning section mentions gluten
        if any(g_source in warning_section for g_source in ["wheat", "barley", "rye", "gluten"]):
            warned_in_may_contain = True
    else:
        # If no "may contain" exists, check the whole text for blacklisted items
        found_in_ingredients = [item for item in gluten_blacklist if item in all_text]

    # --- STEP 4: FINAL REPORT OUTPUT ---
    print("\n" + "="*50)
    print("🛡️  GLUTEN-FREE SAFETY ANALYSIS REPORT")
    print("="*50)

    if found_in_ingredients:
        # LEVEL: NOT SAFE (Actual Ingredients)
        print("🔴 STATUS: NOT SAFE")
        print(f"❌ DANGER: Contains blacklisted ingredients: {', '.join(found_in_ingredients).upper()}")
        print("👉 Do not consume. These ingredients are definite sources of gluten.")
    
    elif warned_in_may_contain:
        # LEVEL: CAUTION (The "Unreal Gems" Case)
        print("🟡 STATUS: CAUTION")
        if has_certification:
            print(f"⚠️  Detected: {cert_info}")
            print("⚠️  Warning: Label mentions potential cross-contact (May contain wheat).")
            print("👉 Certified safe (<20ppm), but contains a shared facility warning.")
        else:
            print("⚠️  DANGER: Potential cross-contamination (May contain wheat).")
            print("👉 No certification found to verify safety in a shared facility.")

    elif has_certification:
        print("🟢 STATUS: SAFE")
        print(f"✅ Verified: {cert_info} detected.")
        print("👉 High confidence: Certified and no warnings found.")

    elif has_claim:
        print("🟡 STATUS: CAUTION")
        print("⚠️  Manufacturer claims 'Gluten Free' but no certification was detected.")

    else:
        print("⚪ STATUS: UNKNOWN")

    # TECHNICAL BREAKDOWN
    print("\n[TECHNICAL BREAKDOWN]")
    print(f" - OCR Text Found:  {'Yes' if all_text else 'No'}")
    print(f" - Certification:   {cert_info}")
    print(f" - Mfr GF Claim:    {'Yes' if has_claim else 'No'}")
    print(f" - Facility Warn:   {'Yes' if warned_in_may_contain else 'No'}")
    print("="*50 + "\n")

if __name__ == "__main__":
    analyze_label()