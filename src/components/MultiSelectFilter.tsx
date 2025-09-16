import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(value => value !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const handleRemoveOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(value => value !== option));
  };

  const displayText = selectedValues.length > 0 
    ? `${selectedValues.length} selected`
    : placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors cursor-pointer bg-white min-h-[44px] flex items-center justify-between touch-manipulation"
      >
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selectedValues.length > 0 ? (
            selectedValues.slice(0, 1).map((value) => (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full max-w-[100px] truncate flex-shrink-0"
              >
                <span className="truncate">{value}</span>
                <button
                  onClick={(e) => handleRemoveOption(value, e)}
                  className="hover:bg-emerald-200 rounded-full p-0.5 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm truncate flex-shrink">{displayText}</span>
          )}
          {selectedValues.length > 1 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{selectedValues.length - 1} more
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleToggleOption(option)}
              className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between touch-manipulation min-h-[44px]"
            >
              <span className="text-sm text-gray-700 pr-2 flex-1 truncate">{option}</span>
              {selectedValues.includes(option) && (
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};