import React, { useState } from "react";
import phoneicon from "../../assets/icons/whatsapp.png";
import addressicon from "../../assets/icons/addressicon.png";
import calendaricon from "../../assets/icons/date.png";
import checkicon from "../../assets/icons/checkicon.png";
import closeicon from "../../assets/icons/pendingicon.png";
import downicon from "../../assets/icons/downicon.png";
import showdetails from "../../assets/icons/documenticon.png";
import Popupimages from "../generalComponents/Popupimages";

import "../../style/AdminStyle/CoutureInfo.css";

export default function CoutureInfo({
  full_name,
  phonenumber,
  address,
  created_at,
  isaccepted,
  isactive,
  pdfFiles = [],
  images = [],
  onStatusChange,
  onActiveStatusChange
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isImagesPopupOpen, setIsImagesPopupOpen] = useState(false);

  const renderStatus = () => {
    if (isaccepted === true) {
      return <span className="status accepted">مقبولة</span>;
    } else if (isaccepted === false) {
      return <span className="status refused">مرفوضة</span>;
    } else {
      return <span className="status pending">في الانتظار</span>;
    }
  };

  const handleActiveStatusChange = (newStatus) => {
    onActiveStatusChange(newStatus);
    setShowDropdown(false);
  };

  const openPdfInNewTab = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  const handleOpenImagesPopup = () => {
    if (images && images.length > 0) {
      setIsImagesPopupOpen(true);
    }
  };

  const handleCloseImagesPopup = () => {
    setIsImagesPopupOpen(false);
  };

  // Vérifier s'il y a des images à afficher
  const hasImages = images && images.length > 0;

  return (
    <div className="CoutureCardContainer">
      {/* Première ligne: nom, statut, statut actif avec dropdown, et show details */}
      <div className="firstLine">
        <div className="statusGroup">
          <span className="userName">{full_name}</span>
          {renderStatus()}
          
          {isaccepted === true && (
            <div className="activeStatusContainer">
              <div 
                className="activeStatusDropdown"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className={`status ${isactive ? "active" : "inactive"}`}>
                  {isactive ? "نشط" : "غير نشط"}
                  <img src={downicon} alt="dropdown" className="dropdownIcon" />
                </span>
              </div>
              
              {showDropdown && (
                <div className="dropdownMenu">
                  <div 
                    className="dropdownItem"
                    onClick={() => handleActiveStatusChange(true)}
                  >
                    نشط
                  </div>
                  <div 
                    className="dropdownItem"
                    onClick={() => handleActiveStatusChange(false)}
                  >
                    غير نشط
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Afficher le bouton seulement s'il y a des images */}
        {hasImages && (
          <button 
            className="showDetailsBtn"
            onClick={handleOpenImagesPopup}
          >
            عرض الصور
            <img src={showdetails} alt="show details" />
          </button>
        )}
      </div>

      {/* Deuxième ligne: téléphone et adresse */}
      <div className="secondLine">
        <div className="infoItem">
          <img src={phoneicon} alt="phone" className="datecouture" />
          <span>{phonenumber}</span>
        </div>
        <div className="infoItem">
          <img src={addressicon} alt="address" className="datecouture" />
          <span>{address}</span>
        </div>
      </div>

      {/* Troisième ligne: date de demande et boutons d'action (seulement si en attente) */}
      {isaccepted === null && (
        <div className="thirdLine">
          <div className="infoItem">
            <img src={calendaricon} alt="calendar" className="datecouture" />
            <span className="datedecouturiere">تاريخ التقديم: {created_at}</span>
          </div>
          
          <div className="actionButtons">
            <button
              className="actionBtn accept"
              onClick={() => onStatusChange(true)}
            >
              قبول
              <img src={checkicon} alt="accept" />
            </button>
            <button
              className="actionBtn refuse"
              onClick={() => onStatusChange(false)}
            >
              رفض
              <img src={closeicon} alt="refuse" />
            </button>
          </div>
        </div>
      )}

      {/* Section pour afficher les fichiers PDF */}
      {pdfFiles && pdfFiles.length > 0 && (
        <div className="pdfFilesSection">
          <h4 className="pdfSectionTitle">الملفات المرفقة</h4>
          <div className="pdfFilesList">
            {pdfFiles.map((pdf, index) => (
              <div 
                key={index} 
                className="pdfFileItem"
                onClick={() => openPdfInNewTab(pdf.url)}
              >
                <span className="pdfFileName">{pdf.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup d'images */}
      {isImagesPopupOpen && (
        <Popupimages
          initialIndex={0}
          images={images}
          onClose={handleCloseImagesPopup}
        />
      )}
    </div>
  );
}