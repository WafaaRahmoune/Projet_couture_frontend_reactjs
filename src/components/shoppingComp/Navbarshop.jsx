import '../../style/shoppingStyle/Navbarshop.css';
import React, { useState, useEffect } from 'react';
import logo from '../../assets/logobleu.png';
import home from '../../assets/icons/home.png';
import shop from '../../assets/icons/shop.png';
import commande from '../../assets/icons/commande.png';
import order from '../../assets/icons/special2.png';
import compte from '../../assets/icons/compte.png';
import { useNavigate, useLocation } from "react-router-dom"; // Ajoutez useLocation

export default function Navbarshop({ defaultSection = "#shop" }) {
  const location = useLocation(); // Utilisez useLocation
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Synchroniser activeSection avec la route actuelle
    const pathToSectionMap = {
      '/': '#home',
      '/shopping': '#shop',
      '/shoppingDropshipper': '#shop',
      '/special': '#custom',
      '/mycommands': '#orders',
      '/mycommandsdropshipper': '#orders',
      '/compte': '#account',
      '/NotActiveDropshipper': '#shop'
    };

    const currentSection = pathToSectionMap[location.pathname] || defaultSection;
    setActiveSection(currentSection);
  }, [location.pathname, defaultSection]);

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur au chargement du composant
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
      }
    }
  }, []);

  const navigate = useNavigate();
  
  const goToShop = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        
        if (user.role === "dropshipper") {
          checkDropshipperStatus(user.email)
            .then(status => {
              if (status === "notactif") {
                navigate("/NotActiveDropshipper");
              } else {
                navigate("/shoppingDropshipper");
              }
            })
            .catch(error => {
              console.error("Erreur lors de la vérification du statut:", error);
              navigate("/shoppingDropshipper");
            });
        } else if (user.role === "client") {
          navigate("/shopping");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  const checkDropshipperStatus = async (email) => {
    try {
      const response = await fetch(`https://api.kadi-inv.store/api/checkStatusDropshipper/${email}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error("Erreur lors de l'appel API:", error);
      throw error;
    }
  };

  const goToSpecial = () => {
    navigate("/special");
  };

  const goToCompte = () => {
    navigate("/compte");
  };

  const goToMycommands = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        
        if (user.role === "dropshipper") {
          checkDropshipperStatus(user.email)
            .then(status => {
              if (status === "notactif") {
                navigate("/NotActiveDropshipper");
              } else {
                navigate("/mycommandsdropshipper");
              }
            })
            .catch(error => {
              console.error("Erreur lors de la vérification du statut:", error);
              navigate("/mycommandsdropshipper");
            });
        } else if (user.role === "client") {
          navigate("/mycommands");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  const goTolandingPage = () => {
    navigate("/");
  };

  return (
    <>
      {/* Navbar Desktop et Tablette */}
      <div className="containershopping">
        <nav className={`navbarshop desktop-navbar ${userRole === "dropshipper" ? "dropshipper-navbar" : ""}`}>
          <div className="navbar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <img src={logo} alt="قاف" className="logo-img" />
          </div>
          <div className="navbarshop-links">
            <a 
              href="#home" 
              className={activeSection === "#home" ? "active" : ""} 
              onClick={(e) => {
                e.preventDefault();
                goTolandingPage();
              }}
            >
              <img src={home} alt="الرئيسية" className="icon" />
              الرئيسية
            </a>
            
            <a 
              href="#shop" 
              className={activeSection === "#shop" ? "active" : ""} 
              onClick={(e) => {
                e.preventDefault();
                goToShop();
              }}
            >
              <img src={shop} alt="تسوق" className="icon" />
              تسوق
            </a>
            
            {userRole !== "dropshipper" && (
              <a 
                href="#custom" 
                className={activeSection === "#custom" ? "active" : ""} 
                onClick={(e) => {
                  e.preventDefault();
                  goToSpecial();
                }}
              >
                <img src={order} alt="تصميم خاص" className="icon" />
                تصميم خاص
              </a>
            )}
            
            <a 
              href="#orders" 
              className={activeSection === "#orders" ? "active" : ""} 
              onClick={(e) => {
                e.preventDefault();
                goToMycommands();
              }}
            >
              <img src={commande} alt="طلبياتي" className="icon" />
              طلبياتي
            </a>

            <a 
              href="#account" 
              className={activeSection === "#account" ? "active" : ""} 
              onClick={(e) => {
                e.preventDefault();
                goToCompte();
              }}
            >
              <img src={compte} alt="حسابي" className="icon" />
              حسابي
            </a>
          </div>
        </nav>
      </div>
      
      {/* Mobile Navbar */}
      <nav className="mobile-navbar">
        <div className="mobile-topbar">
          <img src={logo} alt="قاف" className="logo-img" />
          <a 
            href="#account" 
            className="account-link" 
            onClick={(e) => {
              e.preventDefault();
              goToCompte();
            }}
          >
            <img src={compte} alt="حسابي" className="icon" /> 
          </a>
        </div>

        <div className="bottom-nav">
          <a 
            href="#home" 
            className={activeSection === "#home" ? "active" : ""} 
            onClick={(e) => {
              e.preventDefault();
              goTolandingPage();
            }}
          >
            <img src={home} alt="الرئيسية" className="icon" /><span>الرئيسية</span>
          </a>
          <a 
            href="#shop" 
            className={activeSection === "#shop" ? "active" : ""} 
            onClick={(e) => {
              e.preventDefault();
              goToShop();
            }}
          >
            <img src={shop} alt="تسوق" className="icon" /><span>تسوق</span>
          </a>
          
          {userRole !== "dropshipper" && (
            <a 
              href="#custom" 
              className={activeSection === "#custom" ? "active" : ""} 
              onClick={(e) => {
                e.preventDefault();
                goToSpecial();
              }}
            >
              <img src={order} alt="تصميم خاص" className="icon" /><span>تصميم</span>
            </a>
          )}
          
          <a 
            href="#orders" 
            className={activeSection === "#orders" ? "active" : ""} 
            onClick={(e) => {
              e.preventDefault();
              goToMycommands();
            }}
          >
            <img src={commande} alt="طلبياتي" className="icon" /><span>طلبياتي</span>
          </a>
        </div>
      </nav>

      <style jsx>{`
        .dropshipper-navbar .navbarshop-links {
          max-width: calc(100vw - 100px) !important;
          width: auto !important;
          padding: 12px clamp(20px, 3vw, 50px) !important;
        }
        
        @media (min-width: 1200px) {
          .dropshipper-navbar .navbarshop-links {
            gap: 180px !important;
            padding: 12px 50px !important;
          }
        }
        
        @media (max-width: 1200px) and (min-width: 1149px) {
          .dropshipper-navbar .navbarshop-links {
            gap: 160px !important;
          }
        }
        
        @media (max-width: 1149px) and (min-width: 989px) {
          .dropshipper-navbar .navbarshop-links {
            gap: 140px !important;
          }
        }
        
        @media (max-width: 988px) and (min-width: 769px) {
          .dropshipper-navbar .navbarshop-links {
            gap: 100px !important;
          }
        }
      `}</style>
    </>
  );
}
