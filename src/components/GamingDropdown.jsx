import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const GamingDropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === selected)?.label || 'SELECT MODEL';

  return (
    <div className="relative w-full font-mono" ref={dropdownRef}>
      <label className="block text-xs font-bold text-cyan-400 mb-2 uppercase tracking-widest pl-1">
        {label}
      </label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-slate-900 border-2 transition-all duration-300 outline-none relative overflow-hidden group
          ${isOpen
            ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] text-white'
            : 'border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-slate-200'}
        `}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:8px_8px]"></div>
        <span className="relative z-10 font-bold tracking-wide uppercase">
          {selectedLabel}
        </span>
        <ChevronDown
          className={`relative z-10 w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border-2 border-slate-700 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="py-0 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`group flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-all border-b border-slate-800 last:border-0 hover:pl-6
                  ${selected === option.value
                    ? 'bg-cyan-950/30 text-cyan-400 border-l-4 border-l-cyan-400'
                    : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800 border-l-4 border-l-transparent hover:border-l-cyan-500/50'}
                `}
              >
                <span className="uppercase font-bold tracking-wider">{option.label}</span>
                {selected === option.value && (
                  <Check className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GamingDropdown;
