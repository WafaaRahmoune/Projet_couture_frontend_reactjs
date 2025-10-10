import React, { useEffect, useState } from "react"
import { InputField } from "@/components/ui/InputField"
import { PasswordField } from "@/components/ui/Passwordfield"
import { Button } from "@/components/ui/Button"
import { Pencil } from "lucide-react"
import SidePanel from "@/components/ui/SidePanel"
import profilIcon from "../../assets/model/profile.png"
import passwordIcon from "../../assets/model/security.png"
import { toast } from "react-toastify"

export default function MonCompte() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})
  const [editableField, setEditableField] = useState(null)
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [loading, setLoading] = useState(false)

  // === 1. Fetch user profile ===
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken") // JWT
        const res = await fetch("https://api.kadi-inv.store/api/profile/couturiere/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setFormData(prev => ({
          ...prev,
          fullName: data.full_name || "",
          email: data.email || "",
          phone: data.phone_number || "",
          address: data.address || "",
        }))
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [])
// Validation synchronisée des champs
const validateFieldSync = (field, value, currentFormData) => {
let error = null

switch (field) {
    case "fullName": {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/
    if (!value.trim()) {
        error = "الاسم الكامل مطلوب"
    } else if (!arabicRegex.test(value)) {
        error = "الاسم يجب أن يكون باللغة العربية فقط"
    } else if (value.trim().length < 2) {
        error = "الاسم يجب أن يكون أكثر من حرفين"
    }
    break
    }

    case "email":
    if (!value) {
        error = "البريد الإلكتروني مطلوب"
    }
    break

    case "phone": {
    const phoneRegex = /^(0(5|6|7)[0-9]{8}|0[2-4][0-9]{8})$/
    if (!value) {
        error = "رقم الهاتف مطلوب"
    } else if (!phoneRegex.test(value.replace(/\s/g, ""))) {
        error = "رقم الهاتف يجب أن يكون 10 أرقام"
    }
    break
    }

    case "address": {
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

    case "newPassword": {
    const hasArabicCharsPassword = /[\u0600-\u06FF]/.test(value)
    if (!value) {
        error = "كلمة المرور مطلوبة"
    } else if (hasArabicCharsPassword) {
        error = "كلمة المرور يجب أن تكون بالأحرف اللاتينية فقط"
    } else if (value.length < 8) {
        error = "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
        error = "كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام ورموز"
    } else if (
        currentFormData.email &&
        value.trim().toLowerCase() === currentFormData.email.trim().toLowerCase()
    ) {
        error = "كلمة المرور لا يجب أن تكون نفس البريد الإلكتروني"
    }
    break
    }

    case "confirmPassword":
    if (!value) {
        error = "تأكيد كلمة المرور مطلوب"
    } else if (value !== currentFormData.newPassword) {
        error = "كلمات المرور غير متطابقة"
    }
    break

    default:
    break
}

return error
}


  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value }
      const nextErrors = { ...errors }
      const e = validateFieldSync(field, value, next)
      if (e) nextErrors[field] = e
      else delete nextErrors[field]
      setErrors(nextErrors)
      return next
    })
  }

  const guardedChange = (field) => (val) => {
    if (editableField === field) handleInputChange(field, val)
  }

  // === 2. Save profile ===
  const handleSaveProfile = async () => {
    const newErrors = {}
    ;["fullName", "email", "phone", "address"].forEach(f => {
      const err = validateFieldSync(f, formData[f], formData)
      if (err) newErrors[f] = err
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      setLoading(true)
      const token = localStorage.getItem("accessToken") // JWT
      const res = await fetch("https://api.kadi-inv.store/api/profile/couturiere/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone_number: formData.phone,
          address: formData.address,
        }),
      })
      if (!res.ok) throw new Error("Erreur lors de la mise à jour du profil")
      toast.success("تم حفظ التغييرات بنجاح")
      setEditableField(null)
    } catch (err) {
      console.error(err)
      toast.error("فشل في تحديث الملف الشخصي")
    } finally {
      setLoading(false)
    }
  }

  // === 3. Update password ===
  const handleUpdatePassword = async () => {
    const newErrors = {}
    ;["newPassword", "confirmPassword"].forEach(f => {
      const err = validateFieldSync(f, formData[f], formData)
      if (err) newErrors[f] = err
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      setLoading(true)
      const token = localStorage.getItem("accessToken")
      const res = await fetch("https://api.kadi-inv.store/api/changepasswordWithVerification/couturiere", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        // 🔹 Traduire le message si c’est le cas
        if (data.current_password) {
          let errorMessage = data.current_password
          if (errorMessage === "Mot de passe actuel incorrect.") {
            errorMessage = "كلمة المرور الحالية غير صحيحة"
          }
          setErrors(prev => ({ ...prev, currentPassword: errorMessage }))
          toast.error(errorMessage)
        } else {
          toast.error("فشل في تغيير كلمة المرور")
        }
        return
      }
      toast.success("تم تحديث كلمة المرور بنجاح")
      setFormData(s => ({ ...s, currentPassword: "", newPassword: "", confirmPassword: "" }))
    } catch (err) {
      
      console.error(err)
      toast.error("فشل في تغيير كلمة المرور")
    } finally {
      setLoading(false)
    }
  }

  // === Validation séparée ===
  const profileFields = ["fullName", "email", "phone", "address"]
  const passwordFields = ["currentPassword", "newPassword", "confirmPassword"]

  const profileErrors = Object.keys(errors).filter(f => profileFields.includes(f))
  const passwordErrors = Object.keys(errors).filter(f => passwordFields.includes(f))

  const isProfileInvalid = profileErrors.length > 0 || editableField === null
  const isPasswordInvalid =
    passwordErrors.length > 0 ||
    !formData.currentPassword ||
    !formData.newPassword ||
    !formData.confirmPassword

    return (
      <SidePanel>
        <div className="w-full h-full min-h-full flex flex-col overflow-x-hidden">
          {/* Header sticky */}
          <div className="sticky top-0 z-20 -mx-6 px-4 sm:px-6 bg-white">
            <div className="h-12 sm:h-14 flex items-center justify-center">
              <h1 className="text-xl sm:text-3xl font-bold text-[#182544]">
                الملف الشخصي
              </h1>
            </div>
          </div>
    
          <div className="w-full space-y-8 sm:space-y-10 px-3 sm:px-2 pt-4 sm:pt-6 pb-12 sm:pb-16">
            {/* --- Section profil --- */}
            <div className="flex items-center gap-2 max-w-[38rem] mx-auto">
              <img src={profilIcon} className="w-6 h-6 sm:w-10 sm:h-10 text-[#182544]" />
              <h2 className="font-bold text-lg sm:text-2xl text-[#182544]">
                المعلومات الشخصية
              </h2>
            </div>
    
            <div className="space-y-4 sm:space-y-6 max-w-lg mx-auto">
              {/* Full Name */}
              <div className="relative">
                <InputField
                  label="الاسم الكامل:"
                  value={formData.fullName}
                  onChange={guardedChange("fullName")}
                  error={errors.fullName}
                />
                <button
                  type="button"
                  className="absolute left-3 top-10 sm:left-4 sm:top-12 text-gray-500 hover:text-gray-700"
                  onClick={() => setEditableField("fullName")}
                >
                  <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
    
              {/* Email */}
              <div className="relative">
                <InputField
                  label="البريد الإلكتروني:"
                  value={formData.email}
                  onChange={guardedChange("email")}
                  error={errors.email}
                  disabled
                />
              </div>
    
              {/* Phone */}
              <div className="relative">
                <InputField
                  label="رقم الهاتف:"
                  value={formData.phone}
                  onChange={guardedChange("phone")}
                  error={errors.phone}
                />
                <button
                  type="button"
                  className="absolute left-3 top-10 sm:left-4 sm:top-12 text-gray-500 hover:text-gray-700"
                  onClick={() => setEditableField("phone")}
                >
                  <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
    
              {/* Address */}
              <div className="relative">
                <InputField
                  label="عنوان الإقامة:"
                  value={formData.address}
                  onChange={guardedChange("address")}
                  error={errors.address}
                />
                <button
                  type="button"
                  className="absolute left-3 top-10 sm:left-4 sm:top-12 text-gray-500 hover:text-gray-700"
                  onClick={() => setEditableField("address")}
                >
                  <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
    
              <Button
                className="w-full sm:w-64 bg-[#E5B62B] hover:bg-[#d4a424] shadow-md text-white font-bold rounded-xl h-10 sm:h-12 text-sm sm:text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveProfile}
                disabled={isProfileInvalid || loading}
              >
                {loading ? "جارٍ الحفظ..." : "حفظ التغيرات"}
              </Button>
            </div>
    
            {/* --- Section mot de passe --- */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-2 max-w-[38rem] mx-auto">
                <img src={passwordIcon} className="w-6 h-6 sm:w-10 sm:h-10" />
                <h2 className="font-bold text-lg sm:text-2xl text-[#182544]">
                  تغيير كلمة المرور
                </h2>
              </div>
    
              <div className="max-w-lg space-y-4 sm:space-y-6 mx-auto">
                <PasswordField
                  label="كلمة المرور الحالية"
                  value={formData.currentPassword}
                  onChange={(v) => handleInputChange("currentPassword", v)}
                  show={showPasswords.current}
                  toggleShow={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                />
    
                <PasswordField
                  label="كلمة المرور الجديدة"
                  value={formData.newPassword}
                  onChange={(v) => handleInputChange("newPassword", v)}
                  error={errors.newPassword}
                  show={showPasswords.new}
                  toggleShow={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                />
    
                <PasswordField
                  label="تأكيد كلمة المرور"
                  value={formData.confirmPassword}
                  onChange={(v) => handleInputChange("confirmPassword", v)}
                  error={errors.confirmPassword}
                  show={showPasswords.confirm}
                  toggleShow={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                />
    
                <Button
                  className="w-full sm:w-64 bg-[#E5B62B] hover:bg-[#d4a424] shadow-md text-white font-bold rounded-xl h-10 sm:h-12 text-sm sm:text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleUpdatePassword}
                  disabled={isPasswordInvalid || loading}
                >
                  {loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
                </Button>
              </div>
    
              <a 
                href="/policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cursor-pointer flex gap-2 text-base sm:text-xl max-w-[38rem] mx-auto text-[#4A66BD] underline"
              >
                مراجعة شروط وسياسة الاستخدام
              </a>
            </div>
          </div>
        </div>
      </SidePanel>
    )
    
}
