import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import imgLogo from "../../imports/ScannedPass/90060f8bc69f0725f78e3106f17ca2a3a599dfc3.png";

type ResultType = "pass" | "fail" | "caution";

interface ResultConfig {
  bannerBg: string;
  infoBg: string;
  headline: string;
  subheadline: string;
  infoText: string;
  allergens: string[];
  videoSrc: string;
  soundSrc: string | null;
}

const RESULT_CONFIG: Record<ResultType, ResultConfig> = {
  pass: {
    bannerBg: "#248f24",
    infoBg: "#248f24",
    headline: "No allergens Found!",
    subheadline: "looks safe for our goblin :)",
    infoText: "No gluten detected — you're good to go. Enjoy your food!",
    allergens: [],
    videoSrc: "/videos/goblinHappy.webm",
    soundSrc: "/sounds/safe.mp3",
  },
  fail: {
    bannerBg: "#8d1915",
    infoBg: "#8d1915",
    headline: "Allergen(s) found!",
    subheadline: "This is not safe for your goblin",
    infoText: "Gluten detected — don't eat this. Try finding a safer alternative.",
    allergens: ["Wheat", "Gluten (Barley)"],
    videoSrc: "/videos/goblinAngry.webm",
    soundSrc: "/sounds/avoid.mp3",
  },
  caution: {
    bannerBg: "#afad16",
    infoBg: "#afad16",
    headline: "Caution!",
    subheadline: "This may not be safe for your goblin",
    infoText: "Possible gluten detected — the label isn't clear, so take a closer look to be safe.",
    allergens: ["May contain: Oats", "May contain: Wheat traces"],
    videoSrc: "/videos/goblinCautious.webm",
    soundSrc: null,
  },
};

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result: ResultType; allergens?: string[] } | null;
  const result: ResultType = state?.result ?? "pass";
  const config = RESULT_CONFIG[result];
  const allergens = state?.allergens ?? config.allergens;

  useEffect(() => {
    if (!config.soundSrc) return;
    const audio = new Audio(config.soundSrc);
    audio.play().catch(() => {});
  }, [config.soundSrc]);

  return (
    <div className="bg-[#385c37] relative w-full h-full overflow-hidden">
      {/* Logo row */}
      <div className="absolute left-[20px] top-[55px] w-[93px] h-[89px]">
        <img
          alt="Gluten Goblin"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          src={imgLogo}
        />
      </div>
      <p
        className="absolute text-white text-[40px] text-center tracking-[2.4px] leading-normal"
        style={{
          fontFamily: "'Jaro', sans-serif",
          fontVariationSettings: "'opsz' 6",
          right: "15px",
          top: "65px",
          width: "255px",
          whiteSpace: "nowrap",
        }}
      >
        Gluten Goblin
      </p>

      {/* Goblin video */}
      <div className="absolute left-[20px] top-[192px] w-[353px] h-[310px] rounded-[34px] overflow-hidden">
        <video
          autoPlay
          loop
          playsInline
          controlsList="nodownload"
          className="absolute inset-0 w-full h-full object-cover rounded-[34px]"
        >
          <source src={config.videoSrc} />
        </video>
      </div>

      {/* Result banner */}
      <div
        className="absolute left-[20px] top-[517px] w-[353px] h-[84px] rounded-[27px] flex flex-col items-center justify-center"
        style={{ backgroundColor: config.bannerBg }}
      >
        <p
          className="text-white text-[20px] tracking-[1.2px] leading-normal text-center mb-0"
          style={{ fontFamily: "'Irish Grover', sans-serif" }}
        >
          {config.headline}
        </p>
        <p
          className="text-white text-[16px] tracking-[1.2px] leading-normal text-center"
          style={{ fontFamily: "'Irish Grover', sans-serif" }}
        >
          {config.subheadline}
        </p>
      </div>

      {/* Contains section */}
      <div className="absolute left-[20px] top-[614px] w-[353px]">
        <p
          className="text-white text-[20px] tracking-[1.2px] leading-normal mb-1"
          style={{ fontFamily: "'Jaini', sans-serif" }}
        >
          Contains:
        </p>
        {allergens.length === 0 ? (
          <p
            className="text-white/70 text-[16px] leading-normal ms-[8px]"
            style={{ fontFamily: "'Jaini', sans-serif" }}
          >
            No allergens detected
          </p>
        ) : (
          <ul className="list-disc ms-[24px]">
            {allergens.map((allergen, i) => (
              <li key={i} className="text-white text-[18px] leading-snug" style={{ fontFamily: "'Jaini', sans-serif" }}>
                {allergen}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Info card */}
      <div
        className="absolute left-[45px] top-[716px] w-[299px] h-[48px] rounded-[11px] flex items-center justify-center px-3"
        style={{ backgroundColor: config.infoBg }}
      >
        <p
          className="text-white text-[12px] text-center leading-normal"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
        >
          {config.infoText}
        </p>
      </div>

      {/* Scan another */}
      <button
        onClick={() => navigate("/scanning-front")}
        className="absolute right-[20px] top-[789px] cursor-pointer"
        style={{ background: "none", border: "none" }}
      >
        <div className="bg-[#1c2819] px-3 py-1 rounded">
          <span
            className="text-white text-[15px] tracking-[0.9px] leading-normal"
            style={{ fontFamily: "'Irish Grover', sans-serif" }}
          >
            scan another
          </span>
        </div>
      </button>

      {/* Home Indicator */}
      <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[144px] h-[5px] bg-black rounded-[100px]" />
    </div>
  );
}