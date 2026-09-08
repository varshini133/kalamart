import React from 'react';
import { Language } from '../../types';

interface B2BSectionProps {
  onNavigateB2B: () => void;
  onRequestWholesaleCatalog: () => void;
  language?: Language;
}

export const B2BSection: React.FC<B2BSectionProps> = ({
  onNavigateB2B,
  onRequestWholesaleCatalog,
  language = 'en'
}) => {
  return (
    <section className="w-full overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-md">
      <div className="relative p-5 sm:p-7 space-y-5 bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container/60">
        {/* Subtle decorative watermark icon */}
        <span className="material-symbols-outlined absolute right-3 bottom-3 text-7xl sm:text-8xl text-outline-variant/10 select-none pointer-events-none">
          domain
        </span>

        {/* Top Eyebrow */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <span className="material-symbols-outlined text-[15px] text-secondary">inventory_2</span>
            <span>
              {language === 'ta'
                ? 'மொத்த வணிகச் சந்தை (B2B)'
                : language === 'hi'
                ? 'थोक खरीद एवं संस्थागत ऑर्डर (B2B)'
                : 'Direct Artisan Bulk Sourcing'}
            </span>
          </div>

          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
            {language === 'ta' ? 'அங்கீகரிக்கப்பட்ட கூட்டுறவு' : language === 'hi' ? 'प्रमाणित सहकारी' : 'Cooperative Direct'}
          </span>
        </div>

        {/* Headline & Description */}
        <div className="space-y-2 max-w-xl">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-primary leading-tight">
            {language === 'ta'
              ? 'மொத்தமாக வாங்க விரும்புகிறீர்களா?'
              : language === 'hi'
              ? 'थोक या बड़े पैमाने पर सोर्सिंग की तलाश है?'
              : 'Looking to source in bulk?'}
          </h2>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {language === 'ta'
              ? 'ஹோட்டல்கள், கார்ப்பரேட் பரிசுகள் மற்றும் உள்துறை வடிவமைப்பாளர்களுக்காக நேரடியாக கைவினைஞர்களிடமிருந்து மொத்த கொள்முதல்.'
              : language === 'hi'
              ? 'बुटीक होटल, कॉर्पोरेट उपहार, इंटीरियर डिजाइन और निर्यात के लिए सीधे जीआई प्रमाणित कारीगर समूहों से थोक खरीद।'
              : 'Direct institutional sourcing for boutique hospitality, corporate gifting, interior architects, and ethical retail straight from certified artisan clusters. Zero intermediaries with full provenance paperwork.'}
          </p>
        </div>

        {/* 4 Key Institutional Trust Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 shadow-2xs space-y-1">
            <div className="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[16px]">price_change</span>
            </div>
            <h3 className="font-bold text-xs text-primary">
              {language === 'ta' ? 'நேரடி மொத்த விலை' : language === 'hi' ? 'थोक कारीगर दर' : 'Wholesale Tiers'}
            </h3>
            <p className="text-[10px] text-outline leading-snug">
              {language === 'ta' ? '20-35% சில்லறை விலையை விடக் குறைவு' : language === 'hi' ? '20-35% खुदरा से कम' : '20-35% below retail direct rates'}
            </p>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 shadow-2xs space-y-1">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
            <h3 className="font-bold text-xs text-primary">
              {language === 'ta' ? 'புவிசார் சான்றிதழ்' : language === 'hi' ? 'जीआई प्रामाणिकता' : 'GI Provenance'}
            </h3>
            <p className="text-[10px] text-outline leading-snug">
              {language === 'ta' ? 'அங்கீகரிக்கப்பட்ட கைவினைச் சான்றிதழ்' : language === 'hi' ? 'प्रत्येक बैच का आधिकारिक प्रमाण' : 'Batch certification & artisan sign-off'}
            </p>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 shadow-2xs space-y-1">
            <div className="w-7 h-7 rounded-lg bg-tertiary/15 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[16px]">package_2</span>
            </div>
            <h3 className="font-bold text-xs text-primary">
              {language === 'ta' ? 'பிரத்யேக பேக்கிங்' : language === 'hi' ? 'कस्टम पैकेजिंग' : 'Custom Branding'}
            </h3>
            <p className="text-[10px] text-outline leading-snug">
              {language === 'ta' ? 'கார்ப்பரேட் கதை அட்டை மற்றும் பேக்கிங்' : language === 'hi' ? 'कारीगर कहानी कार्ड के साथ' : 'Artisan story cards & eco gift boxes'}
            </p>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 shadow-2xs space-y-1">
            <div className="w-7 h-7 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            </div>
            <h3 className="font-bold text-xs text-primary">
              {language === 'ta' ? 'மாதிரி அனுப்புதல்' : language === 'hi' ? 'त्वरित नमूने' : 'Sample Dispatch'}
            </h3>
            <p className="text-[10px] text-outline leading-snug">
              {language === 'ta' ? '48 மணி நேரத்தில் மாதிரி அனுப்பப்படும்' : language === 'hi' ? '48 घंटे में सैंपलिंग' : 'Cluster samples within 48 hours'}
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onNavigateB2B}
            className="px-5 py-3 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>
              {language === 'ta'
                ? 'மொத்த விற்பனை போர்ட்டல் செல்லவும்'
                : language === 'hi'
                ? 'थोक बी2बी पोर्टल खोलें'
                : 'Access Wholesale B2B Portal'}
            </span>
          </button>

          <button
            onClick={onRequestWholesaleCatalog}
            className="px-5 py-3 rounded-full bg-surface-container-lowest text-primary text-xs font-bold flex items-center justify-center gap-2 border border-outline-variant/50 hover:bg-surface-container-high active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">assignment</span>
            <span>
              {language === 'ta'
                ? 'மொத்த விவரக் கையேடு கோரவும்'
                : language === 'hi'
                ? 'थोक कैटलॉग अनुरोध करें'
                : 'Request Bulk Catalog & Pricing'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
