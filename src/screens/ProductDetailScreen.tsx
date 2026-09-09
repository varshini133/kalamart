import React, { useState } from 'react';
import { Language, Product, ScreenType, Artisan } from '../types';
import { REVIEWS, ARTISANS } from '../data/mockData';
import { getTranslations } from '../services/localizationService';
import { ProductInquiryModal, ProductInquiryData } from '../components/marketplace/ProductInquiryModal';
import { BulkInquiryModal } from '../components/b2b/BulkInquiryModal';
import { WhyTrustProductSection } from '../components/trust/WhyTrustProductSection';
import { orderService } from '../services/orderService';

interface ProductDetailScreenProps {
  product: Product;
  onNavigate: (screen: ScreenType) => void;
  onAddToCart: (product: Product) => void;
  onShowToast: (msg: string) => void;
  onOpenVoice: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onBuyNow?: (product: Product) => void;
  onViewArtisanProfile?: (artisan: Artisan) => void;
  language?: Language;
  userRole?: string;
  isBuyerPreview?: boolean;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  onNavigate,
  onAddToCart,
  onShowToast,
  onOpenVoice: _onOpenVoice,
  isWishlisted,
  onToggleWishlist,
  onBuyNow,
  onViewArtisanProfile,
  language = 'en',
  userRole,
  isBuyerPreview
}) => {
  const t = getTranslations(language);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [localSaved, setLocalSaved] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showBulkInquiryModal, setShowBulkInquiryModal] = useState(false);
  const [selectedCareTab, setSelectedCareTab] = useState<'cleaning' | 'seasoning' | 'storage'>('cleaning');

  const effectiveSaved = isWishlisted !== undefined ? isWishlisted : localSaved;

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB21jmwdr743VZ9wYEw5YkvUgAp1dD0JDjjPWoDPcOhEmkXzEnkp7OgUX3sNOU7ohQnMgSyP-fV0KwuJ77Iv9zLnBbfnx-DRloyn59cuz1Hw3Wnx71Cu1_R1E136CAMakixqdALSKQbYST_qZBihkCihB0MtulYFB0lOBCq_LYJ21UrdKZEGAsTS7zM4Kh5YvY3IOuJY92PkYQazzyoOka5WcmzD7AODD11UH540tgxcZFrMDkyyW0_'
  ];

  // Resolve matching artisan from mockData or construct enriched profile
  const matchedArtisan: Artisan = ARTISANS.find(
    (a) => a.name.toLowerCase() === product.artisanName.toLowerCase()
  ) || {
    id: `artisan-${product.artisanName.toLowerCase().replace(/\s+/g, '-')}`,
    name: product.artisanName,
    role: product.artisanRole || 'Master Guild Craftsman',
    location: product.artisanLocation || product.craftOrigin || 'Bhuj, Gujarat',
    specialty: product.technique || product.category || 'Traditional Heritage Handicrafts',
    image: product.artisanImage || images[0],
    coverImage: images[0],
    verified: true,
    giCertified: product.giCertified,
    creationsCount: 8,
    yearsOfExperience: product.artisanExperience || '30+ Years',
    bio: `Master artisan practicing ancestral methods passed down through continuous guild lineage in ${product.artisanLocation || 'India'}.`,
    storyQuote: product.artisanQuote || 'When you touch handcrafted art, you touch the living soul of our soil.',
    trustRating: 4.9,
    craftLineage: 'Registered Regional Master Crafts Guild',
    miniProducts: images,
    bulkDetails: {
      acceptsBulk: true,
      moq: product.moq || 8,
      leadTime: product.productionTime || '10-15 days',
      acceptsCustom: true,
      packagingNotes: 'Eco-friendly heritage packaging with verified GI certificate'
    }
  };

  // STRICT CONDITIONAL TRUST BADGES:
  // "Only display badges when the corresponding condition has actually been verified."
  const isVerifiedArtisan = Boolean(matchedArtisan.verified);
  const isHandmade = Boolean(
    product.badge?.toLowerCase().includes('handmade') ||
    product.technique?.toLowerCase().includes('hand') ||
    product.technique?.toLowerCase().includes('wheel') ||
    product.technique?.toLowerCase().includes('weave') ||
    product.technique?.toLowerCase().includes('wax') ||
    product.technique?.toLowerCase().includes('chiseling') ||
    product.technique?.toLowerCase().includes('drawn')
  );
  const isAuthenticCraft = Boolean(
    product.giCertified ||
    (product.giTag && product.giTag.toLowerCase().includes('gi certified'))
  );

  const toggleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    } else {
      setLocalSaved(!localSaved);
      onShowToast(!localSaved ? t.addedToWishlist : t.removedFromWishlist);
    }
  };

  const toggleAudioStory = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      const msg = language === 'ta'
        ? `${product.artisanName} அவர்களின் குரல் கதை ஒலிக்கிறது`
        : language === 'hi'
        ? `${product.artisanName} की आवाज में शिल्प कथा शुरू`
        : `Playing artisan voice story by ${product.artisanName}`;
      onShowToast(msg);
    }
  };

  const handleInquirySubmit = (inquiry: ProductInquiryData) => {
    orderService.createInquiry({
      productId: inquiry.productId,
      productTitle: inquiry.productTitle,
      productImage: inquiry.productImage || product.images[0],
      artisanName: inquiry.artisanName,
      artisanId: matchedArtisan.id,
      buyerName: inquiry.senderName,
      buyerPhone: inquiry.senderPhone,
      buyerEmail: inquiry.senderEmail,
      message: inquiry.message,
      quantity: inquiry.quantity,
      customizationRequirements: inquiry.customizationRequirements,
      neededByDate: inquiry.neededByDate
    });

    onShowToast(
      language === 'ta'
        ? `உங்கள் தனிப்பயன் கோரிக்கை ${product.artisanName} அவர்களிடம் அனுப்பப்பட்டது!`
        : language === 'hi'
        ? `आपकी अनुकूलन पूछताछ ${product.artisanName} को सफलतापूर्वक भेजी गई!`
        : `Inquiry sent directly to ${product.artisanName}. You can track response in Orders & Inquiries!`
    );
  };

  const handleViewArtisanProfile = () => {
    if (onViewArtisanProfile) {
      onViewArtisanProfile(matchedArtisan);
    } else {
      onNavigate('guilds');
      onShowToast(`${t.viewProfile}: ${matchedArtisan.name}`);
    }
  };

  // Crafting Journey Steps
  const craftingSteps = [
    {
      step: 1,
      title: language === 'ta' ? '1. இயற்கை மூலப்பொருள் தேர்வு' : language === 'hi' ? '1. प्राकृतिक कच्चा माल चयन' : '1. Riverbed & Mineral Extraction',
      description: language === 'ta'
        ? 'இயற்கை நதிக்கரைப் படுகைகளில் இருந்து பெறப்பட்ட களிமண் மற்றும் கனிமங்கள் 7 நாட்கள் வெயிலில் பதப்படுத்தப்படுகின்றன.'
        : language === 'hi'
        ? 'पवित्र नदी तट व क्षेत्रीय खनिजों से प्राप्त शुद्ध मिट्टी को धूप में शुद्ध किया जाता है।'
        : `Harvested directly from certified mineral deposits and riverbeds of ${product.craftOrigin || 'Gujarat'}. Naturally weathered and filtered without industrial chemicals.`
    },
    {
      step: 2,
      title: language === 'ta' ? '2. கைவினை உருவாக்கம்' : language === 'hi' ? '2. पारंपरिक हस्तशिल्प निर्माण' : '2. Ancestral Master Shaping',
      description: language === 'ta'
        ? 'பல தலைமுறைகளாகப் பாதுகாக்கப்பட்ட உத்திகளைக் கொண்டு கைவினைக் கலைஞரின் கரங்களால் உருவமைக்கப்படுகிறது.'
        : language === 'hi'
        ? 'पीढ़ियों से चली आ रही चाक व ढोकरा तकनीक से कुशल हाथों द्वारा गढ़ा जाता है।'
        : `Hand-thrown on traditional stone-pivot wheels or lost-wax coiled using ${product.technique || 'handcrafted master techniques'}. Each piece holds unique subtle artisan fingerprints.`
    },
    {
      step: 3,
      title: language === 'ta' ? '3. இயற்கை வர்ணம் & சுடுதல்' : language === 'hi' ? '3. प्राकृतिक रंग व भट्टी पकाई' : '3. Botanical Finish & Kiln Firing',
      description: language === 'ta'
        ? 'இயற்கை தாவர வண்ணங்கள் பூசப்பட்டு, மெதுவான மர உலையில் சுடப்படுகிறது.'
        : language === 'hi'
        ? 'सीसा-मुक्त प्राकृतिक रंगों के साथ धीमी आंच की पारंपरिक भट्टी में पकाया जाता है।'
        : 'Coated with lead-free natural pigments derived from clay slips, tree resins, and wood ash before undergoing 14-hour slow pit firing in regional acacia-wood kilns.'
    },
    {
      step: 4,
      title: language === 'ta' ? '4. புவிசார் குறியீடு தர சோதனை' : language === 'hi' ? '4. जीआई गुणवत्ता व प्रामाणिकता जांच' : '4. GI Quality & Provenance Sealing',
      description: language === 'ta'
        ? 'நீடித்த உழைப்பு மற்றும் நச்சுத்தன்மையற்ற பாதுகாப்பு ஆகியவற்றிற்கான ஆய்வு.'
        : language === 'hi'
        ? 'टिकाऊपन और गैर-विषाक्तता के लिए आधिकारिक मानकों पर परीक्षण।'
        : 'Inspected by local artisan cooperatives for structural integrity, zero micro-cracks, and non-toxic food-safe properties under GI heritage protocols.'
    }
  ];

  // Resolve title and description
  const displayTitle = language === 'hi' && product.hindiTitle
    ? product.hindiTitle
    : product.marketplaceTranslations?.[language]?.title || product.title;

  const displayDescription = product.marketplaceTranslations?.[language]?.description || product.description;

  return (
    <div className="flex-1 flex flex-col relative w-full pt-28 pb-36 px-4 max-w-md mx-auto space-y-7 animate-fadeIn bg-surface">
      {/* Buyer Preview Banner if Artisan */}
      {(isBuyerPreview || userRole === 'artisan') && (
        <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined text-[18px] text-secondary">visibility</span>
            <span>{t.buyerPreviewMode}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('my-products')}
            className="px-2.5 py-1 rounded-xl bg-secondary text-on-secondary font-bold text-[11px] hover:bg-secondary-container transition-colors cursor-pointer"
          >
            {t.backToMyProducts}
          </button>
        </div>
      )}

      {/* Top Floating Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate(userRole === 'artisan' ? 'my-products' : 'discover')}
          className="flex items-center gap-1 text-xs font-bold text-secondary hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{userRole === 'artisan' ? t.backToMyProducts : t.backToMarketplace}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleWishlist}
            aria-label="Save to Wishlist"
            className={`w-9 h-9 rounded-full bg-surface-container flex items-center justify-center transition-all ${
              effectiveSaved ? 'text-secondary' : 'text-primary'
            }`}
            title={effectiveSaved ? 'In Wishlist' : 'Add to Wishlist'}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: effectiveSaved ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              onShowToast(t.toastCopied);
            }}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary"
            aria-label="Share product"
            title="Share"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
      </div>

      {/* 1. PRODUCT IMAGE GALLERY */}
      <section className="space-y-2.5">
        <div className="relative w-full rounded-3xl overflow-hidden bg-surface-container-lowest shadow-md border border-outline-variant/30">
          <div className="relative aspect-square w-full">
            <img
              src={images[currentImageIndex]}
              alt={displayTitle}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Geographical Origin Micro Pill */}
            <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs border border-outline-variant/30 text-[11px] font-bold text-primary">
              <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
              <span>{product.craftOrigin || product.artisanLocation}</span>
            </div>

            {/* Dispatch / Stock pill */}
            {product.inStock && (
              <div className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/85 backdrop-blur-md text-on-primary text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-pulse" />
                <span>{product.productionTime || 'Ready to dispatch'}</span>
              </div>
            )}

            {/* Image Dots Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1 bg-primary/60 backdrop-blur-md px-2 py-1 rounded-full">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-secondary w-3.5' : 'bg-surface-bright/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail row if multiple images */}
          {images.length > 1 && (
            <div className="p-3 bg-surface-container-low flex gap-2 overflow-x-auto no-scrollbar border-t border-outline-variant/20">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 ring-2 transition-all ${
                    i === currentImageIndex ? 'ring-secondary shadow-xs scale-95' : 'ring-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. PRODUCT NAME & 3. PRICE */}
      <section className="space-y-3">
        {/* Category & Ratings row */}
        <div className="flex items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold text-xs">
            {product.category}
          </span>

          <div className="flex items-center gap-1 text-xs text-secondary font-bold">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span>{product.rating || '4.9'}</span>
            <span className="text-outline font-normal">({product.reviewsCount || 18} reviews)</span>
          </div>
        </div>

        {/* Product Name */}
        <h1 className="font-display text-2xl font-bold text-primary leading-tight">
          {displayTitle}
        </h1>

        {/* 3. PRICE SECTION with Transparent Royalty Breakdown */}
        <div className="p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-bold font-display text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-outline line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-secondary/15 text-secondary font-bold">
                  {product.discount}
                </span>
              )}
            </div>

            <span className="text-[11px] font-bold text-secondary">
              Taxes Included
            </span>
          </div>

          {/* Transparent Fair Trade Royalty Bar */}
          <div className="pt-1.5 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
            <span className="text-outline flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[14px]">volunteer_activism</span>
              <span>Direct Artisan Royalty</span>
            </span>
            <span className="font-bold text-primary">
              ₹{Math.round(product.price * 0.87).toLocaleString('en-IN')} (87% to artisan cluster)
            </span>
          </div>
        </div>
      </section>

      {/* 4. TRUST & AUTHENTICITY ("Why trust this product?") */}
      <WhyTrustProductSection product={product} language={language} />

      {/* 5. SHORT DESCRIPTION */}
      <section className="p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[16px]">menu_book</span>
          <span>{t.aboutCreation}</span>
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {displayDescription}
        </p>
      </section>

      {/* 6. ADD TO CART, 7. BUY NOW, 8. SEND INQUIRY BUTTONS */}
      <section className="space-y-2.5 pt-1">
        <div className="grid grid-cols-2 gap-2.5">
          {/* 6. Add to Cart Button */}
          <button
            onClick={() => {
              onAddToCart(product);
              onShowToast(t.toastAddedToBag);
            }}
            className="py-3.5 px-4 rounded-full bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-highest active:scale-95 transition-all shadow-xs border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>{t.addToBag}</span>
          </button>

          {/* 7. Buy Now Button */}
          <button
            onClick={() => {
              if (onBuyNow) {
                onBuyNow(product);
              } else {
                onAddToCart(product);
                onShowToast(t.instantCheckout);
              }
            }}
            className="py-3.5 px-4 rounded-full bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-secondary-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>{t.buyNow}</span>
          </button>
        </div>

        {/* 8. Send Inquiry Button */}
        <button
          onClick={() => setShowInquiryModal(true)}
          className="w-full py-3 rounded-full bg-surface-container-lowest text-primary font-bold text-xs flex items-center justify-center gap-2 border border-outline-variant/40 hover:bg-surface-container-low active:scale-95 transition-all shadow-2xs"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">chat</span>
          <span>
            {t.sendInquiryTo} ({product.artisanName.split(' ')[0]})
          </span>
        </button>
      </section>

      {/* 9. PRODUCT DETAILS */}
      <section className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px]">tune</span>
          <span>
            {t.masterCraftDetails}
          </span>
        </h3>

        <div className="divide-y divide-outline-variant/15 text-xs">
          {/* Materials */}
          <div className="py-2.5 flex justify-between items-start gap-4">
            <span className="text-outline font-medium flex items-center gap-1.5 flex-shrink-0">
              <span className="material-symbols-outlined text-[15px] text-secondary">texture</span>
              <span>{t.materialsLabel}</span>
            </span>
            <span className="font-bold text-primary text-right">
              {product.material || product.materialsList?.join(', ') || 'Natural Terracotta Clay & Botanical Glaze'}
            </span>
          </div>

          {/* Craft Technique */}
          <div className="py-2.5 flex justify-between items-start gap-4">
            <span className="text-outline font-medium flex items-center gap-1.5 flex-shrink-0">
              <span className="material-symbols-outlined text-[15px] text-secondary">handyman</span>
              <span>{t.craftTechniqueLabel}</span>
            </span>
            <span className="font-bold text-primary text-right">
              {product.technique || 'Hand-thrown on Stone Wheel & Open Pit Fired'}
            </span>
          </div>

          {/* Production Time */}
          <div className="py-2.5 flex justify-between items-start gap-4">
            <span className="text-outline font-medium flex items-center gap-1.5 flex-shrink-0">
              <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
              <span>{t.productionTimeLabel}</span>
            </span>
            <span className="font-bold text-primary text-right">
              {product.productionTime || '4 to 6 days hand-curing'}
            </span>
          </div>

          {/* Dimensions */}
          <div className="py-2.5 flex justify-between items-start gap-4">
            <span className="text-outline font-medium flex items-center gap-1.5 flex-shrink-0">
              <span className="material-symbols-outlined text-[15px] text-secondary">square_foot</span>
              <span>{t.dimensionsLabel}</span>
            </span>
            <span className="font-bold text-primary text-right">
              {product.capacity || 'Height: 11.5" • Diameter: 9.2" • Weight: 1.65 kg'}
            </span>
          </div>

          {/* Care Instructions */}
          <div className="pt-3 space-y-2">
            <span className="text-outline font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-secondary">sanitizer</span>
              <span>{t.careInstructionsLabel}</span>
            </span>

            {/* Interactive Care Tabs */}
            <div className="flex gap-1.5 pt-0.5">
              {(['cleaning', 'seasoning', 'storage'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedCareTab(tab)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize transition-all ${
                    selectedCareTab === tab
                      ? 'bg-secondary text-on-secondary shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {tab === 'cleaning' ? t.cleaningTab : tab === 'seasoning' ? t.seasoningTab : t.storageTab}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-on-surface-variant bg-surface-container-low p-2.5 rounded-2xl leading-relaxed border border-outline-variant/20">
              {selectedCareTab === 'cleaning' && t.cleaningCareTip}
              {selectedCareTab === 'seasoning' && t.seasoningCareTip}
              {selectedCareTab === 'storage' && t.storageCareTip}
            </p>
          </div>
        </div>
      </section>

      {/* B2B WHOLESALE & INSTITUTIONAL SOURCING SECTION */}
      {(product.bulkOrderAvailable !== false) && (
        <section className="p-5 rounded-3xl bg-surface-container-lowest border border-secondary/35 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                  <span>{t.b2bWholesaleTitle}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    {t.bulkAvailable}
                  </span>
                </h3>
                <p className="text-[11px] text-on-surface-variant">
                  {t.b2bWholesaleDesc}
                </p>
              </div>
            </div>
          </div>

          {/* 4 Required Sourcing Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-xs">
            {/* 1. Bulk Order Available */}
            <div>
              <span className="text-[10px] text-outline block">{t.orderAvailability}</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>{t.bulkAvailable}</span>
              </span>
            </div>

            {/* 2. Minimum Order Quantity (MOQ) */}
            <div>
              <span className="text-[10px] text-outline block">{t.moqLabel}</span>
              <span className="font-bold text-primary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-secondary">inventory_2</span>
                <span>{product.moq || 10} units</span>
              </span>
            </div>

            {/* 3. Production Capacity */}
            <div>
              <span className="text-[10px] text-outline block">{t.productionCapacity}</span>
              <span className="font-bold text-primary flex items-center gap-1 mt-0.5 truncate">
                <span className="material-symbols-outlined text-[14px] text-secondary">factory</span>
                <span>{product.productionCapacity || '100 units / month'}</span>
              </span>
            </div>

            {/* 4. Approximate Lead Time */}
            <div>
              <span className="text-[10px] text-outline block">{t.approxLeadTime}</span>
              <span className="font-bold text-primary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                <span>{product.approxLeadTime || '14–21 days'}</span>
              </span>
            </div>
          </div>

          {/* Wholesale Pricing Tier & Request Quote Action */}
          <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/25 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-[10px] text-outline">{t.tieredWholesalePrice}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-serif text-secondary">
                  ₹{(product.bulkPrice || Math.round(product.price * 0.75)).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-outline line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Save {Math.round(((product.price - (product.bulkPrice || Math.round(product.price * 0.75))) / product.price) * 100)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowBulkInquiryModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">request_quote</span>
              <span>{t.requestQuoteBulk}</span>
            </button>
          </div>
        </section>
      )}

      {/* 10. ABOUT THE CRAFT */}
      <section className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-secondary mb-0.5">
            <span className="material-symbols-outlined text-[16px]">history_edu</span>
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {t.livingHeritage}
            </span>
          </div>
          <h2 className="font-bold text-base font-sans text-primary">
            {t.aboutCraft}
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
            {product.storyBehindProduct ||
              `Dating back nearly 4,500 years to the bronze and terracotta kilns of the Indus Valley Civilization, this craft discipline has survived through unbroken oral knowledge. Practiced in regional artisan clusters, every curve honors ecological balance, local soil minerals, and seasonal rhythms.`}
          </p>
        </div>

        {/* 4 Sacred Handcrafted Stages */}
        <div className="space-y-2.5 pt-1">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-outline">
            {t.howItsHandcrafted}
          </h4>
          <div className="space-y-2">
            {craftingSteps.map((s) => (
              <div
                key={s.step}
                className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/20 flex gap-3 items-start"
              >
                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  {s.step}
                </span>
                <div>
                  <h5 className="font-bold text-xs text-primary">{s.title}</h5>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. MEET THE ARTISAN (RICH ARTISAN STORY SECTION) */}
      <section className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-md space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-secondary">
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {t.meetTheArtisan}
            </span>
          </div>
          <span className="text-[11px] font-bold text-secondary">
            {matchedArtisan.yearsOfExperience || '30+ Years Lineage'}
          </span>
        </div>

        {/* Profile Card Info */}
        <div className="flex items-start gap-3.5">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-secondary/40 flex-shrink-0 shadow-sm bg-surface-container">
            <img
              src={matchedArtisan.image}
              alt={matchedArtisan.name}
              className="w-full h-full object-cover"
            />
            {matchedArtisan.verified && (
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px]">verified</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base text-primary leading-tight truncate">
              {matchedArtisan.name}
            </h4>
            <p className="text-xs text-secondary font-semibold truncate mt-0.5">
              {matchedArtisan.role}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-outline mt-0.5">
              <span className="material-symbols-outlined text-[13px]">location_on</span>
              <span className="truncate">{matchedArtisan.location}</span>
            </div>
            <div className="text-[10px] text-on-surface-variant font-medium mt-1 truncate">
              <span className="text-secondary font-bold">Specialty:</span> {matchedArtisan.specialty}
            </div>
          </div>
        </div>

        {/* Artisan Story & Quote */}
        <div className="bg-surface-container-low p-3.5 rounded-2xl border-l-3 border-secondary space-y-1 relative">
          <span className="material-symbols-outlined text-secondary/30 text-2xl absolute right-2.5 top-2 select-none">
            format_quote
          </span>
          <p className="text-xs text-on-surface italic leading-relaxed pr-4">
            "{product.artisanQuote || matchedArtisan.storyQuote || matchedArtisan.bio}"
          </p>
        </div>

        {/* Voice story clip */}
        <div className="p-3 bg-surface-container-low rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleAudioStory}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isPlayingAudio ? 'bg-secondary text-on-secondary animate-pulse' : 'bg-primary text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div>
              <p className="text-xs font-bold text-primary">
                {isPlayingAudio ? t.playingAudioStory : t.hearArtisanStory}
              </p>
              <p className="text-[10px] text-outline">{t.narratedInNativeTongue}</p>
            </div>
          </div>

          {isPlayingAudio && (
            <div className="flex items-center gap-0.5">
              {[4, 10, 16, 6, 12, 18, 8].map((h, idx) => (
                <span
                  key={idx}
                  className="w-1 bg-secondary rounded-full animate-pulse"
                  style={{ height: `${h * 1.2}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* "View Artisan Profile" CTA */}
        <button
          onClick={handleViewArtisanProfile}
          className="w-full py-3 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-container active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[17px] text-secondary">account_circle</span>
          <span>{t.viewArtisanProfile}</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </section>

      {/* Patron Reviews */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[17px]">rate_review</span>
            <span>{t.patronExperiences}</span>
          </h3>
          <span className="text-xs text-secondary font-bold">100% {t.verifiedPatron}</span>
        </div>

        <div className="space-y-2">
          {REVIEWS.slice(0, 2).map((rev) => (
            <div
              key={rev.id}
              className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 space-y-1 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">{rev.author}</span>
                <span className="text-[10px] text-outline">{rev.date}</span>
              </div>
              <p className="text-xs text-on-surface-variant italic">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fixed Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 px-4 py-3 pb-safe shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-outline">{t.directArtisanRoyalty}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-display text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-secondary font-bold">87% direct</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-[240px]">
            <button
              onClick={() => {
                onAddToCart(product);
                onShowToast(t.toastAddedToBag);
              }}
              className="flex-1 h-12 rounded-full bg-surface-container-highest text-primary font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
              <span>{t.addToBag}</span>
            </button>

            <button
              onClick={() => {
                if (onBuyNow) {
                  onBuyNow(product);
                } else {
                  onAddToCart(product);
                  onShowToast(t.instantCheckout);
                }
              }}
              className="flex-1 h-12 rounded-full bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all hover:bg-secondary-container"
            >
              <span className="material-symbols-outlined text-[17px]">bolt</span>
              <span>{t.buyNow}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Send Inquiry Modal */}
      <ProductInquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        product={product}
        artisan={matchedArtisan}
        onSubmitInquiry={handleInquirySubmit}
        language={language}
      />

      {/* B2B Bulk Inquiry (Request a Quote) Modal */}
      <BulkInquiryModal
        isOpen={showBulkInquiryModal}
        onClose={() => setShowBulkInquiryModal(false)}
        product={product}
        onShowToast={onShowToast}
        language={language}
        onInquirySubmitted={() => onNavigate('b2b-portal')}
      />
    </div>
  );
};
