import { useState } from "react";
import "../../style/AdminStyle/ContainerPagesAdmin.css";
import Sidebaradmin from "./Sidebaradmin";

export default function ContainerPagesAdmin({
  titre = "لوحة التحكم",
  soustitre = "احصائيات عامة حول الموقع",
  elemnts = [],
  contenus = [],
  children,
  headerOptions = null,
  onTabChange = null // Nouvelle prop pour suivre les changements d'onglet
}) {
  const [active, setActive] = useState(0);

  // Déterminer quel contenu afficher
  const contentToDisplay = contenus.length > 0 ? contenus[active] : children;

  const handleTabChange = (index) => {
    setActive(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className="dashboardLayout">
      <Sidebaradmin />
      
      <div className="ContainerElementsOfDashbord">
        {/* En-tête avec titre, sous-titre et options */}
        <div className="dashboard-header">
          <div className="header-text">
            {titre && <div className="titledashbord">{titre}</div>}
            {soustitre && <div className="soustitredashbord">{soustitre}</div>}
          </div>
          
          {/* Options d'en-tête (filtres, etc.) */}
          {headerOptions && (
            <div className="header-options">
              {headerOptions}
            </div>
          )}
        </div>
        
        {/* Afficher les onglets seulement s'il y a des éléments */}
        {elemnts.length > 0 && (
          <div className="elementstonavigate">
            {elemnts.map((el, index) => (
              <div
                key={index}
                className={`navElement ${active === index ? "active" : ""}`}
                onClick={() => handleTabChange(index)}
              >
                {el}
              </div>
            ))}
          </div>
        )}
        
        <div className="contenu-onglet">
          {contentToDisplay}
        </div>
      </div>
    </div>
  );
}