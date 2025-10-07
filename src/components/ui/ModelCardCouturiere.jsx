//   import checkIcon from "../../assets/model/checked.png"
//   import calendarIcon from "../../assets/model/calendar.png";
//   import moneyIcon from "../../assets/model/money.png";
//   import boxIcon from "../../assets/model/box.png";
//   import infoIcon from "../../assets/model/info.png";
//   import { X, ChevronLeft, ChevronRight } from "lucide-react";
//   import bookIcon from "../../assets/model/book.png";
//   import descriptionIcon from "../../assets/model/description.png";
//   import colorsIcon from "../../assets/model/colors.png";
//   import sorryIcon from "../../assets/model/sorry.png";
//   import mesureIcon from "../../assets/model/mesure.png";
//   import quantityIcon from "../../assets/model/quantite.png";
//   import deaslineIcon from "../../assets/model/deadline.png"
//   import React, { useState, useRef, useEffect } from "react";
  
//   import { motion, AnimatePresence } from "framer-motion";
  
//   export default function ModelCard({
//     name,
//     code,
//     pricePerPiece,
//     totalPieces,
//     date,
//     type,
//     description,
//     status,
//     images,
//     sizes,
//     priceLabel,
//     deadline
//   }) {
//     const [showDetails, setShowDetails] = useState(false);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [activeIndex, setActiveIndex] = useState(0);
//     const [rejectModal, setRejectModal] = useState(false);
  
//     const formatDeadline = (dateString) => {
//       if (!dateString) return '';
//       const parts = dateString.split(/[-/]/);
//       if (parts.length === 3) {
//         const [day, month, year] = parts;
//         return `${year}-${month}-${day}`;
//       }
//       return dateString;
//     };
  
//     const typeLabels = {
//       femme: "نسائي",
//       homme: "رجالي",
//       enfant: "أطفال",
//       babie: "رضع",
//       Femme: "نسائي",
//       Homme: "رجالي",
//       Enfant: "أطفال",
//       Babie: "رضع"
//     };
  
//     const isAccepted = status === "done"|| status ==="accepted"|| status ==="Accepted";
//     const isRejected = status === "cancelled" || status === "Cancelled";
  
//     const statusTranslations = {
//       inprogress: "قيد التنفيذ",
//       pending: "قيد الانتظار",
//       done: "منجز",
//       cancelled: "ملغى",
//       accepted: "مقبول",
//       waiting: "قيد الانتظار"
//     };
  
//     const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
//     const prevImage = () =>
//       setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  
  
  
  
  
//     // dans le corps du composant, juste après les useState existants:
//   const mobileScrollRef = useRef(null);
//   const touchStartRef = useRef(null);
  
//   // helper: quand on scroll le container mobile on met à jour activeIndex
//   const handleMobileScroll = () => {
//     const el = mobileScrollRef.current;
//     if (!el) return;
//     // calcule l'index approximatif en fonction de la largeur visible
//     const idx = Math.round(el.scrollLeft / el.clientWidth);
//     if (idx !== activeIndex) setActiveIndex(idx);
//   };
  
//   // scroll to index helper (utilisé par les dots)
//   const scrollToIndex = (i) => {
//     const el = mobileScrollRef.current;
//     if (!el) return;
//     el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
//   };
  
//     return (
//       <div className="border-2 border-[#999EA6] rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col gap-3 sm:gap-4">
  
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
//           {/* Infos modèle */}
//           <div className="space-y-1 sm:space-y-2">
//             <h2 className="text-[14px] sm:text-[22px] font-cairo text-[#374151]">
//               {name} : <span className="text-[#374151]">كود {code}</span>
//             </h2>
  
