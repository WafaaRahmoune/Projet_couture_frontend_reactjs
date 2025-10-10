import { useState } from "react"
import SidePanel from "@/components/ui/SidePanel"
import { ArrowLeft, Upload, X } from "lucide-react"
import SelectField from "@/components/ui/SelectField"
import { InputField } from "@/components/ui/InputField"
import { Button } from "@/components/ui/Button"
import ColorAutocomplete from "@/components/ui/ColorSelect"
import { getAccessToken } from "@/utils/Auth"   // adapte le chemin si besoin
import { authFetch } from "@/utils/Auth"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SuccessModal from "@/components/ui/SuccessModel";

const token = await getAccessToken()

export default function AddNewModel() {
  const [showSuccess, setShowSuccess] = useState(false);

  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [sizes, setSizes] = useState("")
  const [colors, setColors] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [isAdding, setIsAdding] = useState(false)
  const navigate = useNavigate();

  const isFormValid = () => {
    return (
      name &&
      type &&
      sizes &&
      colors &&
      price &&
      description &&
      files.length > 0 &&
      files.length < 6

    )
  }

  // Validation champ par champ
  const validateField = (field, value) => {
    let message = ""

    switch (field) {
      case "name":
        if (!value) message = "اسم النموذج مطلوب."
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          message = "اسم النموذج يجب أن يكون باللغة العربية فقط."
        break

      case "type":
        if (!value) message = "الرجاء اختيار النوع."
        break

      case "sizes":
        if (!value) message = "الرجاء اختيار مقاس القطعة."
        break

      case "colors":
        if (!value) message = "الرجاء اختيار لون القطعة."
        break

      case "price":
        if (!value) message = "سعر القطعة مطلوب."
        else if (!/^\d+$/.test(value))
          message = "سعر القطعة يجب أن يكون أرقاماً فقط."
        break

      case "description":
        if (!value) message = "الوصف مطلوب."
        else if (value.length < 10)
          message = "الرجاء كتابة وصف دقيق ومفصل (10 أحرف على الأقل)."
        else if (!/^[\u0600-\u06FF\s]+$/.test(value))
          message = "الوصف يجب أن يكون باللغة العربية."
        break

      default:
        break
    }

    setErrors((prev) => {
      const newErrors = { ...prev }
      if (message) newErrors[field] = message
      else delete newErrors[field]
      return newErrors
    })
  }

  // Validation fichiers
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

  const validateFilesState = (currentFiles) => {
    let fileError = null
    if (currentFiles.length === 0) {
      fileError = "يجب إرفاق ملف واحد على الأقل (صورة أو مستند)."
    } else if (currentFiles.length > 5) {
      fileError = "لا يمكنك تحميل أكثر من 5 ملفات."
    } else {
      fileError = validateFiles(currentFiles)
    }
    setErrors((prev) => {
      const newErrors = { ...prev }
      if (fileError) newErrors.files = fileError
      else delete newErrors.files
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



  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid() || Object.keys(errors).length > 0) return
  
    setIsAdding(true)
  
    try {
      const formData = new FormData()
  
      // Champs simples
      formData.append("name", name)
      formData.append("type", type)
      formData.append("description", description)
      formData.append("price_per_piece_for_client", price)

   // ✅ Variants envoyés comme chaîne JSON (comme dans Postman)
      formData.append(
        "variants",
        JSON.stringify([
          { size: sizes, color: colors, quantity: 1 }
        ])
      )
      
      files.forEach((file) => {
        formData.append("files", file)
      })
        // debug: lister tout le FormData
      for (const pair of formData.entries()) {
        console.log("FormData:", pair[0], pair[1]);
      }

      // Requête API (avec token JWT si nécessaire)
      const response = await authFetch("https://api.kadi-inv.store/api/addmodel/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ ton token JWT
        },
        body: formData,
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Erreur backend:", errorData)
        throw new Error("Erreur lors de l'ajout")
      }
      setShowSuccess(true);

      const data = await response.json()
      console.log("✅ Succès:", data)
  
    }  catch (err) {
      console.error("API Error:", err)
      const errorMessage = err.message || "فشل في إضافة النموذج"
      toast.error(errorMessage)
    } finally {
      setIsAdding(false)
    }
  }
  
  return (
    <SidePanel>
      <div className="flex flex-col h-full">
      <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full w-full max-w-xl rounded-b-2xl rounded-t-3xl bg-white mx-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white py-4">
            <div className="relative group flex w-full max-w-md items-center justify-center mx-auto">
            <h2 className="amiri-bold text-center text-lg sm:text-xl md:text-2xl text-[#E5B62B]">
                إضافة نموذج جديد
              </h2>
              <ArrowLeft onClick={() => navigate(-1)} className="absolute left-4 h-5 w-5 cursor-pointer text-[#374151]" />
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-6 py-2" dir="rtl">
            <div className="space-y-4">
              <InputField
                label="اسم النموذج:"
                placeholder="اكتب اسم الموديل (مثلاً: فستان صيفي ناعم)"
                value={name}
                onChange={(val) => {
                  setName(val)
                  validateField("name", val)
                }}
                onBlur={() => validateField("name", name)}
                error={errors.name || null}
              />

              <SelectField
                label="النوع:"
                value={type}
                onChange={(val) => {
                  setType(val)
                  validateField("type", val)
                }}
                error={errors.type || null}
                options={[
                  { value: "femme", label: "نسائي" },
                  { value: "homme", label: "رجالي" },
                  { value: "Enfant", label: "أطفال" },
                ]}
              />

              <SelectField
                label="مقاس القطعة:"
                value={sizes}
                onChange={(val) => {
                  setSizes(val)
                  validateField("sizes", val)
                }}
                error={errors.sizes || null}
                options={[
                  { value: "XS", label: "XS" },
                  { value: "S", label: "S" },
                  { value: "M", label: "M" },
                  { value: "L", label: "L" },
                  { value: "XL", label: "XL" },
                  { value: "XXL", label: "XXL" },
                  { value: "XXXL", label: "XXXL" },
                  { value: "3XL", label: "3XL" },
                  { value: "4XL", label: "4XL" },
                ]}
              />

              <ColorAutocomplete
                label="لون القطعة:"
                value={colors}
                onChange={(val) => {
                  console.log(val)
                  setColors(val)
                  validateField("colors", val)
                }}
                error={errors.colors || null}
              />

              <InputField
                label="سعر القطعة:"
                placeholder="حدد سعر القطعة بالدينار الجزائري (مثلاً: 1234)"
                value={price}
                onChange={(val) => {
                  setPrice(val)
                  validateField("price", val)
                }}
                onBlur={() => validateField("price", price)}
                error={errors.price || null}
              />

              <InputField
                label="وصف النموذج:"
                placeholder="اكتب وصفاً دقيقاً للنموذج يشمل التفاصيل والملاحظات"
                value={description}
                onChange={(val) => {
                  setDescription(val)
                  validateField("description", val)
                }}
                onBlur={() => validateField("description", description)}
                error={errors.description || null}
              />

              {/* Upload fichiers */}
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
                  onClick={() =>
                    document.getElementById("folder-upload").click()
                  }
                >
                  <Upload className="ml-2 h-4 w-4" />
                  اختر ملفات أو صور للنموذج
                </Button>
                {files.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm"
                        >
                          <span className="max-w-[150px] truncate text-gray-700">
                            {file.name}
                          </span>
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
                    <p className="text-center text-xs text-gray-500">
                      {files.length} ملف محدد
                    </p>
                  </div>
                )}
                {errors.files && (
                  <p className="mt-1 text-center text-xs text-red-500">
                    {errors.files}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white pt-2 pb-4 px-6">
            <button
              type="submit"
              disabled={
                !isFormValid() || isAdding || Object.keys(errors).length > 0
              }
              className="mt-6 h-12 w-full rounded-full font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: "#E5B62B" }}
            >
              {isAdding ? "جاري الإضافة..." : "تأكيد الإضافة"}
            </button>
          </div>
        </form>
      </div>
    </SidePanel>
  )
}
