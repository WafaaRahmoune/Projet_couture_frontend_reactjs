
import React, { useState, useEffect } from 'react';
import "../../style/landingStyle/ServicesSection.css";
import model from "../../assets/icons/model.png";
import couture from "../../assets/icons/couture.png";
import dropshipping from "../../assets/icons/dropshipping.png";
import special from "../../assets/icons/special.png";

const services = [
     {
    title: 'بيع النماذج',
    icon: model,
    color: '#E7B63C',
    soustitre:'مكتبة واسعة من النماذج الجاهزة و الحصرية',
    items: [
      'أكثر من 100 نموذج جاهز',
      'تحديثات أسبوعية للتصاميم الجديدة',
      'نماذج مخصصة لمواسم معينة',
      'نماذج خاصة تقدم بناءً على الطلبات',
    ],
  },
  {
    title: 'التخصيص',
    icon: special,
    color: '#0F1F4B',
    soustitre:'اختر النماذج حسب مقاساتك وذوقك',
    items: [
      'قياسات دقيقة ومخصصة',
      'اختيار الألوان والأقمشة',
      'إدخال التفاصيل والإكسسوارات',
      'دفع نسبة من السعر مسبقًا',
    ],
  },
 {
    title: 'خياطات عن بعد',
    icon: couture,
    color: '#DEB6D7',
    soustitre:'شبكة من أمهر الخياطات في الوطن',
    items: [
      'خياطات معتمدات و مدربات',
      'خدمة سريعة و متقنة ',
      'متابعة مباشرة لكل مراحل العمل',
      'ضمان الجودة و الوقت المحدد ',
    ],
  },
  {
    title: 'الدروبشيبينغ',
    icon:dropshipping,
    color: '#19A463',
    soustitre:'ابدأ عملك في مجال الخياطة بدون مخزون',
    items: [
      'لا حاجة لرأس مال كبير',
      'دعم تسويقي و تقني كامل',
      'عمولات مجزية تصل ل 30 %',
      'اكتسب خبرة في التسويق وإدارة الأعمال',
    ],
  },
  
];

export default function ServicesSection() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // ✅ écoute les changements de taille de l’écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="services-section" id="services">
      <h2 className="services-title">خدماتنا المتميزة</h2>
      <p className="services-subtitle">
        نقدم مجموعة شاملة من الخدمات المصممة خصيصًا لتلبية احتياجاتك في عالم الأزياء والخياطة
      </p>

      {isMobile ? (
        // ✅ Version Mobile (Accordion)
        <div className="mobile-view">
          {services.map((service, index) => (
            <div
              key={index}
              className={`service-accordion ${activeAccordion === index ? 'active' : ''}`}
            >
              <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                <div className="header-content">
                  <span className="service-icon" style={{ backgroundColor: service.color }}>
                    <img src={service.icon} alt={service.title} />
                  </span>
                  <div className="title-container">
                    <h3>{service.title}</h3>
                    <p className="soustitre">{service.soustitre}</p>
                  </div>
                </div>
                <span className="accordion-arrow">{activeAccordion === index ? '▲' : '▼'}</span>
              </div>
              <div
                className="accordion-content"
                style={{
                  maxHeight: activeAccordion === index ? '500px' : '0',
                  opacity: activeAccordion === index ? 1 : 0,
                }}
              >
                <ul className="service-list">
                  {service.items.map((item, i) => (
                    <li key={i}>
                      <span className="bullet" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ✅ Version Desktop (Grid)
        <div className="services-grid desktop-view">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-header">
                <span className="service-icon" style={{ backgroundColor: service.color }}>
                  <img src={service.icon} alt={service.title} />
                </span>
                <div className="title-container">
                  <h3>{service.title}</h3>
                  <p className="soustitre">{service.soustitre}</p>
                </div>
              </div>
              <ul className="service-list">
                {service.items.map((item, i) => (
                  <li key={i}>
                    <span className="bullet" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
