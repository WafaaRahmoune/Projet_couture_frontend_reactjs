import { useEffect } from "react";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function RefuseDropshipperPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {  rejectionReasons } = location.state || {};

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
            <h2 className="login-title">طلب التسجيل مرفوض</h2>
          </div>
          
          <div className="login-success-content" dir="rtl">
            {/* Error Icon */}
            <div className="flex justify-center w-full mb-6">
              <XCircle className="h-16 w-16 text-[#EF4444]" />
            </div>

            {/* Message */}
            <div className="space-y-4 text-center">
              <p className="text-lg font-[Cairo] font-medium">
                نأسف، لم يتم قبول طلب تسجيلك كدروبشيبر
              </p>
              <p className="text-[#374151]">
                بعد مراجعة طلبك، قرر المسؤول رفض التسجيل لأحد الأسباب التالية:
              </p>
              
              {/* Rejection Reasons */}
              <ul className="text-[#374151] text-center  list-inside list-disc pr-5 space-y-2">
                {rejectionReasons && rejectionReasons.length > 0 ? (
                  rejectionReasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))
                ) : (
                  <>
                    <li>الرابط المقدم للمتجر غير صالح أو غير فعال</li>
                    <li>عدم توافق نشاطك التجاري مع شروط منصتنا</li>
                  </>
                )}
              </ul>
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