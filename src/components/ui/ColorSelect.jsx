import React, { useState } from "react";
import { COLOR_OPTIONS, getArabicColorLabel } from "@/utils/colorUtils";

export default function ColorAutocomplete({ label, value, onChange, error }) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredOptions = COLOR_OPTIONS.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2 text-right relative">
      <label className="text-sm text-[#374151] font-[Cairo] font-semibold">
        {label}
      </label>

      <div
        className={`w-full rounded-full px-4 border-[1px] transition-all duration-200 
          ${error ? "border-red-500" : "border-[#C1C1C1]"} 
          focus-within:border-[#374151] focus-within:border-[3px] 
          focus-within:shadow-lg focus-within:border-opacity-50 bg-white`}
      >
        <input
          type="text"
          value={query || getArabicColorLabel(value)}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="ابحث عن اللون..."
          className="w-full h-12 bg-transparent outline-none border-none text-right font-[Cairo] text-[15px] font-semibold text-[#374151] placeholder-[#B0B0B0]"
        />
      </div>

      {showDropdown && query && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-md">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <li
                key={idx}
                onClick={() => {
                  onChange(opt.value);
                  setQuery(opt.label);
                  setShowDropdown(false);
                }}
                className="flex items-center justify-end gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 text-right font-[Cairo]"
              >
                <span
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: opt.value }}
                ></span>
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-red-500 font-[Cairo]">لا يوجد تطابق</li>
          )}
        </ul>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
