import { useState, useEffect } from "react";
import { ArrowLeft } from 'lucide-react';
import { InputField } from "@/components/ui/inputField";
import { PasswordField } from "@/components/ui/passwordfield";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../style/authenticationStyle/LoginClient.css";
import logo from "../../assets/logobleu.png";

// Dictionnaire des messages d'erreur en arabe
const ERROR_MESSAGES = {
  // Erreurs générales
  "bad_email_or_password": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "inactive_account": "يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.",
  "account_disabled": "تم تعطيل حسابك من قبل الإدارة.",
  "couturiere_not_found": "حساب الخياطة غير موجود.",
  "dropshipper_not_found": "حساب الموزع غير موجود.",
  
  // Erreurs spécifiques dropshipper
  "dropshipper_pending": "حسابك كموزع قيد المراجعة.",
  "dropshipper_refused": "تم رفض حسابك كموزع من قبل الإدارة.",
  "dropshipper_désactivé": "تم تعطيل حسابك كموزع من قبل الإدارة.",
  
  // Erreurs spécifiques couturiere
  "couturiere_pending": "حسابك كخياطة قيد المراجعة.",
  "couturiere_refused": "تم رفض حسابك كخياطة من قبل الإدارة.",
  "couturiere_désactivé": "تم تعطيل حسابك كخياطة من قبل الإدارة.",
  
  // Erreurs de connexion
  "connection_error": "خطأ في الاتصال بالخادم - تحقق من الاتصال بالإنترنت",
  "request_error": "خطأ في إعداد الطلب",
  "unknown_error": "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
};

// Clé pour le localStorage
const REDIRECT_STORAGE_KEY = "login_redirect_path";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLogging, setIsLogging] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer le path de redirection depuis l'état de navigation ou du localStorage
  const [redirectPath, setRedirectPath] = useState("");
  const [buttonName, setButtonName] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Récupérer les données de redirection du localStorage au chargement
    const savedRedirectData = localStorage.getItem(REDIRECT_STORAGE_KEY);
    if (savedRedirectData) {
      try {
        const { path, button } = JSON.parse(savedRedirectData);
        setRedirectPath(path);
        setButtonName(button);
      } catch (error) {
        console.error("Erreur lors du parsing des données de redirection:", error);
      }
    }

    // Si on a de nouvelles données de navigation, les utiliser et les sauvegarder
    if (location.state?.redirectPath) {
      const newRedirectPath = location.state.redirectPath;
      const newButtonName = location.state.buttonName || '';
      
      setRedirectPath(newRedirectPath);
      setButtonName(newButtonName);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(REDIRECT_STORAGE_KEY, JSON.stringify({
        path: newRedirectPath,
        button: newButtonName
      }));
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location.state]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.general) {
      setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
    }
  };

  const isFormValid = () => {
    return formData.email.trim() !== "" && formData.password.trim() !== "";
  };

  // Fonction pour gérer les redirections spéciales selon le type d'erreur
  const handleSpecialRedirects = (errorType, email, role) => {
    switch (errorType) {
      case "couturiere_pending":
        navigate("/RegistrationSucess", {
          state: { email, role, message: ERROR_MESSAGES[errorType] }
        });
        return true;
        
      case "couturiere_refused":
        navigate("/registration-couturiere-refused", {
          state: { email, role, message: ERROR_MESSAGES[errorType] }
        });
        return true;

      case "couturiere_désactivé":
  navigate("/NotActiveCouturiere", {
    state: { email, role, message: ERROR_MESSAGES[errorType] }
  });
  return true;
        
      case "dropshipper_pending":
        navigate("/RegistrationSucess", {
          state: { email, role, message: ERROR_MESSAGES[errorType] }
        });
        return true;
        
      case "dropshipper_refused":
        navigate("/RefuseDropshipperPage", {
          state: { email, role, message: ERROR_MESSAGES[errorType] }
        });
        return true;
        
      case "dropshipper_désactivé":
        navigate("/NotActiveDropshipper", {
          state: { email, role, message: ERROR_MESSAGES[errorType] }
        });
        return true;
        
      default:
        return false;
    }
  };

  // Fonction pour gérer la redirection après login réussi
 // Fonction pour gérer la redirection après login réussi
