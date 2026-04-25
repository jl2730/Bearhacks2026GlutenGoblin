import svgPaths from "./svg-1guw8w7ki5";
import imgLogo from "./33ce8c49eac7c8bd804fd55d8cd9780c321a6064.png";
import imgScanImg from "./7dfd2790802e29af45a42e1c9ad939e502cd080a.png";
import imgCheckImg from "./9d2242a0a7ba36d80ccbe1d8977333eb13478858.png";
import imgImage1 from "./fcffed12f997eb45e45adc2ed4f394e0bd3766fa.png";

function Group() {
  return (
    <div className="absolute contents left-[20px] top-[308px]">
      <div className="absolute h-[363px] left-[20px] rounded-[31px] top-[308px] w-[353px]" />
      <p className="absolute font-['Irish_Grover:Regular',sans-serif] h-[36px] leading-[normal] left-[calc(12.5%-2.13px)] not-italic text-[20px] text-white top-[334px] tracking-[1.2px] w-[299px]">How it works:</p>
      <ol className="absolute block font-['Irish_Grover:Regular',sans-serif] h-[36px] leading-[0] left-[calc(25%+14.75px)] not-italic text-[20px] text-white top-[404px] tracking-[1.2px] w-[233px]" start="1">
        <li className="ms-[30px]">
          <span className="leading-[normal]">scan</span>
        </li>
      </ol>
      <ol className="absolute block font-['Irish_Grover:Regular',sans-serif] h-[36px] leading-[0] left-[calc(25%+14.75px)] not-italic text-[20px] text-white top-[478px] tracking-[1.2px] w-[233px]" start="2">
        <li className="ms-[30px]">
          <span className="leading-[normal]">check</span>
        </li>
      </ol>
      <ol className="absolute block font-['Irish_Grover:Regular',sans-serif] h-[36px] leading-[0] left-[calc(25%+14.75px)] not-italic text-[20px] text-white top-[552px] tracking-[1.2px] w-[233px]" start="3">
        <li className="ms-[30px]">
          <span className="leading-[normal]">{`Goblin Decides `}</span>
        </li>
      </ol>
    </div>
  );
}

function AdobeStock() {
  return (
    <div className="absolute left-[46px] size-[42px] top-[6px]" data-name="AdobeStock_509096452 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g id="AdobeStock_509096452 1">
          <path d={svgPaths.p387f4f40} fill="var(--fill-0, #71AB6D)" id="Vector" />
          <path d={svgPaths.p3526f000} fill="var(--fill-0, #71AB6D)" id="Vector_2" />
          <path d={svgPaths.pde6ff80} fill="var(--fill-0, #71AB6D)" id="Vector_3" />
          <path d={svgPaths.p2fd3a140} fill="var(--fill-0, #71AB6D)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-[#3e533d] relative size-full" data-name="Home">
      <div className="-translate-y-1/2 absolute flex h-[556.19px] items-center justify-center right-[-660.99px] top-[calc(50%+142.1px)] w-[1084.987px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[-90.33deg]">
          <div className="h-[1081.854px] relative w-[550px]" data-name="Ellipse">
            <div className="absolute inset-[-5.08%_-10%_44.92%_-10%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 660 650.927">
                <g filter="url(#filter0_f_1_359)" id="Ellipse">
                  <path d={svgPaths.p1bbfd200} fill="url(#paint0_linear_1_359)" fillOpacity="0.2" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="650.927" id="filter0_f_1_359" width="660" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_1_359" stdDeviation="27.5" />
                  </filter>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_359" x1="279.632" x2="210.423" y1="41.8384" y2="593.696">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Group />
      <div className="absolute h-[166px] left-[calc(12.5%-2.13px)] top-[78px] w-[299px]" data-name="Logo">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
      <div className="absolute h-[48px] left-[calc(12.5%+25.88px)] top-[398px] w-[32px]" data-name="scanImg">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScanImg} />
      </div>
      <div className="absolute h-[62px] left-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[693px] w-[353px]" data-name="gettingStarted">
        <button className="absolute bg-[#1c8753] block cursor-pointer inset-0 rounded-[10px]" />
        <p className="absolute font-['Irish_Grover:Regular',sans-serif] inset-[29.03%_9.07%_22.58%_6.23%] leading-[normal] not-italic text-[20px] text-center text-white tracking-[1.2px]">Get started</p>
        <AdobeStock />
      </div>
      <div className="absolute h-[34px] left-[calc(12.5%+23.88px)] top-[473px] w-[36px]" data-name="checkImg">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCheckImg} />
      </div>
      <div className="absolute h-[30px] left-[calc(12.5%+18.88px)] top-[552px] w-[45px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[24px] leading-[normal] left-[20px] not-italic text-[13px] text-white top-[263px] tracking-[0.78px] w-[353px]">Scan a label and let him decide—his reaction tells you everything you need to know.</p>
      <div className="absolute h-[34px] left-0 top-[807px] w-[393px]" data-name="Home Indicator">
        <div className="-translate-x-1/2 absolute bottom-[8px] flex h-[5px] items-center justify-center left-1/2 w-[144px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="bg-black h-[5px] rounded-[100px] w-[144px]" data-name="Home Indicator" />
          </div>
        </div>
      </div>
    </div>
  );
}