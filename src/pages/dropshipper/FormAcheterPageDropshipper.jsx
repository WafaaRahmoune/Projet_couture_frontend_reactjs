import React, { useState, useEffect} from 'react';
import Popup from "../../components/generalComponents/Popup";
import { useNavigate, useLocation } from 'react-router-dom';
import { useRef } from 'react';

import Navbarshop from '../../components/shoppingComp/Navbarshop';
import modelImage from '../../assets/products/p1.png';
import plus from '../../assets/icons/plus.png';
import remove from '../../assets/icons/remove.png';
import "../../style/FormAcheterStyle/FormAcheter.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import donepopup from "../../assets/icons/donepopup.png";
import InputField from '../../components/generalComponents/Inputfield';

const wilayas = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار",
  "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر",
  "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة",
  "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران", "البيض",
  "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت",
  "الوادي", "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت",
  "غرداية", "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس",
  "عين صالح", "عين قزّام", "تقرت", "جانت", "المغير", "المنيعة"
];

function FormAcheterPageDropshipper() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
    const [showPopup, setShowPopup] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const errorRef = useRef(null);
  // États pour les prix
  const [prixLivraison, setPrixLivraison] = useState(null);
  const [isLoadingDelivery, setIsLoadingDelivery] = useState(false);
  
  // État pour le chargement de la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Récupérer les données du produit passées en paramètres
  const productData = location.state?.product;
  
  // Utiliser les données du produit
  const prixProduit = productData ? parseFloat(productData.price) : 150000000000000;
  const productImage = productData?.currentImage || modelImage;
  const productName = productData?.title || "عباءة محتشمة";
  const modelCode = productData?.code || "1234";
  
  // Récupérer les données spécifiques au dropshipper
  const minPiecesForDropshipper = productData?.min_pieces_for_dropshipper || 20000;
const userData = localStorage.getItem("user");
let isDropshipper = false;

