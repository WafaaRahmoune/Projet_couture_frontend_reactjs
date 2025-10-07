import { useState } from "react"
import checkIcon from "../../assets/model/checked.png"
import calendarIcon from "../../assets/model/calendar.png"
import moneyIcon from "../../assets/model/money.png"
import boxIcon from "../../assets/model/box.png"
import bookIcon from "../../assets/model/book.png"
import descriptionIcon from "../../assets/model/description.png"
import colorsIcon from "../../assets/model/colors.png"
import mesureIcon from "../../assets/model/mesure.png"
import quantityIcon from "../../assets/model/quantite.png"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios";
import { toast } from "react-toastify";
import deadlineIcon from "../../assets/model/deadline.png"

export default function ModelCardFassou({
  id,
  name,
  code,
  pricePerPiece,
  totalPieces,
  date,
  type,
  description,
  status,
  images = [],
  sizes = [],
  onOfferAccepted,
  deadline
}) {
  const [showDetails, setShowDetails] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [confirmModal, setConfirmModal] = useState(false)
  const [congratsModal, setCongratsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const typeLabels = {
    femme: "نسائي",
    homme: "رجالي",
    enfant: "أطفال",
    babie: "رضع",
    Femme: "نسائي",
    Homme: "رجالي",
    Enfant: "أطفال",
    Babie: "رضع"
    
  };
  const statusTranslations = {
    inprogress: "قيد التنفيذ",
    pending: "قيد الانتظار",
    done: "منجز",
    cancelled: "ملغى",
    accepted: "مقبول",
    waiting: "بانتظار"
  };
  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))

  const handleOfferClick = () => setConfirmModal(true)
