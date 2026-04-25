import json
import subprocess

def analyze_label():
    api_key = "AIzaSyAA5_SEGOqVI_rq3VOgcl6UpuE_BgY3xzM"
    
    # Load your blacklist from the text file
    try:
        with open("gluten_ingredients.txt", "r") as f:
            gluten_blacklist = [line.strip().lower() for line in f if line.strip()]
    except FileNotFoundError:
        print("Error: gluten_ingredients.txt not found!")
        return

    # Run the API call
    command = f'curl -s -X POST -H "Content-Type: application/json" --data-binary @request.json "https://vision.googleapis.com/v1/images:annotate?key={api_key}"'
    result = subprocess.check_output(command, shell=True)
    data = json.loads(result)

    # Get the specific response for our image
    response = data['responses'][0]

    print("\n" + "="*40)
    print("🔍 GLUTEN-FREE ANALYSIS REPORT")
    print("="*40)

    # --- PART A: LOGO ANALYSIS ---
    print("\n[STEP 1: LOGO SCAN]")
    if 'logoAnnotations' in response:
        for logo in response['logoAnnotations']:
            brand = logo['description']
            print(f"✅ FOUND LOGO: {brand}")
            print(f"   Reason: Google identified the official '{brand}' symbol on the packaging.")
    else:
        print("ℹ️  No official certification logos detected.")

    # --- PART B: TEXT/INGREDIENT ANALYSIS ---
    print("\n[STEP 2: INGREDIENT SCAN]")
    try:
        detected_text = response['fullTextAnnotation']['text'].lower()
        
        # Check for the claim
        if "gluten free" in detected_text:
            print("✅ FOUND TEXT: 'Gluten Free'")
            print("   Reason: The manufacturer has printed a gluten-free claim on the label.")

        # Check for forbidden ingredients
        found_bad_stuff = [item for item in gluten_blacklist if item in detected_text]
        
        if found_bad_stuff:
            print(f"❌ DANGER: Contains {', '.join(found_bad_stuff)}")
            print(f"   Reason: These ingredients were found in the text and match your 'ingredients.txt' blacklist.")
        else:
            print("👍 CLEAN: No blacklisted ingredients found in the text.")

    except KeyError:
        print("⚠️  Error: Could not read any text from this image.")

    print("\n" + "="*40)

if __name__ == "__main__":
    analyze_label()