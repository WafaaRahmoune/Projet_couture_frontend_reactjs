import React, { useState } from "react";
import phoneicon from "../../assets/icons/whatsapp.png";
import addressicon from "../../assets/icons/addressicon.png";
import Popupimages from "../generalComponents/Popupimages";
import priceicon from "../../assets/icons/price.png";
import trueicon from "../../assets/true.png";
import no from "../../assets/no.png";
import Popup from "../../components/generalComponents/Popup"; // Import du composant Popup
import areyousure from "../../assets/areyousure.png"; // Import de l'image pour le popup
import "../../style/AdminStyle/ModelComp.css";
import { WidthFull } from "@mui/icons-material";
import useErreur401Handler from '../generalComponents/Erreur401Handle';

export default function ModelComp({
  nommodel = "",
  statusmodel = "",
  images = [],
  namecouturiere = "",
  price = null,
  telephone = "",
  address = "",
  variants = [],
  onAccept,
  onReject,
  onImageClick,
  modelId,
  
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false); // État pour afficher la popup de confirmation
  const { handle401Error } = useErreur401Handler();

  const getStatusStyle = (status) => {
    switch (status) {
      case "في الانتظار":
        return { backgroundColor: "#17A2B8", color: "white" };
      case "مرفوضة":
        return { backgroundColor: "#FF6B6B", color: "white" };
      case "مقبولة":
        return { backgroundColor: "#22C55E", color: "white" };
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

  const handleOpenImagePopup = () => {
    setIsImagePopupOpen(true);
    if (onImageClick) {
      onImageClick();
    }
  };

  const handleCloseImagePopup = () => {
    setIsImagePopupOpen(false);
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept({
        nommodel,
        statusmodel,
        images,
        namecouturiere,
        price,
        telephone,
        address,
        variants
      });
    }
  };

  // Fonction pour ouvrir la popup de confirmation de refus
  const handleRejectClick = () => {
    setShowRejectPopup(true);
  };

  // Fonction pour confirmer le refus
  const handleConfirmReject = async () => {
    if (!modelId) {
      console.error("ID du modèle manquant");
      return;
    }

    setIsRejecting(true);
    setShowRejectPopup(false); // Fermer la popup

    try {
      const response = await fetch(`https://api.kadi-inv.store/adminapi/RefuseModelCouturiere/${modelId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
      });


 if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleConfirmReject();
        }
      }
      else 
      if (response.ok) {
        console.log("Modèle refusé avec succès");
        if (onReject) {
          onReject();
        }
      }  else {
        console.error("Échec du refus du modèle");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  // Fonction pour annuler le refus
  const handleCancelReject = () => {
    setShowRejectPopup(false);
  };

  return (
    <div className="adminModelCardContainer">
      {/* Côté droit */}
      <div className="adminModelRightSide">
        {/* Première row : nom du modèle, statut et bouton image */}
        <div className="adminModelLine adminModelHeader">
          <div className="adminModelSection">
            <span className="adminModelName">{nommodel}</span>
            <span 
              className="adminModelStatus" 
              style={getStatusStyle(statusmodel)}
            >
              {statusmodel}
            </span>
          </div>
        </div>

        {/* Deuxième row : nom couturière et prix */}
        <div className="adminModelLine adminModelInfo">
          <div className="adminCouturiereSection">
            <span className="adminCouturiereName">من تصميم :{namecouturiere}</span>
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
          {price !=0 && (
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
            onClick={handleAccept}
          >
            عرض النموذج
            <img src={trueicon} alt="accept" style={{width:"18px", height:"18px"}} />
          </button>
          
          <button 
            className="adminRejectButton"
            onClick={handleRejectClick}
            disabled={isRejecting}
          >
            {isRejecting ? "جاري الرفض..." : "رفض النموذج"}
            <img 
              src={no} 
              alt="reject" 
              style={{
                width: "18px", 
                height: "18px", 
                opacity: isRejecting ? 0.5 : 1
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

      {/* Popup de confirmation pour le refus */}
      {showRejectPopup && (
        <Popup
          title="هل أنت متأكد من رفض هذا النموذج؟"
          iconPopup={areyousure}
          sousTitre="رفضك للنموذج هو قرار نهائي وليس فيه رجوع"
          buttons={[
            {
              text: "أتراجع",
              onClick: handleCancelReject,
              backgroundColor: "#FFFFFF",
              textColor: "#444444",
              width: "fit-content",
              border: "2px solid",
              borderColor: "Black",
              customClass: "with-border"
            },
            {
              text: "أؤكد الرفض",
              onClick: handleConfirmReject,
              backgroundColor: "#EF4444",
              textColor: "#FFFFFF",
              width: "fit-content",
              border: "2px solid",
              borderColor: "Black",
              customClass: "with-border"
            }
          ]}
          onClose={handleCancelReject}
          buttonLayout="horizontal"
          buttonGap="20px"
        />
      )}
    </div>
  );
}
