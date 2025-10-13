import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerificationCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const token = location.state?.token;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleCodeChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      const newCode = paste.split("");
      setCode(newCode);
      setTimeout(() => document.getElementById("code-5")?.focus(), 0);
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = code.join("");

    try {
      const res = await axios.post("https://api.kadi-inv.store/api/verify-otp/", {
        token,
        otp,
      });

      navigate("/reset-password", {
        state: {
          email: res.data.email,
          reset_token: res.data.reset_token
        },
      });
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else if (Array.isArray(detail) && typeof detail[0] === "string") {
        setErrorMessage(detail[0]);
      } else if (typeof detail === "object" && detail !== null && "string" in detail) {
        setErrorMessage(detail.string);
      } else {
        setErrorMessage("رمز التحقق غير صحيح أو منتهي الصلاحية");
      }
    }
  };

  const handleResend = () => {
    setTimeLeft(600); // 10 minutes
    setCanResend(false);
    setCode(["", "", "", "", "", ""]);
    // Tu peux appeler l'API ici si nécessaire
  };

  const handleBack = () => {
    navigate("/forgot-password");
  };

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
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
            <h2 className="login-title">تأكيد الرمز</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {/* Message d'erreur général */}
            {errorMessage && (
              <div className="login-error-general">
                <p className="login-error-text">{errorMessage}</p>
              </div>
            )}

            <div className="login-input-group">
              <p className="text-base text-[#374151] font-[Cairo] text-center mb-6">
                لقد تم إرسال الرمز، يرجى إدخاله أدناه.
              </p>

              <div
                className="flex justify-center gap-3 mb-4"
                onPaste={handlePaste}
                dir="ltr"
              >
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold rounded-lg border-2 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: digit ? "#E5B62B" : "#DADAD7",
                      backgroundColor: "#F9F9F9",
                      color: "#374151",
                    }}
                  />
                ))}
              </div>

              <p className="text-sm text-[#374151] font-[Cairo] text-center mb-6">
                ينتهي الرمز خلال: {formatTime(timeLeft)}
              </p>
            </div>

            <Button
              type="submit"
              className="login-submit-button w-full"
              style={{ backgroundColor: "#E5B62B" }}
              disabled={code.some((digit) => !digit)}
            >
              تأكيد الرمز
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={`text-base underline transition-all font-[Cairo] ${
                  canResend
                    ? "text-[#3B82F6] cursor-pointer"
                    : "opacity-50 cursor-not-allowed text-[#3B82F6]"
                }`}
              >
                لم يصلك الرمز؟ أعد الإرسال
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