//             {/* Infos rapides */}
//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2 sm:mt-4 text-[12px] sm:text-[18px] font-amiri text-[#374151]">
//               <div className="flex items-center gap-1 sm:gap-2">
//                 <img src={calendarIcon} alt="calendar" className="w-4 h-4 sm:w-5 sm:h-5" />
//                 {date}
//               </div>
//               <div className="flex items-center gap-1 sm:gap-2">
//                 <img src={moneyIcon} alt="money" className="w-4 h-4 sm:w-5 sm:h-5" />
//                 {pricePerPiece} دج {priceLabel}
//               </div>
//               <div className="flex items-center gap-1 sm:gap-2">
//                 <img src={boxIcon} alt="box" className="w-4 h-4 sm:w-5 sm:h-5" />
//                 المجموع: {totalPieces} قطعة
//               </div>
//               <button
//                 className="text-blue-500 text-[12px] sm:text-[18px] font-amiri"
//                 onClick={() => setShowDetails(!showDetails)}
//               >
//                 {showDetails ? "عرض أقل ..." : "عرض المزيد ..."}
//               </button>
//             </div>
//           </div>
  
//           {/* Badge statut */}
//           <div className="flex items-center gap-2 self-end sm:self-center">
//             <span
//               className={`px-3 sm:px-6 min-w-[70px] sm:min-w-[100px] py-1 sm:py-2 rounded-full text-white text-[12px] sm:text-base ${
//                 isAccepted
//                   ? "bg-green-500"
//                   : status ==="waiting"
//                   ? "bg-[#17A2B8]"
//                   :status === "inprogress"
//                   ? "bg-[#E5B62B]"
//                   : "bg-red-400"
//               }`}
//             >
//               {statusTranslations[status]}
//             </span>
//             {isRejected && (
//               <button onClick={() => setRejectModal(true)}>
//                 <img src={infoIcon} alt="info" className="w-5 h-5 sm:w-6 sm:h-6" />
//               </button>
//             )}
//           </div>
//         </div>
  
//         {/* --- Détails --- */}
//         {showDetails && (
//           <div>
//             <hr className="border-[#999EA6] mb-3 " />
  
//             <div className="flex flex-col md:flex-row flex-wrap gap-4 text-[12px] sm:text-[18px] font-amiri text-[#374151]">
//               {/* Description */}
//               <div className="flex-1 max-w-lg">
//                 <div className="flex flex-col gap-2">
//                   <div className="flex items-center gap-2">
//                     <img src={bookIcon} alt="book" className="w-4 h-4 sm:w-5 sm:h-5" />
//                     النوع: {typeLabels[type] || type}
//                   </div>
//                   {deadline && (
//                     <div className="flex items-center gap-2">
//                       <img src={deaslineIcon} alt="deadline" className="w-4 h-4 sm:w-5 sm:h-5" />
//                       تاريخ التسليم: {formatDeadline(deadline)}
//                     </div>
//                   )}
//                   <p className="mt-2 flex items-start gap-2 leading-relaxed">
//                     <img src={descriptionIcon} alt="desc" className="w-4 h-4 sm:w-5 sm:h-5 mt-1" />
//                     {description}
//                   </p>
//                 </div>
  
//                 {/* Tableau */}
//                 <table className="mt-4 w-full text-center border border-[#999EA6] border-collapse text-[11px] sm:text-[16px]">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="p-2 border border-[#999EA6]">المقاس</th>
//                       <th className="p-2 border border-[#999EA6]">اللون</th>
//                       <th className="p-2 border border-[#999EA6]">الكمية</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {sizes.map((s, i) => (
//                       <tr key={i} className="border border-[#999EA6]">
//                         <td className="p-2 border border-[#999EA6]">{s.size}</td>
//                         <td className="p-2 border border-[#999EA6]">
//                           <div className="flex items-center justify-center gap-2">
//                             <span
//                               className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-[#999EA6]"
//                               style={{ backgroundColor: s.hex }}
//                             ></span>
//                             {s.color}
//                           </div>
//                         </td>
//                         <td className="p-2 border border-[#999EA6]">{s.quantity}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
  
  
  
//               {/* Images */}
//   {images && images.length > 0 && (
//     <div className="w-full flex flex-col items-center justify-center flex-1">

