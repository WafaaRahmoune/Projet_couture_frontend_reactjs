import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import "../../style/authenticationStyle/TermsAndPolicy.css";
import logo from "../../assets/logobleu.png";

export default function TermsAndPolicyDropshipper() {
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
            <h2 className="terms-policy-title">شروط الاستخدام وسياسة الخصوصية للدروب شيبينغ</h2>
          </div>
          
          <div className="terms-policy-content">
            <div className="terms-policy-section">
              <h3>1. النشاط المستمر في المتجر</h3>
              <p>
                يجب أن تبقى نشطًا في المتجر باستمرار. في حالة عدم النشاط لفترة طويلة، يحق للإدارة تعطيل حسابك تلقائيًا. يمكنك التواصل مع الإدارة لإعادة تفعيل الحساب إذا كان لديك أسباب مقنعة لفترة عدم النشاط.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>2. الحد الأدنى للكميات المطلوبة</h3>
              <p>
                بصفتك دروب شيبير، يجب عليك الالتزام بحد أدنى معين لكميات القطع المطلوبة شهريًا/ربع سنويًا. وذلك لأن أسعار الدروب شيبينغ تشمل خصومات كبيرة وتكون أقل بكثير من الأسعار العادية للعملاء.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>3. دقة المعلومات</h3>
              <p>
                يلتزم الدروب شيبير بإدخال معلومات صحيحة وكاملة عند التسجيل. نحن نحتفظ بالحق في تعليق أو إنهاء الحساب في حالة اكتشاف أي معلومات غير صحيحة.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>4. الالتزام بسياسات البيع</h3>
              <p>
                يجب الالتزام بسياسات البيع والتسعير المحددة من قبل الإدارة. لا يحق لك بيع المنتجات بأسعار مختلفة عن تلك المحددة في النظام.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>5. التعامل مع العملاء</h3>
              <p>
                أنت المسؤول المباشر عن التعامل مع عملائك وخدمة ما بعد البيع. يجب الالتزام بمعايير الجودة في خدمة العملاء والمحافظة على سمعة المتجر.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>6. الأمان والاختراق</h3>
              <p>
                يلتزم الدروب شيبير بعدم محاولة اختراق أو التلاعب بالمنصة أو أنظمتها الأمنية. أي محاولة اختراق ستؤدي إلى إنهاء فوري للحساب واتخاذ الإجراءات القانونية اللازمة.
              </p>
            </div>
            
            <div className="terms-policy-section">
              <h3>7. السرية والخصوصية</h3>
              <p>
                يجب الحفاظ على سرية معلومات الأسعار والخصومات الممنوحة للدروب شيبيرز وعدم مشاركتها مع أي أطراف خارجية.
              </p>
            </div>
            
           
            
            <div className="terms-policy-section">
              <h3>8. مراجعة الأداء</h3>
              <p>
                تحتفظ الإدارة بالحق في مراجعة أداء الدروب شيبير بشكل دوري واتخاذ الإجراءات المناسبة بناءً على مؤشرات الأداء والمبيعات.
              </p>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}