import React, { useState, useEffect } from "react";
import axios from "axios";
import ModelComp from "./ModelComp";
import PostModelCouturiere from "./PostModelCouturiere";
import "../../style/AdminStyle/DemandePublicationModel.css"
import Vide from "../../components/generalComponents/Vide"
import useErreur401Handler from '../generalComponents/Erreur401Handle';

export default function DemandePublicationModel() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isAcceptPopupOpen, setIsAcceptPopupOpen] = useState(false);
  const { handle401Error } = useErreur401Handler();


  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.patch(
        "https://api.kadi-inv.store/adminapi/getInfoModelCouturiereWaitingToBePublished",
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

       if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchModels();
        }
      }
      else 

      if (response.data.success) {
        const transformedModels = response.data.models.map(model => ({
          id: model.id,
          codemodel: model.codemodel,
          nommodel: model.namemodel || model.name,
          statusmodel: model.statemodel === 'waiting' ? 'في الانتظار' : model.statemodel,
          images: model.imagesmodel ? model.imagesmodel.map(img => img.image_url) : [],
          namecouturiere: model.couturiere_info?.full_name || 'غير معروف',
          price: parseFloat(model.price_per_piece_for_client) || 0,
          telephone: model.couturiere_info?.phone_number || 'غير متوفر',
          address: model.couturiere_info?.address || 'غير متوفر',
          variants: model.variants || [],
          description: model.description || "" // Ajouter la description si disponible
        }));
        console.log('URLs images transformées:', transformedModels.map(m => m.images));
        console.log('Données brutes de l\'API:', response.data.models);
        setModels(transformedModels);
      } else {
        setError("Erreur lors de la récupération des données");
      }
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Impossible de charger les modèles. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleAcceptModel = (model) => {
    setSelectedModel(model);
    setIsAcceptPopupOpen(true);
  };

  const handleAcceptSuccess = (result) => {
    console.log("Modèle accepté avec succès:", result);
    setModels(prevModels => prevModels.filter(model => model.id !== selectedModel.id));
    setSelectedModel(null);
  };

  const handleRejectModel = async (modelId, codemodel) => {
    try {
      console.log(`Rejecting model ${modelId} with code ${codemodel}`);
      
      // Appel à l'API pour refuser le modèle
      const response = await axios.patch(
        `https://api.kadi-inv.store/adminapi/RefuseModelCouturiere/${codemodel}/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 204) {
        console.log("Modèle refusé avec succès");
        // Mettre à jour l'état local
        setModels(prevModels => 
          prevModels.map(model => 
            model.id === modelId 
              ? { ...model, statusmodel: "مرفوضة" }
              : model
          )
        );
      } else {
        console.error("Erreur lors du rejet du modèle");
        fetchModels(); // Recharger les données en cas d'erreur
      }
    } catch (err) {
      console.error("Erreur lors du rejet:", err);
      fetchModels(); // Recharger les données en cas d'erreur
    }
  };

  const handleImageClick = (modelId) => {
    console.log(`Image clicked for model ${modelId}`);
  };

  const handleRetry = () => {
    fetchModels();
  };

  if (loading) {
    return (
      <div className="demandePublicationContainer">
        <div className="loadingState">
          <h3>جاري التحميل...</h3>
          <p>يتم تحميل طلبات النماذج</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="demandePublicationContainer">
        <div className="errorState">
          <h3>حدث خطأ</h3>
          <p>{error}</p>
          <button onClick={handleRetry} className="retryButton">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

 return (
    <div className="demandePublicationContainer">
      <div className="adminModelsScrollContainer">
        {models.map((model) => (
          <ModelComp
            key={model.id}
            description={model.description}
            nommodel={model.nommodel}
            statusmodel={model.statusmodel}
            images={model.images}
            namecouturiere={model.namecouturiere}
            price={model.price}
            telephone={model.telephone}
            address={model.address}
            variants={model.variants}
            modelId={model.codemodel}
            onAccept={() => handleAcceptModel(model)}
            onReject={() => handleRejectModel(model.id, model.codemodel)}
            onImageClick={() => handleImageClick(model.id)}
          />
        ))}
      </div>
      
      {models.length === 0 && (
        <Vide 
          texte="لا يوجد طلب لنشر نموذج "
          tailleIcône={100}
          couleurIcône="#6b7280"
          className="vide-couturieres"
        />
      )}

      <PostModelCouturiere
        isOpen={isAcceptPopupOpen}
        onClose={() => setIsAcceptPopupOpen(false)}
        modelData={selectedModel}
        onSuccess={handleAcceptSuccess}
      />
    </div>
  );
}
