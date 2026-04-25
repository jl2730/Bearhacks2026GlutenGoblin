import imgLogo from "./90060f8bc69f0725f78e3106f17ca2a3a599dfc3.png";
import imgCamerabutPress from "./f7df4b79e3284ba185e1f1624ff261e4bc9384ac.png";

export default function ScanningBack() {
  return (
    <div className="bg-[#385c37] relative size-full" data-name="scanningBack">
      <div className="absolute h-[89px] left-[20px] top-[55px] w-[93px]" data-name="Logo">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
      <div className="absolute bg-[rgba(217,217,217,0.2)] h-[406px] left-[20px] rounded-[34px] top-[227px] w-[353px]" data-name="cameraScreen" />
      <div className="-translate-x-1/2 absolute font-['Irish_Grover:Regular',sans-serif] h-[73px] leading-[0] left-[198.5px] not-italic text-[0px] text-center text-white top-[651px] tracking-[1.2px] w-[349px]">
        <p className="leading-[normal] mb-0 text-[20px]">Scanning back...</p>
        <p className="leading-[normal] text-[14px]">{`this may take some time `}</p>
      </div>
      <div className="absolute left-[calc(37.5%+22.63px)] size-[53px] top-[558px]" data-name="camerabutPress">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCamerabutPress} />
      </div>
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
      <p className="-translate-x-1/2 absolute font-['Poppins:Regular',sans-serif] h-[27px] leading-[normal] left-[196.5px] not-italic text-[16px] text-center text-white top-[200px] tracking-[0.96px] w-[353px]">{`Scan the back package of the product `}</p>
    </div>
  );
}