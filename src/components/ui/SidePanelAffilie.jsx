// components/ui/SidePanelAffilie.jsx
import React, { useState, useEffect } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function SidePanel({ children, menuItems }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(
    menuItems.length > 0 ? menuItems[0] : null
  );

  // Version alternative plus simple - sans redirection automatique
  useEffect(() => {
    const currentPath = location.pathname;
    const isValidPath = menuItems.some(item => 
      currentPath === item.path || currentPath.startsWith(item.path + "/")
    );
    
    if (!isValidPath && menuItems.length > 0) {
      setActiveItem(menuItems[0]);
    } else {
      const foundItem = menuItems.find(item => 
        currentPath === item.path || currentPath.startsWith(item.path)
      );
      if (foundItem) {
        setActiveItem(foundItem);
      }
    }
  }, [location.pathname, menuItems]);

 
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="flex w-full h-screen bg-[#F4F3EF] p-4 gap-4">
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden md:flex flex-col items-center w-64 rounded-3xl bg-white border-[#DDDDC6] border-[5px]">
        {/* Logo */}
        <div className="flex justify-center items-center h-32 w-full">
          <img src="/logo.png" alt="Logo" className="h-20 object-contain" />
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-4 mt-4 w-full items-center">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `w-56 h-14 px-4 flex gap-x-2 items-center rounded-[16px] border-2 font-semibold shadow-md transition-colors
                ${
                  isActive
                    ? "border-[#F0C84B] text-[#F0C84B]"
                    : "border-[#DDDDC6] text-[#374151]"
                }
                hover:border-[#F0C84B] hover:text-[#F0C84B]`
              }
            >
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}

          {/* Logout */}
          <div className="mt-6">
            <button
              onClick={() => setShowConfirm(true)}
              className="text-[#4A66BD] underline flex items-center gap-2"
            >
              <LogOut size={15} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===== Mobile Navbar ===== */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow z-20">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={28} className="text-gray-800" />
          </button>
          <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
        </div>

        {/* Sub Navbar (menu actif) */}
        {activeItem && (
          <div className="px-4 py-2 border-t border-gray-200 text-[#E5B62B] font-semibold">
            {activeItem.label}
          </div>
        )}
      </div>
      {/* ===== Mobile Drawer ===== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex">
          {/* Background */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-64 bg-[#0C1B3C] h-full shadow-lg p-4 flex flex-col text-white">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4  text-white"
            >
              <X size={24} className="stroke-white" strokeWidth={2.5}  />
            </button>

            {/* Logo inside drawer */}
            <div className="flex justify-center items-center h-10  border-white/20">
            </div>

            {/* Menu items */}
            <div className="flex flex-col gap-6 mt-8">
              {menuItems.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-2 py-2 font-semibold transition-colors
                    ${
                      isActive
                        ? "text-[#F0C84B]"
                        : "text-white hover:text-[#F0C84B]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Logout */}
              <button
                  onClick={() => {
                    setMobileOpen(false);    // ← Ferme le drawer
                    setShowConfirm(true);    // ← Ouvre la popup de confirmation
                  }}
                  className="mt-6 text-[#F0C84B] underline flex items-center gap-2"
                >
                <LogOut size={15} className="stroke-[#F0C84B]" strokeWidth={2.3} />

                <span  className=" text-[#F0C84B]" >تسجيل الخروج</span>
              </button>


            </div>
          </div>
        </div>
      )}

      

      {/* ===== Main Content ===== */}
      <main className="flex-1 rounded-3xl border-[#DDDDC6] border-[5px] shadow-inner bg-white p-6 overflow-auto md:mt-0 mt-24">
        {children}
      </main>

      {/* ===== Popup Logout Confirmation ===== */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
            <p className="text-lg font-semibold mb-4">
              هل أنت متأكد أنك تريد تسجيل الخروج؟
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                نعم
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded-xl hover:bg-gray-400"
              >
                لا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}