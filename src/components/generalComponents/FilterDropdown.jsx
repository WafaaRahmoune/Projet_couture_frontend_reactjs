// components/generalComponents/FilterDropdown.js
import { useState } from "react";
import "../../style/AdminStyle/ContainerPagesAdmin.css";

export default function FilterDropdown({ options, selectedOption, onOptionChange, placeholder = "Filter" }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onOptionChange(option);
    setIsOpen(false);
  };

  return (
    <div className="filter-dropdown">
      <button 
        className="filter-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span>▼</span>
      </button>
      
      {isOpen && (
        <div className="filter-dropdown-content">
          {options.map((option, index) => (
            <div
              key={index}
              className={`filter-option ${selectedOption?.value === option.value ? 'active' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}