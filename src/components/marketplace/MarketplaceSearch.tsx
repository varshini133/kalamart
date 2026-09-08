import React from 'react';
import { Language } from '../../types';

interface MarketplaceSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenVoice: () => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  language?: Language;
  onQuickChipClick: (keyword: string) => void;
  selectedCategory: string | null;
  selectedRegion: string | null;
  selectedMaterial: string | null;
  onlyHandmade: boolean;
  onlyReadyToShip: boolean;
  onlyBulk: boolean;
  onClearAllFilters: () => void;
  totalResultsCount: number;
}

export const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({
  searchQuery,
  onSearchChange,
  onOpenVoice,
  onOpenFilters,
  activeFilterCount,
  language = 'en',
  onQuickChipClick,
  selectedCategory,
  selectedRegion,
  selectedMaterial,
  onlyHandmade,
  onlyReadyToShip,
  onlyBulk,
  onClearAllFilters,
  totalResultsCount
}) => {
  const quickChips = [
    { label: language === 'ta' ? 'சுடுமண் மண்பாண்டம்' : language === 'hi' ? 'टेराकोटा मिट्टी' : 'Terracotta', query: 'Terracotta' },
    { label: language === 'ta' ? 'தோக்ரா பித்தளை' : language === 'hi' ? 'ढोकरा धातु' : 'Dhokra Brass', query: 'Dhokra' },
    { label: language === 'ta' ? 'நீல பீங்கான்' : language === 'hi' ? 'जयपुर ब्लू पॉटरी' : 'Blue Pottery', query: 'Blue Pottery' },
    { label: language === 'ta' ? 'சந்தேரி பட்டு' : language === 'hi' ? 'चंदेरी सिल्क' : 'Chanderi Silk', query: 'Chanderi' },
    { label: language === 'ta' ? 'மதுபானி ஓவியம்' : language === 'hi' ? 'मधुबनी चित्रकला' : 'Madhubani', query: 'Madhubani' },
    { label: language === 'ta' ? 'தேசி கம்பளி' : language === 'hi' ? 'देसी ऊन शॉल' : 'Desi Wool', query: 'Desi Wool' },
    { label: language === 'ta' ? 'ராம்தேவ் கும்ஹார்' : language === 'hi' ? 'रामदेव कुम्हार' : 'Ramdev Kumbhar', query: 'Ramdev' }
  ];

  return (
    <div className="w-full space-y-3">
      {/* Primary Multimodal Search Bar */}
      <div className="relative w-full">
        <div className="flex items-center w-full h-14 pl-4 pr-2 bg-surface-container-lowest rounded-full shadow-md border border-outline-variant/30 transition-all focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20">
          <span className="material-symbols-outlined text-[22px] text-outline mr-2.5">search</span>
          <input
            className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
            placeholder={
              language === 'ta'
                ? 'பொருள், கலை, கைவினைஞர், பகுதி தேடவும்...'
                : language === 'hi'
                ? 'उत्पाद, शिल्प, कारीगर या क्षेत्र खोजें...'
                : 'Search by product, craft, artisan, or region...'
            }
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="w-8 h-8 rounded-full text-outline hover:text-primary flex items-center justify-center mr-1 transition-colors"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenVoice}
              aria-label="Voice Search"
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary-container hover:text-on-secondary transition-all active:scale-95"
              title={language === 'ta' ? 'குரல் தேடல்' : language === 'hi' ? 'आवाज से खोजें' : 'Voice Search'}
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>

            <button
              onClick={onOpenFilters}
              aria-label="Filter Options"
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                activeFilterCount > 0
                  ? 'bg-secondary text-on-secondary shadow-md'
                  : 'bg-primary text-on-primary hover:bg-primary-container'
              }`}
              title="Filters"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar text-xs">
        <span className="text-[11px] font-semibold text-outline uppercase tracking-wider flex-shrink-0">
          {language === 'ta' ? 'பிரபலமானவை:' : language === 'hi' ? 'लोकप्रिय:' : 'Popular:'}
        </span>
        {quickChips.map((chip, idx) => {
          const isActive = searchQuery.toLowerCase() === chip.query.toLowerCase();
          return (
            <button
              key={idx}
              onClick={() => onQuickChipClick(isActive ? '' : chip.query)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                isActive
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Active Filter Indicators & Results Count */}
      {(searchQuery || selectedCategory || selectedRegion || selectedMaterial || onlyHandmade || onlyReadyToShip || onlyBulk) && (
        <div className="flex items-center gap-2 flex-wrap text-xs px-1 pt-1 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 shadow-xs">
          <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-bold">
            <span className="material-symbols-outlined text-[14px] text-secondary">filter_list</span>
            <span>
              {language === 'ta'
                ? `${totalResultsCount} கைவினைப் பொருட்கள்`
                : language === 'hi'
                ? `${totalResultsCount} शिल्प मिले`
                : `${totalResultsCount} authentic crafts`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
                <span>"{searchQuery}"</span>
                <button onClick={() => onSearchChange('')}>
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary font-bold text-[11px]">
                <span>{selectedCategory}</span>
                <button onClick={() => onQuickChipClick('')}>
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </span>
            )}

            {selectedRegion && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold text-[11px]">
                <span>📍 {selectedRegion}</span>
              </span>
            )}

            {selectedMaterial && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold text-[11px]">
                <span>🧵 {selectedMaterial}</span>
              </span>
            )}

            {onlyHandmade && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-semibold text-[10px]">
                <span>100% Handmade</span>
              </span>
            )}

            {onlyReadyToShip && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container/30 text-primary font-semibold text-[10px]">
                <span>Ready to Ship</span>
              </span>
            )}

            {onlyBulk && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-semibold text-[10px]">
                <span>Bulk Available</span>
              </span>
            )}
          </div>

          <button
            onClick={onClearAllFilters}
            className="text-[11px] font-bold text-secondary hover:underline ml-auto"
          >
            {language === 'ta' ? 'அனைத்தும் நீக்கு' : language === 'hi' ? 'सभी हटाएं' : 'Clear All'}
          </button>
        </div>
      )}
    </div>
  );
};
