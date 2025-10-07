import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import '../../style/generalStyle/Popup.css'

export default function Popup({
  title = "",
  iconPopup = null,
  sousTitre = "",
  contenu = null,
  // Configuration des boutons
  buttons = [
    {
      text: "حسنا",
      onClick: () => {},
      backgroundColor: "#22C55E",
      textColor: "#FFFFFF",
      width: "auto",
      customClass: "",
      navigateTo: -1, // Navigation par défaut vers -1
      // Nouvelles propriétés
      border: "none", // Par défaut pas de bordure
      borderColor: "transparent", // Couleur de bordure transparente par défaut
      hoverStyle: {} // Style au survol personnalisable
    }
  ],
  onClose = null,
  showButtons = true,
  colorbackgroundTitleSousTitle = "",
  buttonLayout = "horizontal",
  buttonGap = "12px"
}) {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.body.classList.add('popup-open');
    return () => {
      document.body.classList.remove('popup-open');
    };
  }, []);

  const defaultOnClose = () => {
    navigate(-1);
  };

  const handleCloseFunction = onClose || defaultOnClose;

  const handleClose = (e) => {
    if (e.target === e.currentTarget || e.target.closest('.iconsortirpopup')) {
      handleCloseFunction();
    }
  };

  const handleButtonClick = (button) => {
    if (button.onClick) {
      button.onClick();
    }
    if (onClose) {
    onClose();
  }
    if (button.navigateTo) {
      if (button.navigateTo === -1) {
        navigate(-1);
      } else {
        navigate(button.navigateTo);
      }
    }
  };

  return (
    <div className="blurbackground" onClick={handleClose}>
      <div className="containerpopup">
        <div 
          className="containerheaderpopup" 
          style={{backgroundColor: colorbackgroundTitleSousTitle}}
        >
          <div className="iconsortirpopup" onClick={handleCloseFunction}>
            <IoClose size={24} />
          </div>

          {iconPopup && (
            <div className="iconpopup">
              <img src={iconPopup} alt="icone popup" className="popup-icon" />
            </div>
          )}

          <div className="titrepopup">
            {title}
          </div>

          {sousTitre && (
            <div className="soustitrepopup">
              {sousTitre}
            </div>
          )}
        </div>

        <div className="contenupopup">
          {typeof contenu === "string" ? (
            <p className="contentpopup">{contenu}</p>
          ) : (
            contenu
          )}
        </div>

        {showButtons && buttons.length > 0 && (
          <div 
            className={`popup-buttons-container ${buttonLayout === 'vertical' ? 'vertical-layout' : 'horizontal-layout'}`}
            style={{ gap: buttonGap }}
          >
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`bouttonpopup ${button.customClass}`}
                onClick={() => handleButtonClick(button)}
                style={{
                  backgroundColor: button.backgroundColor,
                  color: button.textColor,
                  width: button.width,
                  border: button.border,
                  borderColor: button.borderColor,
                  ...button.customStyle // Style personnalisé additionnel
                }}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}