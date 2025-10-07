import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logojaune.png";
import homeBlanc from "../../assets/icons/homeblanc.png";
import homeBleu from "../../assets/icons/home.png";
import commandBlanc from "../../assets/commandeblanc.png";
import commandBleu from "../../assets/icons/commande.png";
import membersblanc from "../../assets/members.png";
import membersbleu from "../../assets/membersbleu.png";
import modelblanc from "../../assets/modelblanc.png";
import modelbleu from "../../assets/modelbleu.png";
import affiliatebleu from "../../assets/affiliatebleu.png";
import affiliateblanc from "../../assets/affiliateblanc.png";
import dropshipperbleu from "../../assets/dropshipperbleu.png";
import dropshipperblanc from "../../assets/dropshipperblanc.png";
import parametreblanc from "../../assets/parametre.png";
import parametrebleu from "../../assets/parametrebleu.png";
import "../../style/AdminStyle/Sidebaradmin.css";
import logout from "../../assets/logout.png";

export default function Sidebaradmin() {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // État pour la popup

  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      id: "home", 
      label: "لوحة التحكم", 
      icon: active === "home" ? homeBleu : homeBlanc,
      mypath: "/admin/dashboard"
    },
    { 
      id: "orders", 
      label: "إدارة الطلبات", 
      icon: active === "orders" ? commandBleu : commandBlanc,
      mypath: "/admin/gestinDemandes" 
    },
    { 
      id: "members", 
      label: "ادارة الخياطات", 
      icon: active === "members" ? membersbleu : membersblanc,
      mypath: "/admin/gestionCouturieres"  
    },
    { 
      id: "models", 
      label: "إدارة النماذج", 
      icon: active === "models" ? modelbleu : modelblanc,
      mypath: "/admin/gestionModels" 
    },
    { 
      id: "affiliates", 
      label: "إدارة المروجين", 
      icon: active === "affiliates" ? affiliatebleu : affiliateblanc,
      mypath: "/admin/gestionAffiliates" 
    },
    { 
      id: "dropshipping", 
      label: "إدارة الدروبشيبينغ", 
      icon: active === "dropshipping" ? dropshipperbleu : dropshipperblanc,
      mypath: "/admin/gestiondropshippers"  
    },
    { 
      id: "settings", 
      label: "الإعدادات", 
      icon: active === "settings" ? parametrebleu : parametreblanc,
      mypath: "/admin/parametres" 
    },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.mypath === currentPath);
    
    if (currentItem) {
      setActive(currentItem.id);
    }
  }, [location.pathname]);

  const handleItemClick = (itemId, path) => {
    setActive(itemId);
    navigate(path);
  };

  const handleLogout = () => {
    // Supprimer les tokens du localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    // Rediriger vers la page de connexion admin
    navigate("/admin/login");
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true); // Afficher la popup de confirmation
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false); // Fermer la popup
    handleLogout(); // Exécuter le logout
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false); // Fermer la popup sans logout
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="logo" className="sidebar-logo" />
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${active === item.id ? "active" : ""}`}
            onClick={() => handleItemClick(item.id, item.mypath)}
          >
            <img src={item.icon} alt={item.label} className="sidebar-icon" />
            <span className={`sidebar-text ${active === item.id ? "active" : ""}`}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogoutClick}>
          <img src={logout} alt="تسجيل الخروج" className="logout-icon" />
          تسجيل الخروج
        </button>


      </div>

       {/* Popup de confirmation */}
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-popup">
            <h3>تأكيد الخروج</h3>
            <p>هل تريد حقًا تسجيل الخروج؟</p>
            <div className="logout-confirm-buttons">
              <button 
                className="confirm-btn" 
                onClick={handleConfirmLogout}
              >
                نعم
              </button>
              <button 
                className="cancel-btn" 
                onClick={handleCancelLogout}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}