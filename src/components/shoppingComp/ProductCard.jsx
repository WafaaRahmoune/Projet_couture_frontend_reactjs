// src/components/ProductCard.jsx
import React, { useState } from "react";
import "../../style/shoppingStyle/ProductCard.css";
import { useNavigate } from 'react-router-dom';
import Popupimages from "../generalComponents/Popupimages";

// Icônes de flèche personnalisées
const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ProductCard({ product, icon }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [iconClicked, setIconClicked] = useState(false);
  console.log(icon)
  const goToform = () => {

    if (icon !=null){
navigate("/FormAcheterPageDropshipper", {
      state: {
        product: {
          ...product,
          currentImage: product.images[currentImageIndex],
          code: product.code,
          variants: product.variants
        }
      }
    });
    }
    else{
navigate("/shopping/acheter", {
      state: {
        product: {
          ...product,
          currentImage: product.images[currentImageIndex],
          code: product.code,
          variants: product.variants
        }
      }
    });

    }
    
  };

  // Fonction pour télécharger le CSV
  const downloadCSV = (e) => {
    e.stopPropagation();
    setIconClicked(true);
    
    // Préparer les données CSV
    const csvData = prepareCSVData(product);
    
    // Créer un blob avec l'encodage UTF-8 avec BOM pour supporter l'arabe
    const blob = new Blob(["\uFEFF" + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${product.title || 'product'}_details.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Réinitialiser l'état après un court délai
    setTimeout(() => {
      setIconClicked(false);
    }, 300);
  };

  // Préparer les données CSV correctement formatées avec ajustement automatique des colonnes
  const prepareCSVData = (product) => {
    // En-têtes en arabe exactement comme dans votre Excel
    const headers = [
      'اسم الموديل',                              // A
      'الوصف',                                    // B  
      'المتغيرات (اللون المقاس)',                   // C
      'المقاسات',                                 // D
      'الكمية',                                   // E
      'السعر المقطعة للدكطعة للدروبشيبر',            // F
      'الحد الأدنى للقطع للدروبشيبر',               // G
      'الصور'                                     // H
    ];
    
    // Formater les variantes (couleur, taille, quantité) - Selon vos données: "برتقالي 3XL (10), برتقالي 3XL (5)"
    const variantsText = product.variants && product.variants.length > 0
      ? product.variants.map(v => `${v.color || 'غير متوفر'} ${v.size || 'غير متوفر'} (${v.quantity || 0})`).join(', ')
      : 'لا توجد متغيرات';
    
    // Formater les tailles - Selon vos données: "3XL"
    const sizesText = product.sizes && product.sizes.length > 0
      ? product.sizes.join(', ')
      : (product.variants && product.variants.length > 0 
         ? [...new Set(product.variants.map(v => v.size).filter(s => s))].join(', ')
         : 'غير متوفر');
    
    // Calculer la quantité totale - Selon vos données: "10"
    const totalQuantity = product.variants && product.variants.length > 0
      ? product.variants.reduce((total, variant) => total + (parseInt(variant.quantity) || 0), 0).toString()
      : 'غير متوفر';
    
    // Formater les images
    const imagesText = product.images && product.images.length > 0
      ? product.images.map(img => typeof img === 'string' ? img : img.image || img.image_url || img.src).join('; ')
      : (product.image ? product.image : 'لا توجد صور');
    
    // Données de la ligne dans le bon ordre
    const rowData = [
      product.title || product.name || 'غير متوفر',                      // A: اسم الموديل
      product.description || 'غير متوفر',                               // B: الوصف  
      variantsText,                                                     // C: المتغيرات
      sizesText,                                                        // D: المقاسات
      totalQuantity,                                                    // E: الكمية
      product.price_per_piece_for_dropshipper || product.price || 'غير متوفر', // F: السعر
      product.min_pieces_for_dropshipper || 'غير متوفر',                 // G: الحد الأدنى
      imagesText                                                        // H: الصور
    ];

    // Calculer la largeur maximale pour chaque colonne
    const columnWidths = headers.map((header, index) => {
      const headerLength = getTextLength(header);
      const dataLength = getTextLength(String(rowData[index] || ''));
      return Math.max(headerLength, dataLength);
    });

    // Ajuster les en-têtes et les données selon la largeur calculée
    const adjustedHeaders = headers.map((header, index) => 
      padText(header, columnWidths[index])
    );
    
    const adjustedRowData = rowData.map((data, index) => 
      padText(String(data || ''), columnWidths[index])
    );
    
    // Échapper les données pour CSV
    const escapedHeaders = adjustedHeaders.map(field => escapeCSVField(field));
    const escapedData = adjustedRowData.map(field => escapeCSVField(field));
    
    // Retourner les en-têtes et les données
    return [escapedHeaders.join(','), escapedData.join(',')].join('\r\n');
  };

  // Fonction pour calculer la longueur du texte (prend en compte les caractères arabes)
  const getTextLength = (text) => {
    if (!text) return 0;
    // Pour les caractères arabes, on peut ajuster le calcul si nécessaire
    return text.length;
  };

  // Fonction pour ajouter des espaces pour ajuster la largeur
  const padText = (text, targetWidth) => {
    if (!text) text = '';
    const currentLength = getTextLength(text);
    if (currentLength >= targetWidth) return text;
    
    // Ajouter des espaces à droite pour atteindre la largeur cible
    const spacesToAdd = targetWidth - currentLength;
    return text + ' '.repeat(spacesToAdd);
  };

  // Fonction pour échapper les champs CSV
  const escapeCSVField = (field) => {
    if (field && typeof field === 'string') {
      // Si le champ contient des virgules, des guillemets ou des sauts de ligne, l'entourer de guillemets
      if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes(';')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
    }
    return field;
  };

  // Ouvrir le popup
  const openImagePopup = () => {
    setShowPopup(true);
  };

  // Fermer le popup
  const closeImagePopup = () => {
    setShowPopup(false);
  };

  // Préparer les images
  const images = product.images || [product.image];
  const hasMultipleImages = images.length > 1;

  // Aller à l'image suivante
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Aller à l'image précédente
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Styles intégrés pour l'icône
  const iconStyles = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      margin: "5px 10px",
    },
    icon: {
      width: "20px",
      height: "20px",
      cursor: "pointer",
      transition: "transform 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: iconClicked ? "scale(0.9)" : "scale(1)"
    },
    iconImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain"
    },
  };

  return (
    <>
      <div className="shopping-product-card">
        <div className="shopping-product-img-container" onClick={openImagePopup}>
          <img 
            src={images[currentImageIndex]} 
            alt={product.title} 
            className="shopping-product-image" 
          />
          
          {hasMultipleImages && (
            <>
              <button className="shopping-nav-btn shopping-prev-btn" onClick={prevImage}>
                <ArrowLeft />
              </button>
              <button className="shopping-nav-btn shopping-next-btn" onClick={nextImage}>
                <ArrowRight />
              </button>
              
              <div className="shopping-image-indicators">
                {images.map((_, index) => (
                  <span 
                    key={index} 
                    className={`shopping-indicator ${index === currentImageIndex ? 'shopping-indicator-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  ></span>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="shopping-product-header">
          <h3 className="shopping-product-title">{product.title}</h3>
          <p className="shopping-product-price">{product.price + " دج"}</p>
        </div>

        <p className="shopping-product-sizes">
          <span>المقاسات:</span>
          {product.sizes && product.sizes.map((size, idx) => (
            <span key={idx} className="shopping-size-item">{size}</span>
          ))}
        </p>

        <div style={iconStyles.container}>
          {icon && (
            <div 
              style={iconStyles.icon}
              onClick={downloadCSV}
            >
              <img src={icon} alt="Télécharger les détails" style={iconStyles.iconImage} />
            </div>
          )}
          <button className="shopping-buy-btn" onClick={goToform}>احصل عليه</button>
        </div>
      </div>

      {showPopup && (
        <Popupimages
          images={images}
          initialIndex={currentImageIndex}
          onClose={closeImagePopup}
        />
      )}
    </>
  );
}