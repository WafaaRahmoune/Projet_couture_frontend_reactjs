import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import "../../style/authenticationStyle/TermsAndPolicy.css";
import logo from "../../assets/logobleu.png";

export default function TermsAndPolicy() {
  const navigate = useNavigate();

  return (
    <div className="terms-policy-container">
      <div className="terms-policy-logo">
        <img src={logo} alt="Logo" />
      </div>
      
      <div className="terms-policy-card">
        <div className="terms-policy-card-content">
          <div className="terms-policy-back-container">
            <ArrowLeft className="terms-policy-back-button" onClick={() => navigate(-1)} />
          </div>
          
          <div className="terms-policy-header">
            <h2 className="terms-policy-title">شروط الاستخدام وسياسة الخصوصية</h2>
          </div>
          
          <div className="terms-policy-content">
            <div className="terms-policy-section">
              <h3>1. دقة المعلومات</h3>
              <p>
                يلتزم العميل بإدخال معلومات صحيحة وكاملة عند التسجيل. نحن نحتفظ بالحق في تعليق أو إنهاء الحساب في حالة اكتشاف أي معلومات غير صحيحة.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>2. استخدام المعلومات</h3>
              <p>
                نستخدم معلوماتك لتقديم وتحسين خدماتنا، وللاتصال بك، ولأغراض الأمان والامتثال للقوانين المعمول بها. نحن لا نبيع بياناتك الشخصية لأطراف ثالثة.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>3. الأمان والاختراق</h3>
              <p>
                يلتزم العميل بعدم محاولة اختراق أو التلاعب بالمنصة أو أنظمتها الأمنية. أي محاولة اختراق ستؤدي إلى إنهاء فوري للحساب واتخاذ الإجراءات القانونية اللازمة.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>4. حماية البيانات</h3>
              <p>
                نحن نطبق إجراءات أمنية تقنية وإدارية معقولة لحماية معلوماتك من الوصول غير المصرح به أو الاستخدام أو الكشف. ومع ذلك، لا يمكن ضمان الأمان المطلق لأي بيانات عبر الإنترنت.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>5. الاتصالات والإشعارات</h3>
              <p>
                يوافق العميل على استلام إشعارات أو رسائل بريد إلكتروني متعلقة بالخدمات، بما في ذلك التحديثات والعروض الترويجية والإعلانات الهامة المتعلقة بالحساب.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>6. حقوق المستخدم</h3>
              <p>
                يمكن للعميل طلب تعديل أو حذف بياناته الشخصية في أي وقت عن طريق الاتصال بنا عبر البريد الإلكتروني أو من خلال إعدادات الحساب، مع مراعاة أن بعض البيانات قد نحتفظ بها لأغراض قانونية.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>7. القبول والمتابعة</h3>
              <p>
                استمرار استخدام المنصة يعني الموافقة الكاملة على سياسة الخصوصية وشروط الاستخدام. نحن نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إشعار المستخدمين بالتغييرات الهامة.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>8. الأسعار والعروض</h3>
              <p>
                الأسعار والعروض المعروضة في المنصة قد تتغير في أي وقت دون إشعار مسبق. نحن نحتفظ بالحق في تعديل أو إيقاف أي خدمة أو عرض في أي وقت.
              </p>
            </div>
            
           
          </div>
        </div>
      </div>
    </div>
  );
}