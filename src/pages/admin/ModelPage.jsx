import { useState,useEffect } from "react";
import ContainerPagesAdmin from "../../components/AdminComponents/ContainerPagesAdmin";
import "../../style/AdminStyle/Dashboard.css";
import Courbe from "@/components/AdminComponents/Courbe";
import Namadij from "../../components/AdminComponents/Namadij";
import { FiSearch } from "react-icons/fi";
import plusicon from "../../assets/plus.png";
import AddModelPopup from "../../components/AdminComponents/addModelPopup";
import ModifyModelPopup from "../../components/AdminComponents/ModifyModel";
import "../../style/AdminStyle/ModelPage.css"
import Vide from "../../components/generalComponents/Vide"
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

function ModelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModel, setShowAddModel] = useState(false);
  const [showModifyModel, setShowModifyModel] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  const [namadijData, setNamadijData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const { handle401Error } = useErreur401Handler();
  
  const [verificationPopup, setVerificationPopup] = useState({
    show: false,
    message: ""
  });

  // Charger les données des modèles depuis l'API
  useEffect(() => {
    fetchModelsData();
  }, []);

  // Fonction pour récupérer les données des modèles
  const fetchModelsData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://api.kadi-inv.store/clientapi/models/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transformer les données de l'API pour les adapter au composant Namadij
        const transformedData = data.map((model, index) => ({
          id: model.code || `temp-${index}`,
          codemodel: model.code || "",
          nommodel: model.name || "",
          images: model.images ? model.images.map(img => img.image) : [],
          namecouturiere: model.owner_info?.full_name || "",
          type: model.type || "",
          price: model.price_per_piece_for_client ? parseFloat(model.price_per_piece_for_client) : null,
          telephone: model.owner_info?.phone_number || "",
          address: model.owner_info?.address || "",
          variants: model.variants && model.variants.length > 0 
            ? model.variants.map(variant => ({
                size: variant.size || "",
                color: variant.color || "",
                quantity: variant.quantity || 0
              }))
            : (model.sizes && model.sizes.length > 0 && model.colors && model.colors.length > 0
                ? model.sizes.flatMap(size => 
                    model.colors.map(color => ({
                      size: size,
                      color: color,
                      quantity: 1
                    }))
                  )
                : []),
          originalData: {
            name: model.name || "",
            description: model.description || "",
            code: model.code || "", 
            price_per_piece_for_client: model.price_per_piece_for_client || "",
            price_per_piece_for_dropshipper: model.price_per_piece_for_dropshipper || "",
            min_pieces_for_dropshipper: model.min_pieces_for_dropshipper || "",
            images: model.images || [],
            variants: model.variants || [],
            sizes: model.sizes || [],
            colors: model.colors || [],
            type: model.type || "",
          }
        }));
        
        setNamadijData(transformedData);
      }  else if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchModelsData ();
        }
      }else {
        console.error('Erreur lors de la récupération des modèles');
        setError('خطأ في تحميل البيانات');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier si on peut modifier un modèle
  const checkIfModelCanBeModified = async (modelCode) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://api.kadi-inv.store/adminapi/veriifyifweareabletomodifyamodel/${modelCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.response === "yes,make changes";
      } else {
        console.error('Erreur lors de la vérification du modèle');
        return false;
      }
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  // Fonction pour gérer l'édition d'un modèle
  const handleEditModel = async (modelData) => {
    // Vérifier si on peut modifier le modèle
    const canModify = await checkIfModelCanBeModified(modelData.code);
    
    if (canModify) {
      // Stocker le modèle à modifier et ouvrir le popup
      setCurrentModel(modelData);
      setShowModifyModel(true);
    } else {
      // Afficher le popup d'information
      setVerificationPopup({
        show: true,

  "message": "يمكن تعديل بيانات النموذج فقط عندما لا تكون هناك طلبات نشطة مرتبطة به. فالقيام بأي تعديل في وجود طلبات جارية سيؤدي إلى تغيير أو إفساد الطلبات التي أتمّها العملاء باستخدام هذه النسخة من النموذج. يمكنك تعديل النموذج في حالتين: إذا لم يكن مرتبطًا بأي طلبات عملاء، أو إذا كانت جميع الطلبات السابقة قد انتهت بالفعل بحالة مكتمل أو مرفوض. نشكرك على تفهّمك."    });
    }
  };

  const handleAddModelSuccess = (result) => {
    console.log("Modèle ajouté avec succès:", result);
    fetchModelsData();
  };

  const handleModifyModelSuccess = (result) => {
    console.log("Modèle modifié avec succès:", result);
    fetchModelsData();
    setShowModifyModel(false);
    setCurrentModel(null);
  };

  // Fonction pour gérer le masquage d'un modèle
  const handleHideModel = (modelId) => {
    setNamadijData(prevData => 
      prevData.filter(model => model.id !== modelId)
    );
  };

  // Filtre par recherche
  const filteredModels = namadijData.filter((model) =>
    model.nommodel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.codemodel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.namecouturiere.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <ContainerPagesAdmin
        titre="ادارة النماذج"
        soustitre="ادارة النماذج المعروضة مع امكانية اضافة نموذج جديد "
      >
        <div className="loading">جاري تحميل البيانات...</div>
      </ContainerPagesAdmin>
    );
  }

  if (error) {
    return (
      <ContainerPagesAdmin
        titre="ادارة النماذج"
        soustitre="ادارة النماذج المعروضة مع امكانية اضافة نموذج جديد "
      >
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchModelsData}>إعادة المحاولة</button>
        </div>
      </ContainerPagesAdmin>
    );
  }

  return (
    <ContainerPagesAdmin
      titre="ادارة النماذج"
      soustitre="ادارة النماذج المعروضة مع امكانية اضافة نموذج جديد "
    >
      <div className="recherche-section">
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="ابحث عن نموذج بادخال الاسم، الكود أو اسم الخياطة"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons-wrapper">
            <button
              className="addaffilier"
              onClick={() => setShowAddModel(true)}
            >
              اضافة نموذج جديد
              <img src={plusicon} alt="icon" className="plus" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteneur des modèles Namadij */}
      <div className="namadij-container">
        {filteredModels.length > 0 ? (
          filteredModels.map((model) => (
            <Namadij
              key={model.id}
              modelId={model.id}
              codemodel={model.codemodel}
              nommodel={model.nommodel}
              images={model.images}
              namecouturiere={model.namecouturiere}
              price={model.price}
              telephone={model.telephone}
              address={model.address}
              variants={model.variants}
              onEdit={() => handleEditModel(model.originalData)}
              onHide={handleHideModel}
            />
          ))
        ) : (
          <div className="no-results">
            {searchTerm ? 
              "لا توجد نتائج تطابق بحثك" : 
              <Vide 
                texte="لا يوجد نماذج معروضة في المتجر"
                tailleIcône={100}
                couleurIcône="#6b7280"
                className="vide-couturieres"
              />
            }
          </div>
        )}
      </div>
      
      {/* Popup d'ajout de modèle */}
      <AddModelPopup
        isOpen={showAddModel}
        onClose={() => setShowAddModel(false)}
        onSuccess={handleAddModelSuccess}
      />
      
      {/* Popup de modification de modèle */}
      <ModifyModelPopup
        isOpen={showModifyModel}
        onClose={() => {
          setShowModifyModel(false);
          setCurrentModel(null);
        }}
        onSuccess={handleModifyModelSuccess}
        currentModel={currentModel}
      />

      {/* Popup de vérification */}
      {verificationPopup.show && (
        <div className="popup-overlay">
          <div className="verification-popup">
            <h3>تنبيه</h3>
            <p>{verificationPopup.message}</p>
            <button 
              className="popup-confirm-btn"
              onClick={() => setVerificationPopup({ show: false, message: "" })}
            >
              فهمت
            </button>
          </div>
        </div>
      )}
    </ContainerPagesAdmin>
  );
}

export default ModelPage;
