// import { useEffect } from "react"
// import { CheckCircle, ArrowLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {Link ,useNavigate} from "react-router-dom"
// import { fromJSON } from "postcss"      

// export default function RegistrationSuccess() {
// useEffect(() => {
//     document.body.style.overflow = "hidden"
//     return () => {
//     document.body.style.overflow = "auto"
//     }
// }, [])

// const handleBackToHome = () => {
//     console.log("Navigate to home")
// }

// return (
//     <div className="fixed inset-0 bg-[#F4F3EF] flex flex-col items-center justify-start px-4 pt-8 pb-4">
//     {/* Header */}
//     <div className="relative w-full max-w-md flex justify-center items-center mb-4">
//         <h2 className="text-[#E5B62B] text-2xl text-center amiri-bold">شكراً لتسجيلك!</h2>
//         <ArrowLeft
//         className="absolute left-4 text-[#374151] w-5 h-5 cursor-pointer"
//         onClick={handleBackToHome}
//         />
//         <div className="fixed top-4 right-0 z-50">
//         <img
//             src="/logo.png"
//             alt="Logo"
//             className="w-[8rem] max-w-full h-auto object-contain"
//         />
//         </div>
//     </div>

//     {/* Content Card */}
//     <div className="bg-white rounded-t-3xl rounded-b-2xl shadow-md w-full max-w-xl h-[70vh] flex flex-col overflow-hidden">
//         <div className="overflow-y-auto px-6 py-6 flex-1 flex flex-col items-center justify-center space-y-8 text-center" dir="rtl">
//         {/* Success Icon */}
//         <CheckCircle className="h-16 w-16 text-[#10B981]" />

//         {/* Message */}
//         <p className="text-lg leading-relaxed text-[#374151] font-[Cairo] font-medium text-center">
//             تم استلام مستنداتك بنجاح، وهي قيد المراجعة من قبل الإدارة.
//             <br />
//             ستتلقى إشعاراً عبر البريد الإلكتروني أو سيتم التواصل معك عبر الهاتف قريباً.
//         </p>
        
        

//         {/* Back to Home Button */}
//         <Button
//             onClick={handleBackToHome}
//             className="w-full h-12 rounded-full text-white font-medium"
//             style={{ backgroundColor: "#E5B62B" }}
//         >
//             <Link to="/">
//             العودة إلى الرئيسية 
//             </Link>
//         </Button>
//         </div>
//     </div>
//     </div>
// )
// }
import { useEffect } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link,useNavigate, useLocation } from "react-router-dom";

export default function RegistrationSuccess() {
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

  const getRoleText = () => {
    switch(role) {
      case "couturiere": return "خياطة";
      case "dropshipper": return "موزع";
      default: return "مستخدم";
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F4F3EF] flex flex-col items-center justify-start px-4 pt-8 pb-4">
      {/* Header */}
      <div className="relative w-full max-w-md flex justify-center items-center mb-4">
        <h2 className="text-[#E5B62B] text-2xl text-center amiri-bold">شكراً لتسجيلك!</h2>
        <ArrowLeft
          className="absolute left-4 text-[#374151] w-5 h-5 cursor-pointer"
          onClick={handleBackToHome}
        />
        <div className="fixed top-4 right-0 z-50">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[8rem] max-w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-t-3xl rounded-b-2xl shadow-md w-full max-w-xl h-[70vh] flex flex-col overflow-hidden">
        <div className="overflow-y-auto px-6 py-6 flex-1 flex flex-col items-center justify-center space-y-8 text-center" dir="rtl">
          <CheckCircle className="h-16 w-16 text-[#10B981] animate-pulse" />

          <div className="space-y-4">
            <p className="text-lg font-[Cairo] font-medium">
              {message || `حسابك ك${getRoleText()} قيد المراجعة`}
            </p>
            <p className="text-[#374151]">
              تم استلام مستنداتك بنجاح، وهي قيد المراجعة من قبل الإدارة.
            </p>
            {email && (
              <p className="text-sm text-gray-600">
                سيصلك التأكيد على: <span className="font-bold">{email}</span>
              </p>
                           
            )}
             <p className="text-sm text-gray-600">
                           أو على رقم هاتفك
                          </p>
          </div>

          <Button
            onClick={handleBackToHome}
            className="w-full h-12 rounded-full text-white font-medium hover:bg-[#d4a41e]"
            style={{ backgroundColor: "#E5B62B" }}
          >
            <Link  to="/">
            العودة إلى الرئيسية
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}