import React, { useState, useEffect, useRef } from 'react';
import Toast from "../../components/generalComponents/Toast";
import "../../style/AdminStyle/addNewAffiliate.css";
import InputField from '../../components/generalComponents/Inputfield';
import useErreur401Handler from '../generalComponents/Erreur401Handle';

export default function Addfassou({ isOpen, onClose, onSuccess }) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [earthquake, setEarthquake] = useState(false);
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
    nameorder: "",
    description: "",
    modeltype: "",
    initialprice: "",
    deadline: "",
    images: []
  });

  const [errors, setErrors] = useState({});
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({ size: "", color: "", quantity: "" });

  useEffect(() => {
    if (isOpen) {
      // Réinitialiser le formulaire quand le popup s'ouvre
      setForm({
        nameorder: "",
        description: "",
        modeltype: "",
        initialprice: "",
        deadline: "",
        images: []
      });
      setVariants([]);
      setNewVariant({ size: "", color: "", quantity: "" });
      setErrors({});
      setIsSubmitted(false);
      setEarthquake(false);
      setShowSuccessToast(false);
      setShowErrorToast(false);
    }
  }, [isOpen]);

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

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "nameorder":
        if (!value || value.trim() === "") {
          error = "اسم الطلب مطلوب";
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
      
      case "modeltype":
        if (!value || value.trim() === "") {
          error = "نوع النموذج مطلوب";
        }
        break;
      
      case "initialprice":
        if (!value || value.trim() === "") {
          error = "السعر الابتدائي مطلوب";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = "يجب أن يكون السعر رقمًا موجبًا";
        }
        break;
      
      case "deadline":
        if (!value || value.trim() === "") {
          error = "تاريخ الاستحقاق مطلوب";
        }
        break;
      
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Champs obligatoires
    if (!form.nameorder || form.nameorder.trim() === "") {
      newErrors.nameorder = "اسم الطلب مطلوب";
    } else if (form.nameorder.length < 2) {
      newErrors.nameorder = "يجب أن يكون الاسم على الأقل حرفين";
    }
    
    if (!form.description || form.description.trim() === "") {
      newErrors.description = "وصف النموذج مطلوب";
    } else if (form.description.length < 10) {
      newErrors.description = "الوصف يجب أن يكون على الأقل 10 أحرف";
    }
    
    if (!form.modeltype || form.modeltype.trim() === "") {
      newErrors.modeltype = "نوع النموذج مطلوب";
    }
    
    if (!form.initialprice || form.initialprice.trim() === "") {
      newErrors.initialprice = "السعر الابتدائي مطلوب";
    } else if (isNaN(form.initialprice) || parseFloat(form.initialprice) <= 0) {
      newErrors.initialprice = "يجب أن يكون السعر رقمًا موجبًا";
    }
    
    if (!form.deadline || form.deadline.trim() === "") {
      newErrors.deadline = "تاريخ الاستحقاق مطلوب";
    }
    
    // Vérifier les variantes
    if (variants.length === 0) {
      newErrors.variants = "يجب إضافة متغير واحد على الأقل (مقاس ولون وكمية)";
    } else {
      const invalidVariants = variants.filter(v => !v.quantity || v.quantity <= 0);
      if (invalidVariants.length > 0) {
        newErrors.variants = "يجب تحديد كمية صحيحة لكل مقاس ولون";
      }
    }
    
    // Vérifier les images (optionnel selon l'API)
    if (form.images.length === 0) {
      newErrors.images = "يجب إضافة صورة واحدة على الأقل للنموذج";
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
      
      // Ajouter les champs obligatoires selon l'API fassou
      formData.append('nameorder', form.nameorder);
      formData.append('description', form.description);
      formData.append('modeltype', form.modeltype);
      formData.append('initialprice', form.initialprice);
      formData.append('deadline', form.deadline);
      
      // Ajouter les variantes comme JSON
      formData.append('variants', JSON.stringify(variants));
      
      // Ajouter les images
      if (form.images && form.images.length > 0) {
        for (let i = 0; i < form.images.length; i++) {
          formData.append('images', form.images[i]);
        }
      }

      // Utiliser l'API pour créer une commande fassou
      const response = await fetch('http://127.0.0.1:8000/adminapi/createCommandefassou/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });


      const result = await response.json();

      // Dans la fonction handleSubmit du composant Addfassou
  if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleSubmit();
        }
      }
else if (response.ok) {
  console.log("Commande Fassou créée avec succès:", result);
  
  setShowSuccessToast(true);
  
  // Fermer automatiquement après 2 secondes
  setTimeout(() => {
    if (onSuccess) {
      // Passer les données de la nouvelle commande
      onSuccess({
        ...result,
        // Vous pouvez aussi passer les données du formulaire si nécessaire
        newOrder: {
          nameorder: form.nameorder,
          description: form.description,
          model_type: form.modeltype,
          deadline: form.deadline,
          initial_price: form.initialprice,
          variants: variants,
          images: form.images.map(file => ({
            // Simuler la structure d'image attendue
            image: URL.createObjectURL(file)
          })),
          state: 'pending', // Statut par défaut
          codeorder: result.codeorder // Le codeorder renvoyé par l'API
        }
      });
    }
    onClose();
  }, 2000);
        
      } else if (result.error) {
        setErrorMessage(result.error);
        setShowErrorToast(true);
      } else {
        setErrorMessage("حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.");
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage("حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
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
          <h2>إضافة طلب فاسو جديد</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="popup-body">
          <form className="affiliateForm" onSubmit={handleSubmit}>
            <div className="formSection">
              <div className="inputField">
                <label>اسم الطلب (مطلوب):</label>
                <input
                  type="text"
                  placeholder="أدخل اسم الطلب"
                  name="nameorder"
                  value={form.nameorder}
                  onChange={(e) => handleInputChange('nameorder', e.target.value)}
                  className={isSubmitted && errors.nameorder ? 'error' : ''}
                  ref={errors.nameorder ? firstErrorRef : null}
                />
                {isSubmitted && errors.nameorder && (
                  <p className="error" ref={firstErrorRef}>{errors.nameorder}</p>
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
                  ref={errors.description && !errors.nameorder ? firstErrorRef : null}
                />
                {isSubmitted && errors.description && (
                  <p className="error" ref={!errors.nameorder && errors.description ? firstErrorRef : null}>{errors.description}</p>
                )}
              </div>
              
              <div className="inputField">
                <label>نوع النموذج (مطلوب):</label>
                <select
                  name="modeltype"
                  value={form.modeltype}
                  onChange={(e) => handleInputChange('modeltype', e.target.value)}
                  className={isSubmitted && errors.modeltype ? 'error' : ''}
                  ref={errors.modeltype && !errors.nameorder && !errors.description ? firstErrorRef : null}
                >
                  <option value="">اختر نوع النموذج</option>
                  {typeChoices.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {isSubmitted && errors.modeltype && (
                  <p className="error" ref={!errors.nameorder && !errors.description && errors.modeltype ? firstErrorRef : null}>{errors.modeltype}</p>
                )}
              </div>
              
              <div className="inputField">
                <label>السعرالاجمالي (مطلوب):</label>
                <input
                  type="number"
                  placeholder="أدخل السعر الاجمالي بالدينار الجزائري"
                  name="initialprice"
                  value={form.initialprice}
                  onChange={(e) => handleInputChange('initialprice', e.target.value)}
                  className={isSubmitted && errors.initialprice ? 'error' : ''}
                  min="1"
                  ref={errors.initialprice && 
                       !errors.nameorder && 
                       !errors.description && 
                       !errors.modeltype ? firstErrorRef : null}
                />
                {isSubmitted && errors.initialprice && (
                  <p className="error" ref={
                    !errors.nameorder && 
                    !errors.description && 
                    !errors.modeltype && 
                    errors.initialprice ? firstErrorRef : null
                  }>
                    {errors.initialprice}
                  </p>
                )}
              </div>

              <div className="inputField">
                <label>التاريخ الأقصى لاستلام الطلبية(مطلوب):</label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className={isSubmitted && errors.deadline ? 'error' : ''}
                  ref={errors.deadline && 
                       !errors.nameorder && 
                       !errors.description && 
                       !errors.modeltype && 
                       !errors.initialprice ? firstErrorRef : null}
                />
                {isSubmitted && errors.deadline && (
                  <p className="error" ref={
                    !errors.nameorder && 
                    !errors.description && 
                    !errors.modeltype && 
                    !errors.initialprice && 
                    errors.deadline ? firstErrorRef : null
                  }>
                    {errors.deadline}
                  </p>
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
                          <td>{variant.size}</td>
                          <td>
                            <div className="color-display">
                              <span>{variant.color}</span>
                            </div>
                          </td>
                          <td>{variant.quantity}</td>
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
              
              <InputField
                titre="صور النموذج النهائي(مطلوب):"
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
              {loading ? 'جاري إنشاء الطلب...' : 'إنشاء طلب فاسو'}
            </button>
          </form>
        </div>
        
        <Toast
          show={showSuccessToast}
          onClose={handleSuccessToastClose}
          type="success"
          title="تمت الإضافة بنجاح"
          message="تم إنشاء طلب فاسو بنجاح"
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