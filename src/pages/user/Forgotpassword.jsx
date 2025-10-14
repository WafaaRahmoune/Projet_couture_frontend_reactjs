import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logobleu.png";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    const processedValue = field === "email" ? value.toLowerCase() : value;
 setFormData((prev) => ({ ...prev, [field]: processedValue }));
  if (errors[field]) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }
    
    
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const isFormValid = () => {
    const email = formData.email.trim().toLowerCase();
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasArabicChars = /[\u0600-\u06FF]/.test(email);

    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    } else if (hasArabicChars) {
      newErrors.email = "البريد الإلكتروني يجب أن يكون بالأحرف اللاتينية فقط";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!isFormValid()) return;

  setIsSending(true);
  try {
    const res = await axios.post("https://api.kadi-inv.store/api/forgot-password/", {
      email: formData.email,
    });

    navigate("/verification", {
      state: {
        email: formData.email,
        token: res.data.token,
      },
    });
  } catch (err) {
    const detail = err.response?.data?.detail;
    let errorMessage = "حدث خطأ أثناء إرسال الرمز";

    if (typeof detail === "string") {
      errorMessage = detail;
    } else if (Array.isArray(detail) && typeof detail[0] === "string") {
      errorMessage = detail[0];
    } else if (typeof detail === "object" && detail !== null && "string" in detail) {
      errorMessage = detail.string;
    } else if (err.response?.data?.detail) {
      errorMessage = err.response.data.detail;
    }

    // Toujours setter l'erreur comme un objet avec la clé "email"
    setErrors({ email: errorMessage });
  } finally {
    setIsSending(false);
  }
};


  const handleBackToLogin = () => {
    navigate("/login");
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
              onClick={handleBackToLogin}
            />
            <h2 className="login-title">نسيت كلمة المرور؟</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <p className="login-description">
              أدخل بريدك الإلكتروني وسنرسل لك رمزًا لإعادة تعيين كلمة المرور.
            </p>

            <div className="login-input-group">
              <InputField
                label="البريد الإلكتروني:"
                type="text" // Important: avoid native HTML validation
                placeholder="example@gmail.com"
                value={formData.email.trim().toLowerCase()}
                onChange={(val) => handleInputChange("email", val.toLowerCase())}
                error={errors.email}
              />
            </div>

            <button
              type="submit"
              disabled={!formData.email.trim().toLowerCase() || isSending}
              className="login-submit-button"
            >
              {isSending ? "جارٍ الإرسال..." : "إرسال الرمز"}
            </button>

            <div className="login-forgot-password">
              <span className="login-forgot-link">
                <Link to="/login">
                  العودة إلى تسجيل الدخول
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
