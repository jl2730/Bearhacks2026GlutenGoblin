import { Outlet } from "react-router";

export default function MobileFrame() {
  return (
    <div className="min-h-screen w-full bg-[#2a3a29] flex items-center justify-center py-8">
      <div
        className="relative overflow-hidden shadow-2xl"
        style={{
          width: "393px",
          height: "841px",
          borderRadius: "44px",
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Page content */}
        <div className="absolute inset-0" style={{ height: "841px" }}>
          <div className="relative w-full h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}