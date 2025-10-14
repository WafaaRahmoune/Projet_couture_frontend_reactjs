import React, { useRef, useState, useEffect } from "react";
import "../../style/generalStyle/Inputfield.css";
import telecharger from "../../assets/icons/telecharger.png"

export default function InputField({
  caché = "",
  type = "text",
  placeholder = "",
  placeholderSpecial = "اختر خيارًا",
  titre = "",
  down = false,
  downup = false,
  size = "default",
  value = "",
  onChange = () => {},
  onBlur,
  options = null,
  hasError = false,
  accept = "",
  multiple = false,
  uploadedFiles = [],
  onRemoveFile = () => {},
  inputRef = null,
  special = false, // Active le menu personnalisé dans tous les cas
  inputMode = "text",
  lang = undefined,
  dir = undefined
}) {
  const internalFileInputRef = useRef(null);
  const fileInputRef = inputRef || internalFileInputRef;
  const [showCustomMenu, setShowCustomMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const menuRef = useRef(null);

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowCustomMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onChange(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onChange(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Gestion du menu personnalisé
  const toggleCustomMenu = () => {
    if (special && options && Array.isArray(options)) {
      setShowCustomMenu(!showCustomMenu);
    }
  };

  const handleOptionSelect = (optionValue) => {
    setSelectedOption(optionValue);
    onChange({ target: { value: optionValue } });
    setShowCustomMenu(false);
    
    if (onBlur) {
      onBlur({ target: { value: optionValue } });
    }
  };

  // Trouver le libellé de l'option sélectionnée
  const getSelectedLabel = () => {
    if (!options || !Array.isArray(options)) return placeholderSpecial;
    
    const selected = options.find(option => 
      (option.value || option) === selectedOption
    );
    
    return selected ? (selected.label || selected) : placeholderSpecial;
  };

  return (
    <div className={`input-field ${size === "oneline" ? "full-line" : "quarter-line"}`}>
      {titre && <label className="titre">{titre}</label>}

      <div className="input-wrapper" ref={menuRef}>
        {options && Array.isArray(options) ? (
          <>
            {/* Menu de sélection personnalisé */}
            {special ? (
              <div className="custom-select-container">
                <div 
  className={`custom-select-trigger ${hasError ? 'error-border' : ''} ${!selectedOption ? 'placeholder-style' : ''}`}
  onClick={toggleCustomMenu}
  lang={lang}
  dir={dir}
>
  {getSelectedLabel()}
</div>
                
                {showCustomMenu && (
                  <div className="custom-select-menu">
                    {options.map((option, index) => {
                      const optionValue = option.value || option;
                      const optionLabel = option.label || option;
                      
                      return (
                        <div
                          key={index}
                          className={`custom-select-option ${selectedOption === optionValue ? 'selected' : ''}`}
                          onClick={() => handleOptionSelect(optionValue)}
                        >
                          {optionLabel}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              // Menu de sélection standard
              <select
                className={`input-element  ${hasError ? 'error-border' : ''}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required
              >
                <option value="" disabled hidden>
                  {placeholder}
                </option>
                {options.map((option, index) => (
                  <option key={index} value={option.value || option}>
                    {option.label || option}
                  </option>
                ))}
              </select>
            )}
          </>
        ) : type === "file" ? (
          <>
          <div className="upload-wrapper">
  <label 
    className="upload-zone"
    onDrop={handleDrop}
    onDragOver={handleDragOver}
  >
    <img src={telecharger} alt="upload" className="upload-icon" />
    <p className="upload-text">
      {multiple 
        ? "اسحب وأفلت الملفات هنا أو انقر لاختيارها" 
        : "اسحب وأفلت الملف هنا أو انقر لاختياره"
      }<br />
      {accept.includes("image") && accept.includes("pdf") 
        ? "يُسمح بملفات PDF والصور" 
        : accept.includes("image") 
          ? "يُسمح بالصور فقط" 
          : "يُسمح بملفات PDF فقط"
      }
    </p>
    <input
      ref={fileInputRef}
      type="file"
      onChange={handleFileChange}
      onBlur={onBlur}
      accept={accept || "image/*,application/pdf"}
      style={{ display: "none" }}
      multiple={multiple}
    />
  </label>

  {/* Aperçu des fichiers uploadés */}
  {uploadedFiles && uploadedFiles.length > 0 && (
    <div className="uploaded-files-container">
      <h4 className="files-title">الملفات المرفقة:</h4>
      <div className="files-list">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="file-item">
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-size">({Math.round(file.size / 1024)} KB)</span>
            </div>
            <button 
              type="button" 
              className="remove-file-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveFile(index);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
          </>
        ) 
        : (
          <input
            type={type}
            placeholder={placeholder}
            className={`input-element ${hasError ? 'error-border' : ''}`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
           inputMode={inputMode}
  lang={lang}
  dir={dir}
          />
        )}
      </div>
    </div>
  );
}
