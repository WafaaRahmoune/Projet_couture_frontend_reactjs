import { useState, useEffect } from "react";
import { InputField } from "@/components/ui/inputField";
import { PasswordField } from "@/components/ui/passwordfield";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/authenticationStyle/LoginClient.css";
import logo from "../../assets/logobleu.png";

export default function LoginAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLogging, setIsLogging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const isFormValid = () => {
    return formData.email.trim() !== "" && formData.password.trim() !== "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setErrors({ email: "البريد مطلوب", password: "كلمة المرور مطلوبة" });
      return;
    }

    setIsLogging(true);
    setErrors({ email: "", password: "" });

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", formData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const userRole = response.data.user.role;
      if (userRole==="admin"){
        localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
        navigate("/admin/dashboard")
      }else {
        navigate("/");
      }
     

    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        const data = error.response.data;
        const errorType = Array.isArray(data.error_type) ? data.error_type[0] : null;

        // Gestion unifiée des comptes en attente
        if (errorType === "couturiere_pending" || errorType === "dropshipper_pending") {
          const role = errorType.split('_')[0]; // "couturiere" ou "dropshipper"
          navigate("/registration-success", {
            state: {
              email: formData.email,
              role: role,
              message: `حسابك ك${role === "couturiere" ? "خياطة" : "موزع"} قيد المراجعة`
            }
          });
          return;
        }

        // Gestion des autres erreurs
        const errorDetail = Array.isArray(data.detail) ? data.detail[0] : "حدث خطأ غير متوقع.";
        switch (errorType) {
          case "inactive_account":
            setErrors({ email: "", password: "يرجى التحقق من بريدك الإلكتروني." });
            break;
          case "account_disabled":
            setErrors({ email: "", password: "تم تعطيل حسابك من قبل الإدارة..." });
            break;
          case "bad_email_or_password":
            setErrors({ email: "", password: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
            break;
          default:
            setErrors({ email: "", password: errorDetail });
        }
      } else {
        setErrors({ 
          email: "", 
          password: error.request 
            ? "خطأ في الاتصال بالخادم - تحقق من الاتصال" 
            : "خطأ في إعداد الطلب" 
        });
      }
    } finally {
      setIsLogging(false);
    }
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
            
            <h2 className="login-title">تسجيل الدخول</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
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
           
            <button
              type="submit"
              disabled={!isFormValid() || isLogging}
              className="login-submit-button"
            >
              {isLogging ? "جاري الدخول..." : "دخول"}
            </button>
           
          </form>
        </div>
      </div>
    </div>
  );
}