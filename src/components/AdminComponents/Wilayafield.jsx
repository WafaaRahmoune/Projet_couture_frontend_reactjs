import { useState, useEffect } from "react";
import "../../style/AdminStyle/WilayaStyle.css";
import wilayablueicon from "../../assets/wilayablueicon.png";

export default function Wilayafield({
  wilayaname = "",
  price = 0,
  error = "",
  onPriceChange,
}) {
  const [localPrice, setLocalPrice] = useState(price);

  // Mettre à jour la valeur locale quand le prix change
  useEffect(() => {
    setLocalPrice(price);
  }, [price]);

  const handlePriceChange = (e) => {
    const newValue = e.target.value;
    setLocalPrice(newValue);

    if (onPriceChange) {
      onPriceChange(newValue);
    }
  };

  return (
    <div>
      <div className="wilaya-field-container">
        <div className="containerwilayafield">
          <div className="wilaya-field-content">
            <div className="namewithiconwilayafield">
              <img src={wilayablueicon} alt="wilayaicon" />
              <span>{wilayaname}</span>
            </div>

            <div className="containerprice">
              <input
                type="number"
                className={`priceinputwilayafield ${error ? 'error' : ''}`}
                value={localPrice}
                onChange={handlePriceChange}
                placeholder="أدخل السعر"
                min="0"
              />
              <div className="currency-text">دج</div>
            </div>
          </div>
        </div>
      </div>
      {error && <div className="price-error">{error}</div>}
    </div>
  );
}