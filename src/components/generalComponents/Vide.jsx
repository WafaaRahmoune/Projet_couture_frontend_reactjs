import React from 'react';
import "../../style/generalStyle/Vide.css"
const Vide = ({ 
  texte = "Aucune donnée disponible pour le moment", 
  tailleIcône = 80,
  className = "",
  couleurIcône = "#9ca3af" 
}) => {
  return (
    <div className={`vide-container ${className}`}>
      <div className="vide-content">
        <div className="vide-icone">
          <svg 
            width={tailleIcône} 
            height={tailleIcône} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Icône de loupe avec point d'exclamation */}
            <path 
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" 
              fill={couleurIcône}
            />
            {/* Point d'exclamation */}
            <path 
              d="M9.5 7C9.78 7 10 7.22 10 7.5V10.5C10 10.78 9.78 11 9.5 11C9.22 11 9 10.78 9 10.5V7.5C9 7.22 9.22 7 9.5 7Z" 
              fill={couleurIcône}
            />
            <circle cx="9.5" cy="12.5" r="0.75" fill={couleurIcône} />
          </svg>
        </div>
        <p className="vide-texte">{texte}</p>
      </div>
    </div>
  );
};

export default Vide;