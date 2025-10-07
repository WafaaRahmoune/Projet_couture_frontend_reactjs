import React, { useState } from "react";
import checkIcon from "../../assets/model/checked.png"
import calendarIcon from "../../assets/model/calendar.png";
import moneyIcon from "../../assets/model/money.png";
import boxIcon from "../../assets/model/box.png";
import infoIcon from "../../assets/model/info.png";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import bookIcon from "../../assets/model/book.png";
import descriptionIcon from "../../assets/model/description.png";
import colorsIcon from "../../assets/model/colors.png";
import sorryIcon from "../../assets/model/sorry.png";
import mesureIcon from "../../assets/model/mesure.png";
import quantityIcon from "../../assets/model/quantite.png";
import deaslineIcon from "../../assets/model/deadline.png"
import { motion, AnimatePresence } from "framer-motion";

export default function ModelCardCustomFassou({
  name,
  code,
  pricePerPiece,
  totalPieces,
  date,
  type,
  description,
  status,
  images,
  sizes,
  deadline,
  orderType
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rejectModal, setRejectModal] = useState(false);

  const isAccepted = status === "انتهى";
  const isRejected = status === "ملغاة" || status === "cancelled";

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
      <div className="border-2 border-[#999EA6] rounded-2xl p-4 shadow-sm flex flex-col gap-4">

      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        {/* Left Section */}
        <div className="space-y-2">
            <div className="flex items-center  gap-4">

                {/* Right side: title + code */}
                <h2 className="text-[22px] font-cairo text-[#374151]">
                    {name} : <span className="text-[#374151]">كود {code}</span>
                </h2>

                {/* Left side: orderType box */}
                <div    className={`px-4 py-1 text-[#182544] rounded-xl text-[16px] font-cairo ${
                        orderType === "fassou" ? "bg-[#E9D28E]" : "bg-[#DBEAFE]"
                        }`}
                    >
                    {orderType === "fassou" ? "طلب فـاصو" : "طلب خاص"}

                </div>

            </div>

          {/* Info Row */}
          <div className="flex items-center mt-4 gap-6 text-[18px] font-amiri text-[#374151]">
            <div className="flex items-center gap-2">
              <img src={calendarIcon} alt="calendar" className="w-5 h-5" />
              {date}
            </div>
            <div className="flex items-center gap-2">
              <img src={moneyIcon} alt="money" className="w-5 h-5" />
              {pricePerPiece} دج للقطعة
            </div>
            <div className="flex items-center gap-2">
              <img src={boxIcon} alt="box" className="w-5 h-5" />
              المجموع: {totalPieces} قطعة
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

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-6 min-w-[100px] py-2 rounded-full  text-white text-base ${
              isAccepted
                ? "bg-green-500"
                : status === "قيد التنفيد"
                ? "bg-[#E5B62B]"
                : "bg-red-400 "
            }`}
          >
            {status}
          </span>

          {isRejected && (
            <button onClick={() => setRejectModal(true)}>
              <img src={infoIcon} alt="info" className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* --- Détails --- */}
      {showDetails && (
        <div>
          <hr className="border-[#999EA6] mb-3 " />

          <div className="flex flex-col md:flex-row flex-wrap gap-4 text-[18px] font-amiri text-[#374151]">
          {/* Description */}
            <div className="flex-1 max-w-lg">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img src={bookIcon} alt="book" className="w-5 h-5" />
                  النوع: {type}
                </div>
                
                <div className="flex items-center gap-2">
                  <img src={deaslineIcon} alt="deadline" className="w-5 h-5" />
                  مدة التسليم: {deadline}
                </div>
                <p className="mt-2 flex items-start gap-2 leading-relaxed">
                  <img
                    src={descriptionIcon}
                    alt="desc"
                    className="w-5 h-5 mt-1"
                  />
                  {description}
                </p>
              </div>

              { (
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
              )}
            </div>

            {/* Image */}
            {images && images.length > 0 && (
              <div className="flex flex-col items-center justify-center flex-1">
                <img
                  src={images[activeIndex]}
                  alt={name}
                  className="w-48 h-64 object-cover rounded-xl cursor-pointer"
                  onClick={() => setModalOpen(true)}
                />
                <div className="flex gap-2 mt-2 ">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-3 h-3 rounded-full cursor-pointer transition ${
                        i === activeIndex
                          ? "bg-yellow-400 scale-110"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Modal images --- */}
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

            <h3 className="text-center text-[22px] font-cairo text-[#374151] mb-4">
              {name}
            </h3>

            <div className="flex items-center justify-center relative">
              <button
                onClick={prevImage}
                disabled={activeIndex === 0}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full ${
                  activeIndex === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={36} />
              </button>

              <div className="flex items-center justify-center gap-4 w-full overflow-hidden relative h-[70vh]">
                <AnimatePresence initial={false}>
                  {images.map((img, i) => {
                    let offset = i - activeIndex;
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
                        className={`rounded-xl shadow-lg cursor-pointer ${
                          offset === 0 ? "z-20" : "z-10"
                        }`}
                        style={{
                          maxHeight: offset === 0 ? "70vh" : "50vh",
                          position: "absolute",
                        }}
                        onClick={() => setActiveIndex(i)}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>

              <button
                onClick={nextImage}
                disabled={activeIndex === images.length - 1}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full ${
                  activeIndex === images.length - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <ChevronRight size={36} />
              </button>
            </div>
          </div>
        </div>
      )}
{/* --- Modal refus --- */}
{rejectModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
    onClick={() => setRejectModal(false)}
  >
    <div
      className="bg-white rounded-2xl  max-w-5xl w-full relative shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Bouton fermer */}
      <button
        className="absolute top-3 left-3 p-2 rounded-full hover:bg-gray-200 transition"
        onClick={() => setRejectModal(false)}
      >
        <X size={22} className="text-[#000000] " strokeWidth={3} />
      </button>

      {/* Header */}
      <div className="bg-[#E9D28E]/50 p-6  rounded-t-xl mb-6 flex flex-col items-center text-center shadow-sm">
        <img
          src={sorryIcon}
          alt="désolé"
          className="w-16 h-16 mb-3"
        />
        <h2 className="font-bold text-black text-xl font-cairo">
          نعتذر لك عزيزي الخياط
        </h2>
        <p className="text-[#374151] text-base font-amiri mt-1">
          دعنا نوضح لك قواعد العمل وأسباب إلغاء الطلب
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[16px] font-amiri text-[#374151]">
      
      {/* Bloc 1 */}


      <div className="border-2 border-[#DADAD7] rounded-3xl p-6 shadow-[6px_6px_4px_0_#DADAD7] m-4">
        <h4 className="font-extrabold  mb-4 text-black text-2xl">قواعد العمل معنا :</h4>
        <ul className="space-y-3">
          {[
            "يجب أن يكون النموذج من تصميم وتنفيذ الخياط نفسه/ها",
            "يمنع نشر أي محتوى مخالف للأخلاق أو لا يتماشى مع أهداف المنصة",
            "لا يسمح بتكرار نفس النموذج أكثر من مرة",
            "النموذج الموافق عليه يصبح مرئيًا للعملاء ويدرج ضمن \"إبداعاتي\" تحت الحالة \"مقبول\"",
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <img src={checkIcon} alt="check" className="w-7 h-7"/>              
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Bloc 2 */}

      <div className="border-2 border-[#DADAD7] rounded-3xl p-6 shadow-[6px_6px_4px_0_#DADAD7] m-4">
        <h4 className="font-extrabold  mb-4 text-black text-2xl">الأسباب المحتملة لإلغاء طلبك:</h4>
        <ul className="space-y-3">
          {[
            "وجود صور غير أصلية أو مسروقة من الإنترنت",
            "معلومات ناقصة أو غير واضحة عن النموذج",
            "ضعف الجودة الظاهرة في الصور أو التصميم",
            "مخالفة أي قاعدة من قواعد النشر أو عدم احترام شروط الاستخدام",
          ].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E5B62B] text-black font-bold text-lg leading-none">
                  {i + 1}
                </div>
                <span className="flex-1">{text}</span>
              </li>

          ))}
        </ul>
      </div>


    </div>

      {/* Bouton bas */}
      <div className="m-3 text-center">
        <button
          onClick={() => setRejectModal(false)}
          className="bg-green-500 text-white px-10 py-2 rounded-full hover:bg-green-600 transition font-cairo text-lg"
        >
          حسناً، فهمت
        </button>
      </div>
    






    </div>
  </div>
)}



    </div>
  );
}
