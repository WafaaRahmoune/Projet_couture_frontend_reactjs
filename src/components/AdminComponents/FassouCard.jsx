import React, { useState } from "react";
import downicon from "../../assets/icons/downicon.png";
import priceicon from "../../assets/icons/price.png";
import phoneicon from "../../assets/icons/whatsapp.png";
import addressicon from "../../assets/icons/addressicon.png";
import deadlineicon from "../../assets/deadlineicon.png";
import Popupimages from "../generalComponents/Popupimages";
import '../../style/AdminStyle/DemandeCard.css';

export default function FasouCard({
  nameorder = "",
  codeorder = "",
  deadline = "",
  variants = [],
  state = "",
  initial_price = 0,
  images = [],
  couturiere_info = null,
  onStatusChange
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#17A2B8", color: "white" };
      case "cancelled":
        return { backgroundColor: "#FF6B6B", color: "white" };
      case "inprogress":
        return { backgroundColor: "#E5B62B", color: "white" };
      case "done":
        return { backgroundColor: "#22C55E", color: "white" };
      default:
        return { backgroundColor: "#17A2B8", color: "white" };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "في الانتظار";
      case "cancelled":
        return "ملغية";
      case "inprogress":
        return "قيد التنفيذ";
      case "done":
        return "مكتملة";
      default:
        return status;
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
    if (state === "inprogress") {
      setShowStatusMenu(!showStatusMenu);
    }
  };

  const handleStatusOptionClick = (newStatus) => {
    setShowStatusMenu(false);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const handleOpenImagePopup = () => {
    setIsImagePopupOpen(true);
  };

  const handleCloseImagePopup = () => {
    setIsImagePopupOpen(false);
  };

  const showDropdown = state === "inprogress";

  return (
    <div className="CardContainer">
      <div className="rightsideDemandeCard">
        {/* Première ligne: Informations principales */}
        <div className="line userInfo">
          <div className="userSection ">
            <span className="userName">{nameorder}</span>
            <span className="codeModel">{codeorder}</span>
          </div>
          
          
          <div className="statusContainer">
            <span 
              className="status" 
              style={getStatusStyle(state)}
              onClick={handleStatusClick}
            >
              {getStatusText(state)}
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
                <div 
                  className="statusOption"
                  onClick={() => handleStatusOptionClick("done")}
                >
                  مكتملة
                </div>
                <div 
                  className="statusOption"
                  onClick={() => handleStatusOptionClick("cancelled")}
                >
                  ملغية
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Deuxième ligne: Prix et informations de la couturière */}
        <div className="line modelInfo">
          {couturiere_info && (
            <>
              {couturiere_info.full_name && (
                <div className="locationItem">
                  <div style={{fontFamily:"Amiri", fontSize:"16px", fontWeight:"bold", color:"#2C3E50"}}>
                    الخياطة المكلفة بالمهمة: 
                  </div>
                  <span className="userName">{couturiere_info.full_name}</span>
                </div>
              )}
              
              {couturiere_info.address && (
                <div className="locationItem">
                  <img src={addressicon} alt="address" className="locationIcon" />
                  <span>{couturiere_info.address}</span>
                </div>
              )}
              
              {couturiere_info.phone_number && (
                <div className="phoneSection">
                  <img src={phoneicon} alt="phone" className="phoneIcon" />
                  <span>{couturiere_info.phone_number}</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="line modelInfo">
        
        <div className="deadlineSection">
            <img src={deadlineicon} alt="deadline" className="deadlineIcon" />
            <span className="deadlineText">الموعد النهائي: {deadline}</span>
          </div>
          <div className="locationItem">
          <img src={priceicon} alt="price" className="locationIcon" />
          <span>السعر الاجمالي: {initial_price} دج</span>
        </div>
</div>
        {/* Troisième ligne: Variantes et description */}
        <div className="line">
          {variants.length > 0 && (
            <div className="tableCommandCard">
              <table className="variantsTable">
                <thead>
                  <tr>
                    <th>المقاس</th>
                    <th>اللون</th>
                    <th>الكمية</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, index) => (
                    <tr key={index}>
                      <td className="sizeCell">{variant.size}</td>
                      <td className="colorCell">
                        <div className="colorInfo">
                          <span>{variant.color}</span>
                        </div>
                      </td>
                      <td className="quantityCell">{variant.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Section des images */}
      {images.length > 0 && (
        <div className="leftsideDemandeCard">
          <div className="imageSection">
            <div className="mainImage">
              <img 
                src={images[currentImageIndex]?.image_url} 
                alt={`Order ${currentImageIndex + 1}`}
                className="productImage"
                onClick={handleOpenImagePopup}
                style={{ cursor: 'pointer' }}
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
          images={images.map(img => img.image_url)}
          onClose={handleCloseImagePopup}
        />
      )}
    </div>
  );
}