import imgLogo from "./90060f8bc69f0725f78e3106f17ca2a3a599dfc3.png";

function Results() {
  return (
    <div className="absolute contents left-[20px] top-[517px]" data-name="results">
      <div className="absolute bg-[#afad16] h-[84px] left-[20px] rounded-[27px] top-[517px] w-[353px]" />
      <div className="-translate-x-1/2 absolute font-['Irish_Grover:Regular',sans-serif] h-[47px] leading-[0] left-[calc(12.5%+147.38px)] not-italic text-[0px] text-center text-white top-[530px] tracking-[1.2px] w-[299px] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0 text-[20px]">{`Caution! `}</p>
        <p className="leading-[normal] mb-0 text-[16px]">This is may not be safe for your goblin</p>
        <p className="leading-[normal] text-[20px]">​</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[calc(12.5%-2.13px)] top-[716px]">
      <div className="absolute bg-[#afad16] h-[48.374px] left-[calc(12.5%-2.13px)] rounded-[11px] top-[716px] w-[299px]" />
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold h-[29.392px] leading-[normal] left-[calc(12.5%+147.38px)] not-italic text-[12px] text-center text-white top-[725.8px] w-[253.261px]">Possible gluten detected — the label isn’t clear, so take a closer look to be safe.</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[calc(62.5%+14.38px)] top-[789px]">
      <div className="absolute bg-[#1c2819] h-[25px] left-[calc(62.5%+14.38px)] top-[789px] w-[120px]" />
      <p className="-translate-x-1/2 absolute font-['Irish_Grover:Regular',sans-serif] h-[18px] leading-[normal] left-[calc(62.5%+74.38px)] not-italic text-[15px] text-center text-white top-[793px] tracking-[0.9px] w-[120px]">scan another</p>
    </div>
  );
}

export default function ScannedCaution() {
  return (
    <div className="bg-[#385c37] relative size-full" data-name="scannedCaution">
      <div className="absolute h-[89px] left-[20px] top-[55px] w-[93px]" data-name="Logo">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
      <div className="absolute h-[406px] left-[20px] rounded-[34px] top-[192px] w-[353px]" data-name="cameraScreen">
        <video autoPlay className="absolute max-w-none object-cover rounded-[34px] size-full" controlsList="nodownload" loop playsInline>
          <source src="/_videos/v1/d8fabee63329c18d29ec1db2f3d929947ca86af3" />
        </video>
      </div>
      <Results />
      <div className="absolute font-['Jaini:Regular',sans-serif] h-[79px] leading-[0] left-[20px] not-italic text-[20px] text-white top-[610px] tracking-[1.2px] w-[353px]">
        <p className="leading-[normal] mb-0 whitespace-pre-wrap">{`Contains: `}</p>
        <ul className="list-disc mb-0">
          <li className="mb-0 ms-[30px]">
            <span className="leading-[normal] text-[20px]">​</span>
          </li>
          <li className="ms-[30px]">
            <span className="leading-[normal] text-[20px]">​</span>
          </li>
        </ul>
        <p className="leading-[normal] whitespace-pre-wrap">​</p>
      </div>
      <Group />
      <div className="absolute h-[34px] left-0 top-[807px] w-[393px]" data-name="Home Indicator">
        <div className="-translate-x-1/2 absolute bottom-[8px] flex h-[5px] items-center justify-center left-1/2 w-[144px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="bg-black h-[5px] rounded-[100px] w-[144px]" data-name="Home Indicator" />
          </div>
        </div>
      </div>
      <p className="-translate-x-1/2 absolute font-['Jaro:Regular',sans-serif] h-[34px] leading-[normal] left-[calc(25%+147.25px)] text-[40px] text-center text-white top-[78px] tracking-[2.4px] w-[255px]" style={{ fontVariationSettings: "'opsz' 6" }}>
        Gluten Goblin
      </p>
      <Group1 />
    </div>
  );
}