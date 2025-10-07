import React, { useState } from "react";
import phoneicon from "../../assets/icons/whatsapp.png";
import downicon from "../../assets/icons/downicon.png";
import accepticon from "../../assets/accept.png";
import refuseicon from "../../assets/refuse.png";
import benificeicon from "../../assets/benifice.png";
import '../../style/AdminStyle/DropshipperCard.css';
import datedemandeicon from "../../assets/icons/date.png";

export default function DropshipperCard({
  id,
  nameuser = "سارة احمد",
  datedemande = "15-16-2025",
  phone = "0556263501",
  storelink = "www.storelink.com",
  isaccepted = null,
  isactive = false,
  mybenifits = 200,
  email = "",
  currentMonth = "شهر",
  onStatusChange,
  onReject,
  onToggleStatus
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  
  const getCurrentStatus = () => {
    if (isaccepted===null)return "في الانتظار";
    if (isaccepted===false) return "مرفوض";
    return isactive ? "نشط" : "غير نشط";
  };

  const [currentStatus, setCurrentStatus] = useState(getCurrentStatus());

  const getStatusStyle = (status) => {
    switch (status) {
      case "نشط":
        return { backgroundColor: "#22C55E", color: "white" };
      case "غير نشط":
        return { backgroundColor: "#F94C4C", color: "white" };
      case "مرفوض":
        return { backgroundColor: "#F94C4C", color: "white" };
      case "في الانتظار":
        return { backgroundColor: "#17A2B8", color: "white" };
      default:
        return { backgroundColor: "#6B7280", color: "white" };
    }
  };

  const handleStatusClick = () => {
    if (isaccepted) {
      setShowStatusMenu(!showStatusMenu);
    }
  };

  const handleStatusUpdate = (newStatus) => {
    setShowStatusMenu(false);
    
    // Ne pas mettre à jour si le statut est le même
    if (newStatus === currentStatus) {
      return;
    }
    
    setCurrentStatus(newStatus);
    
    if (onStatusChange) {
      const newAcceptedStatus = newStatus !== "في الانتظار";
      const newActiveStatus = newStatus === "نشط";
      
      // Si le statut change et que le dropshipper est déjà accepté,
      // on appelle onToggleStatus pour afficher le popup de confirmation
      if (isaccepted && newActiveStatus !== isactive) {
        onToggleStatus(newActiveStatus);
      } else {
        onStatusChange(newAcceptedStatus, newActiveStatus);
      }
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    }
  };

  const getStatusOptions = () => {
    if (isaccepted) {
      return ["نشط", "غير نشط"];
    }
    return [];
  };

  const statusOptions = getStatusOptions();
  const showDropdown = statusOptions.length > 0;

  return (
    <div className="CardContainer">
      <div className="rightsideDemandeCard">
        <div className="line userInfo">
          <div className="userSection">
            <span className="userName">{nameuser}</span>
          </div>
          
          <div className="statusContainer" style={{position: 'relative'}}>
            <span 
              className="status" 
              style={getStatusStyle(currentStatus)}
              onClick={handleStatusClick}
            >
              {currentStatus}
              {showDropdown && (
                <img 
                  src={downicon} 
                  alt="down" 
                  className="mydownicon" 
                />
              )}
            </span>
            
            {showStatusMenu && showDropdown && (
              <div className="statusMenu">
                {statusOptions.map((option) => (
                  <div 
                    key={option}
                    className="statusOption"
                    onClick={() => handleStatusUpdate(option)}
                    style={option === currentStatus ? {backgroundColor: '#f0f0f0'} : {}}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="line modelInfo">
          {storelink && (
            <div className="locationItem">
              <span>موقع المتجر: </span>
              <a 
                href={storelink.startsWith('http') ? storelink : `https://${storelink}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="storeLink"
              >
                {storelink}
              </a>
            </div>
          )}

          {isaccepted && isactive && mybenifits !== null && (
            <div className="locationItem">
              <img src={benificeicon} alt="benefits" className="locationIcon" />
              <span>مجموع مبيعات هذا الدروبشيبر خلال {currentMonth}: </span>
                    

              <span>{mybenifits} دج</span>
            </div>
          )}

          {isaccepted===null && datedemande && (
            <div className="locationItem">
              <img src={datedemandeicon} alt="date" className="locationIcon" />
              <span>تاريخ التقديم: </span>
              <span>{datedemande}</span>
            </div>
          )}

          {phone && (
            <div className="locationItem">
              <img src={phoneicon} alt="phone" className="locationIcon" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      </div>

      {isaccepted===null && (
        <div className="leftsideDemandeCard">
          <div style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
            <button 
              className="acceptButton"
              onClick={() => handleStatusUpdate("نشط")}
            >
              قبول المترشح            
              <img 
                src={accepticon} 
                alt="accept" 
                className="buttonIcondropshipper" 
                style={{ width: '16px', height: '16px' }}
              />
            </button>
            <button 
              className="rejectButton"
              onClick={handleReject}
            >
              رفض المترشح
              <img 
                src={refuseicon} 
                alt="refuse" 
                className="buttonIcondropshipper" 
                style={{ width: '16px', height: '16px' }}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}