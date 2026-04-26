# 👹 Bearhacks2026: Gluten Goblin

**Gluten Goblin** is a high-speed, mobile-first web application designed for individuals with Celiac disease or gluten sensitivities. It acts as an "AI Second Opinion" during grocery shopping, using computer vision to instantly analyze food labels and categorize them by safety levels.

---

## 1. The Core Problem
Reading fine-print ingredient lists is slow, stressful, and prone to human error. Many products are "accidentally" gluten-free but lack clear certification, while others contain hidden gluten under technical names (like *maltodextrin* from wheat or *barley malt*).

## 2. The Solution
The user takes two photos: the **Front of the Package** and the **Ingredients List**. The Goblin then performs a multi-stage analysis to give an instant verdict based on three safety levels:

* 🟢 **SAFE:** Certification logo found (via Google Cloud Vision Logo Detection) or trusted text marker.
* 🟡 **CAUTION:** Claims to be gluten-free but lacks certification, OR contains a "May Contain Wheat" warning.
* 🔴 **AVOID:** AI detects specific blacklist ingredients (wheat, barley, rye, malt, etc.).

---

## 3. The Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JS | Mobile UI with client-side image compression. |
| **Backend** | Python (Flask) | Image processing and safety logic engine. |
| **AI/Vision** | Google Vision API | Text, Logo, and Label Detection. |
| **Hosting** | Vultr Cloud | High-performance cloud hosting. |
| **Infrastructure** | Nginx + DuckDNS | Reverse proxy and SSL/HTTPS for camera access. |
| **Media** | Static MP3 & MP4 | Native goblin reactions for user feedback. |

---

## 4. Key Technical Innovations

* **Client-Side Image Compression:** Resizes high-res 10MB photos to 1024px JPEGs in-browser. This reduced latency by **~90%**, ensuring the app works on spotty hackathon Wi-Fi.
* **Multi-Modal Analysis:** Combines OCR extraction with Logo Detection. It looks for the official "Certified Gluten-Free" badge to override generic caution flags.
* **Static Audio Integration:** Character-driven audio and video reactions optimized to bypass mobile autoplay restrictions.

---

## 5. How it Works (The Workflow)
1. **Capture:** User takes photos of the product.
2. **Compress:** JavaScript shrinks the files for speed.
3. **Analyze:** Flask sends data to Google Cloud Vision.
4. **Filter:** Safety Engine cross-references text against a curated gluten blacklist.
5. **React:** The Goblin screams, smiles, or shrugs based on the findings.

---

## 📦 Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/Bearhacks2026GlutenGoblin.git](https://github.com/YOUR_USERNAME/Bearhacks2026GlutenGoblin.git)
   cd Bearhacks2026GlutenGoblin

2. **Set Up Environment Variables**
   ```bash
   export VISION_API_KEY='your_google_vision_api_key'

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt

4. **Run the App**
   ```bash
   python3 app.py
