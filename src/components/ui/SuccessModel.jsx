import { useNavigate } from "react-router-dom";
import okImage from "@/assets/model/ok.png";

export default function SuccessModal({ show, onClose }) {
  const navigate = useNavigate();

  if (!show) return null;

  const handleOk = () => {
    onClose();              // ferme le modal
    navigate("/MesModels"); // redirige vers MesModels
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50  border-2 ">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] text-center animate-fade-in border-4  border-[#DDDDC6]">
        <div className="flex justify-center mb-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-full shadow">
        <img src={okImage} alt="loading" className="w-40 h-auto"/>
        </div>
          
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-3">
          تم إرسال النموذج بنجاح إلى الإدارة للمراجعة
        </h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          يرجى متابعة حالته من خلال لوحة التحكم.
          <br />
          في حالة القبول سيتم التواصل معك عبر الواتس اب.
        </p>
        <button
          onClick={handleOk}
          className="bg-[#22C55E] hover:bg-green-700 text-white px-6 py-2 shadow 
                    min-w-[100px]  rounded-full  text-base"
        >
                      
          حسنا
        </button>
      </div>
    </div>
  );
}
