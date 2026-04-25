import { useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { getFrontPhoto, clearFrontPhoto } from "../photoStore";
import imgLogo from "../../imports/ScanningBack/90060f8bc69f0725f78e3106f17ca2a3a599dfc3.png";
import imgCameraBtn from "../../imports/ScanningBack/f7df4b79e3284ba185e1f1624ff261e4bc9384ac.png";

function mapStatus(status: string): "pass" | "fail" | "caution" {
  if (status === "SAFE") return "pass";
  if (status === "NOT SAFE") return "fail";
  return "caution";
}

export default function ScanningBackPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    if (scanning) return;
    inputRef.current?.click();
  };

  const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setScanning(true);
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("photo", file);
    const frontPhoto = getFrontPhoto();
    if (frontPhoto) formData.append("front_photo", frontPhoto);
    clearFrontPhoto();

    try {
      const res = await fetch("/analyze", { method: "POST", body: formData });
      const data = await res.json();
      const resultType = data.error ? "caution" : mapStatus(data.status);
      const allergens: string[] = data.found_in_ingredients ?? [];
      navigate("/result", { state: { result: resultType, allergens } });
    } catch {
      navigate("/result", { state: { result: "caution", allergens: [] } });
    }
  };

  return (
    <div className="bg-[#385c37] relative w-full h-full overflow-hidden">
      {/* Flash overlay */}
      {flash && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none" style={{ opacity: 0.8 }} />
      )}

      {/* Analyzing overlay */}
      {analyzing && (
        <div className="absolute inset-0 bg-[#385c37]/80 z-40 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p
            className="text-white text-[22px] tracking-[1.2px] text-center"
            style={{ fontFamily: "'Irish Grover', sans-serif" }}
          >
            Analyzing...
          </p>
          <p
            className="text-white/70 text-[14px] tracking-[0.96px]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            The goblin is checking the ingredients
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Logo row */}
      <div className="absolute left-[20px] top-[55px] w-[93px] h-[89px]">
        <img alt="Gluten Goblin" className="absolute inset-0 w-full h-full object-contain pointer-events-none" src={imgLogo} />
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

      {/* Instruction */}
      <p
        className="absolute text-white text-[16px] text-center tracking-[0.96px] not-italic leading-normal"
        style={{
          fontFamily: "'Poppins', sans-serif",
          left: "50%",
          transform: "translateX(-50%)",
          top: "200px",
          width: "353px",
        }}
      >
        Scan the back package of the product
      </p>

      {/* Camera viewfinder */}
      <div className="absolute left-[20px] top-[227px] w-[353px] h-[406px] bg-[rgba(217,217,217,0.2)] rounded-[34px] flex items-end justify-center pb-6">
        {/* Corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/50 rounded-tl-md" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/50 rounded-tr-md" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/50 rounded-bl-md" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/50 rounded-br-md" />

        {/* Camera button */}
        <button
          onClick={handleCapture}
          className="w-[53px] h-[53px] flex items-center justify-center cursor-pointer transition-transform active:scale-90 hover:scale-105"
          disabled={scanning}
        >
          <img alt="Take photo" src={imgCameraBtn} className="w-full h-full object-contain" />
        </button>
      </div>

      {/* Status text */}
      <div
        className="absolute text-center text-white"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          top: "651px",
          width: "349px",
        }}
      >
        {scanning ? (
          <>
            <p
              className="leading-normal mb-0 text-[20px] tracking-[1.2px]"
              style={{ fontFamily: "'Irish Grover', sans-serif" }}
            >
              Scanning back...
            </p>
            <p
              className="leading-normal text-[14px] tracking-[1.2px]"
              style={{ fontFamily: "'Irish Grover', sans-serif" }}
            >
              this may take some time
            </p>
          </>
        ) : (
          <p
            className="leading-normal text-[16px] tracking-[0.96px] opacity-70"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Tap the camera to take a photo
          </p>
        )}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[144px] h-[5px] bg-black rounded-[100px]" />
    </div>
  );
}
