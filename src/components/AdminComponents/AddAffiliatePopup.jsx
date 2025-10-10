import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from "../../components/generalComponents/Toast";
import "../../style/AdminStyle/addNewAffiliate.css";
import InputField from '../../components/generalComponents/Inputfield';
import useErreur401Handler from '../generalComponents/Erreur401Handle';
// Fonction pour vérifier si une chaîne contient uniquement des caractères arabes
const isArabicText = (text) => {
  const arabicRegex = /^[\u0600-\u06FF\s]+$/;
  return arabicRegex.test(text);
};

// Fonction pour valider la force du mot de passe
const validatePasswordStrength = (password) => {
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[@#&]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasMinLength && hasSpecialChar && hasNumber;
};

function AddAffiliatePopup({ isOpen, onClose, onSuccess }) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handle401Error } = useErreur401Handler();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordconfirm: "",
    selectedModels: [],
    promoCode: "",
    validationDate: "",
    expirationDate: "",
    profitPercentage: "",
    discountPercentage: ""
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredModels, setFilteredModels] = useState([]);

  // Récupérer les modèles disponibles et générer un code promo au chargement
  useEffect(() => {
    if (isOpen) {
      fetchAvailableModels();
      generatePromoCode();
    }
  }, [isOpen]);

  // Filtrer les modèles selon le terme de recherche
  useEffect(() => {
    if (searchTerm) {
      const filtered = availableModels.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        model.code.includes(searchTerm)
      );
      setFilteredModels(filtered);
    } else {
      setFilteredModels(availableModels);
    }
  }, [searchTerm, availableModels]);

  // Fonction pour récupérer les modèles disponibles depuis l'API
  const fetchAvailableModels = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch('https://api.kadi-inv.store/adminapi/getmodelsnotaffectedtopromocode', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchAvailableModels ();
        }
      }
      else

      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data);
        setFilteredModels(data);
      } else {
        console.error('Erreur lors de la récupération des modèles');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(05|06|07)[0-9]{8}$/;
  return phoneRegex.test(phone);
};

  // Fonction pour générer un code promo via l'API
  const generatePromoCode = async () => {
    try {
      const token = localStorage.getItem('accessToken');
     

      const response = await fetch('https://api.kadi-inv.store/adminapi/generate-promo-code', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

       if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchAvailableModels ();
        }
      }

      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({ ...prev, promoCode: data.promo_code }));
      } 
      else {
        console.error('Erreur lors de la génération du code promo');
        // Fallback: générer un code localement en cas d'erreur
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setForm(prev => ({ ...prev, promoCode: result }));
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Fallback: générer un code localement en cas d'erreur
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setForm(prev => ({ ...prev, promoCode: result }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Erreur lors de la copie: ', err);
    });
  };

  const handleInputChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Valider le champ modifié
    validateField(name, value);
    
    // Si on modifie le mot de passe, valider aussi la confirmation
    if (name === "password" && form.passwordconfirm) {
      validateField("passwordconfirm", form.passwordconfirm);
    }
    
    // Si on modifie la confirmation, valider aussi le mot de passe
    if (name === "passwordconfirm" && form.password) {
      validateField("password", form.password);
    }
  };

  const handleModelSelection = (modelCode) => {
    setForm(prev => {
      const updatedModels = prev.selectedModels.includes(modelCode)
        ? prev.selectedModels.filter(code => code !== modelCode)
        : [...prev.selectedModels, modelCode];
      
      return { ...prev, selectedModels: updatedModels };
    });
    
    validateField("selectedModels", form.selectedModels);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "phoneNumber":
  if (!value || value.trim() === "") {
    error = "الرجاء إدخال رقم الهاتف";
  } else if (!validatePhoneNumber(value)) {
    error = "رقم الهاتف يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام";
  }
  break;
      case "fullName":
        if (!value || value.trim() === "") {
          error = "الرجاء إدخال الاسم الكامل";
        } else if (!isArabicText(value)) {
          error = "الاسم يجب أن يكون باللغة العربية فقط";
        } else if (value.length < 3) {
          error = "الاسم يجب أن يكون على الأقل 3 أحرف";
        }
        break;
      
      case "email":
        if (!value || value.trim() === "") {
          error = "الرجاء إدخال البريد الإلكتروني";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "صيغة البريد الإلكتروني غير صحيحة";
        }
        break;
      
      case "password":
        if (!value || value.trim() === "") {
          error = "الرجاء إدخال كلمة المرور";
        } else if (!validatePasswordStrength(value)) {
          error = "يجب أن تحتوي كلمة المرور على رمز خاص مثل @,#,& وأرقام و8 أحرف على الأقل";
        }
        break;
      
      case "passwordconfirm":
        if (!value || value.trim() === "") {
          error = "الرجاء تأكيد كلمة المرور";
        } else if (form.password && value !== form.password) {
          error = "كلمة المرور وتأكيدها غير متطابقتين";
        }
        break;
      
      case "selectedModels":
        if (value.length === 0) {
          error = "الرجاء اختيار نموذج واحد على الأقل";
        }
        break;
      
      case "validationDate":
        if (!value || value.trim() === "") {
          error = "الرجاء إدخال تاريخ التحقق";
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const inputDate = new Date(value);
          
          if (inputDate < today) {
            error = "تاريخ التحقق يجب أن يكون اليوم أو في المستقبل";
          }
        }
        break;
      
      case "expirationDate":
        if (!value || value.trim() === "") {
          error = "الرجاء إدخال تاريخ الانتهاء";
        } else if (form.validationDate) {
          const validationDate = new Date(form.validationDate);
          const expirationDate = new Date(value);
          
          if (expirationDate <= validationDate) {
            error = "تاريخ الانتهاء يجب أن يكون بعد تاريخ التحقق";
          }
        }
        break;
      
      case "profitPercentage":
        if (!value || value.trim() === "") {
          error = "الرجاء إدخال نسبة الربح";
        } else if (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100) {
          error = "نسبة الربح يجب أن تكون بين 0 و 100";
        }
        break;
      
      case "discountPercentage":
        if (!value || value.trim() === "") {
          error = "الرجاء إدخال نسبة الخصم";
        } else if (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100) {
          error = "نسبة الخصم يجب أن تكون بين 0 و 100";
        }
        break;
      
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.phoneNumber || form.phoneNumber.trim() === "") {
  newErrors.phoneNumber = "الرجاء إدخال رقم الهاتف";
} else if (!validatePhoneNumber(form.phoneNumber)) {
  newErrors.phoneNumber = "رقم الهاتف يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام";
}
    
    // Valider tous les champs obligatoires
    if (!form.fullName || form.fullName.trim() === "") {
      newErrors.fullName = "الرجاء إدخال الاسم الكامل";
    } else if (!isArabicText(form.fullName)) {
      newErrors.fullName = "الاسم يجب أن يكون باللغة العربية فقط";
    } else if (form.fullName.length < 3) {
      newErrors.fullName = "الاسم يجب أن يكون على الأقل 3 أحرف";
    }
    
    if (!form.email || form.email.trim() === "") {
      newErrors.email = "الرجاء إدخال البريد الإلكتروني";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }
    
    if (!form.password || form.password.trim() === "") {
      newErrors.password = "الرجاء إدخال كلمة المرور";
    } else if (!validatePasswordStrength(form.password)) {
      newErrors.password = "يجب أن تحتوي كلمة المرور على رمز spécial مثل @,#,& وأرقام و8 أحرف على الأقل";
    }
    
    if (!form.passwordconfirm || form.passwordconfirm.trim() === "") {
      newErrors.passwordconfirm = "الرجاء تأكيد كلمة المرور";
    } else if (form.password !== form.passwordconfirm) {
      newErrors.passwordconfirm = "كلمة المرور وتأكيدها غير متطابقتين";
    }
    
    if (form.selectedModels.length === 0) {
      newErrors.selectedModels = "الرجاء اختيار نموذج واحد على الأقل";
    }
    
    if (!form.validationDate || form.validationDate.trim() === "") {
      newErrors.validationDate = "الرجاء إدخال تاريخ التحقق";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const validationDate = new Date(form.validationDate);
      
      if (validationDate < today) {
        newErrors.validationDate = "تاريخ التحقق يجب أن يكون اليوم أو في المستقبل";
      }
    }
    
    if (!form.expirationDate || form.expirationDate.trim() === "") {
      newErrors.expirationDate = "الرجاء إدخال تاريخ الانتهاء";
    } else if (form.validationDate) {
      const validationDate = new Date(form.validationDate);
      const expirationDate = new Date(form.expirationDate);
      
      if (expirationDate <= validationDate) {
        newErrors.expirationDate = "تاريخ الانتهاء يجب أن يكون بعد تاريخ التحقق";
      }
    }
    
    if (!form.profitPercentage || form.profitPercentage.trim() === "") {
      newErrors.profitPercentage = "الرجاء إدخال نسبة الربح";
    } else if (isNaN(form.profitPercentage) || parseFloat(form.profitPercentage) < 0 || parseFloat(form.profitPercentage) > 100) {
      newErrors.profitPercentage = "نسبة الربح يجب أن تكون بين 0 و 100";
    }
    
    if (!form.discountPercentage || form.discountPercentage.trim() === "") {
      newErrors.discountPercentage = "الرجاء إدخال نسبة الخصم";
    } else if (isNaN(form.discountPercentage) || parseFloat(form.discountPercentage) < 0 || parseFloat(form.discountPercentage) > 100) {
      newErrors.discountPercentage = "نسبة الخصم يجب أن تكون بين 0 و 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setLoading(true);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      

      // Préparer les données pour l'API
      const requestData = {
        full_name: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        promo_code: form.promoCode,
        profit_percentage: parseFloat(form.profitPercentage),
        discount_percentage: parseFloat(form.discountPercentage),
        start_date: form.validationDate,
        expiration_date: form.expirationDate,
        model_codes: form.selectedModels
      };
console.log("Données à envoyer:", requestData);
      const response = await fetch('http://127.0.0.1:8000/adminapi/addNewAffilier/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return requestData();
        }
      }
      if (response.ok) {
        const result = await response.json();
        console.log("Affilié créé avec succès:", result);
        setShowSuccessToast(true);
        
        // Appeler onSuccess avec le résultat
        if (onSuccess) {
          onSuccess(result);
        }
    
      } else {
        console.error('Erreur lors de la création de l\'affilié');
        // Gérer les erreurs spécifiques ici
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Réinitialiser le formulaire lorsqu'on ferme
    setForm({
      fullName: "",
      email: "",
      password: "",
      passwordconfirm: "",
      selectedModels: [],
      promoCode: "",
      validationDate: "",
      expirationDate: "",
      profitPercentage: "",
      discountPercentage: ""
    });
    setErrors({});
    setIsSubmitted(false);
    setSearchTerm("");
    onClose();
  };

  const handleToastClose = () => {
    setShowSuccessToast(false);
    handleClose();
    // Rediriger vers la page de gestion des affiliés
    navigate('/admin/gestionAffiliates');
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content add-affiliate-popup" style={{minWidth:"0", width:"100%"}} onClick={(e) => e.stopPropagation()}>
        <div className="popup-header2">
          <h2>إضافة مروج جديد</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="popup-body">
          <form className="affiliateForm" onSubmit={handleSubmit}>
            <div className="formSection">
              <InputField
                titre="الاسم الكامل:"
                placeholder="يرجى ادخال الاسم الكامل للمروج"
                type="text"
                name="fullName"
                size="oneline"
                down={false}
                value={form.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                hasError={isSubmitted && !!errors.fullName}
              />
              {isSubmitted && errors.fullName && (
                <p className="error">{errors.fullName}</p>
              )}
              
              <InputField
                titre="البريد الإلكتروني:"
                placeholder="من الشكل name@gmail.com"
                type="email"
                name="email"
                size="oneline"
                down={false}
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                hasError={isSubmitted && !!errors.email}
              />
              {isSubmitted && errors.email && (
                <p className="error">{errors.email}</p>
              )}
              
              <InputField
                titre="كلمة المرور:"
                placeholder="يجب أن يحتوي على  رمز خاص مثل @,#,&,أرقام,8 حروف على الأقل "
                type="password"
                name="password"
                size="oneline"
                down={false}
                value={form.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                hasError={isSubmitted && !!errors.password}
              />
              {isSubmitted && errors.password && (
                <p className="error">{errors.password}</p>
              )}

              <InputField
                titre="تأكيد كلمة المرور"
                placeholder="يرجى تأكيد كلمة المرور التي أدخلتها"
                type="password"
                name="passwordconfirm"
                size="oneline"
                down={false}
                value={form.passwordconfirm}
                onChange={(e) => handleInputChange('passwordconfirm', e.target.value)}
                hasError={isSubmitted && !!errors.passwordconfirm}
              />
              {isSubmitted && errors.passwordconfirm && (
                <p className="error">{errors.passwordconfirm}</p>
              )}
            </div>

            <InputField
  titre="رقم الهاتف:"
  placeholder="يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام"
  type="tel"
  name="phoneNumber"
  size="oneline"
  down={false}
  value={form.phoneNumber}
  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
  hasError={isSubmitted && !!errors.phoneNumber}
/>
{isSubmitted && errors.phoneNumber && (
  <p className="error">{errors.phoneNumber}</p>
)}
            
            <div className="formSection">
              <div className="sectionTitle">النماذج المتاحة</div>
              
              {/* Ajouter une barre de recherche */}
              <div className="search-container">
                <input
                  type="text"
                  placeholder="ابحث باسم النموذج أو الكود..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="model-search-input"
                />
              </div>
              
              <div className="modelsGrid">
                {filteredModels.map(model => (
                  <div 
                    key={model.code} 
                    className={`modelCheckbox ${form.selectedModels.includes(model.code) ? 'selected' : ''}`}
                    onClick={() => handleModelSelection(model.code)}
                  >
                    <input 
                      type="checkbox" 
                      checked={form.selectedModels.includes(model.code)} 
                      onChange={() => {}} 
                    />
                    <label>{model.name} (كود: {model.code})</label>
                  </div>
                ))}
              </div>
              
              {/* Message si aucun résultat */}
              {filteredModels.length === 0 && (
                <div className="no-results">
                  لم يتم العثور على نماذج تطابق بحثك
                </div>
              )}
              
              {isSubmitted && errors.selectedModels && (
                <p className="error">{errors.selectedModels}</p>
              )}
            </div>
            
            <div className="formSection">
              <div className="inputField promo-code-field">
                <label>كود الترويج:</label>
                <div className="promo-code-container">
                  <input 
                    type="text" 
                    value={form.promoCode} 
                    readOnly 
                    className="promo-code-input"
                  />
                  <button 
                    type="button" 
                    className={`copy-button ${copied ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(form.promoCode)}
                    title={copied ? "تم النسخ!" : "نسخ الكود"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                    {copied && <span className="copied-text">تم النسخ!</span>}
                  </button>
                </div>
              </div>
              
              <InputField
                titre="تاريخ  بداية فعالية كود البرومو:"
                type="date"
                name="validationDate"
                size="oneline"
                down={false}
                value={form.validationDate}
                onChange={(e) => handleInputChange('validationDate', e.target.value)}
                hasError={isSubmitted && !!errors.validationDate}
              />
              {isSubmitted && errors.validationDate && (
                <p className="error">{errors.validationDate}</p>
              )}
              
              <InputField
                titre="تاريخ نهاية صلاحية كود البرومo:"
                type="date"
                name="expirationDate"
                size="oneline"
                down={false}
                value={form.expirationDate}
                onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                hasError={isSubmitted && !!errors.expirationDate}
              />
              {isSubmitted && errors.expirationDate && (
                <p className="error">{errors.expirationDate}</p>
              )}
            </div>
            
            <div className="formSection">
              <InputField
                titre="%استفادة المروج:"
                placeholder="نسبة الاستفادة التي يجنيها المروج من النموذج .مثلا 10%"
                type="number"
                name="profitPercentage"
                size="oneline"
                down={false}
                value={form.profitPercentage}
                onChange={(e) => handleInputChange('profitPercentage', e.target.value)}
                hasError={isSubmitted && !!errors.profitPercentage}
                min="0"
                max="100"
              />
              {isSubmitted && errors.profitPercentage && (
                <p className="error">{errors.profitPercentage}</p>
              )}
              
              <InputField
                titre="% الخصم للزبون: "
                placeholder="نسبة الخصم التي يستفيد منها الزبون في حالة الحصول على كود برومo "
                type="number"
                name="discountPercentage"
                size="oneline"
                down={false}
                value={form.discountPercentage}
                onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                hasError={isSubmitted && !!errors.discountPercentage}
                min="0"
                max="100"
              />
              {isSubmitted && errors.discountPercentage && (
                <p className="error">{errors.discountPercentage}</p>
              )}
            </div>
            
            <button type="submit" className="submitButton" disabled={loading}>
              {loading ? 'جاري الإضافة...' : 'اضافة المروج'}
            </button>
          </form>
        </div>
        
        <Toast
          show={showSuccessToast}
          onClose={handleToastClose}
          type="success"
          title="تمت الإضافة بنجاح"
          message="تم إضافة المسوق الجديد إلى النظام بنجاح"
          duration={3000}
          position="bottom-right"
        />
      </div>
    </div>
  );
}

export default AddAffiliatePopup;
