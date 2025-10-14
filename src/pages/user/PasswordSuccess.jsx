import { useEffect } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";

export default function PasswordSuccess() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
              onClick={handleBackToLogin}
            />
            <h2 className="login-title">تم حفظ كلمة المرور بنجاح</h2>
          </div>
          
          <div className="login-form">
            <div className="login-input-group flex flex-col items-center justify-center space-y-8 text-center">
              {/* Success Icon */}
              <CheckCircle className="h-16 w-16 text-[#10B981]" />

              {/* Message */}
              <p className="text-lg leading-relaxed text-[#374151] font-[Cairo] font-medium">
                يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
              </p>

              {/* Back to Login Button */}
              <Button
                onClick={handleBackToLogin}
                className="login-submit-button w-full"
                style={{ backgroundColor: "#E5B62B" }}
              >
                العودة إلى تسجيل الدخول
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