// Add this function to format the date
const formatDeadline = (dateString) => {
  if (!dateString) return '';
  
  // Split the date string by dashes or other separators
  const parts = dateString.split(/[-/]/);
  
  // If it's already in dd-mm-yyyy format
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  
  return dateString; // Return original if format is unexpected
};

  const handleConfirmOffer = async () => {
    console.log("Calling endpoint for offer id:", id);



    setIsLoading(true)
    try {

      const token = localStorage.getItem("accessToken");
      const response =await axios.patch(
        `http://127.0.0.1:8000/api/ModifyFassouOffer/${id}/`, // ✅ use offer id
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

    // response.data contains the server result
    if (response.data && response.status === 200) {
      setConfirmModal(false)
      setCongratsModal(true)
      // setData((prevData) => prevData.filter((offer) => offer.id !== id));
      // if (onOfferAccepted) onOfferAccepted(id);

    }  else {
        toast.error("حدث خطأ في السيرفر. حاول لاحقاً.")
      }
    } catch (error) {
      console.error(error)
      toast.error("حدث خطأ في الشبكة. حاول لاحقاً.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-2 border-[#999EA6] rounded-2xl p-4 shadow-sm flex flex-col gap-4">
      {/* Header */}
 
{/* Header */}
<div className="flex flex-col sm:flex-row justify-between items-center gap-6">
  <div className="space-y-2 w-full">
    {/* Title */}
    <h2 className="text-[22px] font-cairo text-[#374151]">
      {name} : <span className="text-[#374151]">كود {code}</span>
    </h2>

    {/* Info - Mobile stacked / Desktop inline */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mt-4 text-[18px] font-amiri text-[#374151] w-full">
      <div className="flex items-center gap-2">
        <img src={calendarIcon} alt="calendar" className="w-5 h-5" />
        {date}
      </div>

      <div className="flex items-center gap-2">
        <img src={moneyIcon} alt="money" className="w-5 h-5" />
        {pricePerPiece} دج لكل القطع     
         </div>

      <div className="flex items-center gap-2">
        <img src={boxIcon} alt="box" className="w-5 h-5" />
        {totalPieces} قطعة
      </div>

      <div>
        <button
          className="text-blue-500 text-[18px] font-amiri"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "عرض أقل ..." : "عرض المزيد ..."}
        </button>
      </div>
    </div>
  </div>

  {/* Action Button */}
  {status === "pending" && (
    <div className="mt-4 sm:mt-0 flex justify-center sm:justify-end w-full sm:w-auto">
      <button
        onClick={handleOfferClick}
        disabled={isLoading}
        className="px-6 min-w-[120px] py-2 h-10 rounded-full bg-[#F0C84B] hover:bg-[#d9b63d] text-white font-cairo"
      >
            {isLoading ? "جاري..." : "خذ العرض"}
      </button>
    </div>
  )}
</div>

      {/* Details */}
      {showDetails && (
        <div>
          <hr className="border-[#999EA6] mb-3" />
          <div className="flex flex-col md:flex-row flex-wrap gap-4 text-[18px] font-amiri text-[#374151]">
            {/* Left */}
            <div className="flex-1 max-w-lg">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img src={bookIcon} alt="book" className="w-5 h-5" />
                  النوع: {typeLabels[type] || type}
                </div>
                        {deadline && (
          <div className="flex items-center gap-2">
            <img src={deadlineIcon} alt="deadline" className="w-5 h-5" />
            تاريخ التسليم: {formatDeadline(deadline)}
          </div>
          )}

                <p className="mt-2 flex items-start gap-2 leading-relaxed">
                  <img src={descriptionIcon} alt="description" className="w-5 h-5 mt-1" />
                  {description}
                </p>
              </div>

              <table className="mt-4 w-full text-center border border-[#999EA6] border-collapse ">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border border-[#999EA6]">
                        <div className="flex items-center justify-center gap-2">
                          <img
                            src={mesureIcon}
                            alt="mesure"
                            className="w-5 h-5"
                          />
                          <span>المقاس</span>
                        </div>
                      </th>
                      <th className="p-2 border border-[#999EA6]">
                        <div className="flex items-center justify-center gap-2">
                          <img
                            src={colorsIcon}
                            alt="color"
                            className="w-5 h-5"
                          />
                          <span>اللون</span>
                        </div>
                      </th>
                      <th className="p-2 border border-[#999EA6]">
                        <div className="flex items-center justify-center gap-2">
                          <img
                            src={quantityIcon}
                            alt="quantity"
                            className="w-5 h-5"
                          />
                          <span>الكمية</span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sizes.map((s, i) => (
                      <tr key={i} className="border border-[#999EA6]">
                        <td className="p-2 border border-[#999EA6]">{s.size}</td>
                        <td className="p-2 border border-[#999EA6]">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-[#999EA6]"
                              style={{ backgroundColor: s.hex }}
                            ></span>
                            {s.color}
                          </div>
                        </td>
                        <td className="p-2 border border-[#999EA6]">
                          {s.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>

            {/* Right - Images */}
            {images.length > 0 && (
              <div className="flex flex-col items-center justify-center flex-1 w-full">
                {/* Image */}
                <img
                  src={images[activeIndex]}
                  alt={name}
                  className="w-full sm:w-48 sm:h-64 h-56 object-cover rounded-xl cursor-pointer"
                  onClick={() => setModalOpen(true)}
                />

                {/* Dots identiques desktop + mobile */}
                <div className="flex justify-center mt-2 gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition ${
                        i === activeIndex ? "bg-yellow-400 scale-110" : "bg-gray-300"
                      }`}
                      aria-label={`Select image ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-4 max-w-5xl w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 left-2 bg-gray-100 p-1 rounded-full hover:bg-gray-200"
              onClick={() => setModalOpen(false)}
            >
              <X size={28} />
            </button>

            <h3 className="text-center text-[22px] font-cairo text-[#374151] mb-4">{name}</h3>

            <div className="flex items-center justify-center relative">
              <button
                onClick={prevImage}
                disabled={activeIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full"
              >
                <ChevronLeft size={36} />
              </button>

              <div className="flex items-center justify-center gap-4 w-full overflow-hidden relative h-[70vh]">
                <AnimatePresence initial={false}>
                  {images.map((img, i) => {
                    const offset = i - activeIndex
                    return (
                      <motion.img
                        key={i}
                        src={img}
                        alt={`${name}-${i}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: offset === 0 ? 1 : 0.6,
                          scale: offset === 0 ? 1 : 0.7,
                          x: offset * 300,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`rounded-xl shadow-lg cursor-pointer ${offset === 0 ? "z-20" : "z-10"}`}
                        style={{
                          maxHeight: offset === 0 ? "70vh" : "50vh",
                          position: "absolute",
                        }}
                        onClick={() => setActiveIndex(i)}
                      />
                    )
                  })}
                </AnimatePresence>
              </div>

              <button
                onClick={nextImage}
                disabled={activeIndex === images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full"
              >
                <ChevronRight size={36} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Offer Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-xl">
            <button
              className="absolute top-3 left-3 p-2 rounded-full hover:bg-gray-200"
              onClick={() => setConfirmModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="text-xl font-cairo font-bold text-[#374151] mb-4 text-center">
              هل أنت متأكد من رغبتك في الحصول على العرض؟
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmOffer}
                disabled={isLoading}
                className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? "جاري..." : "نعم"}
              </button>
              <button
                onClick={() => setConfirmModal(false)}
                className="px-6 py-2 bg-red-400 text-white rounded-full hover:bg-red-500"
              >
                لا
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Congrats Modal */}
      {congratsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-xl">
            <button
              className="absolute top-3 left-3 p-2 rounded-full hover:bg-gray-200"
              onClick={() => {setCongratsModal(false);
                   if (onOfferAccepted) onOfferAccepted(id); // 🔹 ici
              }}
            >
              <X size={22} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={checkIcon} alt="check" className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-cairo font-bold text-green-600 mb-4">مبروك! حصلت على الصفقة</h3>
              <p className="text-lg font-amiri text-[#374151] mb-6">ستجد التفاصيل في قسم الطلبات</p>
              <button
                onClick={() =>  {setCongratsModal(false);
                  if (onOfferAccepted) onOfferAccepted(id); // 🔹 ici
                }}
                className="px-8 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 font-cairo text-lg"
              >
                حسناً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  
}
