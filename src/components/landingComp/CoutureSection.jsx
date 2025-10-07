import React from 'react';
import '../../style/landingStyle/CoutureSection.css';
import couturelanding from '../../assets/couturelanding.png';
import etoile from '../../assets/icons/etoile.png'
import useNavigationDecision from '../generalComponents/DecisionToMakeForPath';

const CoutureSection = () => {
      const handleNavigation = useNavigationDecision();
  
    const handleButtonClick = (buttonName) => {
    handleNavigation(buttonName);
  };
  return (
    <section className="couture-section">
      <div className="couture-container">
        
        <div className="couture-text">
          <h1 className="couture-title">الحلم يبدأ هنا</h1>
          <p className="couture-subtitle">
           كل قطعة ملابس تحكي قصة. كل غرزة تحمل فكرة في طور الإنجاز. نحن هنا لنحول أحلامك إلى واقع ملموس من خلال شبكة من أمهر الخياطين و الخياطات في الجزائر.
          </p>
          <div className="couture-stat">
            <img src={etoile} alt="etoile" />
            <span className="stat-text"><strong>العديد من الخياطين</strong><br />من مختلف أنحاء الوطن</span>
          </div>
          <button className="join-button" onClick={() => handleButtonClick("انضم الان")}>
            
             {
   JSON.parse(localStorage.getItem('user'))?.role === 'couturiere' 
   ?  'الدخول للمنصة' 
   : 'انضم الآن'}
            
            
            </button>
        </div>
        <div className="couture-image">
          <img src={couturelanding} alt="Couture Landing" />
        </div>
      </div>
    </section>
  );
};

export default CoutureSection;
