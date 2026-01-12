import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search posts by title, content, or author...',
  initialValue = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
      startContent={<Search size={18} className="text-default-400" />}
      endContent={
        searchQuery && (
          <button
            onClick={handleClear}
            className="text-default-400 hover:text-default-600"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )
      }
      classNames={{
        base: "w-full",
        input: "text-sm",
      }}
    />
  );
};
