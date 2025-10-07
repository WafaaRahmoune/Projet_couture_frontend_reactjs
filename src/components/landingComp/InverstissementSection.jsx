import whatsapp from "../../assets/icons/whatsapp.png";
import "../../style/landingStyle/InvestissementSection.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InverstissementSection() {
  const [whatsappLink, setWhatsappLink] = useState("https://chat.whatsapp.com/GHvAxP5Jb5sFNQHqaoRgsw?mode=ac_t");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/clientapi/sociallinks/")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const apiData = res.data[0];
          // Utiliser le groupe d'investissement de l'API s'il existe, sinon garder la valeur par défaut
          if (apiData.group_investissement) {
            setWhatsappLink(apiData.group_investissement);
          }
        }
      })
      .catch((err) => {
        console.error("Erreur de récupération des liens d'investissement:", err);
        // Garde le lien par défaut en cas d'erreur
      });
  }, []);

  return (
    <>
      {/* Investment Section */}
      <div className="investment-section">
        <div className="investment-header">
          <h2 className="investment-title">فرصة استثمارية</h2>
          <div className="soustitre">
            هل ترغب في استثمار أموالك في مشروع مربح في مجال الخياطة؟
          </div>
          <p className="investment-description">
            نحن نبحث عن مستثمرين يشاركوننا هذه المشاريع. الحد الأدنى للاستثمار هو مبلغ بسيط. للمزيد من التفاصيل 
          </p>
        </div>     
      </div>
      <div className="containerbutton">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn whats"
        >
          تواصل معنا عبر الواتساب
          <img src={whatsapp} alt="WhatsApp" />
        </a>
      </div>
    </>
  );
}