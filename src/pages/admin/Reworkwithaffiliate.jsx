import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from "../../components/generalComponents/Toast";
import "../../style/AdminStyle/addNewAffiliate.css";
import InputField from '../../components/generalComponents/Inputfield';
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

function ReworkWithAffiliate({ isOpen, onClose, affiliate , onSuccess}) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allModelsAssigned, setAllModelsAssigned] = useState(false);
  const navigate = useNavigate();
  const { handle401Error } = useErreur401Handler();

  const [form, setForm] = useState({
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
    if (isOpen && affiliate) {
      fetchAvailableModels();
      generatePromoCode();
      // Pré-remplir les pourcentages avec les valeurs par défaut
      setForm(prev => ({
        ...prev,
        profitPercentage: "15",
        discountPercentage: "10"
      }));
    }
  }, [isOpen, affiliate]);

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
      

      const response = await fetch('http://127.0.0.1:8000/adminapi/getmodelsnotaffectedtopromocode', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data);
        setFilteredModels(data);
        
        // Vérifier si tous les modèles sont déjà affectés
        if (data.length === 0) {
          setAllModelsAssigned(true);
        } else {
          setAllModelsAssigned(false);
        }
      } else if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchAvailableModels ();
        }
      }
      else {
        console.error('Erreur lors de la récupération des modèles');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Fonction pour générer un code promo via l'API
  const generatePromoCode = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      

      const response = await fetch('http://127.0.0.1:8000/adminapi/generate-promo-code', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({ ...prev, promoCode: data.promo_code }));
      } else 
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchAvailableModels ();
        }
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
      if (!token) {
        navigate('/admin/login');
        return;
      }

      // Préparer les données pour l'API
      const requestData = {
        promo_code: form.promoCode,
        profit_percentage: parseFloat(form.profitPercentage),
        discount_percentage: parseFloat(form.discountPercentage),
        start_date: form.validationDate,
        expiration_date: form.expirationDate,
        model_codes: form.selectedModels
      };

      const response = await fetch(`http://127.0.0.1:8000/adminapi/reworkwithaffiliate/${affiliate.email}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Nouveau code promo créé avec succès:", result);
        setShowSuccessToast(true);

   if (onSuccess) {
          onSuccess(result);
        }
        
      } else if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchAvailableModels ();
        }
      }
      else {
        console.error('Erreur lors de la création du nouveau code promo:', result);
        setErrorMessage(result.error || "حدث خطأ أثناء إنشاء كود الترويج الجديد. يرجى المحاولة مرة أخرى.");
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
    // Réinitialiser le formulaire lorsqu'on ferme
    setForm({
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
    setAllModelsAssigned(false);
    onClose();
  };

  const handleToastClose = () => {
    setShowSuccessToast(false);
    handleClose();
  };

  const handleErrorToastClose = () => {
    setShowErrorToast(false);
    setErrorMessage("");
  };

  if (!isOpen || !affiliate) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content add-affiliate-popup" onClick={(e) => e.stopPropagation()}  style={{minWidth:"0", width:"100%"}}>
        <div className="popup-header2">
          <h2>تجديد حساب المروج: {affiliate.full_name}</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="popup-body">
          
          
          <form className="affiliateForm" onSubmit={handleSubmit}>
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
              
              {allModelsAssigned ? (
                <div className="no-models-message">
                  جميع نماذج المتجر مُخصصة لرموز الترويج، لا يوجد نموذج حر حالياً
                </div>
              ) : (
                <>
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
                  
                  {/* Message si aucun résultat de recherche */}
                  {filteredModels.length === 0 && availableModels.length > 0 && (
                    <div className="no-results">
                      لم يتم العثور على نماذج تطابق بحثك
                    </div>
                  )}
                </>
              )}
              
              {isSubmitted && errors.selectedModels && (
                <p className="error">{errors.selectedModels}</p>
              )}
            </div>
            
            <div className="formSection">
              <div className="inputField promo-code-field">
                <label>كود الترويج الجديد:</label>
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
            
            <button 
              type="submit" 
              className="submitButton" 
              disabled={loading || allModelsAssigned}
            >
              {loading ? 'جاري إنشاء الكود الجديد...' : 'إنشاء كود ترويج جديد'}
            </button>
          </form>
        </div>
        
        <Toast
          show={showSuccessToast}
          onClose={handleToastClose}
          type="success"
          title="تم الإنشاء بنجاح"
          message="تم إنشاء كود الترويج الجديد للمروج بنجاح"
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

export default ReworkWithAffiliate;