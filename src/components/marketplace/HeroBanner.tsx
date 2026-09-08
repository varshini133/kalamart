import React from 'react';
import { KUTCH_POTTERY_HERO } from '../../data/mockData';
import { Language } from '../../types';

interface HeroBannerProps {
  language?: Language;
  onExploreCrafts: () => void;
  onMeetArtisans: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language = 'en',
  onExploreCrafts,
  onMeetArtisans
}) => {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-surface-container-lowest shadow-xl border border-outline-variant/30">
      <div className="relative w-full min-h-[360px] flex flex-col justify-end overflow-hidden">
        {/* Background authentic imagery */}
        <img
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
          src={KUTCH_POTTERY_HERO}
          alt="Master artisan molding sacred earthen pottery on traditional potter's wheel"
        />

        {/* Sophisticated dual-tone authentic cultural gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/25" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              {language === 'ta'
                ? 'நேரடி புவிசார் குறியீடு'
                : language === 'hi'
                ? 'प्रमाणित जीआई शिल्प'
                : '100% Certified GI Provenance'}
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {language === 'ta' ? 'பாரம்பரிய கைவினை' : language === 'hi' ? 'जीवंत धरोहर' : 'Living Heritage'}
          </span>
        </div>

        {/* Content Body */}
        <div className="relative z-10 p-5 sm:p-6 text-on-primary space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/90 text-on-secondary text-[11px] font-bold backdrop-blur-sm">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span>
              {language === 'ta'
                ? 'நேரடி கைவினைஞர் சந்தை'
                : language === 'hi'
                ? 'कारीगरों से सीधे आपके घर'
                : 'Direct From Living Masters'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl leading-tight font-bold text-surface-bright tracking-tight">
            {language === 'ta'
              ? 'பாரம்பரியக் கலைகளின் தூய கைவண்ணம்'
              : language === 'hi'
              ? 'प्रामाणिक हस्तकला एवं पारंपरिक शिल्प'
              : 'Authentic Handmade Craftsmanship'}
          </h1>

          <p className="text-xs sm:text-sm text-surface-container-high leading-relaxed max-w-lg">
            {language === 'ta'
              ? 'தலைமுறை தலைமுறையாக போற்றி வளர்க்கப்படும் பாரம்பரிய கைவினைப் பொருட்கள். இடைத்தரகர்கள் இன்றி கைவினைஞர்களிடமிருந்து நேரடியாக.'
              : language === 'hi'
              ? 'हर शिल्प में बसी है सदियों की पवित्र परंपरा और पीढ़ियों की साधना। बिना किसी बिचौलिए के सीधे कारीगर परिवारों से।'
              : 'Every single piece carries centuries of sacred craft tradition, shaped with mindful devotion by verified master artisans with zero middlemen.'}
          </p>

          {/* Value Micro-Pill Strip */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-surface-container-highest">
            <span className="inline-flex items-center gap-1 bg-primary-container/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-outline-variant/20">
              <span className="text-secondary font-bold">✓</span>
              <span>{language === 'ta' ? '100% கைவினை' : language === 'hi' ? '100% हस्तनिर्मित' : '100% Handcrafted'}</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-primary-container/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-outline-variant/20">
              <span className="text-secondary font-bold">✓</span>
              <span>{language === 'ta' ? 'முழு ஊதியம்' : language === 'hi' ? 'सीधा पारिश्रमिक' : 'Direct Artisan Royalties'}</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-primary-container/40 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-outline-variant/20">
              <span className="text-secondary font-bold">✓</span>
              <span>{language === 'ta' ? 'பிளாஸ்டிக் அற்றது' : language === 'hi' ? 'प्लास्टिक मुक्त पैकेजिंग' : 'Eco-Packaged'}</span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onExploreCrafts}
              className="px-5 py-2.5 rounded-full bg-secondary text-on-secondary text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-secondary/90 active:scale-95 transition-all"
            >
              <span>{language === 'ta' ? 'சிறப்புப் படைப்புகள்' : language === 'hi' ? 'मास्टरपीस देखें' : 'Explore Masterpieces'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            </button>

            <button
              onClick={onMeetArtisans}
              className="px-4 py-2.5 rounded-full bg-surface-container-lowest/85 backdrop-blur-sm text-primary text-xs font-bold flex items-center gap-1.5 hover:bg-surface-container-lowest active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">groups</span>
              <span>{language === 'ta' ? 'கைவினைஞர்களை சந்திக்க' : language === 'hi' ? 'कारीगरों से मिलें' : 'Meet Artisans'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
