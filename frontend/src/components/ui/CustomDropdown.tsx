'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CustomDropdown({ label, options, value, onChange, className = '' }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[54px] flex items-center justify-between px-5 bg-slate-50 border rounded-2xl transition-all outline-none
        ${isOpen 
          ? 'border-blue-500 bg-white shadow-[0_0_0_1px_rgba(59,130,246,1)] shadow-blue-50' 
          : 'border-slate-100 hover:bg-slate-100'}`}
      >
        <span className="font-bold text-slate-700">{selectedOption?.label}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[110] top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-bold
                ${value === option.value 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
              >
                {option.label}
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
