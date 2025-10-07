import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate} from "react-router-dom";

export default function NotActiveCouturiere() {
  const navigate = useNavigate();

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
            <h2 className="login-title">حالة الحساب: غير نشط</h2>
          </div>
          
          <div className="login-success-content" dir="rtl">
            {/* Warning Icon */}
            <div className="flex justify-center w-full mb-6">
              <AlertCircle className="h-16 w-16 text-[#F59E0B]" />
            </div>

            {/* Message */}
            <div className="space-y-4 text-center">
              <p className="text-lg font-[Cairo] font-medium">
                عذراً، حالة حسابك كخياطة غير نشطة حالياً
              </p>
              <p className="text-[#374151]">
                هذا بسبب واحد أو أكثر من الأسباب التالية:
              </p>
              
              {/* Inactivity Reasons */}
              <ul className="text-[#374151] text-right list-inside list-disc  pr-5 space-y-2">
                <li>عدم نشر عدد كافٍ من الموديلات في المنصة</li>
                <li>الموديلات المنشورة غير مكتملة أو تحتاج لتحسين في الجودة</li>
                <li>عدم النشاط الكافي في المنصة للاستمرار كشريكة</li>
              </ul>
              
              <p className="text-[#374151]">
                إذا كنت ترغب في التواصل أو التوضيح، يمكنك الاتصال بالإدارة 
                 
               على الرقم 
                <span className="font-bold"> 0784784814</span>
                <br />
                يمكنك استئناف العمل معنا كخياطة نشطة بعد التواصل مع الإدارة.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3 mt-8">
              <Button
                onClick={handleBackToHome}
                className="w-full h-12 rounded-full text-white font-medium"
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
    </div>
  );
}