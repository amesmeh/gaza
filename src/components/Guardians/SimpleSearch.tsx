import React from 'react';
import { Search } from 'lucide-react';

interface SimpleSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const SimpleSearch: React.FC<SimpleSearchProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "البحث في الأسماء..."
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pr-10 pl-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm placeholder-gray-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
        placeholder={placeholder}
      />
    </div>
  );
};