const handleSuccessfulLogin = (userRole) => {
  // Nettoyer le localStorage après un login réussi
  localStorage.removeItem(REDIRECT_STORAGE_KEY);

  // TOUJOURS utiliser la liste 2 selon le rôle, ignorer le redirectPath
  switch (userRole) {
    case "client":
      navigate("/shopping");
      break;
    case "couturiere":
      navigate("/MesModels");
      break;
    case "dropshipper":
      navigate("/shoppingDropshipper");
      break;
    case "affiliate":
      navigate("/affiliateDashboard/codepromo");
      break;

    case "admin":
      navigate("/admin/dashboard");
      break;
    default:
      navigate("/");
      console.warn(`Rôle non reconnu: ${userRole}`);
  }
};

  // Fonction pour extraire le message d'erreur approprié
  const getErrorMessage = (errorType, defaultMessage) => {
    return ERROR_MESSAGES[errorType] || defaultMessage || ERROR_MESSAGES.unknown_error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setErrors({ 
        email: formData.email.trim() === "" ? "البريد مطلوب" : "", 
        password: formData.password.trim() === "" ? "كلمة المرور مطلوبة" : "",
        general: "" 
      });
      return;
    }

    setIsLogging(true);
    setErrors({ email: "", password: "", general: "" });

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", formData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });

      // Sauvegarder les tokens et les données utilisateur
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirection après login réussi
      handleSuccessfulLogin(response.data.user.role, redirectPath);

    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        const data = error.response.data;
        const errorType = Array.isArray(data.error_type) ? data.error_type[0] : data.error_type;
        const errorDetail = Array.isArray(data.detail) ? data.detail[0] : data.detail;

        // Gérer les redirections spéciales
        if (handleSpecialRedirects(errorType, formData.email, formData.role)) {
          return;
        }

        // Gérer les erreurs spécifiques pour couturiere_désactivé
        if (errorType === "couturiere_désactivé") {
          setErrors({ 
            email: "", 
            password: "",
            general: "تم الغاء التفعيل لحسابك من طرف الادارة.يمكنك التواصل "
          });
          return;
        }

        // Gérer les autres erreurs
        const errorMessage = getErrorMessage(errorType, errorDetail);
        
        if (errorType === "bad_email_or_password" || errorType === "inactive_account") {
          setErrors({ email: "", password: errorMessage, general: "" });
        } else {
          setErrors({ email: "", password: "", general: errorMessage });
        }

      } else if (error.request) {
        setErrors({ 
          email: "", 
          password: "", 
          general: ERROR_MESSAGES.connection_error 
        });
      } else {
        setErrors({ 
          email: "", 
          password: "", 
          general: ERROR_MESSAGES.request_error 
        });
      }
    } finally {
      setIsLogging(false);
    }
  };

  // Modifier le lien vers signup pour inclure la redirection
 const getSignupLink = () => {
  
 
  if (redirectPath) {
    console.log(redirectPath)
    return redirectPath;
  }

  // Vérifier le rôle dans localStorage
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const { role } = JSON.parse(userData);
      
      if (role === "dropshipper") {
        console.log("dropshipper")
return "/SignupDropshipper";
      }
      if (role === "client"){
 console.log("dropshipper")
        return "/registerclient";
      }
       
      
      if (role === "couturiere") {
console.log("dropshipper")
        return "/registerclient";
      }
        
      if (role === "affiliate"){
console.log("dropshipper")
        return null;
      }

      if (role === "admin"){
console.log("admin")
        return null;
      }


        
      
    } catch (error) {
      console.error("Erreur parsing userData:", error);
    }
  }

  return null; // fallback par défaut
};

  

  return (
    <div className="login-container">
      {/* Logo centré avec espace en dessous */}
      <div className="login-logo">
        <img src={logo} alt="Logo" />
      </div>
      
      {/* White Card avec titre et icône à l'intérieur */}
      <div className="login-card">
        <div className="login-card-content">
          {/* Header avec bouton de retour et titre à l'intérieur de la carte */}
          <div className="login-header">
            <ArrowLeft 
              className="login-back-button" 
              onClick={() => navigate(-1)}
            />
            <h2 className="login-title">تسجيل الدخول</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {/* Message d'erreur général */}
            {errors.general && (
              <div className="login-error-general">
                <p className="login-error-text">{errors.general}</p>
              </div>
            )}

            <div className="login-input-group">
              <InputField
                label="البريد الإلكتروني:"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={(val) => handleInputChange("email", val)}
                error={errors.email}
              />
              <PasswordField
                label="كلمة المرور:"
                placeholder="ادخل كلمة المرور"
                value={formData.password}
                show={showPassword}
                toggleShow={() => setShowPassword((prev) => !prev)}
                onChange={(val) => handleInputChange("password", val)}
                error={errors.password}
              />
            </div>
 {getSignupLink() !== null && (
            <div className="login-forgot-password">
              <span className="login-forgot-link">
                <Link to="/forgot-password">
                  نسيت كلمة المرور؟ 
                </Link>
              </span>
            </div>
 )}
            <button
              type="submit"
              disabled={!isFormValid() || isLogging}
              className="login-submit-button"
            >
              {isLogging ? "جاري الدخول..." : "دخول"}
            </button>

{getSignupLink() !== null && (
  <p className="login-signup-text">
    {(() => {
      const signupLink = getSignupLink();
      if (signupLink === "/registerclient") {
        return "ليس لديك حساب زبون؟ ";
      } else if (signupLink === "/SignupDropshipper") {
        return "ليس لديك حساب دروبشيبر؟ ";
      } else if (signupLink === "/signup") {
        return "ليس لديك حساب خياطة؟ ";
      } else {
        return "ليس لديك حساب؟ ";
      }
    })()}
    <span className="login-signup-link">
      <Link to={getSignupLink()}>
        أنشئ حسابك الآن
      </Link>
    </span>
  </p>
)}
          </form>
        </div>
      </div>
    </div>
  );
}