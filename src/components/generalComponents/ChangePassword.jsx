import React, { useState } from 'react';
import InputField from "../generalComponents/Inputfield";
import Toast from "../generalComponents/Toast";
import lockIcon from '../../assets/icons/lock.png';
import "../../style/compteStyle/ChangePassword.css";
import api from '../../apimanagement/api';

export default function ChangePassword({path="", align = "center"} ) {
  const [form, setForm] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [errors, setErrors] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [apiError, setApiError] = useState("");

  const getContainerClass = () => {
    const baseClass = "containerchangepassword";
    return `${baseClass} ${baseClass}--${align}`;
  };

  // Vérifier si tous les champs sont remplis
  const areAllFieldsFilled = () => {
    return form.current.trim() !== '' && 
           form.newPass.trim() !== '' && 
           form.confirm.trim() !== '';
  };

  // Vérifier si au moins un champ a été modifié
  const hasFormData = () => {
    return form.current.trim() !== '' || form.newPass.trim() !== '' || form.confirm.trim() !== '';
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    let valid = true;
    let newErrors = {
      current: '',
      newPass: '',
      confirm: ''
    };

    if (!form.current) {
      newErrors.current = 'يرجى إدخال كلمة المرور الحالية';
      valid = false;
    }

    if (!form.newPass) {
      newErrors.newPass = 'يرجى إدخال كلمة المرور الجديدة';
      valid = false;
    }

    if (!form.confirm) {
      newErrors.confirm = 'يرجى تأكيد كلمة المرور الجديدة';
      valid = false;
    }

    if (form.newPass && form.confirm && form.newPass !== form.confirm) {
      newErrors.confirm = 'كلمتا المرور غير متطابقتين';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setApiError("");

    // Vérifier si tous les champs sont remplis
    if (!areAllFieldsFilled()) {
      setErrors({
        current: !form.current ? 'يرجى إدخال كلمة المرور الحالية' : '',
        newPass: !form.newPass ? 'يرجى إدخال كلمة المرور الجديدة' : '',
        confirm: !form.confirm ? 'يرجى تأكيد كلمة المرور الجديدة' : ''
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!isFormValid()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);

    try {
      // Vérifier d'abord si nous avons un refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        window.location.href = path;
        setLoading(false);
        return;
      }
      
      // Utilisation de l'API personnalisée avec authentification
      const response = await api.withAuth(true, true).post('/api/changepassword/', {
        password: form.current,
        newPassword: form.newPass
      });

      const data = response.data;

      if (response.status === 200) {
        setShowToast(true); // Afficher le toast
        // Reset form on success
        setForm({
          current: '',
          newPass: '',
          confirm: ''
        });
        setIsSubmitted(false);
      } else {
        // Gérer les erreurs spécifiques de l'API
        if (data.password) {
          setApiError(data.password[0]);
        } else if (data.newPassword) {
          setErrors(prev => ({ ...prev, newPass: data.newPassword[0] }));
        } else {
          setApiError(data.message || "حدث خطأ أثناء تغيير كلمة المرور");
        }
      }
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      
      // Les erreurs d'authentification sont gérées par l'intercepteur
      if (error.response?.status === 403) {
        setApiError("ليس لديك الصلاحية لتغيير كلمة المرور");
      } else if (!error.message?.includes('Authentication') && 
                 !error.message?.includes('refresh token')) {
        // Afficher seulement les erreurs non liées à l'authentification
        setApiError("حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  // Déterminer la classe du bouton en fonction de l'état
  const getButtonClass = () => {
    let className = "btn-confirmcompte";
    
    if (loading) {
      className += " loading";
    } else if (!areAllFieldsFilled()) {
      className += " disabled";
    } else if (isSubmitted && !isFormValid()) {
      className += " invalid";
    } else {
      className += " valid";
    }
    
    if (shake) {
      className += " shake";
    }
    
    return className;
  };

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        type="success"
        title="تمت العملية بنجاح"
        message="تم تغيير كلمة المرور بنجاح"
        duration={5000}
        position="bottom-right"
      />

      <section className={getContainerClass()}>
        <div className="field-wrapper">
          <section className="nameheader">
            <img src={lockIcon} alt="lock" className="compte-icon" />
            <h1>تغيير كلمة المرور</h1>
          </section>

          <InputField
            titre="كلمة المرور الحالية"
            placeholder="يمكنك تعبئة كلمة المرور الحالية"
            type="password"
            size="oneline"
            name="current"
            value={form.current}
            onChange={(e) => handleInputChange('current', e.target.value)}
            hasError={isSubmitted && !!errors.current}
          />
          {isSubmitted && errors.current && (
            <p className="error">{errors.current}</p>
          )}

          <InputField
            titre="كلمة المرور الجديدة"
            placeholder="يمكنك إنشاء كلمة مرور خاصة بك"
            type="password"
            size="oneline"
            name="newPass"
            value={form.newPass}
            onChange={(e) => handleInputChange('newPass', e.target.value)}
            hasError={isSubmitted && !!errors.newPass}
          />
          {isSubmitted && errors.newPass && (
            <p className="error">{errors.newPass}</p>
          )}

          <InputField
            titre="تأكيد كلمة المرور:"
            placeholder="أعد تعبئة نفس كلمة المرور الجديدة"
            type="password"
            size="oneline"
            name="confirm"
            value={form.confirm}
            onChange={(e) => handleInputChange('confirm', e.target.value)}
            hasError={isSubmitted && !!errors.confirm}
          />
          {isSubmitted && errors.confirm && (
            <p className="error">{errors.confirm}</p>
          )}

          {apiError && (
            <p className="error">{apiError}</p>
          )}
        </div>

        <div className="button-group">
          <button
            type="submit"
            className={getButtonClass()}
            onClick={handleSubmit}
            disabled={loading || !areAllFieldsFilled()}
          >
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </button>
        </div>
      </section>
    </>
  );
}