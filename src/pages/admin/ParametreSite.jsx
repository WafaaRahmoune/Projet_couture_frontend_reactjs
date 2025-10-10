import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChangeName from "../../components/compteComp/ChangeName";
import ContainerPagesAdmin from "../../components/AdminComponents/ContainerPagesAdmin";
import "../../style/AdminStyle/ParametreSite.css";
import ChangePassword from '../../components/generalComponents/ChangePassword';
import ChangegroupsLinks from "../../components/AdminComponents/ChangegroupsLinks";
import Wilayafield from "../../components/AdminComponents/Wilayafield";
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

// Composant pour les paramètres de livraison
function ParametresLivraison() {
  const [wilayas, setWilayas] = useState([]);
  const [originalWilayas, setOriginalWilayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const initialLoad = useRef(true);
  const { handle401Error } = useErreur401Handler();
  

  // Fonction pour récupérer le token
  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  // Fonction pour vérifier si le token est expiré
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  };

  // Vérifier s'il y a des modifications
  const hasChanges = () => {
    if (originalWilayas.length === 0 || wilayas.length === 0) return false;
    
    return wilayas.some((wilaya, index) => {
      const originalWilaya = originalWilayas[index];
      return originalWilaya && wilaya.price !== originalWilaya.price;
    });
  };

  // Charger les wilayas depuis l'API
  useEffect(() => {
    const fetchWilayas = async () => {
      const token = getToken();
      
     

      try {
        setLoading(true);
        const response = await fetch("https://api.kadi-inv.store/adminapi/getallwilayaswithprices", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchWilayas();
        }
      }
      else

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des wilayas");
        }

        const data = await response.json();
        const formattedWilayas = data.wilayas.map(wilaya => ({
          id: wilaya.id,
          name: wilaya.wilaya_name,
          price: parseFloat(wilaya.delivery_price) || 0,
          error: ""
        }));

        setWilayas(formattedWilayas);
        setOriginalWilayas(JSON.parse(JSON.stringify(formattedWilayas))); // Copie profonde
      } catch (error) {
        console.error("Erreur:", error);
        setFormError("حدث خطأ أثناء تحميل بيانات الولايات");
      } finally {
        setLoading(false);
        initialLoad.current = false;
      }
    };

    fetchWilayas();
  }, [navigate]);

  const handlePriceChange = (id, newPrice) => {
    const priceValue = newPrice === "" ? "" : Number(newPrice);
    let error = "";

    if (newPrice === "") {
      error = "حقل السعر مطلوب";
    } else if (isNaN(priceValue) || priceValue < 0) {
      error = "يجب أن يكون السعر رقمًا موجبًا";
    }

    setWilayas((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, price: priceValue, error } : w
      )
    );
  };

  const isFormValid = () => {
    return wilayas.every(w => 
      w.error === "" && 
      w.price !== "" && 
      w.price >= 0
    );
  };

  const hasEmptyFields = () => {
    return wilayas.some(w => w.price === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier s'il y a des modifications
    
    
    if (!isFormValid() || hasEmptyFields()) {
      setFormError("يرجى تصحيح الأخطاء قبل الإرسال");
      return;
    }
    
    const token = getToken();
    
    if (!token || isTokenExpired(token)) {
      navigate("/admin/login");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      
      const wilayasToSend = wilayas.map(wilaya => ({
        wilaya_name: wilaya.name,
        delivery_price: wilaya.price.toString()
      }));

      const response = await fetch("https://api.kadi-inv.store/adminapi/wilayas/updateprixlivraison/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ wilayas: wilayasToSend })
      });

      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleSubmit();
        }
      }
      else

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la mise à jour des prix");
      }

      const result = await response.json();
      console.log("Résultat de la mise à jour:", result);
      
      // Mettre à jour les wilayas originales avec les nouvelles valeurs
      setOriginalWilayas(JSON.parse(JSON.stringify(wilayas)));
      
      setSuccessMessage("تم تحديث الأسعار بنجاح");
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (error) {
      console.error("Erreur:", error);
      setFormError("حدث خطأ أثناء تحديث الأسعار");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري تحميل بيانات الولايات...</p>
      </div>
    );
  }

  return (
    <div>
      {formError && <div className="global-error">{formError}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="wilayas-grid">
        {wilayas.map((wilaya) => (
          <Wilayafield
            key={wilaya.id}
            wilayaname={wilaya.name}
            price={wilaya.price}
            error={wilaya.error}
            onPriceChange={(newPrice) => handlePriceChange(wilaya.id, newPrice)}
          />
        ))}
      </div>

      <div className="validation-section">
        <button 
          type="button" 
          className="save-all-btn"
          onClick={handleSubmit}
          disabled={!isFormValid() || hasEmptyFields() || saving || !hasChanges()}
        >
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
        
        {hasEmptyFields() && (
          <div className="global-error" style={{marginTop: '10px'}}>
            يجب ملء جميع حقول الأسعار
          </div>
        )}
        
      
      </div>
    </div>
  );
}

// Composant pour les paramètres du site
function ParametresSite() {
  return (
    <div className="containerall">
      <div className="modifymarginChangeName">
        <ChangeName align="start"/>
        <ChangePassword path="/admin/login" align="start"/>
      </div>
      <div className="modifymarginChangeName">
        <ChangegroupsLinks path="/admin/login" align="start" />
      </div>
    </div>
  );
}

function ParametreSite() {
  return (
    <ContainerPagesAdmin
      titre="الاعدادات"
      soustitre="ادارة اعدادات الموقع و أسعار طلبات التوصيل عبر 58 ولاية"
      elemnts={["اعدادات الموقع", "اعدادات طلبيات التوصيل"]}
      contenus={[<ParametresSite />, <ParametresLivraison />]}
    />
  );
}

export default ParametreSite;
