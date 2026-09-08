import React from 'react';
import { Language } from '../../types';

interface MarketplaceFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  selectedRegion: string | null;
  onSelectRegion: (reg: string | null) => void;
  selectedMaterial: string | null;
  onSelectMaterial: (mat: string | null) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  onlyHandmade: boolean;
  onToggleHandmade: () => void;
  onlyReadyToShip: boolean;
  onToggleReadyToShip: () => void;
  onlyBulk: boolean;
  onToggleBulk: () => void;
  onResetFilters: () => void;
  language?: Language;
  activeFilterCount: number;
}

export const MarketplaceFiltersModal: React.FC<MarketplaceFiltersModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  selectedMaterial,
  onSelectMaterial,
  maxPrice,
  onMaxPriceChange,
  onlyHandmade,
  onToggleHandmade,
  onlyReadyToShip,
  onToggleReadyToShip,
  onlyBulk,
  onToggleBulk,
  onResetFilters,
  language = 'en',
  activeFilterCount
}) => {
  if (!isOpen) return null;

  const categories = [
    'Handloom',
    'Home Decor',
    'Jewelry',
    'Pottery',
    'Textiles',
    'Traditional Art'
  ];

  const regions = [
    'Gujarat',
    'Rajasthan',
    'Chhattisgarh',
    'Madhya Pradesh',
    'Uttar Pradesh',
    'Bihar',
    'Tamil Nadu',
    'Telangana'
  ];

  const materials = [
    'Natural Terracotta Clay',
    '100% Brass & Bell Metal',
    'Pure Silk & Zari Threads',
    'Indigenous Desi Wool',
    'Aromatic Sheesham Wood',
    'Quartz Dough & Oxides',
    'Handmade Lokta Paper'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/60 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-secondary">tune</span>
            <h2 className="font-bold text-base text-primary">
              {language === 'ta' ? 'வடிகட்டி விருப்பங்கள்' : language === 'hi' ? 'शिल्प फ़िल्टर' : 'Filter Authentic Crafts'}
            </h2>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[11px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Filter Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Quick Toggles: Handmade, Ready to Ship, Bulk */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-primary uppercase tracking-wider text-[11px]">
              {language === 'ta' ? 'விரைவு வடிப்பான்கள்' : language === 'hi' ? 'त्वरित विकल्प' : 'Preferences & Availability'}
            </h3>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">pan_tool</span>
                  <div>
                    <div className="font-bold text-primary">100% Certified Handmade</div>
                    <div className="text-[10px] text-outline">Verified artisan master crafted without industrial machines</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={onlyHandmade}
                  onChange={onToggleHandmade}
                  className="w-4 h-4 accent-secondary rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
                  <div>
                    <div className="font-bold text-primary">Ready to Ship</div>
                    <div className="text-[10px] text-outline">In cluster stock, dispatches in 24-48 hours</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={onlyReadyToShip}
                  onChange={onToggleReadyToShip}
                  className="w-4 h-4 accent-secondary rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">inventory_2</span>
                  <div>
                    <div className="font-bold text-primary">Bulk / Wholesale Available</div>
                    <div className="text-[10px] text-outline">Qualifies for direct B2B volume pricing</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={onlyBulk}
                  onChange={onToggleBulk}
                  className="w-4 h-4 accent-secondary rounded"
                />
              </label>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-primary uppercase tracking-wider text-[11px]">
              {language === 'ta' ? 'பிரிவு' : language === 'hi' ? 'श्रेणी' : 'Craft Category'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(isSelected ? null : cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-primary uppercase tracking-wider text-[11px]">
                {language === 'ta' ? 'அதிகபட்ச விலை' : language === 'hi' ? 'मूल्य सीमा' : 'Price Range'}
              </h3>
              <span className="font-bold text-secondary text-sm">
                Up to ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer h-2 bg-surface-container rounded-lg"
            />

            <div className="flex gap-2 pt-1">
              {[1500, 3500, 6000, 10000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => onMaxPriceChange(preset)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                    maxPrice === preset
                      ? 'border-secondary bg-secondary/15 text-secondary'
                      : 'border-outline-variant/30 text-outline hover:border-secondary'
                  }`}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-primary uppercase tracking-wider text-[11px]">
              {language === 'ta' ? 'கைவினைப் பகுதி / மாநிலம்' : language === 'hi' ? 'क्षेत्र या राज्य' : 'Craft Origin / Region'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((reg) => {
                const isSelected = selectedRegion === reg;
                return (
                  <button
                    key={reg}
                    onClick={() => onSelectRegion(isSelected ? null : reg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    📍 {reg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-primary uppercase tracking-wider text-[11px]">
              {language === 'ta' ? 'மூலப்பொருள்' : language === 'hi' ? 'पारंपरिक सामग्री' : 'Authentic Material'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {materials.map((mat) => {
                const isSelected = selectedMaterial === mat;
                return (
                  <button
                    key={mat}
                    onClick={() => onSelectMaterial(isSelected ? null : mat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    🧵 {mat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-outline-variant/20 flex gap-3 bg-surface-container-lowest">
          <button
            onClick={onResetFilters}
            className="flex-1 py-3 rounded-full bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors"
          >
            {language === 'ta' ? 'அனைத்தும் நீக்கு' : language === 'hi' ? 'रीसेट करें' : 'Reset All Filters'}
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-secondary text-on-secondary font-bold text-xs shadow-md hover:bg-secondary/90 transition-all active:scale-95"
          >
            {language === 'ta' ? 'முடிவுகளைக் காண்க' : language === 'hi' ? 'शिल्प देखें' : 'Show Results'}
          </button>
        </div>
      </div>
    </div>
  );
};
