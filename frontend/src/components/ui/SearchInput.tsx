import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import Input from './Input';

export interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'post' | 'user' | 'tag' | 'category';
  metadata?: any;
}

interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  suggestions?: SearchSuggestion[];
  loading?: boolean;
  className?: string;
  variant?: 'default' | 'hero' | 'navbar';
  size?: 'sm' | 'md' | 'lg';
  showHistory?: boolean;
  recentSearches?: string[];
  onClearHistory?: () => void;
}

const SearchInput: React.FC<SearchProps> = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  loading = false,
  className,
  variant = 'default',
  size = 'md',
  showHistory = false,
  recentSearches = [],
  onClearHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const variantClasses = {
    default: 'bg-white border-gray-300',
    hero: 'bg-white/90 backdrop-blur-md border-white/20 shadow-xl',
    navbar: 'bg-gray-50 border-gray-200',
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearch = () => {
    if (internalValue.trim()) {
      onSearch?.(internalValue.trim());
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = (showHistory ? recentSearches.length : 0) + suggestions.length;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < totalItems) {
        if (showHistory && selectedIndex < recentSearches.length) {
          const selectedHistory = recentSearches[selectedIndex];
          setInternalValue(selectedHistory);
          onChange?.(selectedHistory);
          onSearch?.(selectedHistory);
        } else {
          const suggestionIndex = showHistory ? selectedIndex - recentSearches.length : selectedIndex;
          const selectedSuggestion = suggestions[suggestionIndex];
          onSuggestionSelect?.(selectedSuggestion);
        }
        setIsOpen(false);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type?: string) => {
    switch (type) {
      case 'post': return '📄';
      case 'user': return '👤';
      case 'tag': return '🏷️';
      case 'category': return '📁';
      default: return '🔍';
    }
  };

  const showDropdown = isOpen && (suggestions.length > 0 || (showHistory && recentSearches.length > 0) || loading);

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className={cn(
            variantClasses[variant],
            sizeClasses[size],
            'pr-20'
          )}
          leftIcon={<Search className="h-5 w-5" />}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          )}
          {internalValue && (
            <button
              onClick={handleClear}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          )}

          {!loading && showHistory && recentSearches.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Recent Searches
                {onClearHistory && (
                  <button
                    onClick={onClearHistory}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={`history-${index}`}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm',
                    'hover:bg-gray-50 flex items-center space-x-2',
                    selectedIndex === index && 'bg-primary-50 text-primary-600'
                  )}
                  onClick={() => {
                    setInternalValue(search);
                    onChange?.(search);
                    onSearch?.(search);
                    setIsOpen(false);
                  }}
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, index) => {
                const actualIndex = showHistory ? index + recentSearches.length : index;
                return (
                  <button
                    key={suggestion.id}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-md text-sm',
                      'hover:bg-gray-50 flex items-center space-x-2',
                      selectedIndex === actualIndex && 'bg-primary-50 text-primary-600'
                    )}
                    onClick={() => {
                      onSuggestionSelect?.(suggestion);
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                    <span>{suggestion.text}</span>
                    {suggestion.type && (
                      <span className="ml-auto text-xs text-gray-400 capitalize">
                        {suggestion.type}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {!loading && suggestions.length === 0 && (!showHistory || recentSearches.length === 0) && internalValue && (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
