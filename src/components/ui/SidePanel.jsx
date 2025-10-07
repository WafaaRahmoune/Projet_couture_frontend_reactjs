  import React, { useState,useEffect } from "react";
  import { Home, User, ShoppingBag, LogOut, Menu, X, Plus } from "lucide-react";
  import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
  
  export default function SidePanel({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showConfirm, setShowConfirm] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
  
    const menuItems = [
      { label: "إبداعاتي", icon: <Home size={15} />, path: "/MesModels" },
      { label: "الطلبات الخاصة", icon: <ShoppingBag size={15} />, path: "/demandes" },
      { label: "طلبات الفصو/عروض الفصو ", icon: <ShoppingBag size={15} />, path: "/DemandesOffresFassou" },
      { label: "حسابي", icon: <User size={15} />, path: "/Couturiere/MyAccount" },
    ];
    // Dans le useEffect pour la redirection automatique seulement
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "") {
      navigate("/MesModels");
    }
  }, [location.pathname, navigate]);
    const handleLogout = () => {
  // Récupérer les informations de l'utilisateur depuis le localStorage
  const userData = localStorage.getItem('user');
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      
      // Vérifier le rôle de l'utilisateur
      
       if (user.role === 'couturiere') {
        localStorage.setItem("login_redirect_path", JSON.stringify({
          "path": "/signup",
          "button": "انضم الان"
        }));
      } else {
        console.error("Rôle utilisateur non reconnu:", user.role);
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse des données utilisateur:", error);
    }
  }
  
  navigate("/login");
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
  
    // === Récupérer le breadcrumb (إبداعاتي > modèle) ===
    let breadcrumb = "";
    if (location.pathname.startsWith("/MesModels/")) {
      // Exemple : /mesmodels/1234 → extraire id ou nom
      const modelId = location.pathname.split("/")[2];
      breadcrumb = `إبداعاتي > فستان عراسي أنيق : كود ${modelId}`;
    } else if (location.pathname === "/MesModels") {
      breadcrumb = "إبداعاتي";
    } else {
      const active = menuItems.find((item) => item.path === location.pathname);
      breadcrumb = active ? active.label : "";
    }
  
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
        <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow  z-20">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setMobileOpen(true)}>
              <Menu size={28} className="text-gray-800" />
            </button>
            <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
          </div>
  

 {/* Sub Navbar */}
<div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 font-semibold text-[#E5B62B]">
 {/* Right: breadcrumb */}
  {location.pathname.startsWith("/MesModels") ? (
    <div
      className="cursor-pointer text-[#E5B62B]"
      onClick={() => navigate("/MesModels")}
    >
      {breadcrumb}
    </div>
  ) : (
    <span className="text-[#E5B62B]">{breadcrumb}</span>  // juste du texte
  )}

  {/* Left: إضافة نموذج جديد - seulement si mesmodels */}
  {location.pathname.startsWith("/MesModels") && (
    <Link to="/AddNewModel" className="flex items-center gap-1 text-[#E5B62B]">
  <Plus size={18} className="stroke-[#E5B62B]" strokeWidth={2.3} />
  <span className="text-[#E5B62B]">إضافة نموذج جديد</span>
</Link>

  )}
</div>

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
                className="absolute top-4 right-4 text-white"
              >
              <X size={24} className="stroke-white" strokeWidth={2.5}  />
              </button>
  
              {/* Logo inside drawer */}
              <div className="flex justify-center items-center h-20 border-b border-white/20">
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
        <main className="flex-1 rounded-3xl border-[#DDDDC6] border-[5px] shadow-inner bg-white p-6 overflow-auto md:mt-0 mt-32">
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
  