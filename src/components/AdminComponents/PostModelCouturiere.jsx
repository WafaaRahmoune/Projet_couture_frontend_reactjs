import React, { useState, useEffect, useRef } from 'react';
import Toast from "../../components/generalComponents/Toast";
import "../../style/AdminStyle/addNewAffiliate.css";
import InputField from '../../components/generalComponents/Inputfield';
import useErreur401Handler from '../generalComponents/Erreur401Handle';

function PostModelCouturiere({ isOpen, onClose, modelData, onSuccess }) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [earthquake, setEarthquake] = useState(false);
  const sizeChoices = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '3XL', '4XL'
  ];
  const formRef = useRef(null);
  const firstErrorRef = useRef(null);
  const { handle401Error } = useErreur401Handler();
  

  const [form, setForm] = useState({
    
    arabic_name: "",
    price_per_piece_for_client: "",
    description: "",
    price_per_piece_for_dropshipper: "",
    min_quantity_for_dropshipper: "",
    additional_images: [],
    existing_images: [] // Nouveau: pour les images existantes
  });

  const [errors, setErrors] = useState({});
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({ size: "", color: "", quantity: "" });

 useEffect(() => {
  if (isOpen && modelData) {
    console.log("ModelData received in PostModelCouturiere:", modelData);
    console.log("Model code:", modelData.codemodel);
    
    // Pré-remplir les variantes existantes
    if (modelData.variants && modelData.variants.length > 0) {
      setVariants(modelData.variants.map(variant => ({
        size: variant.size,
        color: variant.color,
        new_quantity: variant.quantity || 0,
        isExisting: true
      })));
    }
    
    // Pré-remplir les autres champs du formulaire + images existantes
    setForm({
      arabic_name: modelData.nommodel || "",
      price_per_piece_for_client: modelData.price || modelData.price_per_piece_for_client || "",
      description: modelData.description || "",
      price_per_piece_for_dropshipper: "",
      min_quantity_for_dropshipper: "",
      additional_images: [],
      existing_images: modelData.images || [] // Charger les images existantes
    });
      
      setNewVariant({ size: "", color: "", quantity: "" });
      setErrors({});
      setIsSubmitted(false);
      setEarthquake(false);
      setShowSuccessToast(false);
      setShowErrorToast(false);
      setErrorDetails(""); // Réinitialiser les détails d'erreur
    }
  }, [isOpen, modelData]);


  const handleRemoveExistingImage = (index) => {
  const newExistingImages = [...form.existing_images];
  newExistingImages.splice(index, 1);
  setForm(prev => ({ ...prev, existing_images: newExistingImages }));
};
  useEffect(() => {
    if (isSubmitted && Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }
  }, [errors, isSubmitted]);

  const handleInputChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleVariantQuantityChange = (index, value) => {
    const newVariants = [...variants];
    newVariants[index].new_quantity = parseInt(value) || 0;
    setVariants(newVariants);
  };

  // Fonction pour convertir une URL en fichier
  async function urlToFile(url, filename, mimeType) {
    try {
      console.log("Fetching image:", url);
      const res = await fetch(url);
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status} - ${res.statusText}`);
      }
      
      const buf = await res.arrayBuffer();
      return new File([buf], filename, { type: mimeType });
    } catch (error) {
      console.error("Erreur lors de la conversion de l'URL en fichier:", error);
      throw error;
    }
  }

  const handleNewVariantChange = (field, value) => {
    setNewVariant(prev => ({ ...prev, [field]: value }));
  };

  const handleAddVariant = () => {
    if (!newVariant.size || !newVariant.color || !newVariant.quantity) {
      setErrorMessage("يجب ملء جميع حقول المتغير الجديد");
      setShowErrorToast(true);
      return;
    }

    if (isNaN(newVariant.quantity) || parseInt(newVariant.quantity) <= 0) {
      setErrorMessage("يجب أن تكون الكمية رقمًا صحيحًا موجبًا");
      setShowErrorToast(true);
      return;
    }

    const exists = variants.some(v => 
      v.size === newVariant.size && v.color === newVariant.color
    );

    if (exists) {
      setErrorMessage("هذا المتغير موجود بالفعل");
      setShowErrorToast(true);
      return;
    }

    setVariants(prev => [
      ...prev,
      {
        size: newVariant.size,
        color: newVariant.color,
        new_quantity: parseInt(newVariant.quantity),
        isNew: true
      }
    ]);

    setNewVariant({ size: "", color: "", quantity: "" });
  };

  const handleRemoveVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      setForm(prev => ({ 
        ...prev, 
        additional_images: [...prev.additional_images, ...files] 
      }));
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...form.additional_images];
    newFiles.splice(index, 1);
    setForm(prev => ({ ...prev, additional_images: newFiles }));
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "arabic_name":
        if (value && value.trim() !== "" && value.length < 2) {
          error = "يجب أن يكون الاسم العربي على الأقل حرفين";
        }
        break;
      
      case "price_per_piece_for_client":
        if (!value || value.trim() === "") {
          error = "سعر القطعة للزبون مطلوب";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = "يجب أن يكون السعر رقمًا موجبًا";
        }
        break;
      
      case "description":
        if (!value || value.trim() === "") {
          error = "وصف النموذج مطلوب";
        } else if (value.length < 10) {
          error = "الوصف يجب أن يكون على الأقل 10 أحرف";
        }
        break;
      
      case "price_per_piece_for_dropshipper":
        if (value && value.trim() !== "" && (isNaN(value) || parseFloat(value) <= 0)) {
          error = "يجب أن يكون السعر رقمًا موجبًا";
        }
        break;
      
      case "min_quantity_for_dropshipper":
        if (value && value.trim() !== "" && (isNaN(value) || parseInt(value) <= 0)) {
          error = "يجب أن تكون الكمية رقمًا صحيحًا موجبًا";
        }
        break;
      
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.price_per_piece_for_client || form.price_per_piece_for_client === "") {
      newErrors.price_per_piece_for_client = "سعر القطعة للزبون مطلوب";
    } else if (isNaN(form.price_per_piece_for_client) || parseFloat(form.price_per_piece_for_client) <= 0) {
      newErrors.price_per_piece_for_client = "يجب أن يكون السعر رقمًا موجبًا";
    }
    
    if (!form.description || form.description.trim() === "") {
      newErrors.description = "وصف النموذج مطلوب";
    } else if (form.description.length < 10) {
      newErrors.description = "الوصف يجب أن يكون على الأقل 10 أحرف";
    }
    
    if (form.arabic_name && form.arabic_name.trim() !== "" && form.arabic_name.length < 2) {
      newErrors.arabic_name = "يجب أن يكون الاسم العربي على الأقل حرفين";
    }
    
    if (form.price_per_piece_for_dropshipper && form.price_per_piece_for_dropshipper.trim() !== "" && 
        (isNaN(form.price_per_piece_for_dropshipper) || parseFloat(form.price_per_piece_for_dropshipper) <= 0)) {
      newErrors.price_per_piece_for_dropshipper = "يجب أن يكون السعر رقمًا موجبًا";
    }
    
    if (form.min_quantity_for_dropshipper && form.min_quantity_for_dropshipper.trim() !== "" && 
        (isNaN(form.min_quantity_for_dropshipper) || parseInt(form.min_quantity_for_dropshipper) <= 0)) {
      newErrors.min_quantity_for_dropshipper = "يجب أن تكون الكمية رقمًا صحيحًا موجبًا";
    }
    
    if (variants.length > 0) {
      const invalidVariants = variants.filter(v => !v.new_quantity || v.new_quantity <= 0);
      if (invalidVariants.length > 0) {
        newErrors.variants = "يجب تحديد كمية صحيحة لكل مقاس ولون";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitted(true);
  
  if (!validateForm()) {
    setEarthquake(true);
    setTimeout(() => setEarthquake(false), 500);
    setLoading(false);
    return;
  }
  
  setLoading(true);
  
  try {
    const token = localStorage.getItem('accessToken');
    

    const formData = new FormData();
    if (!modelData.codemodel) {
      setErrorMessage("رمز النموذج غير متوفر");
      setErrorDetails("Le code du modèle est manquant dans les données");
      setShowErrorToast(true);
      setLoading(false);
      return;
    }
    
    // Ajouter les données au FormData
    formData.append('code', modelData.codemodel);
    formData.append('price_per_piece_for_client', form.price_per_piece_for_client);
    formData.append('description', form.description);
    
    if (form.arabic_name && form.arabic_name.trim() !== "") {
      formData.append('arabic_name', form.arabic_name);
    }
    
    if (form.price_per_piece_for_dropshipper) {
      formData.append('price_per_piece_for_dropshipper', form.price_per_piece_for_dropshipper);
    }
    
    if (form.min_quantity_for_dropshipper) {
      formData.append('min_quantity_for_dropshipper', form.min_quantity_for_dropshipper);
    }
    
    if (variants.length > 0) {
      const variantsData = variants.map(variant => ({
        size: variant.size,
        color: variant.color,
        quantity: variant.new_quantity
      }));
      formData.append('variants', JSON.stringify(variantsData));
    }
    
    // Log des données envoyées
    console.log("Données envoyées:", {
      code: modelData.codemodel,
      price_per_piece_for_client: form.price_per_piece_for_client,
      description: form.description,
      arabic_name: form.arabic_name,
      price_per_piece_for_dropshipper: form.price_per_piece_for_dropshipper,
      min_quantity_for_dropshipper: form.min_quantity_for_dropshipper,
      variants: variants.map(v => ({ size: v.size, color: v.color, quantity: v.new_quantity })),
      existing_images_count: form.existing_images.length,
      additional_images_count: form.additional_images.length
    });
    
    // Ajouter les images existantes (celles qui n'ont pas été supprimées)
    if (form.existing_images && form.existing_images.length > 0) {
      console.log("Tentative d'ajout des images existantes:", form.existing_images);
      for (let i = 0; i < form.existing_images.length; i++) {
        try {
          console.log(`Traitement de l'image existante ${i}: ${form.existing_images[i]}`);
          const file = await urlToFile(
            form.existing_images[i], 
            `existing_image_${i}_${Date.now()}.jpg`, 
            "image/jpeg"
          );
          formData.append('images', file);
          console.log(`Image existante ${i} ajoutée avec succès`);
        } catch (error) {
          console.error(`Erreur avec l'image existante ${i}:`, error);
          // Continuer avec les autres images
        }
      }
    }
    
    // Ajouter les nouvelles images
    if (form.additional_images && form.additional_images.length > 0) {
      for (let i = 0; i < form.additional_images.length; i++) {
        formData.append('images', form.additional_images[i]);
      }
    }

    // Afficher le contenu de FormData pour le débogage
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch('https://api.kadi-inv.store/adminapi/accept-model/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

      console.log("Réponse du serveur - Status:", response.status);
      
      let result;
      try {
        result = await response.json();
        console.log("Réponse du serveur - Données:", result);
      } catch (jsonError) {
        console.error("Erreur lors de l'analyse de la réponse JSON:", jsonError);
        throw new Error(`Réponse serveur invalide (non JSON). Status: ${response.status}`);
      }

      if (response.ok) {
        console.log("Modèle accepté avec succès:", result);
        setShowSuccessToast(true);
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result);
          }
          onClose();
        }, 2000);
        
      } else {
        console.error("Erreur serveur détaillée:", {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          details: result.details || result
        });
        
         if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleSubmit();
        }
      }
      else if (result.error) {
          setErrorMessage(result.error || "حدث خطأ أثناء قبول النموذج");
          setErrorDetails(JSON.stringify(result.details || result, null, 2));
        } else {
          setErrorMessage(`خطأ في الخادم (${response.status})`);
          setErrorDetails(`Status: ${response.status}, Message: ${response.statusText}`);
        }
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      setErrorMessage("حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
      setErrorDetails(`Erreur: ${error.message}\nStack: ${error.stack}`);
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSuccessToastClose = () => {
    setShowSuccessToast(false);
  };

  const handleErrorToastClose = () => {
    setShowErrorToast(false);
    setErrorMessage("");
    setErrorDetails("");
  };

  if (!isOpen || !modelData) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className={`popup-content add-affiliate-popup ${earthquake ? 'earthquake' : ''}`} onClick={(e) => e.stopPropagation()} ref={formRef}  style={{minWidth:"0", width:"100%"}}>
        <div className="popup-header2">
          <h2>قبول نموذج: {modelData.nommodel}</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="popup-body">
          <form className="affiliateForm" onSubmit={handleSubmit}>
            <div className="formSection">
              <div className="inputField">
                <label>اسم النموذج بالعربية (اختياري):</label>
                <input
                  type="text"
                  placeholder="أدخل اسم النموذج باللغة العربية"
                  name="arabic_name"
                  value={form.arabic_name}
                  onChange={(e) => handleInputChange('arabic_name', e.target.value)}
                  className={isSubmitted && errors.arabic_name ? 'error' : ''}
                  ref={errors.arabic_name ? firstErrorRef : null}
                />
                {isSubmitted && errors.arabic_name && (
                  <p className="error" ref={firstErrorRef}>{errors.arabic_name}</p>
                )}
              </div>
              
              <div className="inputField">
                <label>سعر القطعة للزبون (مطلوب):</label>
                <input
                  type="number"
                  placeholder="أدخل سعر القطعة للزبون بالدينار الجزائري"
                  name="price_per_piece_for_client"
                  value={form.price_per_piece_for_client}
                  onChange={(e) => handleInputChange('price_per_piece_for_client', e.target.value)}
                  className={isSubmitted && errors.price_per_piece_for_client ? 'error' : ''}
                  min="1"
                  ref={errors.price_per_piece_for_client && !errors.arabic_name ? firstErrorRef : null}
                />
                {isSubmitted && errors.price_per_piece_for_client && (
                  <p className="error" ref={!errors.arabic_name && errors.price_per_piece_for_client ? firstErrorRef : null}>{errors.price_per_piece_for_client}</p>
                )}
              </div>
              
              <div className="inputField">
                <label>وصف النموذج (مطلوب):</label>
                <textarea
                  placeholder="أدخل وصفًا تفصيليًا للنموذج"
                  name="description"
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={isSubmitted && errors.description ? 'error' : ''}
                  rows="4"
                  ref={errors.description && !errors.arabic_name && !errors.price_per_piece_for_client ? firstErrorRef : null}
                />
                {isSubmitted && errors.description && (
                  <p className="error" ref={!errors.arabic_name && !errors.price_per_piece_for_client && errors.description ? firstErrorRef : null}>{errors.description}</p>
                )}
              </div>
            </div>
            
            <div className="formSection">
              <div className="inputField">
                <label>سعر القطعة للـ Dropshipper:  اختياري</label>
                <input
                  type="number"
                  placeholder="أدخل سعر القطعة للـ Dropshipper بالدينار الجزائري"
                  name="price_per_piece_for_dropshipper"
                  value={form.price_per_piece_for_dropshipper}
                  onChange={(e) => handleInputChange('price_per_piece_for_dropshipper', e.target.value)}
                  className={isSubmitted && errors.price_per_piece_for_dropshipper ? 'error' : ''}
                  min="1"
                  ref={errors.price_per_piece_for_dropshipper && 
                       !errors.arabic_name && 
                       !errors.price_per_piece_for_client && 
                       !errors.description ? firstErrorRef : null}
                />
                {isSubmitted && errors.price_per_piece_for_dropshipper && (
                  <p className="error" ref={
                    !errors.arabic_name && 
                    !errors.price_per_piece_for_client && 
                    !errors.description && 
                    errors.price_per_piece_for_dropshipper ? firstErrorRef : null
                  }>
                    {errors.price_per_piece_for_dropshipper}
                  </p>
                )}
              </div>
              
              <div className="inputField">
                <label>الحد الأدنى للكمية للـ Dropshipper:  اختياري</label>
                <input
                  type="number"
                  placeholder="أدخل الحد الأدنى للكمية المطلوبة للـ Dropshipper"
                  name="min_quantity_for_dropshipper"
                  value={form.min_quantity_for_dropshipper}
                  onChange={(e) => handleInputChange('min_quantity_for_dropshipper', e.target.value)}
                  className={isSubmitted && errors.min_quantity_for_dropshipper ? 'error' : ''}
                  min="1"
                  ref={errors.min_quantity_for_dropshipper && 
                       !errors.arabic_name && 
                       !errors.price_per_piece_for_client && 
                       !errors.description && 
                       !errors.price_per_piece_for_dropshipper ? firstErrorRef : null}
                />
                {isSubmitted && errors.min_quantity_for_dropshipper && (
                  <p className="error" ref={
                    !errors.arabic_name && 
                    !errors.price_per_piece_for_client && 
                    !errors.description && 
                    !errors.price_per_piece_for_dropshipper && 
                    errors.min_quantity_for_dropshipper ? firstErrorRef : null
                  }>
                    {errors.min_quantity_for_dropshipper}
                  </p>
                )}
              </div>
            </div>
            
            <div className="formSection">
              <div className="new-variant-form">
                <h4>إضافة مقاس لون و كمية جدد (اختياري)</h4>
                <div className="variant-inputs">
                  <select
                value={newVariant.size}
                onChange={(e) => handleNewVariantChange('size', e.target.value)}
              >
                <option value="">اختر المقاس</option>
                {sizeChoices.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
                  <input
                    type="text"
                    placeholder="اللون"
                    value={newVariant.color}
                    onChange={(e) => handleNewVariantChange('color', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="الكمية"
                    min="1"
                    value={newVariant.quantity}
                    onChange={(e) => handleNewVariantChange('quantity', e.target.value)}
                  />
                  <button type="button" onClick={handleAddVariant} className="add-variant-btn">
                    إضافة متغير
                  </button>
                </div>
              </div>
              
              {variants.length > 0 && (
                <div className="variants-table">
                  <table>
                    <thead>
                      <tr>
                        <th>المقاس</th>
                        <th>اللون</th>
                        <th>الكمية المتاحة</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant, index) => (
                        <tr key={index}>
                          <td>{variant.size}</td>
                          <td>
                            <div className="color-display">
                              <span>{variant.color}</span>
                            </div>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={variant.new_quantity}
                              onChange={(e) => handleVariantQuantityChange(index, e.target.value)}
                              className="quantity-input"
                            />
                          </td>
                          <td>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveVariant(index)}
                              className="remove-variant-btn"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {isSubmitted && errors.variants && (
                <p className="error" ref={
                  !errors.arabic_name && 
                  !errors.price_per_piece_for_client && 
                  !errors.description && 
                  !errors.price_per_piece_for_dropshipper && 
                  !errors.min_quantity_for_dropshipper && 
                  errors.variants ? firstErrorRef : null
                }>
                  {errors.variants}
                </p>
              )}
            </div>
            
           <div className="formSection">
  <div className="sectionTitle">الصور الحالية للنموذج</div>
  
  {/* Afficher les images existantes avec option de suppression */}
  {form.existing_images.length > 0 && (
    <div className="existing-images-section">
      <h4>الصور الحالية (يمكن إزالتها):</h4>
      <div className="images-grid">
        {form.existing_images.map((imageUrl, index) => (
          <div key={index} className="image-preview">
            <img src={imageUrl} alt={`صورة النموذج ${index + 1}`} />
            <button 
              type="button" 
              className="remove-image-btn"
              onClick={() => handleRemoveExistingImage(index)}
              title="إزالة الصورة"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
  
  <InputField
    titre="إضافة صور إضافية للنموذج:"
    type="file"
    name="additional_images"
    size="oneline"
    down={false}
    multiple={true}
    accept="image/*"
    onChange={handleFileChange}
    onRemoveFile={handleRemoveFile}
    uploadedFiles={form.additional_images}
    hint="يمكنك اختيار أكثر من صورة باستخدام Ctrl+Click"
  />
</div>
            
            <button 
              type="submit" 
              className="submitButton" 
              disabled={loading}
            >
              {loading ? 'جاري معالجة الطلب...' : 'قبول النموذج وإضافته للمتجر'}
            </button>
          </form>
        </div>
        
        <Toast
          show={showSuccessToast}
          onClose={handleSuccessToastClose}
          type="success"
          title="تم القبول بنجاح"
          message="تم قبول النموذج وإضافته إلى المتجر بنجاح"
          duration={3000}
          position="bottom-right"
        />
        
        <Toast
          show={showErrorToast}
          onClose={handleErrorToastClose}
          type="error"
          title="خطأ"
          message={errorMessage}
          duration={5000}
          position="bottom-right"
        />
      </div>
    </div>
  );
}

export default PostModelCouturiere;
