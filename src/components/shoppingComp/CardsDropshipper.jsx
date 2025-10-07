// src/components/CardsDropshipper.jsx
import React from "react";
import ProductCard from "./ProductCard";
import "../../style/shoppingStyle/Cards.css";
import { TbBoxOff } from "react-icons/tb";
import telecharger from "../../assets/icons/telecharger2.png"

export default function CardsDropshipper({ products }) {
  const hasProducts = products.length > 0;

  return (
    <div className={hasProducts ? "cards-container" : "cards-empty-container"}>
      {hasProducts ? (
        products.map((prod) => (
          <ProductCard 
            key={prod.id} 
            icon={telecharger}
            product={{
              ...prod,
              // Assurez-vous que ces propriétés sont disponibles
              title: prod.title || prod.name,
              price: prod.price || prod.price_per_piece_for_client,
              price_per_piece_for_dropshipper: prod.price_per_piece_for_dropshipper,
              min_pieces_for_dropshipper: prod.min_pieces_for_dropshipper,
              code: prod.code,
              variants: prod.variants || [],
              images: prod.images || [],
              description: prod.description || '',
              sizes: prod.sizes || []
            }} 
          />
        ))
      ) : (
        <div className="empty-message">
          <TbBoxOff size={60} color="#999" />
          <p>لا يوجد أي موديل حالياً</p>
        </div>
      )}
    </div>
  );
}