import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PasswordField } from "@/components/ui/Passwordfield";
import { Button } from "@/components/ui/Button";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { email, reset_token } = location.state || {};

  const handleBack = () => {
    navigate("/verification", { state: { email, reset_token } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = "";

    // Validation du mot de passe
    if (password.trim() === "") {
      error = "كلمة المرور مطلوبة";
    } else if (password.length < 8) {
      error = "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل";
    } else if (/[\u0600-\u06FF]/.test(password)) {
      error = "كلمة المرور يجب أن تكون بالأحرف اللاتينية فقط";
    } else if (!/(?=.*[a-z])/.test(password)) {
      error = "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      error = "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل";
    } else if (!/(?=.*\d)/.test(password)) {
      error = "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل";
    } else if (!/(?=.*[@$!%*?&])/.test(password)) {
      error = "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل (@$!%*?&)";
    } else if (email && password.toLowerCase() === email.toLowerCase()) {
      error = "كلمة المرور لا يجب أن تكون نفس البريد الإلكتروني";
    } else if (password.trim() !== confirmPassword.trim()) {
      error = "كلمتا المرور غير متطابقتين";
    }

    // Affichage des erreurs
    if (error) {
      setError(error);
      console.log("Password:", JSON.stringify(password));
      console.log("Confirm Password:", JSON.stringify(confirmPassword));
      console.log("Comparison:", password.trim() === confirmPassword.trim());
      return;
    }

    try {
      await axios.post("https://api.kadi-inv.store/api/reset-password/", {
        reset_token,
        new_password: password.trim(),
      });

      // Rediriger vers la page de succès après 2 secondes
      setTimeout(() => {
        navigate("/password-success");
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.detail ||
        "حدث خطأ أثناء إعادة تعيين كلمة المرور";
      
      setError(errorMessage);

      // Si l'erreur concerne un lien expiré, on l'affiche avec un lien
      if(errorMessage.includes("انتهت صلاحية الرابط") || errorMessage.includes('رمز التحقق غير صالح.')) {
        setError(
          <span>
            {errorMessage}{" "}
            <Link 
              to="/forgot-password" 
              className="text-[#4A66BD] underline hover:text-[#d4a729]"
            >
              انقر هنا لإعادة المحاولة
            </Link>
          </span>
        );
      }
      console.error("API Error:", err.response);
    }
  };

  return (
    <div className="login-container">
      {/* Logo centré avec espace en dessous */}
      <div className="login-logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      
      {/* White Card avec titre et icône à l'intérieur */}
      <div className="login-card">
        <div className="login-card-content">
          {/* Header avec bouton de retour et titre à l'intérieur de la carte */}
          <div className="login-header">
            <ArrowLeft 
              className="login-back-button" 
              onClick={handleBack}
            />
            <h2 className="login-title">إعادة تعيين كلمة المرور</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {/* Message d'erreur général */}
            {error && (
              <div className="login-error-general">
                <p className="login-error-text">{error}</p>
              </div>
            )}

            <div className="login-input-group">
              {/* Instruction */}
              <p className="text-base text-[#374151] font-[Cairo] text-center mb-6">
                الرجاء إدخال كلمة مرور جديدة لحسابك.
              </p>

              {/* Password Field */}
              <PasswordField
                label="كلمة المرور:"
                placeholder="أدخل كلمة المرور"
                value={password}
                show={showPassword}
                toggleShow={() => setShowPassword((prev) => !prev)}
                onChange={(val) => setPassword(val)}
                error={error && typeof error === 'string' && error.includes("كلمة المرور") ? error : ""}
              />

              {/* Confirm Password Field */}
              <PasswordField
                label="تأكيد كلمة المرور:"
                placeholder="أدخل كلمة المرور لتأكيدها"
                value={confirmPassword}
                show={showConfirmPassword}
                toggleShow={() => setShowConfirmPassword((prev) => !prev)}
                onChange={(val) => setConfirmPassword(val)}
                error={error && typeof error === 'string' && error.includes("تأكيد") ? error : ""}
              />
            </div>

            <Button
              type="submit"
              className="login-submit-button w-full"
              style={{ backgroundColor: "#E5B62B" }}
              disabled={!password || !confirmPassword}
            >
              حفظ
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
