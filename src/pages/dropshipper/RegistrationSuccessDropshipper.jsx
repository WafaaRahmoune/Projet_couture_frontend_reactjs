import { useEffect } from "react";
import { CheckCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function RegistrationSuccessDropshipper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, role, message } = location.state || {};

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleBackToHome = () => {
    navigate("/");
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
           
            <h2 className="login-title">شكراً لتسجيلك!</h2>
          </div>
          
          <div className="login-success-content" dir="rtl">
            {/* Success Icon */}
                         <div className="flex justify-center w-full mb-6">
              <CheckCircle className="h-16 w-16 text-[#10B981]" />
            </div>


            {/* Message */}
            <div className="space-y-4 text-center">
              <p className="text-lg font-[Cairo] font-medium">
                {message || `حسابك كدروبشيبر قيد المراجعة`}
              </p>
              <p className="text-[#374151]">
تم استلام معلوماتك بنجاح و هي قيد المراجعة من قبل الادارة .بمجرد معالجتها سيتم التواصل معك عبر الهاتف أو البريد الالكتروني .                 <br />
               
                 
              </p>
            </div>

            {/* Back to Home Button */}
            <Button
              onClick={handleBackToHome}
              className="w-full h-12 rounded-full text-white font-medium mt-8"
              style={{ backgroundColor: "#E5B62B" }}
            >
              <Link to="/">
                العودة إلى الرئيسية
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}