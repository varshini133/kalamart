import React from 'react';
import { CRAFT_COLLECTIONS } from '../../data/mockData';
import { CraftCollection, Language } from '../../types';

interface CraftCollectionsSectionProps {
  onSelectCollection: (collection: CraftCollection) => void;
  language?: Language;
}

export const CraftCollectionsSection: React.FC<CraftCollectionsSectionProps> = ({
  onSelectCollection,
  language = 'en'
}) => {
  return (
    <section className="space-y-3.5 w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-secondary mb-0.5">
            <span className="material-symbols-outlined text-[16px]">collections_bookmark</span>
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {language === 'ta' ? 'சிறப்புக் களஞ்சியம்' : language === 'hi' ? 'विशेष संग्रह' : 'Curated Master Series'}
            </span>
          </div>
          <h2 className="font-bold text-lg font-sans text-primary">
            {language === 'ta' ? 'பாரம்பரிய கைவினைத் தொகுப்புகள்' : language === 'hi' ? 'प्रामाणिक शिल्प संग्रह' : 'Authentic Craft Collections'}
          </h2>
          <p className="text-xs text-outline">
            {language === 'ta'
              ? 'வரலாற்றுப் பின்னணியும் புவிசார் அங்கீகாரமும் கொண்ட பிரத்யேகத் தொகுப்புகள்'
              : language === 'hi'
              ? 'हजारों साल की ऐतिहासिक निरंतरता और भौगोलिक संकेत से प्रमाणित विशेष कृतियां'
              : 'Thematic heritage series hand-curated from registered geographical clusters'}
          </p>
        </div>
      </div>

      {/* Collections 2x2 Grid or Horizontal Scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {CRAFT_COLLECTIONS.map((col) => {
          const localizedTitle =
            language === 'ta' && col.tamilTitle
              ? col.tamilTitle
              : language === 'hi' && col.hindiTitle
              ? col.hindiTitle
              : col.title;

          return (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col)}
              className="group relative rounded-3xl overflow-hidden shadow-sm border border-outline-variant/30 bg-surface-container cursor-pointer hover:shadow-md transition-all active:scale-98 flex flex-col justify-end min-h-[220px]"
            >
              {/* Background Image */}
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Cultural Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />

              {/* Top Tags */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-[10px] font-bold text-primary shadow-xs">
                  {col.region}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  {col.badge}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 p-4 space-y-1.5 text-on-primary">
                <div className="text-[11px] text-surface-container-high font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-secondary">person</span>
                  <span>{col.artisanName}</span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-surface-bright leading-snug">
                  {localizedTitle}
                </h3>

                <p className="text-xs text-surface-container-high line-clamp-2 leading-relaxed opacity-95">
                  {col.subtitle}
                </p>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary group-hover:underline flex items-center gap-1">
                    <span>{language === 'ta' ? 'தொகுப்பைக் காண்க' : language === 'hi' ? 'संग्रह देखें' : 'Explore Collection'}</span>
                    <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
