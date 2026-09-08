import React from 'react';
import { MARKETPLACE_CATEGORIES } from '../../data/mockData';
import { Language } from '../../types';

interface CategoriesSectionProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  language?: Language;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  language = 'en'
}) => {
  return (
    <section className="space-y-3.5 w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-secondary mb-0.5">
            <span className="material-symbols-outlined text-[16px]">category</span>
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {language === 'ta' ? 'பாரம்பரிய துறைகள்' : language === 'hi' ? 'प्रामाणिक श्रेणियां' : 'Craft Disciplines'}
            </span>
          </div>
          <h2 className="font-bold text-lg font-sans text-primary">
            {language === 'ta' ? 'கைவினைப் பிரிவுகள்' : language === 'hi' ? 'प्रमुख शिल्प श्रेणियां' : 'Explore by Craft Category'}
          </h2>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-0.5"
          >
            <span>{language === 'ta' ? 'அனைத்தும் காண்க' : language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
          </button>
        )}
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
        {MARKETPLACE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const localizedName =
            language === 'ta' && cat.tamilName
              ? cat.tamilName
              : language === 'hi' && cat.hindiName
              ? cat.hindiName
              : cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
              className={`flex flex-col items-center text-center p-2.5 rounded-2xl transition-all duration-300 group active:scale-95 border ${
                isSelected
                  ? 'bg-secondary/15 border-secondary ring-2 ring-secondary/40 shadow-md'
                  : 'bg-surface-container-lowest border-outline-variant/30 hover:border-secondary/50 hover:bg-surface-container-low shadow-xs'
              }`}
            >
              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mb-2 shadow-xs transition-transform duration-300 group-hover:scale-105 ${
                  isSelected ? 'ring-2 ring-secondary ring-offset-2' : ''
                }`}
              >
                <img
                  className="w-full h-full object-cover"
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
              </div>

              <span
                className={`text-xs font-bold leading-tight truncate w-full ${
                  isSelected ? 'text-secondary' : 'text-primary'
                }`}
              >
                {localizedName}
              </span>

              <span className="text-[10px] text-outline mt-0.5 font-medium truncate w-full">
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
