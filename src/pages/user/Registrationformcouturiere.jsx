import { useState, useEffect } from "react"
import { ArrowLeft, Eye, EyeOff, X, Upload } from 'lucide-react'
import { InputField } from "@/components/ui/InputField"
import { PasswordField } from "@/components/ui/Passwordfield"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Link, redirect, useNavigate } from "react-router-dom";
import axios from "axios"
import logo from "../../assets/logobleu.png"; // Ajout de l'import du logo

export default function RegistrationCouturiere() {
  const [files, setFiles] = useState([])
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState("")
  const [resendError, setResendError] = useState("")
  const [resendCount, setResendCount] = useState(0)
  const [lastResendTime, setLastResendTime] = useState(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const validateFieldSync = (field, value, currentFormData) => {
    let error = null
    switch (field) {
      case "fullName":
        const arabicRegex = /^[\u0600-\u06FF\s]+$/
        if (!value.trim()) {
          error = "الاسم الكامل مطلوب"
        } else if (!arabicRegex.test(value)) {
          error = "الاسم يجب أن يكون باللغة العربية فقط"
        } else if (value.trim().length < 2) {
          error = "الاسم يجب أن يكون أكثر من حرفين"
        }
        break
      case "email":
        const hasArabicChars = /[\u0600-\u06FF]/.test(value)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          error = "البريد الإلكتروني مطلوب"
        } else if (!emailRegex.test(value)) {
          error = "البريد الإلكتروني غير صحيح"
        } else if (hasArabicChars) {
          error = "البريد الإلكتروني يجب أن يكون بالأحرف اللاتينية فقط"
        }
        break
      case "password":
        const hasArabicCharsPassword = /[\u0600-\u06FF]/.test(value)
        if (!value) {
          error = "كلمة المرور مطلوبة"
        } else if (hasArabicCharsPassword) {
          error = "كلمة المرور يجب أن تكون بالأحرف اللاتينية فقط"
        } else if (value.length < 8) {
          error = "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
          error = "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز"
        } else if (value.trim().toLowerCase() === currentFormData.email.trim().toLowerCase()) {
          error = "كلمة المرور لا يجب أن تكون نفس البريد الإلكتروني"
        }
        break
      case "confirmPassword":
        if (!value) {
          error = "تأكيد كلمة المرور مطلوب"
        } else if (value !== currentFormData.password) {
          error = "كلمات المرور غير متطابقة"
        }
        break
        case "phone":
          const cleaned = value.replace(/\s/g, "");
          const phoneRegex = /^0\d{9}$/;
          const validPrefixRegex = /^0(5|6|7|2|3|4)/;
        
          if (!value) {
            error = "رقم الهاتف مطلوب";
          } else if (!phoneRegex.test(cleaned)) {
            error = "رقم الهاتف يجب أن يحتوي على 10 أرقام";
          } else if (!validPrefixRegex.test(cleaned)) {
            error = "رقم الهاتف يجب أن يبدأ بـ 05 أو 06 أو 07 (أو 02-04 للهاتف الثابت)";
          }
          break;
        
      case "address":
        const arabicRegexAddress = /^[\u0600-\u06FF\s]+$/
        if (!value.trim()) {
          error = "عنوان الإقامة مطلوب"
        } else if (!arabicRegexAddress.test(value)) {
          error = "العنوان يجب أن يكون باللغة العربية فقط"
        } else if (value.trim().length < 10) {
          error = "العنوان يجب أن يكون أكثر تفصيلاً"
        }
        break
    }
    return error
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value }
      let newErrors = { ...errors }

      const fieldError = validateFieldSync(field, value, newFormData)
      if (fieldError) {
        newErrors[field] = fieldError
      } else {
        delete newErrors[field]
      }

      if (field === "password" || field === "confirmPassword") {
        const passwordError = validateFieldSync("password", newFormData.password, newFormData)
        if (passwordError) {
          newErrors.password = passwordError
        } else {
          delete newErrors.password
        }

        const confirmPasswordError = validateFieldSync("confirmPassword", newFormData.confirmPassword, newFormData)
        if (confirmPasswordError) {
          newErrors.confirmPassword = confirmPasswordError
        } else {
          delete newErrors.confirmPassword
        }
      }

      setErrors(newErrors)
      return newFormData
    })
  }

  const validateFiles = (fileList) => {
    const maxSize = 5 * 1024 * 1024
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ]
    for (const file of fileList) {
      if (file.size > maxSize) {
        return `الملف ${file.name} كبير جداً. الحد الأقصى 5 ميجابايت`
      }
      if (!allowedTypes.includes(file.type)) {
        return `نوع الملف ${file.name} غير مدعوم. الأنواع المدعومة: PDF, DOC, DOCX, JPG, PNG`
      }
    }
    return null
  }

  const validateFilesState = (currentFiles) => {
    let fileError = null
    if (currentFiles.length === 0) {
      fileError = "يجب إرفاق ملف واحد على الأقل لإثبات المهارات"
    } else if (currentFiles.length > 5) {
      fileError = "لا يمكنك تحميل أكثر من 5 ملفات."
    } else {
      fileError = validateFiles(currentFiles)
    }
    setErrors((prev) => {
      const newErrors = { ...prev }
      if (fileError) {
        newErrors.files = fileError
      } else {
        delete newErrors.files
      }
      return newErrors
    })
  }

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files)
    setFiles((prev) => {
      const updatedFiles = [...prev, ...selectedFiles]
      validateFilesState(updatedFiles)
      return updatedFiles
    })
    event.target.value = null
  }

  const removeFile = (indexToRemove) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, index) => index !== indexToRemove)
      validateFilesState(updatedFiles)
      return updatedFiles
    })
  }

  const isFormValid = () => {
    const requiredFields = ["fullName", "email", "password", "confirmPassword", "phone", "address"]
    const allFieldsFilled = requiredFields.every((field) => formData[field].trim() !== "")
    const hasActiveErrors = Object.values(errors).some((error) => error && error.trim() !== "")
    const termsAccepted = acceptTerms

    return allFieldsFilled && termsAccepted && !hasActiveErrors && !isSubmitting
  }

  const handleResendVerification = async () => {
    if (!formData.email || !formData.email.trim()) {
      setResendError("البريد الإلكتروني مطلوب لإعادة الإرسال")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setResendError("البريد الإلكتروني غير صحيح")
      return
    }
    const now = new Date().getTime()
    if (lastResendTime && now - lastResendTime < 60000) {
      const remainingTime = Math.ceil((60000 - (now - lastResendTime)) / 1000)
      setResendError(`يرجى الانتظار ${remainingTime} ثانية قبل إعادة الإرسال`)
      return
    }
    if (resendCount >= 3) {
      setResendError("تم تجاوز الحد الأقصى لعدد المحاولات. يرجى المحاولة لاحقاً")
      return
    }
    setIsResending(true)
    setResendError("")
    setResendSuccess("")
    try {
      console.log("Envoi de la requête de renvoi pour:", formData.email)
      const response = await axios.post(
        "https://api.kadi-inv.store/api/resend-verification/",
        {
          email: formData.email.trim().toLowerCase(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 30000,
        },
      )
      console.log("Réponse du serveur:", response.data)
      setResendSuccess("تم إرسال رابط التحقق مرة أخرى بنجاح!")
      setResendCount((prev) => prev + 1)
      setLastResendTime(new Date().getTime())
      setTimeout(() => {
        setResendSuccess("")
      }, 5000)
    } catch (error) {
      console.error("Erreur complète:", error)
      if (error.code === "ECONNABORTED") {
        setResendError("انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى")
      } else if (error.response) {
        const { status, data } = error.response
        console.log("Détails de l'erreur:", { status, data })
        switch (status) {
          case 400:
            setResendError("البيانات المرسلة غير صحيحة")
            break
          case 404:
            setResendError("لم يتم العثور على الحساب أو الحساب محقق بالفعل")
            break
          case 429:
            setResendError("تم إرسال الكثير من الطلبات. يرجى المحاولة بعد دقيقة")
            break
          case 500:
            setResendError("خطأ في الخادم. يرجى المحاولة لاحقاً")
            break
          default:
            setResendError(`حدث خطأ (${status}). يرجى المحاولة مرة أخرى`)
        }
      } else if (error.request) {
        setResendError("لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت")
      } else {
        setResendError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى")
      }
    } finally {
      setIsResending(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    setSubmitSuccess("")

    const fieldsToValidate = ["fullName", "email", "password", "confirmPassword", "phone", "address"]
    let currentErrors = {}

    fieldsToValidate.forEach((field) => {
      const error = validateFieldSync(field, formData[field], formData)
      if (error) {
        currentErrors[field] = error
      }
    })

    if (!acceptTerms) {
      currentErrors.terms = "يجب الموافقة على الشروط والأحكام"
    } else {
      delete currentErrors.terms
    }

    let fileError = null;
    if (files.length === 0) {
      fileError = "يجب إرفاق ملف واحد على الأقل لإثبات المهارات";
    } else if (files.length > 5) {
      fileError = "لا يمكنك تحميل أكثر من 5 ملفات.";
    } else {
      fileError = validateFiles(files);
    }
    if (fileError) {
      currentErrors.files = fileError;
    } else {
      delete currentErrors.files;
    }

    setErrors(currentErrors)

    const hasErrors = Object.keys(currentErrors).length > 0

    if (hasErrors) {
      setIsSubmitting(false)
      return
    }

    try {
      const data = new FormData()
      data.append("user[full_name]", formData.fullName)
    data.append("user[email]", formData.email)
    data.append("user[password]", formData.password)
    data.append("address", formData.address)
    data.append("phone_number", formData.phone)
    data.append("agreed_to_policy", acceptTerms)
       files.forEach((file) => {
      data.append("documents", file)  // Même clé pour tous les fichiers
    })
      console.log("Envoi des données...")

     const response = await axios.post("https://api.kadi-inv.store/api/signup-couturiere/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // Timeout augmenté
    })
          console.log("Réponse reçue:", response.data)


      setSubmitSuccess("تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني")
      setResendCount(0)
      setLastResendTime(null)
      setErrors({})

    } catch (error) {
  console.error("ERREUR COMPLETE:", error)
  
  if (error.response) {
    const { status, data } = error.response
    console.log("ERREURS DU BACKEND:", data) // ← Affiche les erreurs réelles
    
    // Afficher les erreurs de validation spécifiques
    if (status === 400) {
      // Afficher les erreurs de validation détaillées
      if (data.user) {
        // Erreurs dans l'objet user
        if (data.user.email) {
          setErrors((prev) => ({ ...prev, email: data.user.email[0] }))
        }
        if (data.user.full_name) {
          setErrors((prev) => ({ ...prev, fullName: data.user.full_name[0] }))
        }
        if (data.user.password) {
          setErrors((prev) => ({ ...prev, password: data.user.password[0] }))
        }
      }
      // Erreurs générales
      if (data.address) {
        setErrors((prev) => ({ ...prev, address: data.address[0] }))
      }
      if (data.phone_number) {
        setErrors((prev) => ({ ...prev, phone: data.phone_number[0] }))
      }
      if (data.agreed_to_policy) {
        setErrors((prev) => ({ ...prev, terms: data.agreed_to_policy[0] }))
      }
      if (data.documents) {
        setErrors((prev) => ({ ...prev, files: data.documents[0] }))
      }
      
      // Si pas d'erreurs spécifiques, afficher le message général
      if (Object.keys(data).length === 0) {
        setSubmitError("بيانات غير صحيحة. يرجى التحقق من جميع الحقول")
      } else if (!data.user && !data.address && !data.phone_number && !data.agreed_to_policy && !data.documents) {
        setSubmitError(data.detail || "بيانات غير صحيحة. يرجى المراجعة والمحاولة مرة أخرى")
      }
    } else if (status === 500) {
      setSubmitError("خطأ في الخادم. يرجى المحاولة لاحقاً")
    } else {
      setSubmitError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى")
    }
  } else if (error.request) { 
    setSubmitError("لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت")
  } else {
    setSubmitError("حدث خطأ غير متوقع")
  }
}


  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-container">
      {/* Logo centré avec espace en dessous */}
      <div className="login-logo">
        <img src={logo} alt="Logo" />
      </div>
      
      {/* White Card avec titre et icône à l'intérieur */}
      <div className="login-card">
        <div className="login-card-content">
          {/* Header avec bouton de retour et titre à l'intérieur de la carte */}
          <div className="login-header">
            <ArrowLeft 
              className="login-back-button" 
              onClick={handleBackToLogin}
            />
            <h2 className="login-title">تسجيل حساب خياطة</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
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
              value={formData.email.toLowerCase()}
              onChange={(val) => handleInputChange("email", val)}
              error={errors.email}
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
            <InputField
              label="رقم الهاتف:"
              type="tel"
              placeholder="0123456789"
              value={formData.phone}
              onChange={(val) => handleInputChange("phone", val)}
              error={errors.phone}
            />
            <InputField
              label="عنوان الاقامة:"
              placeholder="الشارع، المدينة، الولاية"
              value={formData.address}
              onChange={(val) => handleInputChange("address", val)}
              error={errors.address}
            />
            
            {/* File Upload Section */}
            <div className="space-y-3">
              <input
                type="file"
                id="folder-upload"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                type="button"
                disabled={files.length >= 5}
                variant="outline"
                className="h-12 w-full rounded-full border border-[#E5B62B] bg-transparent text-[#E5B62B] transition-colors hover:bg-[#E5B62B] hover:text-white"
                onClick={() => document.getElementById("folder-upload").click()}
              >
                <Upload className="ml-2 h-4 w-4" />
                اختر ملفات لإثبات مهاراتك
              </Button>
              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm">
                        <span className="max-w-[150px] truncate text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 transition-colors hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs text-gray-500">{files.length} ملف محدد</p>
                </div>
              )}
              {errors.files && <p className="mt-1 text-center text-xs text-red-500">{errors.files}</p>}
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <Checkbox
                checked={acceptTerms}
                onCheckedChange={(c) => {
                  setAcceptTerms(c)
                  if (c) {
                    setErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.terms
                      return newErrors
                    })
                  }
                }}
                className="data-[state=checked]:border-[#E5B62B] data-[state=checked]:bg-[#E5B62B]"
              />
              <label className="text-right text-sm leading-5 text-[#374151]">
                أوافق على <span className="cursor-pointer text-[#E5B62B] underline">شروط الاستخدام</span>,{" "}
                <span className="cursor-pointer text-[#E5B62B] underline">سياسة التسجيل الخاصة بالخياطات</span>
              </label>
            </div>
            {errors.terms && <p className="text-center text-xs text-red-500">{errors.terms}</p>}
            
            <button
              type="submit"
              disabled={!isFormValid()}
              className="login-submit-button"
            >
              {isSubmitting ? "جاري الإنشاء..." : "إنشاء حساب"}
            </button>

            <div className="login-forgot-password">
              <span className="login-forgot-link">
                <Link to="/login">
                  هل لديك حساب بالفعل؟ تسجيل الدخول
                </Link>
              </span>
            </div>
          </form>
          
          {/* رسائل النجاح والخطأ العامة */}
          {submitSuccess && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <p className="mb-3 text-sm text-green-700">تم إنشاء الحساب بنجاح! تم إرسال رابط التحقق إلى:</p>
              <p className="mb-3 text-sm font-semibold text-green-800">{formData.email}</p>
              <p className="mb-3 text-xs text-green-600">يرجى التحقق من صندوق الوارد وصندوق الرسائل غير المرغوب فيها</p>
              <div className="mt-3 border-t border-green-200 pt-3">
                <p className="mb-2 text-xs text-green-600">لم تستلم الرسالة؟</p>
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending || resendCount >= 3}
                    className="rounded-full bg-green-600 px-4 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-green-700"
                  >
                    {isResending
                      ? "جاري الإرسال..."
                      : resendCount > 0
                        ? `إعادة إرسال رابط التحقق (${resendCount}/3)`
                        : "إعادة إرسال رابط التحقق"}
                  </Button>
                  {resendCount >= 3 && (
                    <p className="mt-2 text-xs text-orange-600">
                      تم تجاوز الحد الأقصى للمحاولات. يرجى الاتصال بالدعم الفني
                    </p>
                  )}
                </div>
              </div>
              {resendSuccess && (
                <div className="mt-3 rounded border border-green-300 bg-green-100 p-2 text-xs text-green-700">
                  {resendSuccess}
                </div>
              )}
              {resendError && (
                <div className="mt-3 rounded border border-red-300 bg-red-100 p-2 text-xs text-red-700">
                  {resendError}
                </div>
              )}
            </div>
          )}
          {submitError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
