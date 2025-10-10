import React, { useEffect, useState } from 'react';
import '../../style/landingStyle/DropshippingSection.css';
import modeles from "../../assets/icons/modeles.png";
import livraison from "../../assets/icons/livraison.png";
import time from "../../assets/icons/time.png";
import money from "../../assets/icons/money.png";
import whatsapp from "../../assets/icons/whatsapp.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useNavigationDecision from '../generalComponents/DecisionToMakeForPath';

export default function DropshippingSection() {

     const handleNavigation = useNavigationDecision();
    
      const handleButtonClick = (buttonName) => {
      handleNavigation(buttonName);
    };
  const [whatsappLink, setWhatsappLink] = useState("https://chat.whatsapp.com/GHvAxP5Jb5sFNQHqaoRgsw?mode=ac_t");
const navigate =useNavigate()
  useEffect(() => {
    axios.get("https://api.kadi-inv.store/clientapi/sociallinks/")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const apiData = res.data[0];
          // Utiliser le groupe dropshipping de l'API s'il existe, sinon garder la valeur par défaut
          if (apiData.group_dropshipping) {
            setWhatsappLink(apiData.group_dropshipping);
          }
        }
      })
      .catch((err) => {
        console.error("Erreur de récupération des liens dropshipping:", err);
        // Garde le lien par défaut en cas d'erreur
      });
  }, []);



  const features = [
    {
      icon: modeles,
      title: "عرض النماذج",
      description: "فرصة عرض النماذج في متجرك"
    },
    {
      icon: time,
      title: "مرونة في العمل",
      description: "اعمل في أي وقت و من أي مكان"
    },
   
    {
      icon: livraison,
      title: "خدمة التوصيل",
      description: "التغليف و التوصيل مهمتنا"
    },
     {
      icon: money,
      title: "أسعار الجملة",
      description: "تخفيضات تصل إلى 30%"
    },
  ];

  const steps = [
    {
      number: 1,
      text:"سجل في المنصة كمترشح"
    },
    {
      number: 2,
      text: "سنراجع متجرك الذي تود عرض نماذجنا فيه"
    },
    {
      number: 3,
      text: "نتواصل معك عبر الواتساب لتفاصيل أكثر"
    },
    {
      number: 4,
      text: "احصل على النماذج بسعر الجملة و اربح عمولة من كل بيعة"
    }
  ];

  return (
    <div className="dropshipping-section"  id="pub">
      <div className="container" id ="dropshipping">
        {/* Header */}
        <div className="header">
          <div className="announcement">
            إعلان خاص- فرصة محدودة
          </div>
          <h1 className="main-title">
            انضم لفريق الدروبشيبينغ
          </h1>
        </div>

        {/* Content */}
        <div className="content">
          {/* Question */}
          

          {/* Main Content Layout */}
          <div className="main-content">
            {/* Right Section - Features Grid */}
            <div className="right-section">
                <div className="steps-title">
            <h2 className="steps-title">لماذا تختار الدروب شيبينغ معنا؟</h2>
          </div>
              <div className="features-grid">
  {features.map((feature, index) => (
    <div key={index} className="feature-card">
      <div className="feature-icon">
        <img src={feature.icon} alt={feature.title} />
      </div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-description">{feature.description}</p>
    </div>
  ))}
</div>
            </div>

            {/* Left Section - Steps and Buttons */}
            <div className="left-section">
              {/* Steps Section */}
              <div className="steps-section">
                
                <div className="steps-list">
                    <h3 className="steps-title">كيف تبدأ في 4 خطوات بسيطة :</h3>
                  {steps.map((step, index) => (
                    <div key={index} className="step-item">
                      <div className="step-number">{step.number}</div>
                      <div className="step-text">{step.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="register-btn" onClick={() => handleButtonClick("التسجيل في الدروبشيبينغ")}>
  {
   JSON.parse(localStorage.getItem('user'))?.role === 'dropshipper' 
   ?  'تصفح المتجر' 
   : 'التسجيل في الدروبشيبينغ'}
</button>

               
                   <a
                     href={whatsappLink}
                     target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn"
                   >
  <img src={whatsapp} alt="WhatsApp" />
  تواصل معنا عبر الواتساب
</a>
                  
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
