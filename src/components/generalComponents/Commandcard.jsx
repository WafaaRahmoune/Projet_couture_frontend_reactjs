import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Popup from "../generalComponents/Popup";
import sorry from "../../assets/icons/sorry.png";
import ContentPopupSorry from "../talabiyatiComp/ContentPopupSorry";
import Popupimages from "../generalComponents/Popupimages";
import "../../style/generalStyle/CommandCard.css";

export default function CommandCard({ 
  selectedImages = [],
  namecommand = "", 
  photobutton = ["", ""],
  date = ["", ""], 
  telephone = ["", ""], 
  prix = ["", ""], 
  status = [],
  pdfFiles = [],
  variants = [],
  isCustom = false,
  dropshipperClientName = null 
}) { 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Vérifier si au moins une variante a une couleur définie
  const hasColorVariants = variants && variants.some(variant => variant.color && variant.color.trim() !== "");

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleImageNext = () => {
    if (selectedImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
    }
  };

  const handleImagePrev = () => {
    if (selectedImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
    }
  };

  const openPdfInNewTab = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  return ( 
    <div className="CardContainer"> 
      {/* Section des images (côté gauche) - Desktop seulement */}
     

      <div className="sidedroit">
        <div className="line1"> 
          <div className="namecommand elemntcard"> 
          
            {namecommand}
            
            { isCustom &&(<div className="specialtext"> 
              مخصص
            </div> )}
                       { !isMobile && dropshipperClientName && (
      <div className="dropshipper-name" style={{fontSize: "1rem", color: "#666", marginTop: "5px",marginRight:"50px"}}>
      مستقبل الطلبية: {dropshipperClientName}
      </div>
    )}
      
        
        
          </div> 
    
          
          {/* Sur mobile: photo et status sur la même ligne */}
          {isMobile ? (
            <div className="photoStatusWrapper">
              <div className="photocommand elemntcard">
                <button className="photobutton" onClick={handleOpenPopup}>
                  {photobutton[0]}
                  <img src={photobutton[1]} alt="photocommand" className="imagefortalabiyati"/>
                </button>
                <button style={{backgroundColor: status[1],padding:"5px 15px",borderRadius:"16px",color:"white",fontWeight:"normal",fontFamily:"Cairo"}} >
                  {status[0]}
                </button>
                {status[2] && (
                  <img 
                    className="iconRefuse" 
                    src={status[2]} 
                    alt="refuse"  
                    onClick={() => setShowPopup(true)}
                  /> 
                )}
                {showPopup && (
                  <Popup
                    title="نعتذر لك عزيزي العميل"
                    sousTitre="دعنا نوضح لك قواعد العمل وأسباب إلغاء الطلب"
                    iconPopup={sorry}
                    contenu={<ContentPopupSorry/>}
                    colorbackgroundTitleSousTitle="#F6EDD2"
                    buttonTexte="حسناً، فهمت"
                    onClose={() => setShowPopup(false)}
                    onConfirm={() => {
                      setShowPopup(false);
                        const userRole = localStorage.getItem('user.role');
    
    // Navigation conditionnelle selon le rôle
    if (userRole === 'dropshipper') {
      navigate('/mycommandsdropshipper');
    } else if (userRole === 'client') {
      navigate('/mycommands');
    } else {
      // Cas par défaut si le rôle n'est pas reconnu
      navigate('/mycommands');
    }
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <>

            
              {/* Status affiché seulement sur desktop/tablette */}
              <div className="sidegauche">
                <div className="statusCommand"> 
                  <button style={{backgroundColor: status[1]}} >
                    {status[0]}
                  </button>
                  {status[2] && (
                    <img 
                      className="iconRefuse" 
                      src={status[2]} 
                      alt="refuse"  
                      onClick={() => setShowPopup(true)}
                    />
                  )}
                  {showPopup && (
                    <Popup
                      title="نعتذر لك عزيزي العميل"
                      sousTitre="دعنا نوضح لك قواعد العمل وأسباب إلغاء الطلب"
                      iconPopup={sorry}
                      contenu={<ContentPopupSorry/>}
                      colorbackgroundTitleSousTitle="#F6EDD2"
                      buttonTexte="حسناً ، فهمت"
                      onClose={() => setShowPopup(false)}
                      onConfirm={() => {
                        setShowPopup(false);
                        navigate('/mycommands');
                      }}
                    />
                  )}
                </div> 
              </div>
            </>
          )}
        </div> 
                      { isMobile && dropshipperClientName && (
      <div className="dropshipper-name" >
      مستقبل الطلبية: {dropshipperClientName}
      </div>
    )}
        <div className="line2"> 
          <div className="datecommand elemntcard">
            <img src={date[1]} alt="datecommand" />
            <span>{date[0]}</span>
          </div> 

          <div className="telephone elemntcard">
            <img src={telephone[1]} alt="telephone" />
            <span>{telephone[0]}</span>
          </div>

          {prix !== null && (
            <div className="prix elemntcard">
              <img src={prix[1]} alt="prix" /> 
              <span>المبلغ الاجمالي مع احتساب التوصيل: {prix[0]} </span>
            </div>
          )}
        </div> 

        {/* Section pour afficher les variantes si elles existent */}
        {variants && variants.length > 0 && (
          <div className="variants-section " style={{marginTop:"0px"}}>
            <div className="variants-table-container">
              <table className="variants-table" >
                <thead>
                  <tr>
                    <th>المقاس</th>
                    {hasColorVariants && <th>اللون</th>}
                    <th>الكمية</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, index) => (
                    <tr key={index}>
                      <td>{variant.size || "-"}</td>
                      {hasColorVariants && <td>{variant.color || "-"}</td>}
                      <td>{variant.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      </div>

      {/* Popup d'image */}
      {isPopupOpen && (
        <Popupimages
          initialIndex={currentImageIndex}
          images={selectedImages}
          onClose={handleClosePopup}
        />
      )}

       {!isMobile && selectedImages.length > 0 && (
        <div className="leftsideDemandeCard">
          <div className="imageSection">
            <div className="mainImage">
              <img 
                src={selectedImages[currentImageIndex]} 
                alt={`Product ${currentImageIndex + 1}`}
                className="productImage"
                onClick={handleOpenPopup}
                style={{ cursor: 'pointer' }}
              />
              {selectedImages.length > 1 && (
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
            
            {selectedImages.length > 1 && (
              <div className="imageIndicators">
                {selectedImages.map((_, index) => (
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
    </div> 
  ); 
}