//  {/* --- MOBILE: même logique que desktop, sans scroll tactile --- */}
// <div className="w-full sm:hidden flex flex-col items-center justify-center">
//   <img
//     src={images[activeIndex]}
//     alt={name}
//     className="w-full h-48 object-cover rounded-xl cursor-pointer"
//     onClick={() => setModalOpen(true)}
//   />
//   <div className="flex gap-2 mt-2">
//     {images.map((_, i) => (
//       <button
//         key={i}
//         onClick={() => setActiveIndex(i)}
//         className={`w-2 h-2 rounded-full cursor-pointer transition ${
//           i === activeIndex ? "bg-yellow-400 scale-110" : "bg-gray-300"
//         }`}
//         aria-label={`Select image ${i + 1}`}
//       />
//     ))}
//   </div>
// </div>

//       {/* --- DESKTOP: affichage actuel amélioré */}
//       <div className="hidden sm:flex flex-col items-center justify-center flex-1">
//         <img
//           src={images[activeIndex]}
//           alt={name}
//           className="w-48 h-64 object-cover rounded-xl cursor-pointer"
//           onClick={() => setModalOpen(true)}
//         />
//         <div className="flex gap-2 mt-2">
//           {images.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setActiveIndex(i)}
//               className={`w-3 h-3 rounded-full cursor-pointer transition ${i === activeIndex ? "bg-yellow-400 scale-110" : "bg-gray-300"}`}
//               aria-label={`Select image ${i + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>

    
//   )}
//             </div>
//           </div>
//         )}
  
  
//         {/* --- Modal refus --- */}
//         {rejectModal && (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
//             onClick={() => setRejectModal(false)}
//           >
//             <div
//               className="bg-white rounded-2xl max-w-5xl w-full relative shadow-xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Bouton fermer */}
//               <button
//                 className="absolute top-3 left-3 p-2 rounded-full hover:bg-gray-200 transition"
//                 onClick={() => setRejectModal(false)}
//               >
//                 <X size={20} sm:size={22} className="text-[#000000]" strokeWidth={3} />
//               </button>
  
