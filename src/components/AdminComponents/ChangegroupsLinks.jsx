import React, { useState, useEffect } from 'react';
import InputField from "../generalComponents/Inputfield";
import Toast from "../generalComponents/Toast";
import socialIcon from '../../assets/icons/social.png'; 
import styloIcon from '../../assets/icons/styloIcon.png';
import "../../style/AdminStyle/ChangeGroupsLinks.css";
import useErreur401Handler from '../generalComponents/Erreur401Handle';

export default function 

ChangegroupsLinks({ path = "", align = "center" }) {
  const [form, setForm] = useState({
    whatsapp: '',
    instagram: '',
    facebook: '',
    group_dropshipping: '',
    group_investissement: ''
  });

  const [initialForm, setInitialForm] = useState({
    whatsapp: '',
    instagram: '',
    facebook: '',
    group_dropshipping: '',
    group_investissement: ''
  });

  const [errors, setErrors] = useState({
    whatsapp: '',
    instagram: '',
    facebook: '',
    group_dropshipping: '',
    group_investissement: ''
  });  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [noChangesError, setNoChangesError] = useState(""); // Nouvel état pour erreur "aucun changement"
  const { handle401Error } = useErreur401Handler();

  // Fonction pour déterminer la classe CSS en fonction de l'alignement
  const getContainerClass = () => {
    const baseClass = "containersocials";
    return `${baseClass} ${baseClass}--${align}`;
  };

  // Charger les données existantes
  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const token = localStorage.getItem('accessToken');


      const response = await fetch('https://api.kadi-inv.store/clientapi/sociallinks/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
       
      });

      const data = await response.json();
      
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleSubmit();
        }
      }
      else 

      if (response.status === 200 && data.length > 0) {
        const socialData = data[0];
        const formData = {
          whatsapp: socialData.whatsapp || '',
          instagram: socialData.instagram || '',
          facebook: socialData.facebook || '',
          group_dropshipping: socialData.group_dropshipping || '',
          group_investissement: socialData.group_investissement || ''
        };
        setForm(formData);
        setInitialForm(formData); // Sauvegarder les données initiales
        setHasExistingData(true);
      } else {
        setHasExistingData(false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des liens sociaux:", error);
      if (!error.message?.includes('Authentication') && 
          !error.message?.includes('refresh token')) {
        setApiError("حدث خطأ في تحميل البيانات");
      }
      setHasExistingData(false);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError("");
    if (noChangesError) setNoChangesError(""); // Effacer l'erreur "aucun changement" quand l'utilisateur tape
  };

 const validateUrl = (url) => {
  if (!url) return true; // Champ vide est valide
  
  // Pattern plus permissif pour les URLs
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?[\/\w.-]*=[\/\w.-]*)?$/;
  return urlPattern.test(url);
};

  const validateWhatsapp = (number) => {
    if (!number) return true; // Champ vide est valide
    const whatsappPattern = /^[0-9]{10,15}$/;
    return whatsappPattern.test(number);
  };

  // Vérifier si aucun champ n'a été modifié
  const hasNoChanges = () => {
    return (
      form.whatsapp === initialForm.whatsapp &&
      form.instagram === initialForm.instagram &&
      form.facebook === initialForm.facebook &&
      form.group_dropshipping === initialForm.group_dropshipping &&
      form.group_investissement === initialForm.group_investissement
    );
  };

  const isFormValid = () => {
    let valid = true;
    let newErrors = {
      whatsapp: '',
      instagram: '',
      facebook: '',
      group_dropshipping: '',
      group_investissement: ''
    };

    // Vérifier d'abord si aucun changement n'a été fait
    if (hasNoChanges()) {
      setNoChangesError("لم تقم بإجراء أي تغييرات");
      valid = false;
    } else {
      setNoChangesError(""); // Effacer l'erreur s'il y a des changements
    }

    // Validation WhatsApp
    if (form.whatsapp && !validateWhatsapp(form.whatsapp)) {
      newErrors.whatsapp = 'رقم واتساب غير صحيح';
      valid = false;
    }

    // Validation URLs
    if (form.instagram && !validateUrl(form.instagram)) {
      newErrors.instagram = 'رابط إنستغرام غير صحيح';
      valid = false;
    }

    if (form.facebook && !validateUrl(form.facebook)) {
      newErrors.facebook = 'رابط فيسبوك غير صحيح';
      valid = false;
    }

    if (form.group_dropshipping && !validateUrl(form.group_dropshipping)) {
      newErrors.group_dropshipping = 'رابط المجموعة غير صحيح';
      valid = false;
    }

    if (form.group_investissement && !validateUrl(form.group_investissement)) {
      newErrors.group_investissement = 'رابط المجموعة غير صحيح';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submit started");
  setIsSubmitted(true);
  setApiError("");
  setNoChangesError("");

  // Vérifier d'abord si aucun changement
  if (hasNoChanges()) {
    console.log("No changes detected");
    setNoChangesError("لم تقم بإجراء أي تغييرات");
    setShake(true);
    setTimeout(() => setShake(false), 500);
    return;
  }

  if (!isFormValid()) {
    console.log("Form validation failed", errors);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    return;
  }

  console.log("Form is valid, proceeding with API call");
  setLoading(true);
    try {
  const token = localStorage.getItem('accessToken');
 


  const result = await fetch('http://127.0.0.1:8000/adminapi/updatesociallinks/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form
      });

      const response = await result.json();
 if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleSubmit();
        }
      }
      else 

  if (response.status === 200) {
    console.log("Update successful");
    setShowToast(true);
    setHasExistingData(true);
    setInitialForm(form);
  } else {
    console.log("Update failed with status", response.status);
    setApiError(response.data.message || "حدث خطأ أثناء التحديث");
  }
} catch (error) {
  console.error("Erreur lors de la mise à jour des liens sociaux:", error);
      
      if (error.response?.status === 403) {
        setApiError("ليس لديك الصLاحية لتحديث الروابط");
      } else if (error.response?.status === 400) {
        // Gestion des erreurs de validation du serveur
        const serverErrors = error.response.data;
        let newErrors = {
          whatsapp: '',
          instagram: '',
          facebook: '',
          group_dropshipping: '',
          group_investissement: ''
        };
        
        if (serverErrors.whatsapp) {
          newErrors.whatsapp = Array.isArray(serverErrors.whatsapp) 
            ? serverErrors.whatsapp[0] 
            : serverErrors.whatsapp;
        }
        if (serverErrors.instagram) {
          newErrors.instagram = Array.isArray(serverErrors.instagram) 
            ? serverErrors.instagram[0] 
            : serverErrors.instagram;
        }
        if (serverErrors.facebook) {
          newErrors.facebook = Array.isArray(serverErrors.facebook) 
            ? serverErrors.facebook[0] 
            : serverErrors.facebook;
        }
        if (serverErrors.group_dropshipping) {
          newErrors.group_dropshipping = Array.isArray(serverErrors.group_dropshipping) 
            ? serverErrors.group_dropshipping[0] 
            : serverErrors.group_dropshipping;
        }
        if (serverErrors.group_investissement) {
          newErrors.group_investissement = Array.isArray(serverErrors.group_investissement) 
            ? serverErrors.group_investissement[0] 
            : serverErrors.group_investissement;
        }
        
        setErrors(newErrors);
      } else if (!error.message?.includes('Authentication') && 
                 !error.message?.includes('refresh token')) {
        setApiError("حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className={getContainerClass()}>جاري التحميل...</div>;
  }

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        type="success"
        title="تمت العملية بنجاح"
        message="تم تحديث الروابط الاجتماعية بنجاح"
        duration={5000}
        position="bottom-right"
      />

      <section className={getContainerClass()}>
        <div className="field-wrapper">
          <section className="nameheader">
            <img src={socialIcon} alt="social" className="social-icon" />
            <h1>الروابط الاجتماعية والمجموعات</h1>
          </section>

          {/* Afficher l'erreur "aucun changement" */}
          {noChangesError && (
            <p className="error no-changes-error">{noChangesError}</p>
          )}

          {/* WhatsApp Field avec icône stylo conditionnelle */}
          <div className="input-wrapper">
            {hasExistingData && <img src={styloIcon} alt="modifier" className="edit-icon" />}
            <InputField
              titre="رقم واتساب"
              placeholder="أدخل رقم واتساب"
              type="text"
              size="oneline"
              name="whatsapp"
              value={form.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              hasError={isSubmitted && !!errors.whatsapp}
            />
          </div>
          {isSubmitted && errors.whatsapp && (
            <p className="error">{errors.whatsapp}</p>
          )}

          {/* Instagram Field avec icône stylo conditionnelle */}
          <div className="input-wrapper">
            {hasExistingData && <img src={styloIcon} alt="modifier" className="edit-icon" />}
            <InputField
              titre="إنستغرام"
              placeholder="أدخل رابط الإنستغرام"
              type="url"
              size="oneline"
              name="instagram"
              value={form.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              hasError={isSubmitted && !!errors.instagram}
            />
          </div>
          {isSubmitted && errors.instagram && (
            <p className="error">{errors.instagram}</p>
          )}

          {/* Facebook Field avec icône stylo conditionnelle */}
          <div className="input-wrapper">
            {hasExistingData && <img src={styloIcon} alt="modifier" className="edit-icon" />}
            <InputField
              titre="فيسبوك"
              placeholder="أدخل رابط الفيسبوك"
              type="url"
              size="oneline"
              name="facebook"
              value={form.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              hasError={isSubmitted && !!errors.facebook}
            />
          </div>
          {isSubmitted && errors.facebook && (
            <p className="error">{errors.facebook}</p>
          )}

          {/* Dropshipping Group Field avec icône stylo conditionnelle */}
          <div className="input-wrapper">
            {hasExistingData && <img src={styloIcon} alt="modifier" className="edit-icon" />}
            <InputField
              titre="مجموعة الدروبشيبينغ"
              placeholder="أدخل رابط مجموعة الدروبشيبينغ"
              type="url"
              size="oneline"
              name="group_dropshipping"
              value={form.group_dropshipping}
              onChange={(e) => handleInputChange('group_dropshipping', e.target.value)}
              hasError={isSubmitted && !!errors.group_dropshipping}
            />
          </div>
          {isSubmitted && errors.group_dropshipping && (
            <p className="error">{errors.group_dropshipping}</p>
          )}

          {/* Investment Group Field avec icône stylo conditionnelle */}
          <div className="input-wrapper">
            {hasExistingData && <img src={styloIcon} alt="modifier" className="edit-icon" />}
            <InputField
              titre="مجموعة الاستثمار"
              placeholder="أدخل رابط مجموعة الاستثمار"
              type="url"
              size="oneline"
              name="group_investissement"
              value={form.group_investissement}
              onChange={(e) => handleInputChange('group_investissement', e.target.value)}
              hasError={isSubmitted && !!errors.group_investissement}
            />
          </div>
          {isSubmitted && errors.group_investissement && (
            <p className="error">{errors.group_investissement}</p>
          )}

          {apiError && (
            <p className="error">{apiError}</p>
          )}
        </div>

        <div className="button-group">
          <button
            type="submit"
            className={`btn-confirmsocials ${shake ? "shake" : ""} ${hasNoChanges() ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={loading || hasNoChanges()}
          >
            {loading ? "جاري التحديث..." : "تحديث الروابط"}
          </button>
        </div>
      </section>
    </>
  );
}
