
import React from "react"
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

function PasswordField({ label, placeholder, value, show, toggleShow, onChange, error }) {
return (
    <div className="space-y-2 text-right">
    <label className="text-sm text-[#374151] font-[Cairo] font-semibold">{label}</label>
    <div className={`
        relative w-full h-12 rounded-full flex items-center
        border-[1px] transition-all duration-200
        ${error ? 'border-red-500' : 'border-[#C1C1C1]'}
        focus-within:border-[#374151] focus-within:border-[3px] focus-within:shadow-lg focus-within:border-opacity-50
        bg-white
    `}>
        <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full pr-4 pl-12 bg-transparent outline-none border-none text-right font-[Cairo] text-[15px] font-semibold text-[#374151] placeholder-[#B0B0B0] focus:placeholder-opacity-50"
        style={{ '::placeholder': { fontWeight: 600 } }}
        />
        <button type="button" onClick={toggleShow} className="absolute left-4 top-1/2 transform -translate-y-1/2 focus:outline-none">
        {show ? <EyeOff className="h-5 w-5 text-[#DADAD7]" /> : <Eye className="h-5 w-5 text-[#DADAD7]" />}
        </button>
    </div>
    {error && <p className="text-red-500 text-xs text-right">{error}</p>}
    </div>
);
}
export { PasswordField }
