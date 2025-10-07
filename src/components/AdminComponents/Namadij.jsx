import React, { useState } from "react";
import phoneicon from "../../assets/icons/whatsapp.png";
import addressicon from "../../assets/icons/addressicon.png";
import Popupimages from "../generalComponents/Popupimages";
import priceicon from "../../assets/icons/price.png";
import editicon from "../../assets/edit.png";
import hideicon from "../../assets/hide.png";
import Popup from "../../components/generalComponents/Popup";
import areyousure from "../../assets/areyousure.png";
import "../../style/AdminStyle/ModelComp.css";
import useErreur401Handler from '../generalComponents/Erreur401Handle';

export default function Namadij({
  codemodel = "",
  nommodel = "",
  images = [],
  namecouturiere = "",
  price = null,
  telephone = "",
  address = "",
  variants = [],
  onEdit,
  onHide,
  onImageClick,
  modelId
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [showHidePopup, setShowHidePopup] = useState(false);
  const { handle401Error } = useErreur401Handler();
   
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

  const handleOpenImagePopup = () => {
    setIsImagePopupOpen(true);
    if (onImageClick) {
      onImageClick();
    }
  };

  const handleCloseImagePopup = () => {
    setIsImagePopupOpen(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit({
        codemodel,
        nommodel,
        images,
        namecouturiere,
        price,
        telephone,
        address,
        variants
      });
    }
  };

  const handleHideClick = () => {
    setShowHidePopup(true);
  };

  const handleConfirmHide = async () => {
    setIsHiding(true);
    
    try {
      // Appel à l'API de suppression
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/adminapi/${codemodel}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleConfirmHide();
        }
      }
      else 

      if (response.ok) {
        console.log("Modèle masqué avec succès");
        if (onHide) {
          onHide(modelId);
        }
      } else {
        console.error("Échec du masquage du modèle");
        alert("Erreur lors du masquage du modèle.");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      alert("Erreur de connexion au serveur.");
    } finally {
      setIsHiding(false);
      setShowHidePopup(false);
    }
  };

  const handleCancelHide = () => {
    setShowHidePopup(false);
  };

  return (
    <div className="adminModelCardContainer">
      {/* Côté droit */}
      <div className="adminModelRightSide">
        {/* Première row : code et nom du modèle */}
        <div className="adminModelLine adminModelHeader">
          <div className="adminModelSection">
            <span className="adminModelName">{nommodel}</span>
            <span className="adminModelCode">{codemodel}</span>
          </div>
        </div>

        {/* Deuxième row : nom couturière et informations de contact */}
        <div className="adminModelLine adminModelInfo">
          <div className="adminCouturiereSection">
            {namecouturiere && (
              <span className="adminCouturiereName">من تصميم : {namecouturiere}</span>
            )}
          </div>
          {telephone && (
            <div className="adminContactItem">
              <img src={phoneicon} alt="phone" style={{width:"24px", height:"24px"}}/>
              <span>{telephone}</span>
            </div>
          )}
          
          {address && (
            <div className="adminContactItem">
              <img src={addressicon} alt="address" style={{width:"24px", height:"24px"}} />
              <span>{address}</span>
            </div>
          )}
          {price && (
            <div className="adminPriceItem">
              <img src={priceicon} alt="price" style={{width:"24px", height:"24px"}} />
              <span>سعر القطعة: {price} دج</span>
            </div>
          )}
        </div>

        {/* 3eme row : tableau des variants */}
        {variants && variants.length > 0 && (
          <div className="adminModelTable">
            <table className="adminVariantsTable">
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
                    <td className="adminSizeCell">{variant.size}</td>
                    <td className="adminColorCell">
                      <div className="adminColorInfo">
                        <span>{variant.color}</span>
                      </div>
                    </td>
                    <td className="adminQuantityCell">{variant.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Côté gauche */}
      <div className="adminModelLeftSide">
        {/* Section images */}
        {images.length > 0 && (
          <div className="adminImageSection">
            <div className="adminMainImage">
              <img 
                src={images[currentImageIndex]} 
                alt={`Model ${currentImageIndex + 1}`}
                className="adminProductImage"
                onClick={handleOpenImagePopup}
                style={{ cursor: 'pointer' }}
              />
              {images.length > 1 && (
                <>
                  <button 
                    className="adminImageNav adminImagePrev" 
                    onClick={handleImagePrev}
                  >
                    ‹
                  </button>
                  <button 
                    className="adminImageNav adminImageNext" 
                    onClick={handleImageNext}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="adminImageIndicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`adminIndicator ${index === currentImageIndex ? 'adminActive' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="adminActionButtons">
          <button 
            className="adminAcceptButton"
            onClick={handleEdit}
          >
            تعديل النموذج
            <img src={editicon} alt="edit" style={{width:"18px", height:"18px"}} />
          </button>
          
          <button 
            className="adminRejectButton"
            onClick={handleHideClick}
            disabled={isHiding}
          >
            {isHiding ? "جاري الإخفاء..." : "إخفاء النموذج"}
            <img 
              src={hideicon} 
              alt="hide" 
              style={{
                width: "18px", 
                height: "18px", 
                opacity: isHiding ? 0.5 : 1
              }} 
            />
          </button>
        </div>
      </div>

      {/* Popup d'image */}
      {isImagePopupOpen && (
        <Popupimages
          initialIndex={currentImageIndex}
          images={images}
          onClose={handleCloseImagePopup}
        />
      )}

      {/* Popup de confirmation pour l'action de masquage */}
      {showHidePopup && (
        <Popup
          title="هل أنت متأكد من إخفاء هذا النموذج؟"
          iconPopup={areyousure}
          sousTitre="سيتم إخفاء هذا النموذج من العرض للعملاء"
          buttons={[
            {
              text: "إلغاء",
              onClick: handleCancelHide,
              backgroundColor: "#FFFFFF",
              textColor: "#444444",
              width: "fit-content",
              border: "2px solid",
              borderColor: "Black",
              customClass: "with-border"
            },
            {
              text: "تأكيد الإخفاء",
              onClick: handleConfirmHide,
              backgroundColor: "#EF4444",
              textColor: "#FFFFFF",
              width: "fit-content",
              border: "2px solid",
              borderColor: "Black",
              customClass: "with-border"
            }
          ]}
          onClose={handleCancelHide}
          buttonLayout="horizontal"
          buttonGap="20px"
        />
      )}
    </div>
  );
}