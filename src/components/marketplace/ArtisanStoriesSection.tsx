import React from 'react';
import { ARTISANS } from '../../data/mockData';
import { Artisan, Language } from '../../types';

interface ArtisanStoriesSectionProps {
  onSelectArtisan: (artisan: Artisan) => void;
  onFilterByArtisan: (artisanName: string) => void;
  language?: Language;
}

export const ArtisanStoriesSection: React.FC<ArtisanStoriesSectionProps> = ({
  onSelectArtisan,
  onFilterByArtisan,
  language = 'en'
}) => {
  return (
    <section className="space-y-3.5 w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-secondary mb-0.5">
            <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {language === 'ta' ? 'வாழும் பாரம்பரியங்கள்' : language === 'hi' ? 'कारीगरों की कहानियां' : 'Living Heritage Stories'}
            </span>
          </div>
          <h2 className="font-bold text-lg font-sans text-primary">
            {language === 'ta' ? 'தலைசிறந்த கைவினைஞர்கள்' : language === 'hi' ? 'कारीगरों से मिलें' : 'Meet the Artisans'}
          </h2>
          <p className="text-xs text-outline">
            {language === 'ta'
              ? 'ஒவ்வொரு படைப்பிற்கும் பின்னால் ஒரு கைவினைஞரின் வாழ்நாள் அர்ப்பணிப்பு'
              : language === 'hi'
              ? 'हर उत्पाद के पीछे है एक गुरु की पीढ़ियों की साधना और कहानी'
              : 'Behind every craft is a master artisan preserving centuries of cultural memory'}
          </p>
        </div>
      </div>

      {/* Artisans Stories Horizontal Card Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 pt-1 -mx-4 px-4 no-scrollbar">
        {ARTISANS.map((artisan) => (
          <div
            key={artisan.id}
            className="w-72 sm:w-80 flex-shrink-0 bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between space-y-3 group hover:border-secondary/70 hover:shadow-md transition-all"
          >
            {/* Header: Photo, Name, Verified GI Badge & Experience */}
            <div 
              onClick={() => onSelectArtisan(artisan)}
              className="flex items-start gap-3 cursor-pointer"
            >
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-secondary/30">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  src={artisan.image}
                  alt={artisan.name}
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px]">verified</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-primary truncate hover:text-secondary transition-colors">{artisan.name}</h3>
                </div>
                <p className="text-xs text-secondary font-semibold truncate">{artisan.role}</p>
                <div className="flex items-center gap-1 text-[11px] text-outline truncate mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  <span>{artisan.location}</span>
                </div>
              </div>
            </div>

            {/* Experience & Lineage Pill */}
            <div className="flex items-center gap-2">
              {artisan.yearsOfExperience && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                  {artisan.yearsOfExperience}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">verified_user</span>
                <span>GI Certified Master</span>
              </span>
            </div>

            {/* Authentic Quote Box */}
            <div className="bg-surface-container-low rounded-2xl p-3 border-l-3 border-secondary relative">
              <span className="material-symbols-outlined text-secondary/30 text-2xl absolute right-2 top-2 select-none">
                format_quote
              </span>
              <p className="text-xs text-on-surface-variant italic leading-relaxed relative z-10 pr-4">
                "{artisan.storyQuote || artisan.bio}"
              </p>
            </div>

            {/* Mini creations showcase */}
            <div>
              <div className="text-[11px] font-semibold text-outline mb-1.5 flex items-center justify-between">
                <span>{language === 'ta' ? 'கைவினைத் தயாரிப்புகள்' : language === 'hi' ? 'हस्तशिल्प संग्रह' : 'Featured Handcrafts'}</span>
                <span className="text-secondary font-bold">{artisan.creationsCount} {language === 'ta' ? 'படைப்புகள்' : language === 'hi' ? 'कृतियां' : 'items'}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {artisan.miniProducts.map((img, idx) => (
                  <div key={idx} className="h-16 rounded-xl overflow-hidden bg-surface-container shadow-2xs">
                    <img className="w-full h-full object-cover" src={img} alt={`${artisan.name} creation ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onSelectArtisan(artisan)}
                className="flex-1 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary-container transition-all active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px] text-secondary">person</span>
                <span>View Profile</span>
              </button>

              <button
                onClick={() => onFilterByArtisan(artisan.name)}
                className="flex-1 py-2.5 rounded-full bg-surface-container-high text-primary text-xs font-bold flex items-center justify-center gap-1 hover:bg-surface-container-highest transition-all active:scale-95 shadow-xs"
              >
                <span>{language === 'ta' ? 'படைப்புகள்' : language === 'hi' ? 'शिल्प देखें' : 'View Crafts'}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
