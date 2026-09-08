import React, { useState, useMemo } from 'react';
import { Artisan, Product, Language, ScreenType } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { WholesaleInquiryModal, WholesaleInquiryData } from '../components/marketplace/WholesaleInquiryModal';

interface ArtisanProfileScreenProps {
  artisan: Artisan;
  products: Product[];
  onNavigate: (screen: ScreenType) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onShowToast: (msg: string) => void;
  wishlist?: Record<string, boolean>;
  onToggleWishlist?: (productId: string, e: React.MouseEvent) => void;
  language?: Language;
}

export const ArtisanProfileScreen: React.FC<ArtisanProfileScreenProps> = ({
  artisan,
  products,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onShowToast,
  wishlist = {},
  onToggleWishlist,
  language = 'en'
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'creations' | 'story' | 'bulk'>('creations');

  // Filter products by this artisan
  const artisanProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.status === 'published' &&
        (p.artisanName.toLowerCase().includes(artisan.name.toLowerCase()) ||
          artisan.name.toLowerCase().includes(p.artisanName.toLowerCase()))
    );
  }, [products, artisan.name]);

  const toggleAudioStory = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      onShowToast(
        language === 'ta'
          ? `${artisan.name} அவர்களின் கைவினைக் குரல் கதை ஒலிக்கிறது`
          : language === 'hi'
          ? `${artisan.name} की आवाज में पारंपरिक कथा शुरू`
          : `Listening to ${artisan.name}'s master craft story in native voice`
      );
    }
  };

  const handleBulkSubmit = (data: WholesaleInquiryData) => {
    onShowToast(
      language === 'ta'
        ? `மொத்தக் கோரிக்கை ${artisan.name} கூட்டுறவுக்கு அனுப்பப்பட்டது!`
        : language === 'hi'
        ? `थोक ऑर्डर पूछताछ ${artisan.name} को सफलतापूर्वक भेजी गई!`
        : `Wholesale inquiry dispatched directly to ${artisan.name}'s cluster workshop.`
    );
  };

  const coverImage =
    artisan.coverImage ||
    (artisanProducts[0]?.images[0] ??
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3');

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-32 max-w-md mx-auto animate-fadeIn bg-surface">
      {/* Top Floating Back Bar */}
      <div className="px-4 py-2 flex items-center justify-between z-30">
        <button
          onClick={() => onNavigate('discover')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border border-outline-variant/30 text-xs font-bold text-primary hover:bg-surface-container-low transition-all"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">arrow_back</span>
          <span>{language === 'ta' ? 'சந்தைக்குத் திரும்பு' : language === 'hi' ? 'बाज़ार वापस' : 'Back to Marketplace'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              onShowToast(
                language === 'ta'
                  ? 'கைவினைஞர் சுயவிவர இணைப்பு நகலெடுக்கப்பட்டது!'
                  : language === 'hi'
                  ? 'कारीगर प्रोफाइल लिंक कॉपी किया गया!'
                  : 'Artisan profile link copied to clipboard!'
              );
            }}
            className="w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-primary shadow-xs border border-outline-variant/30 hover:bg-surface-container"
            title="Share Profile"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Cover & Profile Portrait */}
      <div className="relative px-4">
        {/* Cover Banner */}
        <div className="relative w-full h-44 sm:h-52 rounded-3xl overflow-hidden bg-surface-container shadow-md border border-outline-variant/20">
          <img src={coverImage} alt={`${artisan.name} craft workshop`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
          
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-[10px] font-bold text-primary flex items-center gap-1 border border-outline-variant/30 shadow-2xs">
            <span className="material-symbols-outlined text-[13px] text-secondary">verified_user</span>
            <span>GI Cluster Certified</span>
          </div>

          <div className="absolute bottom-3 left-4 text-on-primary">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>{artisan.location}</span>
            </span>
          </div>
        </div>

        {/* Floating Artisan Portrait & Status */}
        <div className="relative -mt-12 px-2 flex items-end justify-between">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-surface bg-surface-container-lowest shadow-lg">
              <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
            </div>
            {artisan.verified && (
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs border-2 border-surface"
                title="Verified Living Heritage Master"
              >
                <span className="material-symbols-outlined text-[14px]">verified</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pb-1">
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-3.5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container active:scale-95 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary">inventory_2</span>
              <span>{language === 'ta' ? 'மொத்த ஆர்டர்' : language === 'hi' ? 'थोक कोट' : 'Bulk Quote'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Artisan Header Info */}
      <div className="px-4 pt-3 space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-primary leading-tight">
              {artisan.name}
            </h1>
            {artisan.trustRating && (
              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-xs font-bold">
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span>{artisan.trustRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-secondary font-bold mt-0.5">{artisan.role}</p>
          <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-outline">brush</span>
            <span>{artisan.specialty}</span>
          </p>
        </div>

        {/* 4 Cultural Mastery Stat Pills */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-surface-container-lowest p-2.5 rounded-2xl border border-outline-variant/20 shadow-2xs text-center space-y-0.5">
            <span className="text-[10px] text-outline font-medium block">
              {language === 'ta' ? 'அனுபவம்' : language === 'hi' ? 'अनुभव' : 'Mastery'}
            </span>
            <span className="font-bold text-xs text-primary block">{artisan.yearsOfExperience || '25+ Years'}</span>
          </div>

          <div className="bg-surface-container-lowest p-2.5 rounded-2xl border border-outline-variant/20 shadow-2xs text-center space-y-0.5">
            <span className="text-[10px] text-outline font-medium block">
              {language === 'ta' ? 'படைப்புகள்' : language === 'hi' ? 'शिल्प' : 'Creations'}
            </span>
            <span className="font-bold text-xs text-primary block">{artisan.creationsCount} {language === 'ta' ? 'பொருட்கள்' : language === 'hi' ? 'कृतियां' : 'Crafts'}</span>
          </div>

          <div className="bg-surface-container-lowest p-2.5 rounded-2xl border border-outline-variant/20 shadow-2xs text-center space-y-0.5">
            <span className="text-[10px] text-outline font-medium block">
              {language === 'ta' ? 'நேரடி ராயல்டி' : language === 'hi' ? 'सीधा भुगतान' : 'Royalties'}
            </span>
            <span className="font-bold text-xs text-secondary block">87% Direct</span>
          </div>
        </div>

        {/* Authentic Audio Voice Story Clip Player */}
        <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleAudioStory}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs transition-all ${
                isPlayingAudio ? 'bg-secondary text-on-secondary animate-pulse' : 'bg-primary text-on-primary hover:bg-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div>
              <p className="text-xs font-bold text-primary leading-tight">
                {isPlayingAudio
                  ? (language === 'ta' ? 'குரல் கதை கேட்கிறது...' : language === 'hi' ? 'कथा सुन रहे हैं...' : 'Playing Living Story...')
                  : (language === 'ta' ? 'கைவினைஞர் குரல் கதை கேளுங்கள்' : language === 'hi' ? 'कारीगर की आवाज में कहानी' : 'Hear Master Story in Native Voice')}
              </p>
              <p className="text-[10px] text-outline">
                {language === 'ta' ? 'பாரம்பரிய உத்திகள் மற்றும் குடும்ப வரலாறு' : language === 'hi' ? 'मातृभाषा में परिवार व शिल्प की साधना' : 'Heritage narration in authentic vernacular dialect'}
              </p>
            </div>
          </div>

          {isPlayingAudio && (
            <div className="flex items-center gap-0.5">
              {[6, 12, 18, 8, 14, 20, 10].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-secondary rounded-full animate-pulse"
                  style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section Navigation Tabs: Creations | Story & Lineage | Bulk Availability */}
        <div className="flex border-b border-outline-variant/20 pt-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('creations')}
            className={`pb-2.5 flex-1 text-center transition-all border-b-2 ${
              activeTab === 'creations'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-outline hover:text-primary'
            }`}
          >
            {language === 'ta' ? 'படைப்புகள்' : language === 'hi' ? 'शिल्प संग्रह' : 'Master Creations'} ({artisanProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`pb-2.5 flex-1 text-center transition-all border-b-2 ${
              activeTab === 'story'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-outline hover:text-primary'
            }`}
          >
            {language === 'ta' ? 'கதை & பரம்பரை' : language === 'hi' ? 'साधना कथा' : 'Artisan Story'}
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            className={`pb-2.5 flex-1 text-center transition-all border-b-2 ${
              activeTab === 'bulk'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-outline hover:text-primary'
            }`}
          >
            {language === 'ta' ? 'மொத்த சப்ளை' : language === 'hi' ? 'थोक सोर्सिंग' : 'Bulk & Custom'}
          </button>
        </div>

        {/* TAB 1: CREATIONS BY THIS ARTISAN */}
        {activeTab === 'creations' && (
          <div className="pt-2 space-y-3">
            {artisanProducts.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 text-xs text-outline space-y-2">
                <span className="material-symbols-outlined text-3xl text-secondary">palette</span>
                <p>New catalog additions are currently being fired in the cluster kiln.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {artisanProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => {
                      onSelectProduct(p);
                      onNavigate('product-detail');
                    }}
                    onAddToCart={(p) => {
                      onAddToCart(p);
                      onShowToast(language === 'ta' ? 'பையில் சேர்க்கப்பட்டது' : language === 'hi' ? 'बैग में जोड़ा गया' : 'Added to bag');
                    }}
                    isWishlisted={!!wishlist[prod.id]}
                    onToggleWishlist={onToggleWishlist || (() => {})}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RICH ARTISAN STORY & GUILD LINEAGE */}
        {activeTab === 'story' && (
          <div className="pt-2 space-y-4 text-xs leading-relaxed">
            {/* Quote banner */}
            <div className="p-4 rounded-2xl bg-surface-container-low border-l-4 border-secondary italic text-on-surface space-y-1">
              <span className="material-symbols-outlined text-secondary text-xl">format_quote</span>
              <p>"{artisan.storyQuote || artisan.bio}"</p>
            </div>

            {/* In-depth biography */}
            <div className="p-4 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xs space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">history_edu</span>
                <span>{language === 'ta' ? 'வாழ்க்கைக் குறிப்பு' : language === 'hi' ? 'जीवन वृत्त एवं शिल्प यात्रा' : 'Master Biography'}</span>
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                {artisan.bio || `${artisan.name} is an internationally recognized custodian of Indian craft traditions from ${artisan.location}. Practicing for over ${artisan.yearsOfExperience || 'three decades'}, every piece is crafted strictly following canonical heritage methods passed down through master-apprentice guilds.`}
              </p>
              {artisan.craftLineage && (
                <div className="pt-2 flex items-center gap-1.5 text-secondary font-bold text-[11px]">
                  <span className="material-symbols-outlined text-[15px]">account_tree</span>
                  <span>{artisan.craftLineage}</span>
                </div>
              )}
            </div>

            {/* Awards & Honors */}
            {artisan.awards && artisan.awards.length > 0 && (
              <div className="p-4 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xs space-y-2">
                <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">military_tech</span>
                  <span>{language === 'ta' ? 'விருதுகள் மற்றும் கௌரவங்கள்' : language === 'hi' ? 'पुरस्कार एवं सम्मान' : 'Honours & Certifications'}</span>
                </h3>
                <div className="space-y-1.5">
                  {artisan.awards.map((award, i) => (
                    <div key={i} className="flex items-center gap-2 text-on-surface-variant">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                      <span className="font-medium">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BULK ORDER AVAILABILITY */}
        {activeTab === 'bulk' && (
          <div className="pt-2 space-y-3.5 text-xs">
            <div className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">domain</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-primary">
                      {language === 'ta' ? 'நேரடி மொத்த ஆர்டர்கள்' : language === 'hi' ? 'थोक व कस्टमाइज़ेशन' : 'Bulk & Institutional Sourcing'}
                    </h3>
                    <p className="text-[10px] text-outline">
                      {language === 'ta' ? 'கூட்டுறவு பட்டறையிலிருந்து நேரடியாக' : language === 'hi' ? 'सीधे क्लस्टर कार्यशाला से' : 'Direct from master cluster workshop'}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold">
                  {artisan.bulkDetails?.acceptsBulk ? 'Available' : 'Limited Run'}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-0.5">
                  <span className="text-[10px] text-outline block">Minimum Order (MOQ)</span>
                  <span className="font-bold text-primary block">{artisan.bulkDetails?.moq || 10} units</span>
                </div>

                <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-0.5">
                  <span className="text-[10px] text-outline block">Lead Time</span>
                  <span className="font-bold text-primary block">{artisan.bulkDetails?.leadTime || '14-21 days'}</span>
                </div>

                <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-0.5 col-span-2">
                  <span className="text-[10px] text-outline block">Packaging & Provenance</span>
                  <span className="font-bold text-primary block">
                    {artisan.bulkDetails?.packagingNotes || 'Bespoke eco packaging with individual artisan signature card'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowBulkModal(true)}
                className="w-full py-3 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-[17px] text-secondary">assignment</span>
                <span>
                  {language === 'ta'
                    ? `${artisan.name} அவர்களிடம் மொத்த மேற்கோள் கேட்கவும்`
                    : language === 'hi'
                    ? `${artisan.name} से थोक कोट का अनुरोध करें`
                    : `Request Bulk Catalog & Quote from ${artisan.name}`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wholesale & Bulk Sourcing Modal */}
      <WholesaleInquiryModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSubmit={handleBulkSubmit}
        language={language}
      />
    </div>
  );
};
