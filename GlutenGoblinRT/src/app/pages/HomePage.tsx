import { useNavigate } from "react-router";
import svgPaths from "../../imports/Home/svg-1guw8w7ki5";
import imgLogo from "../../imports/Home/33ce8c49eac7c8bd804fd55d8cd9780c321a6064.png";
import imgScanImg from "../../imports/Home/7dfd2790802e29af45a42e1c9ad939e502cd080a.png";
import imgCheckImg from "../../imports/Home/9d2242a0a7ba36d80ccbe1d8977333eb13478858.png";
import imgGoblinIcon from "../../imports/Home/fcffed12f997eb45e45adc2ed4f394e0bd3766fa.png";

function CameraIcon() {
  return (
    <div className="absolute left-[46px] size-[42px] top-[6px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g>
          <path d={svgPaths.p387f4f40} fill="#ffffff" />
          <path d={svgPaths.p3526f000} fill="#ffffff" />
          <path d={svgPaths.pde6ff80} fill="#ffffff" />
          <path d={svgPaths.p2fd3a140} fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#3e533d] relative w-full h-full overflow-hidden">
      {/* Background glow ellipse */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-200px",
          top: "50%",
          transform: "translateY(-50%) translateY(142px)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Logo */}
      <div className="absolute top-[78px] w-[299px] h-[166px]" style={{ left: "50%", transform: "translateX(-50%)" }}>
        <img
          alt="Gluten Goblin Logo"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          src={imgLogo}
        />
      </div>

      {/* Subtitle */}
      <p
        className="absolute left-[20px] top-[263px] w-[353px] text-white text-[13px] tracking-[0.78px] not-italic leading-normal"
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
      >
        Scan a label and let him decide—his reaction tells you everything you need to know.
      </p>

      {/* How it works card */}
      <div className="absolute left-[20px] top-[308px] w-[353px] h-[363px] bg-[rgba(0,0,0,0.15)] rounded-[31px]" />

      {/* How it works: title */}
      <p
        className="absolute left-[45px] top-[334px] text-white text-[20px] tracking-[1.2px] not-italic leading-normal"
        style={{ fontFamily: "'Irish Grover', sans-serif" }}
      >
        How it works:
      </p>

      {/* Step 1: scan */}
      <div className="absolute left-[45px] top-[390px] flex items-center gap-[18px]">
        <img alt="scan" src={imgScanImg} className="w-[32px] h-[48px] object-contain" />
        <p
          className="text-white text-[20px] tracking-[1.2px] not-italic leading-normal"
          style={{ fontFamily: "'Irish Grover', sans-serif" }}
        >
          1. scan
        </p>
      </div>

      {/* Step 2: check */}
      <div className="absolute left-[45px] top-[466px] flex items-center gap-[18px]">
        <img alt="check" src={imgCheckImg} className="w-[36px] h-[34px] object-contain" />
        <p
          className="text-white text-[20px] tracking-[1.2px] not-italic leading-normal"
          style={{ fontFamily: "'Irish Grover', sans-serif" }}
        >
          2. check
        </p>
      </div>

      {/* Step 3: Goblin Decides */}
      <div className="absolute left-[45px] top-[540px] flex items-center gap-[18px]">
        <img alt="goblin" src={imgGoblinIcon} className="w-[45px] h-[30px] object-contain" />
        <p
          className="text-white text-[20px] tracking-[1.2px] not-italic leading-normal"
          style={{ fontFamily: "'Irish Grover', sans-serif" }}
        >
          3. Goblin Decides
        </p>
      </div>

      {/* Get started button */}
      <div className="absolute left-[20px] top-[693px] w-[353px] h-[62px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <button
          onClick={() => navigate("/scanning-front")}
          className="absolute inset-0 bg-[#1c8753] rounded-[10px] cursor-pointer w-full h-full flex items-center justify-center gap-3 transition-opacity hover:opacity-90 active:opacity-80"
        >
          <CameraIcon />
          <span
            className="text-white text-[20px] tracking-[1.2px] not-italic leading-normal ml-14"
            style={{ fontFamily: "'Irish Grover', sans-serif" }}
          >
            Get started
          </span>
        </button>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[144px] h-[5px] bg-black rounded-[100px]" />
    </div>
  );
}
