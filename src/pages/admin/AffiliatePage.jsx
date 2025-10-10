import { useState, useRef, useEffect } from "react";
import ContainerPagesAdmin from "../../components/AdminComponents/ContainerPagesAdmin";
import "../../style/AdminStyle/AffiliatePage.css";
import { FiSearch } from "react-icons/fi";
import plusicon from "../../assets/plus.png";
import taf3il from "../../assets/taf3il.png";

import AddAffiliatePopup from '../../components/AdminComponents/AddAffiliatePopup';
import ReworkWithAffiliate from './Reworkwithaffiliate';
import Vide from "../../components/generalComponents/Vide";
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

function AffiliatePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const tableContainerRef = useRef(null);
  const [showAddAffiliate, setShowAddAffiliate] = useState(false);
  const [showReworkWithAffiliate, setShowReworkWithAffiliate] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [affiliatesData, setAffiliatesData] = useState([]);
  const [loading, setLoading] = useState(true);
 const { handle401Error } = useErreur401Handler();
  // Charger les données des affiliés depuis l'API
  useEffect(() => {
    fetchAffiliatesData();
  }, []);

  // Fonction pour récupérer les données des affiliés
  const fetchAffiliatesData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
     

      const response = await fetch('https://api.kadi-inv.store/adminapi/getallaffiliateinfos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

       if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchAffiliatesData ();
        }
      }
      else

      if (response.ok) {
        const data = await response.json();
        setAffiliatesData(data);
      } else {
        console.error('Erreur lors de la récupération des affiliés');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    // Recharger les données après l'ajout d'un nouvel affilié
    fetchAffiliatesData();
  };
  
  // Filtre par recherche
  const filteredAffiliates = affiliatesData.filter((affiliate) =>
    affiliate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleClickReworkWithAffiliate(affiliate) {
    setSelectedAffiliate(affiliate);
    setShowReworkWithAffiliate(true);
  }

  // Ajoutez cette fonction pour mettre à jour les données après création d'un nouveau code
const handleReworkSuccess = () => {
  fetchAffiliatesData();
};

  // Fonction pour vérifier si tous les codes d'un affilié sont expirés
  const areAllCodesExpired = (promoCodes) => {
    return promoCodes.every(code => code.status === "expiré");
  };

  // Fonction pour afficher les modèles selon la structure de l'API
  const renderModels = (models) => {
    if (Array.isArray(models)) {
      return (
        <ul className="models-list">
          {models.map((model, index) => (
            <li key={index} className="model-item">
              <span className="model-name">{model.name}</span>
              <span className="model-code">({model.code})</span>
            </li>
          ))}
        </ul>
      );
    }
    return models;
  };

  // Fonction pour déterminer la classe CSS du statut
  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "en attente":
        return "status-inactive";
      case "expiré":
        return "status-expired";
      default:
        return "";
    }
  };

  // Fonction pour traduire le statut
  const translateStatus = (status) => {
    switch (status) {
      case "active":
        return "فعال";
      case "en attente":
        return "غير مفعل بعد";
      case "expiré":
        return "منتهي";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <ContainerPagesAdmin
        titre="ادارة المروجين"
        soustitre="عرض لجميع مروجي الموقع و نظام ادارة البرنامج الترويجي"
      >
        <div className="loading">جاري تحميل البيانات...</div>
      </ContainerPagesAdmin>
    );
  }

  return (
    <ContainerPagesAdmin
      titre="ادارة المروجين"
      soustitre="عرض لجميع مروجي الموقع و نظام ادارة البرنامج الترويجي"
    >
      {(showAddAffiliate || showReworkWithAffiliate) && <div className="page-overlay"></div>}
      
      <div className={`page-content ${showAddAffiliate || showReworkWithAffiliate ? 'blurred' : ''}`}>
        <div className="recherche-section">
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="ابحث عن مروج بادخال الاسم أو البريد الالكتروني"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-buttons-wrapper">
              <button
                className={"addaffilier"}
                onClick={() => setShowAddAffiliate(true)}
              >
                اضافة مروج جديد
                <img src={plusicon} alt="icon" className="plus" />
              </button>
            </div>
          </div>
        </div>

        {/* Tableau dynamique avec défilement horizontal */}
         {filteredAffiliates.length === 0 ? (
    <div className="no-data-container">
      <Vide 
        texte="لا يوجد مروجين حاليا"
        tailleIcône={100}
        couleurIcône="#6b7280"
        className="vide-affiliates"
      />
      </div>
           )
           :
        <div className="affiliate-table-container" ref={tableContainerRef}>
          
          <table className="affiliate-table">
            <thead>
              <tr>
                <th>اسم المروج</th>
                <th>البريد الإلكتروني</th>
                <th>رقم الهاتف</th>
                <th>كود الخصم</th>
                <th>تاريخ بداية فعالية الكود</th>
                <th>تاريخ انتهاء فعالية الكود</th>
                <th>حالة الكود</th>
                <th>% استفادة المروج</th>
                <th>% استفادة الزبون</th>
                <th>الربح الاجمالي للمروج</th>
                <th>الموديلات المعنية</th>
              </tr>
            </thead>
            <tbody>
              {filteredAffiliates.map((affiliate) => (
                affiliate.promo_codes.map((code, index) => (
                  <tr key={`${affiliate.email}-${index}`}>
                    {index === 0 ? (
                      <>
                        <td rowSpan={affiliate.promo_codes.length} className="affiliate-name-cell">
                          <span className="containertaf3il">
                            {affiliate.full_name}
                            {/* Afficher taf3il seulement si tous les codes sont expirés */}
                            {areAllCodesExpired(affiliate.promo_codes) && (
                              <img 
                                src={taf3il} 
                                alt="taf3il" 
                                className="taf3il" 
                                onClick={() => handleClickReworkWithAffiliate(affiliate)} 
                              />
                            )}
                          </span>
                        </td>
                        <td rowSpan={affiliate.promo_codes.length}>{affiliate.email}</td>
                        <td rowSpan={affiliate.promo_codes.length}>{affiliate.phone_number || "-"}</td>
                      </>
                    ) : null}
                    <td>{code.code}</td>
                    <td>{code.start_date || "-"}</td>
                    <td>{code.expiration_date}</td>
                    <td>
                      <span className={getStatusClass(code.status)}>
                        {translateStatus(code.status)}
                      </span>
                    </td>
                    <td>{code.profit_percentage}%</td>
                    <td>{code.discount_percentage}%</td>
                    <td>{code.benefice_promo} DA</td>
                    <td>{renderModels(code.models_affectes)}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
}
      </div>
            
      <AddAffiliatePopup 
        isOpen={showAddAffiliate}
        onClose={() => setShowAddAffiliate(false)}
        onSuccess={handleSuccess}
      />
      
      <ReworkWithAffiliate
        isOpen={showReworkWithAffiliate}
        onClose={() => setShowReworkWithAffiliate(false)}
        affiliate={selectedAffiliate}
        onSuccess={handleReworkSuccess} // Ajoutez cette prop

      />
    </ContainerPagesAdmin>
  );
}

export default AffiliatePage;
