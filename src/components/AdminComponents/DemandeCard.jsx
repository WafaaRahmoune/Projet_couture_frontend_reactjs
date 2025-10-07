import React, { useState } from "react";
import deadlineicon from "../../assets/deadlineicon.png";
import phoneicon from "../../assets/icons/whatsapp.png";
import wilayaicon from "../../assets/icons/wilayaicon.png";
import downicon from "../../assets/icons/downicon.png";
import priceicon from "../../assets/icons/price.png";
import addressicon from "../../assets/icons/addressicon.png";
import Popupimages from "../generalComponents/Popupimages";
import '../../style/AdminStyle/DemandeCard.css';

export default function DemandeCard({
  nameuser = "",
  codemodel = "",
  typeuser = "",
  isCustomcommand = null,
  deadlinecustomorder = null,
  statuscommand = null,
  phone = null,
  wilayaname = null,
  exactaddress = null,
  modelname = null,
  price = null +'دج',
  variants = null,
  images =null,
  deliveryprice,
  pdfFiles,
  profit_percentage,
  nameclientdropshipper=null,
  onStatusChange
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false); // Nouvel état pour contrôler le popup

  const getStatusStyle = (status) => {
    switch (status) {
      case "في الانتظار":
        return { backgroundColor: "#17A2B8", color: "white" };
      case "مرفوضة":
        return { backgroundColor: "#FF6B6B", color: "white" };
      case "مخصص":
        return { backgroundColor: "#FF6B6B", color: "white" };
      case "قيد التنفيذ":
        return { backgroundColor: "#E5B62B", color: "white" };
      case "مكتملة":
        return { backgroundColor: "#22C55E", color: "white" };
      case "عميل":
        return { backgroundColor: "#DBEAFE", color: "black" };
      case "دروبشيبينغ":
        return { backgroundColor: "#DBEAFE", color: "black" };
      default:
        return { backgroundColor: "#17A2B8", color: "white" };
    }
  };

  const handleImageNext = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handleImagePrev = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleStatusClick = () => {
    if (statuscommand !== "مرفوضة" && statuscommand !== "مكتملة") {
      setShowStatusMenu(!showStatusMenu);
    }
  };

  const handleStatusChange = (newStatus) => {
    setShowStatusMenu(false);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  // Fonctions pour gérer l'ouverture et la fermeture du popup d'image
  const handleOpenImagePopup = () => {
    setIsImagePopupOpen(true);
  };

  const handleCloseImagePopup = () => {
    setIsImagePopupOpen(false);
  };

  const getStatusOptions = () => {
  if (statuscommand === "في الانتظار") {
    return ["قيد التنفيذ", "مرفوضة", "مكتملة"];
  } else if (statuscommand === "قيد التنفيذ") {
    return ["مكتملة", "مرفوضة"];
  }
  return [];
};
  const statusOptions = getStatusOptions();
  const showDropdown = statusOptions.length > 0 && 
                      statuscommand !== "مرفوضة" && 
                      statuscommand !== "مكتملة";


  return (
    <div className="CardContainer">
      <div className="rightsideDemandeCard">
        <div className="line userInfo">
          <div className="userSection">
            <span className="userName">{nameuser}</span>
            <span 
              className="userType" 
              style={getStatusStyle(typeuser)}
            >
              {typeuser}
            </span>

{ nameclientdropshipper !=null &&(
<span 
              className="userType" 
              style={getStatusStyle(typeuser)}
            >
              اسم المشتري : {nameclientdropshipper}
            </span>
)}
           
          </div>
          
          {isCustomcommand && (
            <div className="customOrder">
              <span 
                className="customLabel"
                style={getStatusStyle("مخصص")}
              >
                مخصص
              </span>
              <div className="deadlineSection">
                <img src={deadlineicon} alt="deadline" className="deadlineIcon" />
                <span className="deadlineText">{deadlinecustomorder} يوم متبقي</span>
              </div>
            </div>
          )}
          
          <div className="line statusInfo">
            <div className="statusContainer" style={{position: 'relative'}}>
              <span 
                className="status" 
                style={getStatusStyle(statuscommand)}
                onClick={handleStatusClick}
              >
                {statuscommand}
                {showDropdown && (
                  <img 
                    src={downicon} 
                    alt="down" 
                    className="mydownicon" 
                  />
                )}
              </span>
              
              {showStatusMenu && showDropdown && (
                <div className="statusMenu">
                  {statusOptions.map((option) => (
                    <div 
                      key={option}
                      className="statusOption"
                      onClick={() => handleStatusChange(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="line modelInfo">
          <div className="modelSection">
            <span className="modelName">{modelname}</span>
            <span className="codeModel">{codemodel}</span>
          </div>

          {((isCustomcommand === false) || (isCustomcommand === true && statuscommand !== "في الانتظار")) && (
            <div className="locationItem">
              <img src={priceicon} alt="wilaya" className="locationIcon" />
              <span> {price} دج للقطعة</span>
              {(profit_percentage && (
                <span> بعد تطبيق كود برومو</span>
              ))}
            </div>
          )}
          
          {wilayaname && (
            <div className="locationItem">
              <img src={wilayaicon} alt="wilaya" className="locationIcon" />
              <span>{wilayaname} : {deliveryprice} دج</span>
            </div>
          )}
          
          {exactaddress && (
            <div className="locationItem">
              <img src={addressicon} alt="address" className="locationIcon" />
              <span>{exactaddress}</span>
            </div>
          )}
        
          {phone && (
            <div className="line phoneInfo">
              <div className="phoneSection">
                <img src={phoneicon} alt="phone" className="phoneIcon" />
                <span>{phone}</span>
              </div>
            </div>
          )}
        </div>

        {variants.length > 0 && (
          <div className="tableCommandCard">
            <table className="variantsTable">
              <thead>
                <tr>
                  <th>المقاس</th>
                  {!isCustomcommand &&(
                     <th>اللون</th>
                  )

                  }
                  
                  <th>الكمية</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => (
                  <tr key={index}>
                    <td className="sizeCell">{variant.size}</td>
                    {!isCustomcommand &&(
                   <td className="colorCell">
                      <div className="colorInfo">
                        <span>{variant.color}</span>
                      </div>
                    </td>
                  )

                  }
                    
                    <td className="quantityCell">{variant.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}



      
{pdfFiles && pdfFiles.length > 0 && (
  <div className="pdfFilesSection">
    <h4 className="pdfSectionTitle">الملفات المرفقة</h4>
    <div className="pdfFilesList">
      {pdfFiles.map((pdf, index) => (
        <div 
          key={index} 
          className="pdfFileItem"
          onClick={() => window.open(pdf.url, '_blank')}
        >
          <span className="pdfFileName">{pdf.name}</span>
        </div>
      ))}
    </div>
  </div>
)}
      </div>

      {images.length > 0 && (
        <div className="leftsideDemandeCard">
          <div className="imageSection">
            <div className="mainImage">
              <img 
                src={images[currentImageIndex]} 
                alt={`Product ${currentImageIndex + 1}`}
                className="productImage"
                onClick={handleOpenImagePopup} // Ajout du clic pour ouvrir le popup
                style={{ cursor: 'pointer' }} // Curseur pointer pour indiquer que c'est cliquable
              />
              {images.length > 1 && (
                <>
                  <button 
                    className="imageNav prev" 
                    onClick={handleImageNext}
                  >
                    ›
                  </button>
                  <button 
                    className="imageNav next" 
                    onClick={handleImagePrev}
                  >
                    ‹
                  </button>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="imageIndicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup d'image */}
      {isImagePopupOpen && (
        <Popupimages
          initialIndex={currentImageIndex}
          images={images}
          onClose={handleCloseImagePopup}
        />
      )}
    </div>
  );
}