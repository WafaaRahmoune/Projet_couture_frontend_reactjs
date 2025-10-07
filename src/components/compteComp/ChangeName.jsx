import React, { useState, useEffect } from 'react';
import InputField from "../generalComponents/Inputfield";
import Toast from "../generalComponents/Toast";
import compte from '../../assets/icons/compte.png';
import styloIcon from '../../assets/icons/styloIcon.png'; 
import "../../style/compteStyle/Changename.css"
import api from '../../apimanagement/api';

// Correction : utiliser la destructuration pour les props
export default function ChangeName({ path = "/loginClient", align = "center" }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [initialNom, setInitialNom] = useState("");
  const [errors, setErrors] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const getContainerClass = () => {
    const baseClass = "containerchangename"; // Correction : utiliser le bon nom de classe
    return `${baseClass} ${baseClass}--${align}`;
  };

  // Fonction pour récupérer les données de l'utilisateur
  const fetchUserData = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        setFetchLoading(false);
        window.location.href = path; // Utiliser le path passé en prop
        return;
      }
      
      const response = await api.withAuth(true, true).get('/api/nameclient/');
      
      const data = response.data;
      setNom(data.full_name);
      setInitialNom(data.full_name);
      setEmail(data.email);
      setErrors("");
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      
      if (error.response?.status === 403) {
        setErrors("ليس لديك الصلاحية للوصول إلى هذه البيانات");
      } else if (!error.message?.includes('Authentication') && 
                 !error.message?.includes('refresh token')) {
        setErrors("حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setFetchLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNom(value);
    setErrors("");
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  const isFormValid = () => {
    return nom.trim() !== "" && nom !== initialNom;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!isFormValid()) {
      if (nom === initialNom) {
        setErrors("لم تقم بتغيير الاسم");
      } else if (nom.trim() === "") {
        setErrors("يرجى إدخال الاسم");
      }
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    setErrors("");

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        setErrors("يرجى تسجيل الدخول أولاً");
        setLoading(false);
        window.location.href = path;
        return;
      }
      
      const response = await api.withAuth(true, true).post('/clientapi/changename/', {
        full_name: nom
      });

      const data = response.data;

      if (response.status === 200) {
        setInitialNom(nom);
        setShowToast(true);
        setIsSubmitted(false);
      } else {
        setErrors(data.message || "حدث خطأ أثناء تحديث الاسم");
        setNom(initialNom);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);
      
      if (error.response?.status === 403) {
        setErrors("ليس لديك الصلاحية لتعديل البيانات");
      } else if (!error.message?.includes('Authentication') && 
                 !error.message?.includes('refresh token')) {
        setErrors("حدث خطأ في الاتصال بالخادم");
        setNom(initialNom);
      }
    } finally {
      setLoading(false);
    }
  };

  // Afficher un loader pendant le chargement des données
  if (fetchLoading) {
    return (
      <section className={getContainerClass()}> {/* Utiliser la classe dynamique */}
        <div className="field-wrapper">
          <section className="nameheader">
            <img src={compte} alt="compte" className="compte-icon" />
            <h1>المعلومات الشخصية</h1>
          </section>
          <div className="loading">جاري تحميل البيانات...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        type="success"
        title="تمت العملية بنجاح"
        message="تم تعديل الاسم بنجاح"
        duration={5000}
        position="bottom-right"
      />

      <section className={getContainerClass()}> {/* Utiliser la classe dynamique */}
        <div className="field-wrapper">
          <section className="nameheader">
            <img src={compte} alt="compte" className="compte-icon" />
            <h1>المعلومات الشخصية</h1>
          </section>
        
          <div className="input-wrapper">
            <img src={styloIcon} alt="modifier" className="edit-icon" />
            <InputField
              titre="الاسم الكامل:"
              type="text"
              name="name"
              size="oneline"
              value={nom}
              onChange={handleInputChange}
              hasError={isSubmitted && !!errors} 
              placeholder={initialNom || "أدخل اسمك الكامل"}
            />
          </div>
          
          {errors && (
            <p className="error">{errors}</p>
          )}

          {isSubmitted && nom === initialNom && !errors && !showToast && (
            <p className="info">لم تقم بتغيير الاسم</p>
          )}
        </div>

        <div className="button-group">
          <button
            type="submit"
            className={`btn-confirmcompte ${shake ? "shake" : ""} ${nom === initialNom ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={loading || nom === initialNom}
          >
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </section>
    </>
  );
}