
import React from 'react';
import { StyleOption } from '../types';

interface ControlGroupProps {
  label: string;
  options: StyleOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const ControlGroup: React.FC<ControlGroupProps> = ({ label, options, selectedValue, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold text-gray-300 mb-3">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out ${
              selectedValue === option.id
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlGroup;
