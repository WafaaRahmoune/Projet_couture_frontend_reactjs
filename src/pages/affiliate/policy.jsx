// pages/PolicyAffiliate.jsx
import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Policy() {
  return (
    <div className="flex flex-col items-center text-right p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Logo */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-6 text-center sm:text-right">
        <img src="/logo.png" alt="Logo" className="h-12 sm:h-16 object-contain" />
        <h1 className="text-xl sm:text-2xl font-bold text-[#374151]">
          سياسة الاستخدام للمسوق بالعمولة
        </h1>
        <ShieldCheck className="text-[#F0C84B]" size={22} />
      </div>
  
      {/* Contenu */}
      <div className="space-y-6 sm:space-y-8 leading-7 sm:leading-8 text-sm sm:text-base text-[#374151]">
        {/* مقدمة */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">مقدمة</h2>
          <p>
            هذه السياسة موجهة للمسوقين بالعمولة (Affiliate) وتوضح الشروط
            والالتزامات الخاصة باستخدام الحساب. بقبولك بيانات الدخول من الإدارة،
            فإنك تقر بالالتزام الكامل بهذه الشروط.
          </p>
        </section>
  
        {/* إنشاء الحساب */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">إنشاء الحساب</h2>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 sm:space-y-3">
            <li>لا يحق للمسوق بالعمولة إنشاء حساب بنفسه.</li>
            <li>الحساب يتم إنشاؤه حصريًا من قبل إدارة المنصة.</li>
            <li>يتم تزويد المسوق باسم مستخدم (البريد الإلكتروني) وكلمة مرور صادرة عن الإدارة.</li>
            <li>لا يجوز تعديل بيانات الدخول إلا عبر قنوات الدعم الرسمية.</li>
          </ul>
        </section>
  
        {/* حقوق المسوق */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">حقوق المسوق بالعمولة</h2>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2">
            <li>الوصول إلى لوحة التحكم الخاصة به باستخدام بيانات الدخول.</li>
            <li>الاطلاع على الأرباح، الإحصائيات، والعمولات المستحقة.</li>
            <li>طلب الدعم الفني عبر المنصة عند الحاجة.</li>
            <li>الحق في إنهاء الحساب بطلب رسمي موجه للإدارة.</li>
          </ul>
        </section>
  
        {/* التزامات المسوق */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">التزامات المسوق بالعمولة</h2>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2">
            <li>استخدام الحساب حصريًا للأغراض التسويقية المصرح بها من المنصة.</li>
            <li>عدم مشاركة بيانات الدخول مع أي طرف ثالث.</li>
            <li>الامتناع عن استخدام طرق احتيالية أو سبام للحصول على عمولات.</li>
            <li>الالتزام بالقوانين المحلية والدولية الخاصة بالتسويق الرقمي.</li>
            <li>الامتثال لسياسات المحتوى والهوية البصرية للمنصة.</li>
          </ul>
        </section>
  
        {/* الاستخدام المقبول */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">الاستخدام المقبول</h2>
          <p>
            يتعهد المسوق باستخدام الحساب فقط للترويج للخدمات أو المنتجات
            المحددة من قبل المنصة. يمنع تمامًا:
          </p>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 mt-2">
            <li>التلاعب بالروابط أو البيانات لإظهار أرباح غير حقيقية.</li>
            <li>تشويه سمعة المنصة أو منافسيها.</li>
            <li>استعمال إعلانات مضللة أو غير قانونية.</li>
          </ul>
        </section>
  
        {/* العقوبات */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">العقوبات والإجراءات</h2>
          <p>في حالة مخالفة الشروط، تحتفظ الإدارة بالحق في:</p>
          <ul className="list-disc pr-5 sm:pr-6 space-y-2 mt-2">
            <li>إصدار تحذير كتابي للمسوق.</li>
            <li>تعليق الحساب مؤقتًا.</li>
            <li>إغلاق الحساب بشكل نهائي مع حجب أي عمولات مكتسبة بطرق غير قانونية.</li>
            <li>المتابعة القانونية عند الحاجة.</li>
          </ul>
        </section>
  
        {/* إنهاء الخدمة */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">إنهاء الخدمة</h2>
          <p>
            يحق للمسوق طلب إنهاء الحساب في أي وقت. كما تحتفظ الإدارة بحق إنهاء
            أو تعليق الحساب دون إشعار مسبق عند مخالفة أي من الشروط.
          </p>
        </section>
  
        {/* التعديلات */}
        <section className="bg-[#F9F9F6] p-4 sm:p-6 rounded-2xl shadow border border-[#E5E5D9]">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-[#F0C84B]">التعديلات</h2>
          <p>
            يمكن للإدارة تعديل هذه السياسة في أي وقت. استمرار استخدام الحساب
            يعني الموافقة الضمنية على أي تحديثات جديدة.
          </p>
        </section>
      </div>
  
      {/* Pied de page */}
      <div className="mt-8 sm:mt-10 text-xs sm:text-sm text-gray-500">
        آخر تحديث: 2025
      </div>
    </div>
  );
  
}
