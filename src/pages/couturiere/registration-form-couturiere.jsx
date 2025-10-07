import { useState, useEffect } from "react"
import { ArrowLeft, Eye, EyeOff, X, Upload } from 'lucide-react'
import { InputField } from "@/components/ui/inputField" // Assuming these are custom components
import { PasswordField } from "@/components/ui/Passwordfield" // Assuming these are custom components
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Link, redirect, useNavigate } from "react-router-dom";
import axios from "axios"

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

      // Re-added useEffect to control body overflow for the fixed layout
      useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
          document.body.style.overflow = "auto"
        }
      }, [])

      // Synchronous validation function for individual fields
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
              const cleaned = value.replace(/\s/g, ""); // remove spaces
              const phoneRegex = /^0\d{9}$/; // must start with 0 and have 10 digits
              const validPrefixRegex = /^0(5|6|7|2|3|4)/; // allowed prefixes
            
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
          let newErrors = { ...errors } // Start with current errors

          // Validate the changed field
          const fieldError = validateFieldSync(field, value, newFormData)
          if (fieldError) {
            newErrors[field] = fieldError
          } else {
            delete newErrors[field]
          }

          // Special handling for password/confirmPassword to ensure consistency
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

          setErrors(newErrors) // Update errors state once
          return newFormData
        })
      }

  // Validates individual files for size/type
  const validateFiles = (fileList) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
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

  // Helper to validate the entire 'files' state and update errors.files
  const validateFilesState = (currentFiles) => {
    let fileError = null
    if (currentFiles.length === 0) {
      fileError = "يجب إرفاق ملف واحد على الأقل لإثبات المهارات"
    } else if (currentFiles.length > 5) {
      fileError = "لا يمكنك تحميل أكثر من 5 ملفات."
    } else {
      fileError = validateFiles(currentFiles) // Validate each file for size/type
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
      validateFilesState(updatedFiles) // Validate the new combined list
      return updatedFiles
    })
    event.target.value = null
  }

  const removeFile = (indexToRemove) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, index) => index !== indexToRemove)
      validateFilesState(updatedFiles) // Validate the remaining list
      return updatedFiles
    })
  }

  const isFormValid = () => {
    const requiredFields = ["fullName", "email", "password", "confirmPassword", "phone", "address"]
    const allFieldsFilled = requiredFields.every((field) => formData[field].trim() !== "")
    const hasActiveErrors = Object.values(errors).some((error) => error && error.trim() !== "")
    const termsAccepted = acceptTerms

    // hasActiveErrors now correctly includes file validation errors via errors.files
    return allFieldsFilled && termsAccepted && !hasActiveErrors && !isSubmitting
  }

  const handleResendVerification = async () => {
    // Vérifications de base
    if (!formData.email || !formData.email.trim()) {
      setResendError("البريد الإلكتروني مطلوب لإعادة الإرسال")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setResendError("البريد الإلكتروني غير صحيح")
      return
    }
    // Vérifier le délai entre les envois (1 minute)
    const now = new Date().getTime()
    if (lastResendTime && now - lastResendTime < 60000) {
      const remainingTime = Math.ceil((60000 - (now - lastResendTime)) / 1000)
      setResendError(`يرجى الانتظار ${remainingTime} ثانية قبل إعادة الإرسال`)
      return
    }
    // Limiter à 3 tentatives
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
        },
      )
      console.log("Réponse du serveur:", response.data)
      setResendSuccess("تم إرسال رابط التحقق مرة أخرى بنجاح!")
      setResendCount((prev) => prev + 1)
      setLastResendTime(new Date().getTime())
      // Effacer le message après 5 secondes
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

    // Validate all form fields
    fieldsToValidate.forEach((field) => {
      const error = validateFieldSync(field, formData[field], formData)
      if (error) {
        currentErrors[field] = error
      }
    })

    // Validate terms and conditions
    if (!acceptTerms) {
      currentErrors.terms = "يجب الموافقة على الشروط والأحكام"
    } else {
      delete currentErrors.terms // Clear if accepted
    }

    // Validate files using the centralized logic
    let fileError = null;
    if (files.length === 0) {
      fileError = "يجب إرفاق ملف واحد على الأقل لإثبات المهارات";
    } else if (files.length > 5) {
      fileError = "لا يمكنك تحميل أكثر من 5 ملفات.";
    } else {
      fileError = validateFiles(files); // Validate each file for size/type
    }
    if (fileError) {
      currentErrors.files = fileError;
    } else {
      delete currentErrors.files;
    }

    setErrors(currentErrors) // Set all errors at once

    const hasErrors = Object.keys(currentErrors).length > 0

    if (hasErrors) {
      setIsSubmitting(false)
      return
    }

    try {
      const data = new FormData()
      data.append("user.full_name", formData.fullName)
      data.append("user.email", formData.email)
      data.append("user.password", formData.password)
      data.append("address", formData.address)
      data.append("phone_number", formData.phone)
      data.append("agreed_to_policy", acceptTerms)
      files.forEach((file, index) => {
        data.append(`documents[${index}]`, file)
      })

      const response = await axios.post("http://127.0.0.1:8000/api/signup-couturiere/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setSubmitSuccess("تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني")
      // Réinitialiser les compteurs de renvoi après succès
      setResendCount(0)
      setLastResendTime(null)
      // setFiles([])
      // setAcceptTerms(false)
      setErrors({})
       // Clear all errors on successful submission



    } catch (error) {
      console.error(error)
      if (error.response) {
        const { status, data } = error.response
        switch (status) {
          case 400:
            if (data.user && data.user.email) {
              setErrors((prev) => ({ ...prev, email: "البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول به أو تغييره لتسجيل حساب جديد."}))
            } else {
              setSubmitError("بيانات غير صحيحة. يرجى المراجعة والمحاولة مرة أخرى")
            }
            break
          case 500:
            setSubmitError("خطأ في الخادم. يرجى المحاولة لاحقاً")
            break
          default:
            setSubmitError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى")
        }
      } else if (error.request) { 
        setSubmitError("لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت")
      } else {
        setSubmitError("حدث خطأ غير متendu")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start bg-[#F4F3EF] px-4 pb-4 pt-8">
      {/* Header */}
      <div className="relative mb-4 flex w-full max-w-md items-center justify-center">
        <h2 className="amiri-bold text-center text-2xl text-[#E5B62B]">تسجيل حساب خياطة</h2>
        <ArrowLeft onClick={() => navigate(-1)} className="absolute left-4 h-5 w-5 cursor-pointer text-[#374151]" />
        <div className="fixed right-0 top-4 z-50">
          <img src="/logo.png" alt="Logo" className="h-auto w-[8rem] max-w-full object-contain" />
        </div>
      </div>
      {/* White Card */}
      <div className="shadow-md flex h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-b-2xl rounded-t-3xl bg-white">
        <div className="flex-1 overflow-y-auto px-6 py-6" dir="rtl">
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="mt-4 h-12 w-full rounded-full font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: "#E5B62B" }}
            >
              {isSubmitting ? "جاري الإنشاء..." : "إنشاء حساب"}
            </Button>
            <p className="mt-4 text-center text-sm text-[#374151]">
              هل لديك حساب بالفعل؟{" "}
              <span className="cursor-pointer text-[#4A66BD] underline">
                  <Link to="/login">
                تسجيل الدخول
                </Link>
              </span>
            </p>
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