//               {/* Header */}
//               <div className="bg-[#E9D28E]/50 p-4 sm:p-6 rounded-t-xl mb-6 flex flex-col items-center text-center shadow-sm">
//                 <img src={sorryIcon} alt="désolé" className="w-12 h-12 sm:w-16 sm:h-16 mb-3" />
//                 <h2 className="font-bold text-black text-lg sm:text-xl font-cairo">
//                   نعتذر لك عزيزي الخياط
//                 </h2>
//                 <p className="text-[#374151] text-sm sm:text-base font-amiri mt-1">
//                   دعنا نوضح لك قواعد العمل وأسباب إلغاء الطلب
//                 </p>
//               </div>
  
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[13px] sm:text-[16px] font-amiri text-[#374151]">
//                 {/* Bloc 1 */}
//                 <div className="border-2 border-[#DADAD7] rounded-3xl p-4 sm:p-6 shadow-[6px_6px_4px_0_#DADAD7] m-2 sm:m-4">
//                   <h4 className="font-extrabold mb-4 text-black text-lg sm:text-2xl">قواعد العمل معنا :</h4>
//                   <ul className="space-y-3">
//                     {[
//                       "يجب أن يكون النموذج من تصميم وتنفيذ الخياط نفسه/ها",
//                       "يمنع نشر أي محتوى مخالف للأخلاق أو لا يتماشى مع أهداف المنصة",
//                       "لا يسمح بتكرار نفس النموذج أكثر من مرة",
//                       "النموذج الموافق عليه يصبح مرئيًا للعملاء ويدرج ضمن \"إبداعاتي\" تحت الحالة \"مقبول\"",
//                     ].map((text, i) => (
//                       <li key={i} className="flex items-start gap-3">
//                         <img src={checkIcon} alt="check" className="w-5 h-5 sm:w-7 sm:h-7"/>              
//                         <span>{text}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
  
//                 {/* Bloc 2 */}
//                 <div className="border-2 border-[#DADAD7] rounded-3xl p-4 sm:p-6 shadow-[6px_6px_4px_0_#DADAD7] m-2 sm:m-4">
//                   <h4 className="font-extrabold mb-4 text-black text-lg sm:text-2xl">الأسباب المحتملة لإلغاء طلبك:</h4>
//                   <ul className="space-y-3">
//                     {[
//                       "وجود صور غير أصلية أو مسروقة من الإنترنت",
//                       "معلومات ناقصة أو غير واضحة عن النموذج",
//                       "ضعف الجودة الظاهرة في الصور أو التصميم",
//                       "مخالفة أي قاعدة من قواعد النشر أو عدم احترام شروط الاستخدام",
//                     ].map((text, i) => (
//                       <li key={i} className="flex items-start gap-3">
//                         <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#E5B62B] text-black font-bold text-sm sm:text-lg leading-none">
//                           {i + 1}
//                         </div>
//                         <span className="flex-1">{text}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
  
//               {/* Bouton bas */}
//               <div className="m-3 text-center">
//                 <button
//                   onClick={() => setRejectModal(false)}
//                   className="bg-green-500 text-white px-6 sm:px-10 py-2 rounded-full hover:bg-green-600 transition font-cairo text-sm sm:text-lg"
//                 >
//                   حسناً، فهمت
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
  
  
  
  
  
  
  
  
  
  
//   {/* --- Modal images (full screen) --- */}
//   {modalOpen && (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
//       onClick={() => setModalOpen(false)}
//     >
//       <div
//         className="bg-white rounded-2xl p-3 sm:p-4 max-w-5xl w-full relative overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           className="absolute top-2 left-2 bg-gray-100 p-1 rounded-full hover:bg-gray-200 z-30"
//           onClick={() => setModalOpen(false)}
//         >
//           <X size={24} />
//         </button>
  
//         <h3 className="text-center text-[16px] sm:text-[22px] font-cairo text-[#374151] mb-4">
//           {name}
//         </h3>
  
//         <div className="relative w-full flex items-center justify-center">
//           {/* Prev */}
//           <button
//             onClick={prevImage}
//             disabled={activeIndex === 0}
//             className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full ${activeIndex === 0 ? "text-gray-400 cursor-not-allowed" : "text-black hover:bg-gray-100"}`}
//           >
//             <ChevronLeft size={28} />
//           </button>
  
//           {/* Image unique visible */}
//           <div
//             className="w-full flex items-center justify-center"
//             // touch handlers pour swipe dans le modal
//             onTouchStart={(e) => (touchStartRef.current = e.touches[0].clientX)}
//             onTouchEnd={(e) => {
//               if (!touchStartRef.current) return;
//               const end = e.changedTouches[0].clientX;
//               const diff = touchStartRef.current - end;
//               const threshold = 50; // pixels
//               if (diff > threshold) {
//                 nextImage();
//               } else if (diff < -threshold) {
//                 prevImage();
//               }
//               touchStartRef.current = null;
//             }}
//           > 
//             <AnimatePresence initial={false} mode="wait">
//               <motion.img
//                 key={activeIndex}
//                 src={images[activeIndex]}
//                 alt={`${name}-${activeIndex}`}
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 transition={{ duration: 0.25 }}
//                 className="max-h-[60vh] sm:max-h-[70vh] object-contain rounded-xl"
//               />
//             </AnimatePresence>
//           </div>
  
//           {/* Next */}
//           <button
//             onClick={nextImage}
//             disabled={activeIndex === images.length - 1}
//             className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full ${activeIndex === images.length - 1 ? "text-gray-400 cursor-not-allowed" : "text-black hover:bg-gray-100"}`}
//           >
//             <ChevronRight size={28} />
//           </button>
//         </div>
  
// {/* Cercles d’indicateurs RTL */}
// <div className="flex justify-center mt-4 gap-2">
//   {[...images].reverse().map((_, index) => {
//     const realIndex = images.length - 1 - index
//     return (
//       <button
//         key={index}
//         onClick={() => setActiveIndex(realIndex)}
//         className={`w-3 h-3 rounded-full transition-all ${
//           realIndex === activeIndex ? "bg-yellow-500 scale-110" : "bg-gray-400"
//         }`}
//       />
//     )
//   })}
// </div>

//       </div>
//     </div>
//   )}
  
//       </div>
//     );
//   }

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
import React, { useState, useRef, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

export default function ModelCard({
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
  priceLabel,
  deadline
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rejectModal, setRejectModal] = useState(false);

  // Vérifier si toutes les couleurs sont vides ou null
  const shouldRemoveColorColumn = sizes.every(size => 
    !size.color || size.color.trim() === "" || !size.hex || size.hex.trim() === ""
  );

  const formatDeadline = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split(/[-/]/);
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

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

  const isAccepted = status === "done"|| status ==="accepted"|| status ==="Accepted";
  const isRejected = status === "cancelled" || status === "Cancelled";

  const statusTranslations = {
    inprogress: "قيد التنفيذ",
    pending: "قيد الانتظار",
    done: "منجز",
    cancelled: "ملغى",
    accepted: "مقبول",
    waiting: "قيد الانتظار"
  };

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // dans le corps du composant, juste après les useState existants:
const mobileScrollRef = useRef(null);
const touchStartRef = useRef(null);

// helper: quand on scroll le container mobile on met à jour activeIndex
const handleMobileScroll = () => {
  const el = mobileScrollRef.current;
  if (!el) return;
  // calcule l'index approximatif en fonction de la largeur visible
  const idx = Math.round(el.scrollLeft / el.clientWidth);
  if (idx !== activeIndex) setActiveIndex(idx);
};

// scroll to index helper (utilisé par les dots)
const scrollToIndex = (i) => {
  const el = mobileScrollRef.current;
  if (!el) return;
  el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
};

  return (
    <div className="border-2 border-[#999EA6] rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col gap-3 sm:gap-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6">
        {/* Infos modèle */}
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-[14px] sm:text-[22px] font-cairo text-[#374151]">
            {name} : <span className="text-[#374151]">كود {code}</span>
          </h2>

          {/* Infos rapides */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2 sm:mt-4 text-[12px] sm:text-[18px] font-amiri text-[#374151]">
            <div className="flex items-center gap-1 sm:gap-2">
              <img src={calendarIcon} alt="calendar" className="w-4 h-4 sm:w-5 sm:h-5" />
              {date}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <img src={moneyIcon} alt="money" className="w-4 h-4 sm:w-5 sm:h-5" />
              {pricePerPiece} دج {priceLabel}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <img src={boxIcon} alt="box" className="w-4 h-4 sm:w-5 sm:h-5" />
              المجموع: {totalPieces} قطعة
            </div>
            <button
              className="text-blue-500 text-[12px] sm:text-[18px] font-amiri"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "عرض أقل ..." : "عرض المزيد ..."}
            </button>
          </div>
        </div>

        {/* Badge statut */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span
            className={`px-3 sm:px-6 min-w-[70px] sm:min-w-[100px] py-1 sm:py-2 rounded-full text-white text-[12px] sm:text-base ${
              isAccepted
                ? "bg-green-500"
                : status ==="waiting"
                ? "bg-[#17A2B8]"
                :status === "inprogress"
                ? "bg-[#E5B62B]"
                : "bg-red-400"
            }`}
          >
            {statusTranslations[status]}
          </span>
          {isRejected && (
            <button onClick={() => setRejectModal(true)}>
              <img src={infoIcon} alt="info" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </div>

      {/* --- Détails --- */}
      {showDetails && (
        <div>
          <hr className="border-[#999EA6] mb-3 " />

          <div className="flex flex-col md:flex-row flex-wrap gap-4 text-[12px] sm:text-[18px] font-amiri text-[#374151]">
            {/* Description */}
            <div className="flex-1 max-w-lg">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img src={bookIcon} alt="book" className="w-4 h-4 sm:w-5 sm:h-5" />
                  النوع: {typeLabels[type] || type}
                </div>
                {deadline && (
                  <div className="flex items-center gap-2">
                    <img src={deaslineIcon} alt="deadline" className="w-4 h-4 sm:w-5 sm:h-5" />
                    تاريخ التسليم: {formatDeadline(deadline)}
                  </div>
                )}
                <p className="mt-2 flex items-start gap-2 leading-relaxed">
                  <img src={descriptionIcon} alt="desc" className="w-4 h-4 sm:w-5 sm:h-5 mt-1" />
                  {description}
                </p>
              </div>

              {/* Tableau */}
              <table className="mt-4 w-full text-center border border-[#999EA6] border-collapse text-[11px] sm:text-[16px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border border-[#999EA6]">المقاس</th>
                    {!shouldRemoveColorColumn && (
                      <th className="p-2 border border-[#999EA6]">اللون</th>
                    )}
                    <th className="p-2 border border-[#999EA6]">الكمية</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((s, i) => (
                    <tr key={i} className="border border-[#999EA6]">
                      <td className="p-2 border border-[#999EA6]">{s.size}</td>
                      {!shouldRemoveColorColumn && (
                        <td className="p-2 border border-[#999EA6]">
                          <div className="flex items-center justify-center gap-2">
                            {s.hex && s.hex.trim() !== "" && (
                              <span
                                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-[#999EA6]"
                                style={{ backgroundColor: s.hex }}
                              ></span>
                            )}
                            {s.color && s.color.trim() !== "" ? s.color : "-"}
                          </div>
                        </td>
                      )}
                      <td className="p-2 border border-[#999EA6]">{s.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Images */}
{images && images.length > 0 && (
  <div className="w-full flex flex-col items-center justify-center flex-1">

{/* --- MOBILE: même logique que desktop, sans scroll tactile --- */}
<div className="w-full sm:hidden flex flex-col items-center justify-center">
  <img
    src={images[activeIndex]}
    alt={name}
    className="w-full h-48 object-cover rounded-xl cursor-pointer"
    onClick={() => setModalOpen(true)}
  />
  <div className="flex gap-2 mt-2">
    {images.map((_, i) => (
      <button
        key={i}
        onClick={() => setActiveIndex(i)}
        className={`w-2 h-2 rounded-full cursor-pointer transition ${
          i === activeIndex ? "bg-yellow-400 scale-110" : "bg-gray-300"
        }`}
        aria-label={`Select image ${i + 1}`}
      />
    ))}
  </div>
</div>

    {/* --- DESKTOP: affichage actuel amélioré */}
    <div className="hidden sm:flex flex-col items-center justify-center flex-1">
      <img
        src={images[activeIndex]}
        alt={name}
        className="w-48 h-64 object-cover rounded-xl cursor-pointer"
        onClick={() => setModalOpen(true)}
      />
      <div className="flex gap-2 mt-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${i === activeIndex ? "bg-yellow-400 scale-110" : "bg-gray-300"}`}
            aria-label={`Select image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  </div>

  
)}
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
            className="bg-white rounded-2xl max-w-5xl w-full relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              className="absolute top-3 left-3 p-2 rounded-full hover:bg-gray-200 transition"
              onClick={() => setRejectModal(false)}
            >
              <X size={20} sm:size={22} className="text-[#000000]" strokeWidth={3} />
            </button>

            {/* Header */}
            <div className="bg-[#E9D28E]/50 p-4 sm:p-6 rounded-t-xl mb-6 flex flex-col items-center text-center shadow-sm">
              <img src={sorryIcon} alt="désolé" className="w-12 h-12 sm:w-16 sm:h-16 mb-3" />
              <h2 className="font-bold text-black text-lg sm:text-xl font-cairo">
                نعتذر لك عزيزي الخياط
              </h2>
              <p className="text-[#374151] text-sm sm:text-base font-amiri mt-1">
                دعنا نوضح لك قواعد العمل وأسباب إلغاء الطلب
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[13px] sm:text-[16px] font-amiri text-[#374151]">
              {/* Bloc 1 */}
              <div className="border-2 border-[#DADAD7] rounded-3xl p-4 sm:p-6 shadow-[6px_6px_4px_0_#DADAD7] m-2 sm:m-4">
                <h4 className="font-extrabold mb-4 text-black text-lg sm:text-2xl">قواعد العمل معنا :</h4>
                <ul className="space-y-3">
                  {[
                    "يجب أن يكون النموذج من تصميم وتنفيذ الخياط نفسه/ها",
                    "يمنع نشر أي محتوى مخالف للأخلاق أو لا يتماشى مع أهداف المنصة",
                    "لا يسمح بتكرار نفس النموذج أكثر من مرة",
                    "النموذج الموافق عليه يصبح مرئيًا للعملاء ويدرج ضمن \"إبداعاتي\" تحت الحالة \"مقبول\"",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <img src={checkIcon} alt="check" className="w-5 h-5 sm:w-7 sm:h-7"/>              
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bloc 2 */}
              <div className="border-2 border-[#DADAD7] rounded-3xl p-4 sm:p-6 shadow-[6px_6px_4px_0_#DADAD7] m-2 sm:m-4">
                <h4 className="font-extrabold mb-4 text-black text-lg sm:text-2xl">الأسباب المحتملة لإلغاء طلبك:</h4>
                <ul className="space-y-3">
                  {[
                    "وجود صور غير أصلية أو مسروقة من الإنترنت",
                    "معلومات ناقصة أو غير واضحة عن النموذج",
                    "ضعف الجودة الظاهرة في الصور أو التصميم",
                    "مخالفة أي قاعدة من قواعد النشر أو عدم احترام شروط الاستخدام",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#E5B62B] text-black font-bold text-sm sm:text-lg leading-none">
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
                className="bg-green-500 text-white px-6 sm:px-10 py-2 rounded-full hover:bg-green-600 transition font-cairo text-sm sm:text-lg"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}







{/* --- Modal images (full screen) --- */}
{modalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    onClick={() => setModalOpen(false)}
  >
    <div
      className="bg-white rounded-2xl p-3 sm:p-4 max-w-5xl w-full relative overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-2 left-2 bg-gray-100 p-1 rounded-full hover:bg-gray-200 z-30"
        onClick={() => setModalOpen(false)}
      >
        <X size={24} />
      </button>

      <h3 className="text-center text-[16px] sm:text-[22px] font-cairo text-[#374151] mb-4">
        {name}
      </h3>

      <div className="relative w-full flex items-center justify-center">
        {/* Prev */}
        <button
          onClick={prevImage}
          disabled={activeIndex === 0}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full ${activeIndex === 0 ? "text-gray-400 cursor-not-allowed" : "text-black hover:bg-gray-100"}`}
        >
          <ChevronLeft size={28} />
        </button>

        {/* Image unique visible */}
        <div
          className="w-full flex items-center justify-center"
          // touch handlers pour swipe dans le modal
          onTouchStart={(e) => (touchStartRef.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (!touchStartRef.current) return;
            const end = e.changedTouches[0].clientX;
            const diff = touchStartRef.current - end;
            const threshold = 50; // pixels
            if (diff > threshold) {
              nextImage();
            } else if (diff < -threshold) {
              prevImage();
            }
            touchStartRef.current = null;
          }}
        > 
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${name}-${activeIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="max-h-[60vh] sm:max-h-[70vh] object-contain rounded-xl"
            />
          </AnimatePresence>
        </div>

        {/* Next */}
        <button
          onClick={nextImage}
          disabled={activeIndex === images.length - 1}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full ${activeIndex === images.length - 1 ? "text-gray-400 cursor-not-allowed" : "text-black hover:bg-gray-100"}`}
        >
          <ChevronRight size={28} />
        </button>
      </div>

{/* Cercles d’indicateurs RTL */}
<div className="flex justify-center mt-4 gap-2">
  {[...images].reverse().map((_, index) => {
    const realIndex = images.length - 1 - index
    return (
      <button
        key={index}
        onClick={() => setActiveIndex(realIndex)}
        className={`w-3 h-3 rounded-full transition-all ${
          realIndex === activeIndex ? "bg-yellow-500 scale-110" : "bg-gray-400"
        }`}
      />
    )
  })}
</div>

    </div>
  </div>
)}

    </div>
  );
}