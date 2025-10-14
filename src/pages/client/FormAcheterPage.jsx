import React, { useState, useEffect, useRef } from 'react';
import Popup from "../../components/generalComponents/Popup";
import { useNavigate, useLocation } from 'react-router-dom';

import Navbarshop from '../../components/shoppingComp/Navbarshop';
import modelImage from '../../assets/products/p1.png';
import plus from '../../assets/icons/plus.png';
import remove from '../../assets/icons/remove.png';
import "../../style/FormAcheterStyle/FormAcheter.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import donepopup from "../../assets/icons/donepopup.png";
import InputField from '../../components/generalComponents/Inputfield';
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

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

function FormAcheterPage() {
    const { handle401Error } = useErreur401Handler();

  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer les données du produit passées en paramètres
  const productData = location.state?.product;
  
  // Utiliser les données du produit
  const prixProduit = productData ? parseFloat(productData.price) : 150000000000000;
  const productImage = productData?.currentImage || modelImage;
  const productName = productData?.title || "عباءة محتشمة";
  const modelCode = productData?.code || "1234";

  // États pour les prix et le code promo
  const [prixLivraison, setPrixLivraison] = useState(null);
  const [isLoadingDelivery, setIsLoadingDelivery] = useState(false);
  const [discountData, setDiscountData] = useState(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [discountError, setDiscountError] = useState("");
  
  // État pour le chargement de la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  // Référence pour le délai de validation du code promo
  const discountTimeoutRef = useRef(null);
  
  // Référence pour le défilement vers les erreurs
  const errorRef = useRef(null);
  
  // Extraire les variantes disponibles
  const variants = productData?.variants || [];
  
  // Extraire les couleurs et tailles disponibles depuis les variantes
  const availableSizes = [...new Set(variants.map(v => v.size))];
  const availableColors = [...new Set(variants.map(v => v.color))];

  // Fonction pour obtenir les couleurs disponibles pour une taille donnée, en excluant les combinaisons déjà utilisées
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

  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [products, setProducts] = useState([{ 
    id: Date.now(),
    size: "",
    color: "",
    nbpieces: ""
  }]);

  const [form, setForm] = useState({
    discountCode: "",
    phone: "",
    wilaya: "",
    address: ""
  });

  const [errors, setErrors] = useState({});

  // Calculer le total des quantités et le prix de base total
  const totalQuantite = products.reduce((total, product) => {
    return total + (parseInt(product.nbpieces) || 0);
  }, 0);

  const prixBaseTotal = prixProduit * totalQuantite;
  
  // Calculer le total après remise
  const prixApresRemise = discountData?.valid 
    ? prixBaseTotal - (prixBaseTotal * discountData.discount_percentage / 100)
    : prixBaseTotal;
  
  const total = prixApresRemise + (prixLivraison || 0);

  // Fonction pour faire défiler vers la première erreur
  const scrollToFirstError = () => {
    // Attendre un peu pour que le DOM se mette à jour avec les erreurs
    setTimeout(() => {
      // Trouver le premier élément d'erreur
      const firstErrorElement = document.querySelector('.error');
      
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
        
        // Optionnel: Mettre en surbrillance l'élément d'erreur
        firstErrorElement.style.transition = 'all 0.3s ease';
        firstErrorElement.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        
        setTimeout(() => {
          if (firstErrorElement) {
            firstErrorElement.style.backgroundColor = '';
          }
        }, 2000);
      }
    }, 100);
  };

  // Fonction pour récupérer le prix de livraison
  const fetchDeliveryPrice = async (wilayaName) => {
    if (!wilayaName) {
      setPrixLivraison(null);
      return;
    }
    
    setIsLoadingDelivery(true);


  
  try {
    const response = await fetch(`https://api.kadi-inv.store/clientapi/delivery-price/?wilaya_name=${encodeURIComponent(wilayaName)}`, {
      method: "GET",
      headers: {
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

  // Fonction pour valider le code promo
  const validateDiscountCode = async (code) => {
    if (!code || code.trim() === "") {
      setDiscountData(null);
      setDiscountError("");
      return;
    }
    
    setIsValidatingCode(true);
    setDiscountError("");
    


 try {
    const response = await fetch(`https://api.kadi-inv.store/clientapi/validatecodepromo/${code.trim()}/${modelCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();




      
      if (data.valid) {
        setDiscountData(data);
        setDiscountError("");
      } else {
        setDiscountData(null);
        setDiscountError(data.message || "كود الخصم غير صالح");
      }
    } catch (error) {
      console.error("Erreur lors de la validation du code promo:", error);
      setDiscountData(null);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setDiscountError("تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
      } else {
        setDiscountError("حدث خطأ غير متوقع أثناء التحقق من الكود");
      }
    } finally {
      setIsValidatingCode(false);
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

  // Fonction pour soumettre la commande
  const submitOrder = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    
    const orderData = {
      phone_number: form.phone,
      address: form.address,
      model_code: modelCode,
      wilaya_name: form.wilaya,
      promo_code: form.discountCode.trim() !== "" ? form.discountCode.trim() : null,
      variants: products.map(product => ({
        size: product.size,
        color: product.color,
        quantity: parseInt(product.nbpieces) || 1
      }))
    };
    
    console.log("Données envoyées:", orderData);
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

   if (response.status === 401) {
        const refreshSuccess = await handle401Error();
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return submitOrder ();
        }
      }



   
      
      if (response.status === 201) {
        setShowPopup(true);
        setIsSubmitted(false);
      } else {
        setSubmitError(data.message || "حدث خطأ أثناء إنشاء الطلب");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de la commande:", error);
      
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        
        if (error.response.status === 500) {
          setSubmitError("خطأ في الخادم الداخلي. يرجى المحاولة لاحقًا");
        } else if (error.response.data && error.response.data.message) {
          setSubmitError(error.response.data.message);
        } else {
          setSubmitError("خطأ في الاتصال أثناء إنشاء الطلب");
        }
      } else if (error.request) {
        setSubmitError("لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الإنترنت");
      } else {
        setSubmitError("حدث خطأ غير متوقع");
      }
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
    
    if (name === "discountCode") {
      if (discountTimeoutRef.current) {
        clearTimeout(discountTimeoutRef.current);
      }
      
      setDiscountData(null);
      setDiscountError("");
      
      if (value.trim() !== "") {
        discountTimeoutRef.current = setTimeout(() => {
          validateDiscountCode(value);
        }, 1000);
      }
    }
    
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "phone") {
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
      phone: form.phone,
      wilaya: form.wilaya,
      address: form.address,
    };

    const newErrors = {};

    Object.entries(requiredFields).forEach(([key, value]) => {
      if (!value || value.trim() === "") {
        newErrors[key] = "الرجاء ملء هذا الحقل لإتمام العملية بنجاح";
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
        else if (parseInt(value.nbpieces) <= 0) {
          newErrors[key] = "عدد القطع يجب أن يكون أكبر من 0";
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
  
  // Si des erreurs sont détectées, faire défiler vers la première erreur
  if (Object.keys(newErrors).length > 0) {
    scrollToFirstError();
  }
  
  return Object.keys(newErrors).length === 0;
};

   

  useEffect(() => {
    return () => {
      if (discountTimeoutRef.current) {
        clearTimeout(discountTimeoutRef.current);
      }
    };
  }, []);

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
            </section>

            <section className="product-details">
              <div className="product-info">
                <img src={productImage} alt={productName} className="product-image" />
                <div className='detailproductinfo'>
                  <h3>{productName}</h3>
                  <p>{prixProduit} دج</p>
                </div>
              </div>
            </section>

            <form className="purchase-form" onSubmit={(e) => e.preventDefault()}>
              {products.map((product, index) => {
                 const availableColorsForSelectedSize = getAvailableColorsForSize(product.size, product.id);
  const availableSizesForSelectedColor = getAvailableSizesForColor(product.color, product.id);
                
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
           <div className="field-wrapper">
                <InputField
                  titre="كود الخصم(إختياري):"
                  placeholder="إذا حصلت عليه من طرف مروج الموديل"
                  type="text"
                  name="discountCode"
                  size="oneline"
                  down={false}
                  value={form.discountCode}
                  onChange={(e) => handleInputChange('discountCode', e.target.value)}
                  hasError={isSubmitted && !!errors.discountCode}
                />
                {isValidatingCode && (
                  <p className="info-text">جاري التحقق من الكود...</p>
                )}
                {discountError && (
                  <p className="error">{discountError}</p>
                )}
                {discountData?.valid && (
                  <p className="success">
                    تم تطبيق الخصم بنجاح: {discountData.discount_percentage}%
                  </p>
                )}
              </div>
              
              <div className="field-wrapper">
                <InputField
                  titre="رقم الهاتف:"
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
                  <span className={discountData?.valid ? "original-price" : ""}>
                    {prixBaseTotal} دج
                  </span>
                </div>
                
                {discountData?.valid && (
                  <div className="price-row discounted">
                    <span>السعر بعد التخفيض:</span>
                    <span>{prixApresRemise} دج</span>
                  </div>
                )}
                
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

              {submitError && (
                <div className="error-message">
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
      onClick: () => {
        navigate("/mycommands");
        // Forcer le scroll vers le haut après la navigation
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      },
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

export default FormAcheterPage;
