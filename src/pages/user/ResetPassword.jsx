import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Ajout de Link
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


// Rediriger vers la page de succès après 3 secondes
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
    <div className="fixed inset-0 bg-[#F4F3EF] flex flex-col items-center justify-start px-4 pt-8 pb-4">
      {/* Header */}
      <div className="relative w-full max-w-md flex justify-center items-center mb-4">
        <h2 className="text-[#E5B62B] text-2xl text-center amiri-bold">
          إعادة تعيين كلمة المرور
        </h2>
        <ArrowLeft
          className="absolute left-4 text-[#374151] w-5 h-5 cursor-pointer"
          onClick={handleBack}
        />
        <div className="fixed top-4 right-0 z-50">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-[8rem] max-w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-t-3xl rounded-b-2xl shadow-md w-full max-w-xl h-[75vh] flex flex-col overflow-hidden">
        <div className="overflow-y-auto px-6 py-6 flex-1" dir="rtl">
          <form onSubmit={handleSubmit} className="space-y-6 text-right font-[Cairo]">
            {/* Instruction */}
            <p className="text-base text-[#374151] text-center">
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

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            {/* Save Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-full text-white font-medium mt-4"
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
