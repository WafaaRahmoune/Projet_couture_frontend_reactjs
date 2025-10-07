import React, { useState } from "react";
import "../../style/landingStyle/QuestionSection.css";
import { ChevronDown, ChevronUp } from "lucide-react"; // icônes en SVG (optionnel)

export default function QuestionSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const questions = [
  {
    question: "كيف يمكنني الانضمام كخياطة في المنصة ؟",
    answer:
      "يمكنك التسجيل مجانًا عبر النموذج الموجود على المنصة، ثم رفع صور لأعمالك أو دليل عن خبراتك في الخياطة. سيقوم فريقنا بمراجعة ملفك خلال 24–48 ساعة. بمجرد الموافقة، ستحصلين على شهادة عضوية وتصبحين خيّاطة مسجلة معنا، مما يمكنك من عرض خدماتك واستقبال الطلبات عبر المنصة.",
  },
  {
    question: "هل يدفع العميل أكثر للتصاميم المخصصة ؟",
    answer:
      "نعم، التصاميم المخصصة تتطلب جهدًا ووقتًا إضافيين، حيث يتم تصميمها خصيصًا وفقًا لذوق العميل ومقاساته. ولهذا، يتم طلب دفع جزء من المبلغ مقدمًا قبل بدء العمل لضمان الجدية، مما يساعدنا على تقديم خدمة احترافية ترقى إلى توقعاتكم. نؤكد لكم أن كل طلب يُنفّذ بعناية واهتمام كبيرين.",
  },
  {
    question: "كم من الوقت يستغرق تنفيذ الطلبات ؟",
    answer:
      "يعتمد ذلك على الموديل ومدى تعقيده، فخياطة فستان بسيط ليست كخياطة فستان سهرة أو قفطان. أما بالنسبة للموديلات الجاهزة والمطلوبة مسبقًا، فنحن نبذل أقصى جهدنا لتصل طلباتكم في أقرب وقت ممكن.",
  },
  {
    question: "هل يمكنني الشراء بالجملة مع الحصول على تخفيضات في الأسعار ؟",
    answer:
      "نعم، ذلك ممكن. نحن نوفر خيارات للشراء بالجملة مع تخفيضات خاصة للتجار أو الطلبات الكبيرة. يمكنك التواصل معنا عبر مواقع التواصل الاجتماعي الموجودة في قسم 'تواصل معنا' للحصول على جميع التفاصيل.",
  },
];

  const toggleQuestion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <h2 className="faq-title">الأسئلة الشائعة</h2>
      <p className="faq-subtitle">
        اجابات شاملة على أكثر الأسئلة التي يطرحها عملاؤنا حول خدماتنا و طريقة عملنا
      </p>

      <div className="faq-container">
        {questions.map((q, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleQuestion(index)}
          >
            <div className="faq-question">
              <span>{q.question}</span>
              {activeIndex === index ? (
                <ChevronUp size={20} className="downup"/>
              ) : (
                <ChevronDown size={20} className="downup"/>
              )}
            </div>
            {activeIndex === index && q.answer && (
              <div className="faq-answer">{q.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
