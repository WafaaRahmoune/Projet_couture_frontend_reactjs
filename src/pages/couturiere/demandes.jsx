import React, { useEffect, useState } from "react";
import SidePanel from "@/components/ui/SidePanel";
import axios from "axios";
// import { NavLink } from "react-router-dom";
import ModelCard from "@/components/ui/ModelCardCouturiere";
import { getArabicColorLabel } from "@/utils/CcolorUtils";

export default function Demandes() {
  const [models, setModels] = useState(null); // null = loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("accessToken"); // JWT
        const res = await axios.get("http://127.0.0.1:8000/api/mesDemandesPersonalise/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setModels(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des modèles.");
        setModels([]);
      }
    };
    fetchModels();
  }, []);

  return (
    <SidePanel>
      {/* Cas chargement */}
      {models === null && (
        <div className="flex flex-col items-center justify-center h-full">
          <img src="/search2.png" alt="loading" className="w-40 h-auto" />
          <p className="text-gray-600 mt-2">جار التحميل ...</p>
        </div>
      )}

      {/* Cas erreur */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Cas aucun modèle */}
      {models !== null && models.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center">
          <img
            src="/search2.png"
            alt="search"
            className="h-auto w-[13rem] max-w-full object-contain"
          />
          <p className="text-gray-700 mb-2">
          لا توجد طلبات محددة لك في الوقت الحالي          </p>
          <p className="text-gray-700 mb-2">  يمكننا أن نوضح أن الطلبات المحددة يمكن إضافتها تلقائيًا في لوحة التحكم بعد الاتفاق معك عبر الهاتف أو البريد الإلكتروني</p>
        </div>
      )}

      {/* Cas modèles existants */}
      {models !== null && models.length > 0 && (
        
        <div className="grid gap-6 p-4">
                    
          {models.map((m) => (
  
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

            images={m.custom_images.map(img => `http://127.0.0.1:8000${img.image}`)}
          sizes={m.variants.map((v) => ({
            size: v.size,
            color: getArabicColorLabel(v.color),
            quantity: v.quantity,
            hex: v.hex  || "#cccccc",
          }))}
          priceLabel="لكل القطع"
          deadline={m.deadline}

        />

          ))}
        </div>
      )}
    </SidePanel>
  );
}