try {
  if (userData) {
    const user = JSON.parse(userData);
    isDropshipper = user.role === "dropshipper";
  }
} catch (error) {
  console.error("Erreur lors du parsing des données utilisateur:", error);
}
  // Afficher la valeur dans la console pour vérification
  console.log("min_pieces_for_dropshipper:", minPiecesForDropshipper);
  console.log("isDropshipper:", isDropshipper);
  console.log("productData:", productData);

  
  
  // Extraire les variantes disponibles
  const variants = productData?.variants || [];
  
  // Extraire les couleurs et tailles disponibles depuis les variantes
  const availableSizes = [...new Set(variants.map(v => v.size))];
  const availableColors = [...new Set(variants.map(v => v.color))];

  // Effet pour scroller vers les erreurs
  useEffect(() => {
    if ((Object.keys(errors).length > 0 || submitError) && isSubmitted) {
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [errors, submitError, isSubmitted]);

  const getAvailableColorsForSize = (size) => {
    if (!size) return availableColors;
    
    const colorsForSize = variants
      .filter(variant => variant.size === size && variant.quantity > 0)
      .map(variant => variant.color);
    
    return [...new Set(colorsForSize)];
  };

  const getAvailableSizesForColor = (color) => {
    if (!color) return availableSizes;
    
    const sizesForColor = variants
      .filter(variant => variant.color === color && variant.quantity > 0)
      .map(variant => variant.size);
    
    return [...new Set(sizesForColor)];
  };

  // Fonction pour obtenir la quantité disponible pour une combinaison taille/couleur
  const getAvailableQuantity = (size, color) => {
    if (!size || !color) return 0;
    
    const matchingVariants = variants.filter(
      variant => variant.size === size && variant.color === color
    );
    
    return matchingVariants.reduce((total, variant) => total + variant.quantity, 0);
  };



  const [products, setProducts] = useState([{ 
    id: Date.now(),
    size: "",
    color: "",
    nbpieces: ""
  }]);

  const [form, setForm] = useState({
    customerName: "", // Nouveau champ: nom du client
    phone: "", // Téléphone du client
    wilaya: "",
    address: ""
  });

  

  // Calculer le total des quantités et le prix de base total
  const totalQuantite = products.reduce((total, product) => {
    return total + (parseInt(product.nbpieces) || 0);
  }, 0);

  const prixBaseTotal = prixProduit * totalQuantite;
  
  // Calculer le total (plus de remise)
  const total = prixBaseTotal + (prixLivraison || 0);

  // Fonction pour valider la quantité minimale pour dropshipper
  const validateMinPiecesForDropshipper = () => {
    if (!isDropshipper || minPiecesForDropshipper === 0) {
      return ""; // Pas de validation si pas dropshipper ou pas de minimum défini
    }
    
    if (totalQuantite < minPiecesForDropshipper) {
      return `العدد الأدنى للشراء بسعر الجملة هو ${minPiecesForDropshipper} قطعة. أنت طلبت ${totalQuantite} فقط.`;
    }
    
    return "";
  };

  // Fonction pour récupérer le prix de livraison
  const fetchDeliveryPrice = async (wilayaName) => {
    if (!wilayaName) {
      setPrixLivraison(null);
      return;
    }
    
    setIsLoadingDelivery(true);

    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`https://api.kadi-inv.store/clientapi/delivery-price/?wilaya_name=${encodeURIComponent(wilayaName)}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    
      const data = await response.json();
      setPrixLivraison(parseFloat(data.delivery_price));
    } catch (error) {
      console.error("Erreur lors de la récupération du prix de livraison:", error);
      setPrixLivraison(500);
    } finally {
      setIsLoadingDelivery(false);
    }
  };

  // Fonction pour valider la quantité
  const validateQuantity = (id, size, color, quantity) => {
    if (!size || !color || !quantity) return "";
    
    const quantityNum = parseInt(quantity);
    
    if (quantityNum <= 0) {
      return "عدد القطع يجب أن يكون أكبر من 0";
    }
    
    const availableQty = getAvailableQuantity(size, color);
    
    if (availableQty === 0) {
      return "هذه النسخة غير متوفرة حالياً";
    }
    
    if (quantityNum > availableQty) {
      return `الكمية المتاحة: ${availableQty} فقط`;
    }
    
    return "";
  };

const submitOrder = async () => {
  setIsSubmitting(true);
  setSubmitError("");
  
  // Vérifier d'abord la quantité minimale pour dropshipper
  const minPiecesError = validateMinPiecesForDropshipper();
  if (minPiecesError) {
    setSubmitError(minPiecesError);
    setIsSubmitting(false);
    return;
  }
  
  const orderData = {
    name_acheteur: form.customerName,
    phone_number: form.phone,
    address: form.address,
    model_code: modelCode,
    wilaya_name: form.wilaya,
    variants: products.map(product => ({
      size: product.size,
      color: product.color,
      quantity: parseInt(product.nbpieces) || 1
    }))
  };
  
  // VALIDATION DES DONNÉES AVANT ENVOI
  const validationErrors = validateOrderData(orderData);
  if (validationErrors.length > 0) {
    setSubmitError("Erreur de validation: " + validationErrors.join(', '));
    setIsSubmitting(false);
    return;
  }
  
  console.log("Données envoyées:", JSON.stringify(orderData, null, 2));

  const token = localStorage.getItem("accessToken");
  
  try {
    const response = await fetch(`https://api.kadi-inv.store/clientapi/achetermodel/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setShowPopup(true);
      setIsSubmitted(false);
    } else {
      // Gestion améliorée des erreurs
      let errorMessage = "Erreur lors de la création de la commande";
      
      if (data.detail) {
        errorMessage = data.detail;
      } else if (data.error) {
        errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
      } else if (data.message) {
        errorMessage = data.message;
      }
      
      setSubmitError(errorMessage);
    }
  } catch (error) {
    console.error("Erreur réseau:", error);
    setSubmitError("Erreur de connexion au serveur");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleAddLine = () => {
    setProducts([...products, { 
      id: Date.now(),
      size: "",
      color: "",
      nbpieces: ""
    }]);
  };
const validateOrderData = (orderData) => {
  const errors = [];
  
  if (!orderData.name_acheteur || orderData.name_acheteur.trim() === '') {
    errors.push('Le nom de l\'acheteur est requis');
  }
  
  if (!orderData.phone_number || orderData.phone_number.trim() === '') {
    errors.push('Le numéro de téléphone est requis');
  }
  
  if (!orderData.address || orderData.address.trim() === '') {
    errors.push('L\'adresse est requise');
  }
  
  if (!orderData.model_code || orderData.model_code.trim() === '') {
    errors.push('Le code modèle est requis');
  }
  
  if (!orderData.wilaya_name || orderData.wilaya_name.trim() === '') {
    errors.push('La wilaya est requise');
  }
  
  if (!orderData.variants || orderData.variants.length === 0) {
    errors.push('Au moins un variant est requis');
  } else {
    orderData.variants.forEach((variant, index) => {
      if (!variant.size || !variant.color || !variant.quantity) {
        errors.push(`Variant ${index + 1} incomplet`);
      }
      if (variant.quantity <= 0) {
        errors.push(`La quantité du variant ${index + 1} doit être positive`);
      }
    });
  }
  
  return errors;
};
  const handleRemoveLine = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleProductChange = (id, name, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [name]: value };
        
        if (name === "size") {
          updatedProduct.color = "";
          updatedProduct.nbpieces = "";
        }
        
        if (name === "color") {
          updatedProduct.nbpieces = "";
        }
        
        return updatedProduct;
      }
      return product;
    });
    
    setProducts(updatedProducts);
    
    validateProductField(id, name, value);
    
    const product = updatedProducts.find(p => p.id === id);
    if (product.size && product.color && product.nbpieces) {
      const quantityError = validateQuantity(id, product.size, product.color, product.nbpieces);
      setErrors(prev => ({
        ...prev,
        [`quantity-${id}`]: quantityError
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        [`quantity-${id}`]: ""
      }));
    }
    
    // Effacer l'erreur de quantité minimale lorsqu'on change les quantités
    if (name === "nbpieces") {
      setSubmitError("");
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.minPieces;
        return newErrors;
      });
    }
  };

  const validateProductField = (id, name, value) => {
    let error = "";
    if (!value || value.trim() === "") {
      error = "الرجاء ملء هذا الحقل لإتمام العملية بنجاح";
    }

    setErrors(prev => ({
      ...prev,
      [`${name}-${id}`]: error
    }));
  };

  const handleInputChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === "wilaya") {
      fetchDeliveryPrice(value);
    }
    
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "customerName") {
      if (value === "" || value.trim() === "") { 
        error = "الرجاء ملء هذا الحقل لإتمام العملية بنجاح";
      } else if (/^\d+$/.test(value.replace(/\s/g, ''))) {
        error = "الاسم لا يجب أن يحتوي على أرقام فقط";
      } else if (!/[\u0600-\u06FF]/.test(value)) {
        error = "يرجى إدخال الاسم باللغة العربية";
      }
    } else if (name === "phone") {
      const regex = /^0[5-7][0-9]{8}$/;
      if (!regex.test(value)) error = "الرقم غير صحيح ";
    } else if (name === "address") {
      if (value === "" || value.trim() === "") { 
        error = "الرجاء ملء هذا الحقل لإتمام العملية بنجاح";
      } else if (/^\d+$/.test(value.replace(/\s/g, ''))) {
        error = "العنوان لا يجب أن يحتوي على أرقام فقط";
      } else if (!/[\u0600-\u06FF]/.test(value)) {
        error = "يرجى إدخال العنوان باللغة العربية";
      }
    } else if (name !== "discountCode") {
      if (value === "" || value.trim() === "") { 
        error = "الرجاء ملء هذا الحقل لإتمام العملية بنجاح";
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const requiredFields = {
      customerName: form.customerName,
      phone: form.phone,
      wilaya: form.wilaya,
      address: form.address,
    };

    const newErrors = {};

    Object.entries(requiredFields).forEach(([key, value]) => {
      if (!value || value.trim() === "") {
        newErrors[key] = "الرجاء ملء هذا الحقل لإتمام العملية بنجاح";
      } else if (key === "customerName") {
        if (/^\d+$/.test(value.replace(/\s/g, ''))) {
          newErrors[key] = "الاسم لا يجب أن يحتوي على أرقام فقط";
        } else if (!/[\u0600-\u06FF]/.test(value)) {
          newErrors[key] = "يرجى إدخال الاسم باللغة العربية";
        }
      } else if (key === "phone") {
        const regex = /^0[5-7][0-9]{8}$/;
        if (!regex.test(value)) {
          newErrors[key] = "الرقم غير صحيح ";
        }
      } else if (key === "address") {
        if (/^\d+$/.test(value.replace(/\s/g, ''))) {
          newErrors[key] = "العنوان لا يجب أن يحتوي على أرقام فقط";
        } else if (!/[\u0600-\u06FF]/.test(value)) {
          newErrors[key] = "يرجى إدخال العنوان باللغة العربية";
        }
      }
    });

    products.forEach((product) => {
      if (!product.size || product.size.trim() === "") {
        newErrors[`size-${product.id}`] = "الرجاء ملء جميع الحقول: المقاس، اللون وعدد القطع، معًا لإتمام الطلب.";
      }
      if (!product.color || product.color.trim() === "") {
        newErrors[`color-${product.id}`] = "الرجاء ملء جميع الحقول: المقاس، اللون وعدد القطع، معًا لإتمام الطلب.";
      }
      if (!product.nbpieces || product.nbpieces.trim() === "") {
        newErrors[`nbpieces-${product.id}`] = "الرجاء ملء جميع الحقول: المقاس، اللون وعدد القطع، معًا لإتمام الطلب.";
      }
      
      if (product.size && product.color) {
        const availableQty = getAvailableQuantity(product.size, product.color);
        if (availableQty === 0) {
          newErrors[`combination-${product.id}`] = "هذه النسخة غير متوفرة حالياً";
        }
      }
      
      if (product.size && product.color && product.nbpieces) {
        const quantityError = validateQuantity(product.id, product.size, product.color, product.nbpieces);
        if (quantityError) {
          newErrors[`quantity-${product.id}`] = quantityError;
        }
      }
    });

    // Vérifier la quantité minimale pour dropshipper - CORRECTION ICI
    const minPiecesError = validateMinPiecesForDropshipper();
    if (minPiecesError) {
      newErrors.minPieces = minPiecesError;
    }

    const combinations = [];
    products.forEach((product) => {
      if (product.size && product.color) {
        const combination = `${product.size}-${product.color}`;
        if (combinations.includes(combination)) {
          newErrors[`combination-${product.id}`] = "هذا اللون و المقاس مضاف من قبل";
        } else {
          combinations.push(combination);
        }
      }
    });

    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isSubmitted) {
      products.forEach(product => {
        if (product.size && product.color && product.nbpieces) {
          const quantityError = validateQuantity(product.id, product.size, product.color, product.nbpieces);
          setErrors(prev => ({
            ...prev,
            [`quantity-${product.id}`]: quantityError
          }));
        }
      });
      
      // Vérifier aussi la quantité minimale lors de la soumission
      const minPiecesError = validateMinPiecesForDropshipper();
      if (minPiecesError) {
        setErrors(prev => ({ ...prev, minPieces: minPiecesError }));
      }
    }
  }, [products, isSubmitted]);

  return (
    <>
      <Navbarshop defaultSection="" />
      <div className="containershop">
        <div className="shop-wrapper">
          <ArrowBackIcon className='retouricon' onClick={() => navigate(-1)} />
          <div className='containerformachat'>

            <section className="form-header">
              <h2>شراء الموديل</h2>
              <p>يرجى ملء المعلومات أدناه لإتمام عملية الشراء</p>
              {isDropshipper && minPiecesForDropshipper > 0 && (
                <p style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '5px' }}>
                  ⓘ العدد الأدنى للشراء بسعر الجملة: {minPiecesForDropshipper} قطعة
                </p>
              )}
            </section>

            <section className="product-details">
              <div className="product-info">
                <img src={productImage} alt={productName} className="product-image" />
                <div className='detailproductinfo'>
                  <h3>{productName}</h3>
                  <p>{prixProduit} دج</p>
                  {isDropshipper && minPiecesForDropshipper > 0 && (
                    <p style={{ color: '#22C55E', fontSize: '12px' }}>
                      سعر خاص للدروبشيبر (الحد الأدنى: {minPiecesForDropshipper} قطع)
                    </p>
                  )}
                </div>
              </div>
            </section>

            <form className="purchase-form" onSubmit={(e) => e.preventDefault()}>
              {products.map((product, index) => {
                const availableColorsForSelectedSize = getAvailableColorsForSize(product.size);
                const availableSizesForSelectedColor = getAvailableSizesForColor(product.color);
                
                return (
                  <div className="flex-row" key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                    <InputField 
                      titre="المقاس:" 
                      special={true}
                      placeholderSpecial ="اختر"
                      type="text" 
                      name="size" 
                      size="quarter" 
                      down={true} 
                      value={product.size} 
                      onChange={(e) => handleProductChange(product.id, 'size', e.target.value)}
                      hasError={isSubmitted && !!errors[`size-${product.id}`]}
                      options={availableSizesForSelectedColor.length > 0 ? availableSizesForSelectedColor : availableSizes}
                    />

                    <InputField 
                      titre="اللون" 
                      special={true}
                      placeholderSpecial ="اختر"
                      type="text" 
                      name="color" 
                      size="quarter" 
                      down={true} 
                      value={product.color} 
                      onChange={(e) => handleProductChange(product.id, 'color', e.target.value)}
                      hasError={isSubmitted && !!errors[`color-${product.id}`]}
                      options={availableColorsForSelectedSize.length > 0 ? availableColorsForSelectedSize : availableColors}
                    />

                    <InputField 
                      titre="عدد القطع:" 
                      type="number"  
                      name="nbpieces"
                      placeholder="1" 
                      size="quarter" 
                      down={false}  
                      value={product.nbpieces} 
                      onChange={(e) => handleProductChange(product.id, 'nbpieces', e.target.value)}
                      hasError={isSubmitted && (!!errors[`nbpieces-${product.id}`] || !!errors[`quantity-${product.id}`])}
                      min="1"
                    />

                    {index === products.length - 1 && (
                      <img
                        src={plus}
                        alt="plus"
                        className="iconplus"
                        onClick={handleAddLine}
                        style={{ cursor: "pointer", width: "25px", height: "25px" }}
                      />
                    )}
                    {products.length > 1 && (
                      <img
                        src={remove}
                        alt="minus"
                        className="minus"
                        onClick={() => handleRemoveLine(product.id)}
                        style={{ cursor: 'pointer', width: '25px', height: '25px' }}
                      />
                    )}
                    
                    <div className='errorsauterlaligne'>
                      {(errors[`size-${product.id}`] || errors[`color-${product.id}`] || errors[`nbpieces-${product.id}`]) && (
                        <p className="error">
                          {errors[`size-${product.id}`] || errors[`color-${product.id}`] || errors[`nbpieces-${product.id}`]}
                        </p>
                      )}
                      
                      {errors[`combination-${product.id}`] && (
                        <p className="error">{errors[`combination-${product.id}`]}</p>
                      )}
  
                      {errors[`quantity-${product.id}`] && (
                        <p className="error">{errors[`quantity-${product.id}`]}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Afficher l'erreur de quantité minimale */}
              {errors.minPieces && (
                <div 
                  ref={errorRef} 
                  className="error-message" 
                  style={{ marginBottom: '15px' }}
                >
                  <p className="error" style={{ color: '#ff6b6b', textAlign: 'center' }}>
                    {errors.minPieces}
                  </p>
                </div>
              )}
              
              {/* Nouveau champ: Nom du client */}
              <div className="field-wrapper">
                <InputField
                  titre="اسم المشتري:"
                  placeholder="اسم الشخص الذي سيستلم الطلب"
                  type="text"
                  name="customerName"
                  size="oneline"
                  down={false}
                  value={form.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  hasError={isSubmitted && !!errors.customerName}
                />
                {isSubmitted && errors.customerName && (
                  <p className="error">{errors.customerName}</p>
                )}
              </div>
              
              <div className="field-wrapper">
                <InputField
                  titre="رقم هاتف المشتري:"
                  placeholder="مثال: 0695449925"
                  type="text"
                  name="phone"
                  size="oneline"
                  down={false}
                  value={form.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  hasError={isSubmitted && !!errors.phone}
                />
                {isSubmitted && errors.phone && (
                  <p className="error">{errors.phone}</p>
                )}
              </div>
              
              <InputField
                titre="الولاية:"
                name="wilaya"
                down={true}
                special={true}
                size="oneline"
                value={form.wilaya}
                onChange={(e) => handleInputChange('wilaya', e.target.value)}
                options={wilayas}
                hasError={isSubmitted && !!errors.wilaya}
              />
              {isSubmitted && errors.wilaya && (
                <p className="error">{errors.wilaya}</p>
              )}

              <InputField
                titre="العنوان:"
                placeholder='البلدية و اسم الحي أو الشارع'
                type="text"
                name="address"
                size="oneline"
                down={false}
                value={form.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                hasError={isSubmitted && !!errors.address}
              />
              {isSubmitted && errors.address && (
                <p className="error">{errors.address}</p>
              )}
              
              <section className="price-summary">
                <div className="price-row">
                  <span>السعر الأساسي ({totalQuantite} قطعة):</span>
                  <span>{prixBaseTotal} دج</span>
                </div>
                
                <div className="price-row">
                  <span>سعر التوصيل:</span>
                  <span>
                    {isLoadingDelivery 
                      ? "جاري التحميل..." 
                      : prixLivraison === null 
                        ? "--" 
                        : `${prixLivraison} دج`
                    }
                  </span>
                </div>
                
                <div className="price-row total">
                  <span style={{ color: "#22C55E" }}>المجموع:</span>
                  <span style={{ color: "#22C55E" }}>{total} دج</span>
                </div>
              </section>

              {submitError && !errors.minPieces && (
                <div ref={errorRef} className="error-message">
                  <p className="error">{submitError}</p>
                </div>
              )}

              <div className="button-group">
                <button
                  type="submit"
                  className="btn-confirm"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSubmitted(true);
                    
                    if (isFormValid()) {
                      submitOrder();
                    }
                  }}
                >

                  {isSubmitting ? "جاري إنشاء الطلب..." : "تأكيد الشراء"}
                </button>
                
                {showPopup && (
                  <Popup
                    title="تم استلام طلبيتك "
                    iconPopup={donepopup}
                    contenu="سنتواصل معك قريبا عبر مكالمة هاتفية أو عبر الواتساب لتأكيد عملية التوصيل. "
                    buttons={[
                      {
                        text: "حسنا",
                        navigateTo: "/mycommandsdropshipper#orders",
                        backgroundColor: "#22C55E",
                        textColor: "#FFFFFF"
                      }
                    ]}
                    onClose={() => setShowPopup(false)}
                    onConfirm={() => {
                      setShowPopup(false);
                    }}
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormAcheterPageDropshipper;
