import React from "react"

function InputField({ label, type = "text", placeholder, value, onChange, error "data-error": dataError }) {
    return (
      <div className="space-y-2 text-right"
          data-error={dataError}
          >
        <label className="text-sm text-[#374151] font-[Cairo] font-semibold">{label}</label>
  
        <div className={`
          w-full h-12 rounded-full flex items-center px-4
          border-[1px] transition-all duration-200
          ${error ? 'border-red-500' : 'border-[#C1C1C1]'}
          focus-within:border-[#374151] focus-within:border-[3px] focus-within:shadow-lg focus-within:border-opacity-50
          bg-white
        `}>
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full bg-transparent outline-none border-none text-right font-[Cairo] text-[15px] font-semibold text-[#374151] placeholder-[#B0B0B0] focus:placeholder-opacity-50"
            style={{ '::placeholder': { fontWeight: 600 } }}
          />
        </div>
  
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
export {InputField}
