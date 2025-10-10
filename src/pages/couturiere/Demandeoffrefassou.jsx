import React, { useState, useEffect } from "react";
import SidePanel from "@/components/ui/SidePanel";
import axios from "axios";
import ModelCard from "@/components/ui/ModelCardCouturiere";
import { getArabicColorLabel } from "@/utils/CcolorUtils";
import ModelCardFassou from "@/components/ui/ModelCardFassou";

export default function DemandesOffresFassou() {
  const [activeTab, setActiveTab] = useState("demandes"); // "demandes" par défaut
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  
  // usage dans ton composant
  
  const urls = {
    demandes: "https://api.kadi-inv.store/api/MesDemandesFassou/",
    offres: "https://api.kadi-inv.store/api/offresFassou/",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setData(null); // loading
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(urls[activeTab], {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des données.");
        setData([]);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <SidePanel>
      {/* Onglets */}
      <div className="flex justify-center gap-8 border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("demandes")}
          className={`pb-2 font-semibold ${
            activeTab === "demandes"
              ? "border-b-4 border-[#F0C84B] text-[#F0C84B]"
              : "text-gray-600"
          }`}
        >
          طلبات الفصو
        </button>
        <button
          onClick={() => setActiveTab("offres")}
          className={`pb-2 font-semibold ${
            activeTab === "offres"
              ? "border-b-4 border-[#F0C84B] text-[#F0C84B]"
              : "text-gray-600"
          }`}
        >
          عروض الفصو
        </button>
      </div>

      {/* Cas chargement */}
      {data === null && (
        <div className="flex flex-col items-center justify-center h-full">
          <img src="/search2.png" alt="loading" className="w-40 h-auto" />
          <p className="text-gray-600 mt-2">جار التحميل ...</p>
        </div>
      )}

      {/* Cas erreur */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Cas vide */}
      {data !== null && data.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center">
          <img
            src="/search2.png"
            alt="search"
            className="h-auto w-[13rem] max-w-full object-contain"
          />
          <p className="text-gray-700 mb-2">لا توجد بيانات بعد.</p>
        </div>
      )}

      {/* Cas data */}
      {data !== null && data.length > 0 && (
  <div className="grid gap-6 p-4">
    {data.map((m) =>
      activeTab === "demandes" ? (
        <ModelCard
          key={m.id}
          name={m.nameorder}
          code={m.codeorder}
          pricePerPiece={m.initial_price}
          totalPieces={m.total_requested_quantity || 0}
          date={m.created_date}
          type={m.model_type}
          description={m.description}
          status={m.state}
  images={m.custom_images.map(img => `https://api.kadi-inv.store${img.image}`)}

          // images={m.custom_images}
          sizes={m.variants.map((v) => ({
            size: v.size,
            color: getArabicColorLabel(v.color),
            quantity: v.quantity,
            hex: v.hex  || "#cccccc",
          }))}
          priceLabel="لكل القطع"
          deadline={m.deadline}

        />
      ) : (
        <ModelCardFassou
          key={m.id}
          id={m.id} 
          name={m.nameorder}
          code={m.codeorder}
          pricePerPiece={m.initial_price}
          totalPieces={m.total_requested_quantity || 0}
          date={m.created_date}
          type={m.model_type}
          description={m.description}
          status={m.state}
          // images={m.custom_images}
            images={m.custom_images.map(img => `https://api.kadi-inv.store${img.image}`)}

          sizes={m.variants.map((v) => ({
            size: v.size,
            color: getArabicColorLabel(v.color),
            quantity: v.quantity,
            hex: v.hex || "#cccccc",
          }))}
          priceLabel="لكل القطع"
          onOfferAccepted={(offerId) =>
            setData((prevData) => prevData.filter((offer) => offer.id !== offerId))
          }
          deadline={m.deadline}

        />
      )
    )}
  </div>
)}

    </SidePanel>
  );
}
