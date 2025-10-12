import "../../style/landingStyle/FooterSection.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../assets/logowhite.png";
import whatsappIcon from "../../assets/icons/whatsapp.png";
import facebookIcon from "../../assets/icons/facebook.png";
import instagramIcon from "../../assets/icons/instagram.png";

export default function FooterSection() {
  // Liens par défaut
  const defaultLinks = [
    { name: "whatsapp", url: "https://chat.whatsapp.com/CIsLTdIOXGrB9zWTQAHbpx?mode=ac_t" },
    { name: "facebook", url: "https://m.facebook.com/ala.banahyt.lalalabansit.alashur.unyat/" },
    { name: "instagram", url: "https://instagram.com/kadi.householde" },
  ];

  const [socialLinks, setSocialLinks] = useState(defaultLinks);
  const [contactInfo, setContactInfo] = useState({
    email: "info@Kadi'sHouseholde.com",
    phone: "0696449925"
  });

  useEffect(() => {
    axios.get("https://api.kadi-inv.store/clientapi/sociallinks/")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const apiData = res.data[0]; // Prendre le premier élément du tableau
          apiData.whatsapp
          // Mettre à jour les liens sociaux
          const updatedLinks = [
            
            { name: "facebook", url: apiData.facebook || defaultLinks[1].url },
            { name: "instagram", url: apiData.instagram || defaultLinks[2].url }
          ];
          setSocialLinks(updatedLinks);
          
          // Mettre à jour les informations de contact si disponibles
          if (apiData.whatsapp) {
            setContactInfo(prev => ({
              ...prev,
              phone: apiData.whatsapp
            }));
          }
        }
      })
      .catch((err) => {
        console.error("Erreur de récupération des liens:", err);
        // Garde les liens par défaut en cas d'erreur
      });
  }, []);

  const iconMap = {
    whatsapp: whatsappIcon,
    facebook: facebookIcon,
    instagram: instagramIcon,
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        {/* Bloc 1 */}
        <div className="footer-brand">
          <h3 className="footer-title">منصة شاملة لربط عالم الخياطة والأزياء</h3>
          <div className="footer-logo">
            <img src={logo} alt="Logo Kadi" />
          </div>
        </div>

        {/* Bloc 2 */}
        <div className="footer-column justdesktop">
          <h3 className="footer-title">الخدمات</h3>
          <ul className="footer-list">
            <li>بيع النماذج</li>
            <li>التخصيص</li>
            <li>خيّاطات عن بعد</li>
            <li>الدروبشيينغ</li>
          </ul>
        </div>

        {/* Bloc 3 */}
        <div className="footer-column">
          <h3 className="footer-title">تواصل معنا</h3>
          <p>البريد الإلكتروني :</p>
          <p>{contactInfo.email}</p>
          <p>الهاتف : <br/>{contactInfo.phone}</p>
          <p>مواقع التواصل :</p>
          <div className="footer-social">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                <img src={iconMap[link.name]} alt={link.name} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>منصة شاملة لربط عالم الخياطة والأزياء</p>
      </div>
    </footer>
  );
}
