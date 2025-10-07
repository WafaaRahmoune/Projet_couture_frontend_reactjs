import React, { useState, useEffect } from 'react';
import '../../style/landingStyle/Navbar.css';
// importer les icons nécessaires
import logo from '../../assets/logobleu.png';
import dropshipping from '../../assets/icons/dropshipping.png';
import home from '../../assets/icons/home.png';
import phone from '../../assets/icons/phone.jpg';
import questions from '../../assets/icons/questions.png';
import services from '../../assets/icons/services.jpg';
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Fermer le menu quand on redimensionne vers desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };
  

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Empêcher le scroll quand le menu est ouvert
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Nettoyer l'effet au démontage
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div 
          className={`menu-toggle ${menuOpen ? 'open' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu de navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div
          className="navbar-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="قاف" className="logo-img" />
        </div>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={handleLinkClick}>
            <img src={home} alt="الرئيسية" className="icon" />
            الرئيسية
          </a>
          <a href="#services" onClick={handleLinkClick}>
            <img src={services} alt="الخدمات" className="icon" />
            الخدمات
          </a>
          <a href="#dropshipping" onClick={handleLinkClick}>
            <img src={dropshipping} alt="الدروبيشينغ" className="icon" />
            الدروبشيبنغ
          </a>
          <a href="#faq" onClick={handleLinkClick}>
            <img src={questions} alt="الأسئلة الشائعة" className="icon faq" />
            الأسئلة الشائعة
          </a>
          <a href="#contact" onClick={handleLinkClick}>
            <img src={phone} alt="تواصل معنا" className="icon" />
            تواصل معنا
          </a>
        </div>
      </nav>

      {/* Overlay cliquable qui ferme le menu */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer le menu"
        />
      )}
    </>
  );
}