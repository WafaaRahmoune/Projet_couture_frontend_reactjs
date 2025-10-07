import React from "react";
// import { ShieldCheck } from "lucide-react";

export default function Policy() {
  return (
    <div className="flex flex-col items-center text-right p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Logo et titre */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-6 text-center sm:text-right">
        <img src="/logo.png" alt="Logo" className="h-12 sm:h-16 object-contain" />
        <h1 className="text-xl sm:text-2xl font-bold text-[#374151]">
          سياسة الاستخدام للخياطة
        </h1>
        {/* <ShieldCheck className="text-[#F0C84B]" size={22} /> */}
      </div>
  
      {/* Contenu */}
      <div className="space-y-6 sm:space-y-8 leading-7 sm:leading-8 text-sm sm:text-base text-[#374151]">
        {/* مقدمة */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">
            مقدمة
          </h2>
          <p>
            هذه السياسة توضح شروط التسجيل والاستخدام الخاصة بالخياطة على منصتنا.
            باستخدامك للمنصة أو التسجيل فيها، فإنك تقرين بالالتزام التام بهذه
            الشروط، وفي حال عدم الموافقة يرجى التوقف عن استخدام الخدمة.
          </p>
        </section>
  
        {/* التسجيل وتفعيل الحساب */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">
            التسجيل وتفعيل الحساب
          </h2>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 sm:space-y-3">
            <li>يمكن للخياطة التسجيل بإنشاء حساب جديد وتقديم جميع المعلومات المطلوبة.</li>
            <li>
              يبقى الحساب في حالة <strong>قيد المراجعة</strong> بعد التسجيل ولا يسمح
              باستخدامه مباشرة.
            </li>
            <li>يتم تفعيل الحساب فقط بعد مراجعة الإدارة والتحقق من صحة البيانات.</li>
            <li>للإدارة الحق في رفض أي طلب تسجيل دون إبداء الأسباب.</li>
            <li>لا يجوز إنشاء أكثر من حساب واحد لكل خياطة إلا بموافقة الإدارة.</li>
          </ul>
        </section>
  
        {/* حقوق الخياطة */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">
            حقوق الخياطة
          </h2>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2">
            <li>الاستفادة من كافة خدمات المنصة بعد التفعيل.</li>
            <li>تعديل أو تحديث بيانات الحساب متى شاءت.</li>
            <li>الحصول على دعم فني عبر قنوات الاتصال الرسمية.</li>
            <li>حماية بياناتها وعدم مشاركتها مع أطراف ثالثة بدون موافقة.</li>
          </ul>
        </section>
  
        {/* التزامات الخياطة */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">
            التزامات الخياطة
          </h2>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2">
            <li>تقديم بيانات صحيحة ومحدثة أثناء التسجيل.</li>
            <li>الحفاظ على سرية اسم المستخدم وكلمة المرور وعدم مشاركتهما.</li>
            <li>تقديم أعمال بجودة عالية والالتزام بالمواعيد المتفق عليها مع العملاء.</li>
            <li>عدم استخدام المنصة في أنشطة غير قانونية أو تضر بسمعة المنصة.</li>
            <li>احترام العملاء وعدم نشر أي محتوى مسيء أو مخالف للأعراف.</li>
          </ul>
        </section>
  
        {/* الاستخدام المقبول */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">
            الاستخدام المقبول
          </h2>
          <p>
            يلتزم المستخدم باستخدام المنصة للأغراض المهنية فقط والمتعلقة بالخدمات
            المقدمة. يمنع منعًا باتًا:
          </p>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 mt-2">
            <li>انتحال هوية أشخاص أو تقديم بيانات مزيفة.</li>
            <li>التلاعب بالطلبات أو محاولة الاحتيال.</li>
            <li>نشر أو مشاركة محتوى ينتهك حقوق الملكية الفكرية.</li>
          </ul>
        </section>
  
        {/* الملكية الفكرية */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">
            حقوق الملكية الفكرية
          </h2>
          <p>
            جميع المحتويات والشعارات والتصاميم الخاصة بالمنصة محمية بحقوق
            الملكية الفكرية. لا يجوز نسخها أو استخدامها دون إذن خطي من الإدارة.
          </p>
        </section>
  
        {/* العقوبات */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">
            العقوبات والإجراءات
          </h2>
          <p>تحتفظ الإدارة بالحق في اتخاذ الإجراءات التالية عند مخالفة الشروط:</p>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 mt-2">
            <li>تحذير المستخدم كتابياً.</li>
            <li>تعليق الحساب مؤقتاً.</li>
            <li>إغلاق الحساب بشكل نهائي.</li>
            <li>اتخاذ إجراءات قانونية إذا لزم الأمر.</li>
          </ul>
        </section>
  
        {/* إنهاء الخدمة */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">
            إنهاء الخدمة
          </h2>
          <p>
            يمكن للخياطة طلب إيقاف الحساب في أي وقت. كما يحق للإدارة إنهاء أو
            تعليق الخدمة دون إشعار مسبق في حال مخالفة الشروط.
          </p>
        </section>
  
        {/* التعديلات */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">
            التعديلات
          </h2>
          <p>
            يحق للإدارة تعديل هذه السياسة في أي وقت. استمرارك في استخدام المنصة
            بعد نشر التعديلات يعتبر موافقة ضمنية عليها.
          </p>
        </section>
      </div>
  
      {/* Pied de page */}
      <div className="mt-8 sm:mt-10 text-xs sm:text-sm text-gray-500">
        آخر تحديث: 2025
      </div>
    </div>
  )
  

}
