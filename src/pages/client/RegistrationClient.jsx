import { useState, useEffect } from "react";
import { ArrowLeft } from 'lucide-react';
import { InputField } from "@/components/ui/inputField";
import { PasswordField } from "@/components/ui/passwordfield";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/authenticationStyle/RegistrationClient.css";
import logo from "../../assets/logobleu.png";

export default function RegistrationClient() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [lastResendTime, setLastResendTime] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const checkEmailExists = async (email) => {
    if (!email) {
      setEmailExists(false);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailExists(false);
      return false;
    }

    setEmailChecking(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/checkIfEmailExist/${encodeURIComponent(email)}`
      );
      
      console.log("Réponse API vérification email:", response.data);
      
      setEmailExists(response.data.exists);
      
      // Mettre à jour les erreurs
      if (response.data.exists) {
        setErrors(prev => ({
          ...prev,
          email: "البريد الإلكتروني موجود مسبقاً"
        }));
      } else {
        // Supprimer l'erreur d'email existant si elle était présente
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
      
      return response.data.exists;
    } catch (error) {
      console.error("Erreur de vérification d'email:", error);
      setEmailExists(false);
      return false;
    } finally {
      setEmailChecking(false);
    }
  };

  const validateFieldSync = (field, value, currentFormData) => {
    let error = null;
    switch (field) {
      case "fullName":
        const arabicRegex = /^[\u0600-\u06FF\s]+$/;
        if (!value.trim()) {
          error = "الاسم الكامل مطلوب";
        } else if (!arabicRegex.test(value)) {
          error = "الاسم يجب أن يكون باللغة العربية فقط";
        } else if (value.trim().length < 2) {
          error = "الاسم يجب أن يكون أكثر من حرفين";
        }
        break;
      case "email":
        const hasArabicChars = /[\u0600-\u06FF]/.test(value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          error = "البريد الإلكتروني مطلوب";
        } else if (!emailRegex.test(value)) {
          error = "البريد الإلكتروني غير صحيح";
        } else if (hasArabicChars) {
          error = "البريد الإلكتروني يجب أن يكون بالأحرف اللاتينية فقط";
        }
        break;
      case "password":
        const hasArabicCharsPassword = /[\u0600-\u06FF]/.test(value);
        if (!value) {
          error = "كلمة المرور مطلوبة";
        } else if (hasArabicCharsPassword) {
          error = "كلمة المرور يجب أن تكون بالأحرف اللاتينية فقط";
        } else if (value.length < 8) {
          error = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
          error = "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز";
        } else if (value.trim().toLowerCase() === currentFormData.email.trim().toLowerCase()) {
          error = "كلمة المرور لا يجب أن تكون نفس البريد الإلكتروني";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "تأكيد كلمة المرور مطلوب";
        } else if (value !== currentFormData.password) {
          error = "كلمات المرور غير متطابقة";
        }
        break;
    }
    return error;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
      let newErrors = { ...errors };

      // Si l'email change, réinitialiser la vérification
      if (field === "email") {
        setEmailExists(false);
        // Supprimer l'erreur d'email existant si elle était présente
        if (newErrors.email === "البريد الإلكتروني موجود مسبقاً") {
          delete newErrors.email;
        }
      }

      const fieldError = validateFieldSync(field, value, newFormData);
      if (fieldError) {
        newErrors[field] = fieldError;
      } else {
        delete newErrors[field];
      }

      if (field === "password" || field === "confirmPassword") {
        const passwordError = validateFieldSync("password", newFormData.password, newFormData);
        if (passwordError) {
          newErrors.password = passwordError;
        } else {
          delete newErrors.password;
        }

        const confirmPasswordError = validateFieldSync("confirmPassword", newFormData.confirmPassword, newFormData);
        if (confirmPasswordError) {
          newErrors.confirmPassword = confirmPasswordError;
        } else {
          delete newErrors.confirmPassword;
        }
      }

      setErrors(newErrors);
      return newFormData;
    });
  };

  // Fonction utilitaire pour vérifier si une erreur existe
  const hasError = (error) => {
    if (!error) return false;
    if (typeof error === 'string') return error.trim() !== "";
    if (Array.isArray(error)) return error.length > 0;
    if (typeof error === 'object') return Object.keys(error).length > 0;
    return false;
  };

  const isFormValid = () => {
    const requiredFields = ["fullName", "email", "password", "confirmPassword"];
    const allFieldsFilled = requiredFields.every((field) => formData[field].trim() !== "");
    const hasActiveErrors = Object.values(errors).some(hasError);
    const termsAccepted = acceptTerms;
    const emailAvailable = !emailExists;

    return allFieldsFilled && termsAccepted && !hasActiveErrors && !isSubmitting && emailAvailable;
  };

  const handleResendVerification = async () => {
    if (!formData.email || !formData.email.trim()) {
      setResendError("البريد الإلكتروني مطلوب لإعادة الإرسال");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setResendError("البريد الإلكتروني غير صحيح");
      return;
    }
    
    const now = new Date().getTime();
    if (lastResendTime && now - lastResendTime < 60000) {
      const remainingTime = Math.ceil((60000 - (now - lastResendTime)) / 1000);
      setResendError(`يرجى الانتظار ${remainingTime} ثانية قبل إعادة الإرسال`);
      return;
    }
    
    if (resendCount >= 3) {
      setResendError("تم تجاوز الحد الأقصى لعدد المحاولات. يرجى المحاولة لاحقاً");
      return;
    }
    
    setIsResending(true);
    setResendError("");
    setResendSuccess("");
    
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/resend-verification/",
        {
          email: formData.email.trim().toLowerCase(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 30000,
        }
      );
      
      setResendSuccess("تم إرسال رابط التحقق مرة أخرى بنجاح!");
      setResendCount((prev) => prev + 1);
      setLastResendTime(new Date().getTime());
      
      setTimeout(() => {
        setResendSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Erreur de renvoi:", error);
      if (error.code === "ECONNABORTED") {
        setResendError("انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى");
      } else if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            setResendError("البيانات المرسلة غير صحيحة");
            break;
          case 404:
            setResendError("لم يتم العثور على الحساب أو الحساب محقق بالفعل");
            break;
          case 429:
            setResendError("تم إرسال الكثير من الطلبات. يرجى المحاولة بعد دقيقة");
            break;
          case 500:
            setResendError("خطأ في الخادم. يرجى المحاولة لاحقاً");
            break;
          default:
            setResendError(`حدث خطأ (${status}). يرجى المحاولة مرة أخرى`);
        }
      } else if (error.request) {
        setResendError("لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت");
      } else {
        setResendError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    // Vérifier d'abord si l'email existe
    const emailAlreadyExists = await checkEmailExists(formData.email);
    
    if (emailAlreadyExists) {
      setIsSubmitting(false);
      return;
    }

    const fieldsToValidate = ["fullName", "email", "password", "confirmPassword"];
    let currentErrors = {};

    fieldsToValidate.forEach((field) => {
      const error = validateFieldSync(field, formData[field], formData);
      if (error) {
        currentErrors[field] = error;
      }
    });

    if (!acceptTerms) {
      currentErrors.terms = "يجب الموافقة على الشروط والأحكام";
    } else {
      delete currentErrors.terms;
    }

    setErrors(currentErrors);

    const hasErrors = Object.keys(currentErrors).length > 0;

    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/clientapi/signup/",
        {
          email: formData.email,
          full_name: formData.fullName,
          password: formData.password,
          password_confirm: formData.confirmPassword,
          agreed_to_policy: acceptTerms,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSubmitSuccess("تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني");
      setResendCount(0);
      setLastResendTime(null);
      setErrors({});

    } catch (error) {
      console.error("Erreur détaillée:", error);
      if (error.response) {
        console.error("Réponse d'erreur:", error.response.data);
        const { status, data } = error.response;
        switch (status) {
          case 400:
            if (data.email) {
              setErrors((prev) => ({ ...prev, email: Array.isArray(data.email) ? data.email[0] : data.email }));
            } else if (data.password) {
              setErrors((prev) => ({ ...prev, password: Array.isArray(data.password) ? data.password[0] : data.password }));
            } else if (data.agreed_to_policy) {
              setErrors((prev) => ({ ...prev, terms: Array.isArray(data.agreed_to_policy) ? data.agreed_to_policy[0] : data.agreed_to_policy }));
            } else {
              setSubmitError("بيانات غير صحيحة. يرجى المراجعة والمحاولة مرة أخرى");
            }
            break;
          case 500:
            setSubmitError("خطأ في الخادم. يرجى المحاولة لاحقاً");
            break;
          default:
            setSubmitError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
        }
      } else if (error.request) {
        setSubmitError("لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت");
      } else {
        setSubmitError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-logo">
        <img src={logo} alt="Logo" />
      </div>
      
      <div className="registration-card">
        <div className="registration-card-content">
          
          <div className="registration-header">
            <h2 className="registration-title">تسجيل حساب زبون</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="registration-input-group">
              <InputField
                label="الاسم الكامل:"
                placeholder="ادخل الاسم الكامل"
                value={formData.fullName}
                onChange={(val) => handleInputChange("fullName", val)}
                error={errors.fullName}
              />
              
              <InputField
                label="البريد الإلكتروني:"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onBlur={() => checkEmailExists(formData.email)}
                onChange={(val) => handleInputChange("email", val)}
                error={errors.email}
                loading={emailChecking}
              />
              
              <PasswordField
                label="كلمة المرور:"
                placeholder="ادخل كلمة المرور"
                value={formData.password}
                show={showPassword}
                toggleShow={() => setShowPassword((prev) => !prev)}
                onChange={(val) => handleInputChange("password", val)}
                error={errors.password}
              />
              
              <PasswordField
                label="تأكيد كلمة المرور:"
                placeholder="أدخل كلمة المرور لتأكيدها"
                value={formData.confirmPassword}
                show={showConfirmPassword}
                toggleShow={() => setShowConfirm((prev) => !prev)}
                onChange={(val) => handleInputChange("confirmPassword", val)}
                error={errors.confirmPassword}
              />
            </div>

            <div className="registration-terms">
              <Checkbox
                checked={acceptTerms}
                onCheckedChange={(c) => {
                  setAcceptTerms(c);
                  if (c) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.terms;
                      return newErrors;
                    });
                  }
                }}
                className="registration-checkbox"
              />
              <label className="registration-terms-label">
                أوافق على <span className="registration-terms-link">
                  <Link to="/rules">شروط الاستخدام وسياسة الخصوصية</Link>
                </span>
              </label>
            </div>
            
            {errors.terms && <p className="registration-error-text">{errors.terms}</p>}
            
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="registration-submit-button"
            >
              {isSubmitting ? "جاري الإنشاء..." : "إنشاء حساب"}
            </button>
            
            <p className="registration-login-text">
              هل لديك حساب بالفعل؟{" "}
              <span className="registration-login-link">
                <Link to="/login">تسجيل الدخول</Link>
              </span>
            </p>
          </form>

          {submitSuccess && (
            <div className="registration-success-message">
              <p className="registration-success-title">تم إنشاء الحساب بنجاح! تم إرسال رابط التحقق إلى:</p>
              <p className="registration-success-email">{formData.email}</p>
              <p className="registration-success-note">يرجى التحقق من صندوق الوارد وصندوق الرسائل غير المرغوب فيها</p>
              
              <div className="registration-resend-section">
                <p className="registration-resend-text">لم تستلم الرسالة؟</p>
                <div className="registration-resend-actions">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending || resendCount >= 3}
                    className="registration-resend-btn"
                  >
                    {isResending
                      ? "جاري الإرسال..."
                      : resendCount > 0
                        ? `إعادة إرسال رابط التحقق (${resendCount}/3)`
                        : "إعادة إرسال رابط التحقق"}
                  </button>
                  {resendCount >= 3 && (
                    <p className="registration-resend-limit">
                      تم تجاوز الحد الأقصى للمحاولات. يرجى الاتصال بالدعم الفني
                    </p>
                  )}
                </div>
              </div>
              
              {resendSuccess && (
                <div className="registration-resend-success">
                  {resendSuccess}
                </div>
              )}
              
              {resendError && (
                <div className="registration-resend-error">
                  {resendError}
                </div>
              )}
            </div>
          )}
          
          {submitError && (
            <div className="registration-error-message">
              <p className="registration-error-text">{submitError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}