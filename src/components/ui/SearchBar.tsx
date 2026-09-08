import React from 'react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onVoiceClick?: () => void;
  onFilterClick?: () => void;
  placeholder?: string;
  className?: string;
  filterActive?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onVoiceClick,
  onFilterClick,
  placeholder = 'Search authentic GI crafts, master weavers, pottery...',
  className = '',
  filterActive = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative flex items-center gap-2 w-full ${className}`}>
      <div className="relative flex-1 flex items-center">
        <span className="absolute left-3.5 text-outline material-symbols-outlined text-[20px] pointer-events-none">
          search
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full font-sans text-xs sm:text-sm pl-10 pr-16 py-2.5 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-outline/70 focus:outline-none focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 rounded-full text-outline hover:text-on-surface transition-colors"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}

          {onVoiceClick && (
            <button
              type="button"
              onClick={onVoiceClick}
              className="p-1 rounded-full text-secondary hover:bg-secondary/10 transition-colors"
              title="Search by Voice"
            >
              <span className="material-symbols-outlined text-[19px]">mic</span>
            </button>
          )}
        </div>
      </div>

      {onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className={`shrink-0 p-2.5 rounded-full border transition-all flex items-center justify-center ${
            filterActive
              ? 'bg-primary text-on-primary border-primary shadow-xs'
              : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-primary hover:bg-surface-container-high'
          }`}
          title="Filter Crafts"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      )}
    </div>
  );
};
