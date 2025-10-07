import React, { useState, useEffect, useRef } from 'react';
import Toast from "../../components/generalComponents/Toast";
import "../../style/AdminStyle/addNewAffiliate.css";
import InputField from '../../components/generalComponents/Inputfield';
import useErreur401Handler from '../generalComponents/Erreur401Handle';

export default function ModifyModelPopup({ isOpen, onClose, onSuccess, currentModel }) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [earthquake, setEarthquake] = useState(false);
  const [originalModelCode, setOriginalModelCode] = useState("");
  const { handle401Error } = useErreur401Handler();

  const typeChoices = [
    { value: 'femme', label: 'نساء' },
    { value: 'homme', label: 'رجال' },
    { value: 'enfant', label: 'أطفال' }
  ];
  
  const sizeChoices = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '3XL', '4XL'
  ];
  
  const formRef = useRef(null);
  const firstErrorRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    price_per_piece_for_client: "",
    price_per_piece_for_dropshipper: "",
    min_pieces_for_dropshipper: "",
    images: [], // Nouvelles images à ajouter
    existingImages: [], // Images existantes à conserver
  
  });

  const [errors, setErrors] = useState({});
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({ size: "", color: "", quantity: "" });

  useEffect(() => {
    if (isOpen && currentModel) {
      setOriginalModelCode(currentModel.code || "");
      
      const isDropshipperEnabled = currentModel.price_per_piece_for_dropshipper !== "0.00" && 
                                   parseFloat(currentModel.price_per_piece_for_dropshipper) > 0;
      
      setForm({
        name: currentModel.name || "",
        description: currentModel.description || "",
        type: currentModel.type || "",
        price_per_piece_for_client: currentModel.price_per_piece_for_client || "",
        price_per_piece_for_dropshipper: isDropshipperEnabled ? currentModel.price_per_piece_for_dropshipper : "",
        min_pieces_for_dropshipper: isDropshipperEnabled ? currentModel.min_pieces_for_dropshipper : "",
        images: [],
        existingImages: currentModel.images || []
      });
      
      if (currentModel.variants && currentModel.variants.length > 0) {
        setVariants(currentModel.variants.map(v => ({
          size: v.size,
          color: v.color,
          quantity: v.quantity
        })));
      } else {
        setVariants([]);
      }
      
      setErrors({});
      setIsSubmitted(false);
      setEarthquake(false);
      setShowSuccessToast(false);
      setShowErrorToast(false);
    }
  }, [isOpen, currentModel]);

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
        quantity: parseInt(newVariant.quantity)
      }
    ]);

    setNewVariant({ size: "", color: "", quantity: "" });
  };

  const handleEditVariant = (index, field, value) => {
    setVariants(prev => {
      const newVariants = [...prev];
      newVariants[index] = {
        ...newVariants[index],
        [field]: field === 'quantity' ? parseInt(value) || 0 : value
      };
      return newVariants;
    });
  };

  const handleRemoveVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      setForm(prev => ({ 
        ...prev, 
        images: [...prev.images, ...Array.from(files)] 
      }));
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...form.images];
    newFiles.splice(index, 1);
    setForm(prev => ({ ...prev, images: newFiles }));
  };

  const handleRemoveExistingImage = (index) => {
    const newExistingImages = [...form.existingImages];
    newExistingImages.splice(index, 1);
    setForm(prev => ({ ...prev, existingImages: newExistingImages }));
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value || value.trim() === "") {
          error = "اسم النموذج مطلوب";
        } else if (value.length < 2) {
          error = "يجب أن يكون الاسم على الأقل حرفين";
        }
        break;
      
      case "description":
        if (!value || value.trim() === "") {
          error = "وصف النموذج مطلوب";
        } else if (value.length < 10) {
          error = "الوصف يجب أن يكون على الأقل 10 أحرف";
        }
        break;
      
      case "type":
        if (!value || value.trim() === "") {
          error = "نوع النموذج مطلوب";
        }
        break;
      
      case "price_per_piece_for_client":
        if (!value || value.trim() === "") {
          error = "سعر القطعة للزبون مطلوب";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = "يجب أن يكون السعر رقمًا موجبًا";
        }
        break;
      
      case "price_per_piece_for_dropshipper":
        if (value && value.trim() !== "" && (isNaN(value) || parseFloat(value) <= 0)) {
          error = "يجب أن يكون السعر رقمًا موجبًا";
        }
        break;
      
      case "min_pieces_for_dropshipper":
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
    
    if (!form.name || form.name.trim() === "") {
      newErrors.name = "اسم النموذج مطلوب";
    } else if (form.name.length < 2) {
      newErrors.name = "يجب أن يكون الاسم على الأقل حرفين";
    }
    
    if (!form.description || form.description.trim() === "") {
      newErrors.description = "وصف النموذج مطلوب";
    } else if (form.description.length < 10) {
      newErrors.description = "الوصف يجب أن يكون على الأقل 10 أحرف";
    }
    
    if (!form.type || form.type.trim() === "") {
      newErrors.type = "نوع النموذج مطلوب";
    }
    
    if (!form.price_per_piece_for_client || form.price_per_piece_for_client.trim() === "") {
      newErrors.price_per_piece_for_client = "سعر القطعة للزبون مطلوب";
    } else if (isNaN(form.price_per_piece_for_client) || parseFloat(form.price_per_piece_for_client) <= 0) {
      newErrors.price_per_piece_for_client = "يجب أن يكون السعر رقمًا موجبًا";
    }
    
    if (form.price_per_piece_for_dropshipper && form.price_per_piece_for_dropshipper.toString().trim() !== "" && 
      (isNaN(form.price_per_piece_for_dropshipper) || parseFloat(form.price_per_piece_for_dropshipper) <= 0)) {
      newErrors.price_per_piece_for_dropshipper = "يجب أن يكون السعر رقمًا موجبًا";
    }
    
    if (form.min_pieces_for_dropshipper && form.min_pieces_for_dropshipper.toString().trim() !== "" && 
      (isNaN(form.min_pieces_for_dropshipper) || parseInt(form.min_pieces_for_dropshipper) <= 0)) {
      newErrors.min_pieces_for_dropshipper = "يجب أن تكون الكمية رقمًا صحيحًا موجبًا";
    }
    
    if (variants.length === 0) {
      newErrors.variants = "يجب إضافة متغير واحد على الأقل (مقاس ولون وكمية)";
    } else {
      const invalidVariants = variants.filter(v => 
        !v.size || !v.color || !v.quantity || v.quantity <= 0
      );
      
      if (invalidVariants.length > 0) {
        newErrors.variants = "يجب تعبئة جميع الحقول لكل متغير (مقاس، لون، كمية موجبة)";
      }
      
      const variantKeys = variants.map(v => `${v.size}-${v.color}`);
      const hasDuplicates = new Set(variantKeys).size !== variantKeys.length;
      
      if (hasDuplicates) {
        newErrors.variants = "يوجد متغيرات مكررة (نفس المقاس واللون)";
      }
    }
    
    // Vérifier qu'il y a au moins une image (existante ou nouvelle)
    if (form.images.length === 0 && form.existingImages.length === 0) {
      newErrors.images = "يجب إضافة صورة واحدة على الأقل للنموذج";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const deleteModel = async () => {
    try {
      if (!originalModelCode) {
        console.warn("Aucun code de modèle spécifié pour la suppression");
        return true;
      }

      const token = localStorage.getItem('accessToken');
      

      const response = await fetch(`http://127.0.0.1:8000/adminapi/${originalModelCode}/delete/`, {
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
          return deleteModel();
        }
      }
      else

      if (response.ok) {
        return true;
      } else {
        if (response.status === 404) {
          console.warn("Endpoint de suppression non trouvé, continuation...");
          return true;
        }
        
        const result = await response.json();
        throw new Error(result.error || "فشل في حذف النموذج");
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.warn("Endpoint de suppression non trouvé, continuation...");
        return true;
      }
      
      throw error;
    }
  };

  // Fonction pour télécharger une image depuis une URL et la convertir en File
  const downloadImageAsFile = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Déterminer le type MIME à partir de l'URL ou du blob
      let mimeType = blob.type;
      if (!mimeType || mimeType === 'application/octet-stream') {
        // Essayer de déterminer le type à partir de l'extension
        const extension = imageUrl.split('.').pop().toLowerCase();
        switch (extension) {
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          case 'gif':
            mimeType = 'image/gif';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          default:
            mimeType = 'image/jpeg'; // Par défaut
        }
      }
      
      return new File([blob], fileName, { type: mimeType });
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      throw error;
    }
  };

  const addNewModel = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      

      const formData = new FormData();
      
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('price_per_piece_for_client', form.price_per_piece_for_client);
      
      if (form.price_per_piece_for_dropshipper) {
        formData.append('price_per_piece_for_dropshipper', form.price_per_piece_for_dropshipper);
      }
      
      if (form.min_pieces_for_dropshipper) {
        formData.append('min_pieces_for_dropshipper', form.min_pieces_for_dropshipper);
      }
      
      formData.append('variants', JSON.stringify(variants));
      
      // D'abord, traiter les images existantes (les télécharger et les ajouter)
      if (form.existingImages && form.existingImages.length > 0) {
        
        const downloadPromises = form.existingImages.map(async (imageObj, index) => {
          try {
            const fileName = `existing_image_${index}_${Date.now()}.jpg`;
            const imageFile = await downloadImageAsFile(imageObj.image, fileName);
            return imageFile;
          } catch (error) {
            console.error(`Erreur lors du téléchargement de l'image ${index + 1}:`, error);
            return null;
          }
        });
        
        const downloadedImages = await Promise.all(downloadPromises);
        
        // Ajouter les images téléchargées avec succès au FormData
        downloadedImages.forEach((imageFile, index) => {
          if (imageFile) {
            formData.append('images', imageFile);
           
          }
        });
      }
      
      // Ensuite, traiter les nouvelles images (fichiers sélectionnés)
      if (form.images && form.images.length > 0) {
        
        for (let i = 0; i < form.images.length; i++) {
          formData.append('images', form.images[i]);
          
        }
      }

     

      const response = await fetch('http://127.0.0.1:8000/adminapi/addNewModelByAdmin/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const result = await response.json();

if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return addNewModel();
        }
      }
      else 
      if (response.ok) {
        return result;
      }  else if (result.error) {
        throw new Error(result.error);
      } else {
        throw new Error("حدث خطأ أثناء إضافة النموذج. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
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
      await deleteModel();
      const result = await addNewModel();
      
      
      setShowSuccessToast(true);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result);
        }
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage(error.message || "حدث خطأ أثناء تعديل النموذج. يرجى المحاولة مرة أخرى.");
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
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className={`popup-content add-affiliate-popup ${earthquake ? 'earthquake' : ''}`} onClick={(e) => e.stopPropagation()} ref={formRef} style={{minWidth:"0", width:"100%"}}>
        <div className="popup-header2">
          <h2>تعديل النموذج</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="popup-body">
          <form className="affiliateForm" onSubmit={handleSubmit}>
            <div className="formSection">
              <div className="inputField">
                <label>اسم النموذج (مطلوب):</label>
                <input
                  type="text"
                  placeholder="أدخل اسم النموذج"
                  name="name"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={isSubmitted && errors.name ? 'error' : ''}
                  ref={errors.name ? firstErrorRef : null}
                />
                {isSubmitted && errors.name && (
                  <p className="error" ref={firstErrorRef}>{errors.name}</p>
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
                  ref={errors.description && !errors.name ? firstErrorRef : null}
                />
                {isSubmitted && errors.description && (
                  <p className="error" ref={!errors.name && errors.description ? firstErrorRef : null}>{errors.description}</p>                )}
              </div>
              
              <div className="inputField">
                <label>نوع النموذج (مطلوب):</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={isSubmitted && errors.type ? 'error' : ''}
                  ref={errors.type && !errors.name && !errors.description ? firstErrorRef : null}
                >
                  <option value="">اختر نوع النموذج</option>
                  {typeChoices.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {isSubmitted && errors.type && (
                  <p className="error" ref={!errors.name && !errors.description && errors.type ? firstErrorRef : null}>{errors.type}</p>
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
                  ref={errors.price_per_piece_for_client && 
                       !errors.name && 
                       !errors.description && 
                       !errors.type ? firstErrorRef : null}
                />
                {isSubmitted && errors.price_per_piece_for_client && (
                  <p className="error" ref={
                    !errors.name && 
                    !errors.description && 
                    !errors.type && 
                    errors.price_per_piece_for_client ? firstErrorRef : null
                  }>
                    {errors.price_per_piece_for_client}
                  </p>
                )}
              </div>
            </div>
            
            <div className="formSection">
              <div className="inputField">
                <label>سعر القطعة للـ Dropshipper (اختياري):</label>
                <input
                  type="number"
                  placeholder="أدخل سعر القطعة للـ Dropshipper بالدينار الجزائري"
                  name="price_per_piece_for_dropshipper"
                  value={form.price_per_piece_for_dropshipper}
                  onChange={(e) => handleInputChange('price_per_piece_for_dropshipper', e.target.value)}
                  className={isSubmitted && errors.price_per_piece_for_dropshipper ? 'error' : ''}
                  min="1"
                />
                {isSubmitted && errors.price_per_piece_for_dropshipper && (
                  <p className="error">{errors.price_per_piece_for_dropshipper}</p>
                )}
              </div>
              
              <div className="inputField">
                <label>الحد الأدنى للكمية للـ Dropshipper (اختياري):</label>
                <input
                  type="number"
                  placeholder="أدخل الحد الأدنى للكمية المطلوبة للـ Dropshipper"
                  name="min_pieces_for_dropshipper"
                  value={form.min_pieces_for_dropshipper}
                  onChange={(e) => handleInputChange('min_pieces_for_dropshipper', e.target.value)}
                  className={isSubmitted && errors.min_pieces_for_dropshipper ? 'error' : ''}
                  min="1"
                />
                {isSubmitted && errors.min_pieces_for_dropshipper && (
                  <p className="error">{errors.min_pieces_for_dropshipper}</p>
                )}
              </div>
            </div>

            <div className="formSection">
              <div className="new-variant-form">
                <h4>المقاسات والألوان والكميات (مطلوب)</h4>
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
                  <h4>المتغيرات المضافة:</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>المقاس</th>
                        <th>اللون</th>
                        <th>الكمية</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant, index) => (
                        <tr key={index}>
                          <td>
                            <select
                              value={variant.size}
                              onChange={(e) => handleEditVariant(index, 'size', e.target.value)}
                            >
                              {sizeChoices.map((size) => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={variant.color}
                              onChange={(e) => handleEditVariant(index, 'color', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={variant.quantity}
                              onChange={(e) => handleEditVariant(index, 'quantity', e.target.value)}
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
                <p className="error">
                  {errors.variants}
                </p>
              )}
            </div>

            <div className="formSection">
              <div className="sectionTitle">صور النموذج (مطلوب)</div>
              
              {/* Afficher les images existantes qui seront conservées */}
              {form.existingImages.length > 0 && (
                <div className="existing-images">
                  <h4>الصور الحالية (سيتم الاحتفاظ بها):</h4>
                  <div className="images-grid">
                    {form.existingImages.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image.image} alt={`Modèle ${index}`} />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => handleRemoveExistingImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <InputField
                titre="إضافة صور جديدة للنموذج:"
                type="file"
                name="images"
                size="oneline"
                down={false}
                multiple={true}
                accept="image/*"
                onChange={handleFileChange}
                onRemoveFile={handleRemoveFile}
                uploadedFiles={form.images}
                hint="يمكنك اختيار أكثر من صورة باستخدام Ctrl+Click"
              />
              {isSubmitted && errors.images && (
                <p className="error">{errors.images}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="submitButton" 
              disabled={loading}
            >
              {loading ? 'جاري تعديل النموذج...' : 'تعديل النموذج'}
            </button>
          </form>
        </div>
        
        <Toast
          show={showSuccessToast}
          onClose={handleSuccessToastClose}
          type="success"
          title="تم التعديل بنجاح"
          message="تم تعديل النموذج بنجاح"
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