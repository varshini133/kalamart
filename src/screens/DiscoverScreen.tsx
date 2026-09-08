import React, { useState, useMemo, useRef } from 'react';
import {
  PRODUCTS,
  ARTISANS,
  CRAFT_COLLECTIONS
} from '../data/mockData';
import { CraftCollection, Language, Product, ScreenType, User } from '../types';
import { getTranslations } from '../services/localizationService';
import { HeroBanner } from '../components/marketplace/HeroBanner';
import { MarketplaceSearch } from '../components/marketplace/MarketplaceSearch';
import { CategoriesSection } from '../components/marketplace/CategoriesSection';
import { ArtisanStoriesSection } from '../components/marketplace/ArtisanStoriesSection';
import { CraftCollectionsSection } from '../components/marketplace/CraftCollectionsSection';
import { B2BSection } from '../components/marketplace/B2BSection';
import { ProductCard } from '../components/marketplace/ProductCard';
import { MarketplaceFiltersModal } from '../components/marketplace/MarketplaceFiltersModal';
import { WholesaleInquiryModal, WholesaleInquiryData } from '../components/marketplace/WholesaleInquiryModal';
import { BulkInquiryModal } from '../components/b2b/BulkInquiryModal';

interface DiscoverScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenVoice: () => void;
  onShowToast: (msg: string) => void;
  products?: Product[];
  wishlist?: Record<string, boolean>;
  onToggleWishlist?: (productId: string) => void;
  user?: User | null;
  language?: Language;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onOpenVoice,
  onShowToast,
  products = PRODUCTS,
  wishlist = {},
  onToggleWishlist,
  user,
  language = 'en'
}) => {
  const t = getTranslations(language);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [onlyHandmade, setOnlyHandmade] = useState<boolean>(false);
  const [onlyReadyToShip, setOnlyReadyToShip] = useState<boolean>(false);
  const [onlyBulk, setOnlyBulk] = useState<boolean>(false);

  // Tabs: 'featured' | 'ready' | 'gi_certified' | 'wishlist' | 'b2b'
  const [activeTab, setActiveTab] = useState<'featured' | 'ready' | 'gi_certified' | 'wishlist' | 'b2b'>('featured');

  // Modals
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showWholesaleModal, setShowWholesaleModal] = useState(false);
  const [bulkProductForQuote, setBulkProductForQuote] = useState<Product | null>(null);

  // Local Wishlist Fallback
  const [localWishlist, setLocalWishlist] = useState<Record<string, boolean>>({});
  const currentWishlist = onToggleWishlist ? wishlist : localWishlist;

  // Delivery micro-location
  const [pincode, setPincode] = useState(
    language === 'ta' ? 'சென்னை 600001' : language === 'hi' ? 'नई दिल्ली 110001' : 'Bangalore 560001'
  );
  const [isEditingPincode, setIsEditingPincode] = useState(false);

  // Simulated Loading State for tactile feel
  const [isFiltering, setIsFiltering] = useState(false);

  // Smooth scroll reference
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const artisansSectionRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToArtisans = () => {
    artisansSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Toggle Wishlist handler
  const handleToggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(productId);
      const willBeSaved = !currentWishlist[productId];
      onShowToast(
        willBeSaved
          ? (language === 'ta' ? 'விருப்பப்பட்டியலில் சேர்க்கப்பட்டது' : language === 'hi' ? 'विशलिस्ट में जोड़ा गया' : 'Added to your Wishlist')
          : (language === 'ta' ? 'விருப்பப்பட்டியலில் இருந்து நீக்கப்பட்டது' : language === 'hi' ? 'विशलिस्ट से हटाया गया' : 'Removed from Wishlist')
      );
    } else {
      const nextState = !localWishlist[productId];
      setLocalWishlist({ ...localWishlist, [productId]: nextState });
      onShowToast(
        nextState
          ? (language === 'ta' ? 'விருப்பப்பட்டியலில் சேர்க்கப்பட்டது' : language === 'hi' ? 'विशलिस्ट में जोड़ा गया' : 'Added to your Wishlist')
          : (language === 'ta' ? 'விருப்பப்பட்டியலில் இருந்து நீக்கப்பட்டது' : language === 'hi' ? 'विशलिस्ट से हटाया गया' : 'Removed from Wishlist')
      );
    }
  };

  // Active filter count calculator
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedRegion) count++;
    if (selectedMaterial) count++;
    if (maxPrice < 10000) count++;
    if (onlyHandmade) count++;
    if (onlyReadyToShip) count++;
    if (onlyBulk) count++;
    return count;
  }, [selectedCategory, selectedRegion, selectedMaterial, maxPrice, onlyHandmade, onlyReadyToShip, onlyBulk]);

  // Voice Search integration with localized prompt feedback
  const handleVoiceSearch = () => {
    const promptMsg =
      language === 'ta'
        ? 'குரல் கேட்கிறது: "சுடுமண் மண்பாண்டங்கள்"...'
        : language === 'hi'
        ? 'आवाज सुन रहे हैं: "कच्छ की मिट्टी कला"...'
        : 'Voice listening: "Terracotta pots from Kutch"...';
    onShowToast(promptMsg);
    onOpenVoice();
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedRegion(null);
    setSelectedMaterial(null);
    setMaxPrice(10000);
    setOnlyHandmade(false);
    setOnlyReadyToShip(false);
    setOnlyBulk(false);
    setActiveTab('featured');
    onShowToast(language === 'ta' ? 'வடிப்பான்கள் நீக்கப்பட்டன' : language === 'hi' ? 'फ़िल्टर साफ़ कर दिए गए' : 'Filters cleared');
  };

  // Select a curated collection
  const handleSelectCollection = (collection: CraftCollection) => {
    setIsFiltering(true);
    setSearchQuery(collection.craftQuery || collection.title);
    setTimeout(() => {
      setIsFiltering(false);
      scrollToProducts();
      onShowToast(
        language === 'ta'
          ? `${collection.title} தொகுப்பு தேர்ந்தெடுக்கப்பட்டது`
          : language === 'hi'
          ? `${collection.title} संग्रह फ़िल्टर किया गया`
          : `Browsing ${collection.title}`
      );
    }, 150);
  };

  // Filter by an artisan's name
  const handleFilterByArtisan = (artisanName: string) => {
    setIsFiltering(true);
    setSearchQuery(artisanName);
    setTimeout(() => {
      setIsFiltering(false);
      scrollToProducts();
      onShowToast(
        language === 'ta'
          ? `${artisanName} தயாரிப்புகள் காட்டப்படுகின்றன`
          : language === 'hi'
          ? `${artisanName} के शिल्प दिखाए जा रहे हैं`
          : `Showing creations by ${artisanName}`
      );
    }, 150);
  };

  // Bulk inquiry submission
  const handleWholesaleSubmit = (data: WholesaleInquiryData) => {
    onShowToast(
      language === 'ta'
        ? `நன்றி ${data.contactPerson}! உங்கள் மொத்தக் கோரிக்கை பதிவு செய்யப்பட்டது.`
        : language === 'hi'
        ? `धन्यवाद ${data.contactPerson}! आपका थोक अनुरोध कारीगर समूह को भेजा गया।`
        : `Wholesale inquiry sent for ${data.businessName}. Our artisan coordinator will reach out in 24 hours.`
    );
  };

  // Category matching helper
  const matchesCategoryFilter = (p: Product, cat: string) => {
    const prodCat = (p.category || '').toLowerCase();
    const target = cat.toLowerCase();

    if (target === 'handloom') {
      return prodCat.includes('handloom') || prodCat.includes('loom') || prodCat.includes('stole') || prodCat.includes('saree');
    }
    if (target === 'home decor') {
      return prodCat.includes('home') || prodCat.includes('decor') || prodCat.includes('urli') || prodCat.includes('dabba') || prodCat.includes('box');
    }
    if (target === 'jewelry') {
      return prodCat.includes('jewelry') || prodCat.includes('jewellery') || prodCat.includes('choker') || prodCat.includes('necklace');
    }
    if (target === 'pottery') {
      return prodCat.includes('pottery') || prodCat.includes('terracotta') || prodCat.includes('clay') || prodCat.includes('vase');
    }
    if (target === 'textiles') {
      return prodCat.includes('textile') || prodCat.includes('shawl') || prodCat.includes('wool') || prodCat.includes('silk') || prodCat.includes('fabric');
    }
    if (target === 'traditional art') {
      return prodCat.includes('art') || prodCat.includes('painting') || prodCat.includes('mural') || prodCat.includes('madhubani');
    }
    return prodCat.includes(target);
  };

  // Main Marketplace Filtering Logic
  // Excludes drafts and rejected products so the buyer only sees published/ready items
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be published in buyer marketplace
      if (p.status && p.status !== 'published') {
        return false;
      }

      // Search matching across multiple attributes:
      // Product title, description, tags, artisanName, craftOrigin, category, technique, material
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q) || (p.hindiTitle && p.hindiTitle.toLowerCase().includes(q));
        const inArtisan = p.artisanName.toLowerCase().includes(q);
        const inCategory = p.category.toLowerCase().includes(q);
        const inOrigin = p.craftOrigin.toLowerCase().includes(q) || p.artisanLocation.toLowerCase().includes(q);
        const inTechnique = p.technique ? p.technique.toLowerCase().includes(q) : false;
        const inMaterial = p.material ? p.material.toLowerCase().includes(q) : false;
        const inDesc = p.description ? p.description.toLowerCase().includes(q) : false;
        const inTags = p.aiPreservedData?.autoTags ? p.aiPreservedData.autoTags.some((tag) => tag.toLowerCase().includes(q)) : false;

        if (!inTitle && !inArtisan && !inCategory && !inOrigin && !inTechnique && !inMaterial && !inDesc && !inTags) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && !matchesCategoryFilter(p, selectedCategory)) {
        return false;
      }

      // Region filter
      if (selectedRegion) {
        const r = selectedRegion.toLowerCase();
        const matchesOrigin = p.craftOrigin.toLowerCase().includes(r) || p.artisanLocation.toLowerCase().includes(r);
        if (!matchesOrigin) return false;
      }

      // Material filter
      if (selectedMaterial) {
        const m = selectedMaterial.toLowerCase();
        const matchesMat = p.material ? p.material.toLowerCase().includes(m) : false;
        if (!matchesMat) return false;
      }

      // Price filter
      if (p.price > maxPrice) {
        return false;
      }

      // Handmade filter
      if (onlyHandmade) {
        const isHandmade = p.badge?.toLowerCase().includes('handmade') || p.giCertified || true;
        if (!isHandmade) return false;
      }

      // Ready to ship filter
      if (onlyReadyToShip) {
        const isReady = p.inStock && (!p.productionTime || p.productionTime.toLowerCase().includes('ready') || p.productionTime.toLowerCase().includes('stock'));
        if (!isReady) return false;
      }

      // Bulk available filter
      if (onlyBulk) {
        if (!p.bulkPrice && !p.moq) return false;
      }

      // Tab filter
      if (activeTab === 'wishlist') {
        if (!currentWishlist[p.id]) return false;
      } else if (activeTab === 'ready') {
        if (!p.inStock) return false;
      } else if (activeTab === 'gi_certified') {
        if (!p.giCertified) return false;
      } else if (activeTab === 'b2b') {
        if (p.bulkOrderAvailable === false) return false;
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedRegion,
    selectedMaterial,
    maxPrice,
    onlyHandmade,
    onlyReadyToShip,
    onlyBulk,
    activeTab,
    currentWishlist
  ]);

  const wishlistItemsCount = Object.values(currentWishlist).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col relative w-full pt-28 pb-32 px-4 max-w-md mx-auto space-y-7 animate-fadeIn bg-surface">
      {/* Location & Direct Sourcing Header Pill */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-on-surface-variant">{t.deliveringTo}</span>
            {isEditingPincode ? (
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                onBlur={() => setIsEditingPincode(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingPincode(false)}
                autoFocus
                className="font-bold text-primary border-b border-secondary outline-none text-xs bg-transparent"
              />
            ) : (
              <button
                onClick={() => setIsEditingPincode(true)}
                className="font-bold text-primary hover:underline flex items-center gap-0.5"
                title="Edit Delivery Pincode"
              >
                <span>{pincode}</span>
                <span className="material-symbols-outlined text-[13px] text-outline">edit</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[11px] font-semibold tracking-tight text-on-surface">
            {language === 'ta' ? 'நேரடி புவிசார் சரக்கு' : language === 'hi' ? 'सीधे क्लस्टर से' : 'Direct Cluster Sourced'}
          </span>
        </div>
      </div>

      {/* Personalized Greeting */}
      {user && (
        <div className="flex items-center justify-between px-1 -mb-3">
          <div>
            <span className="text-xs text-on-surface-variant font-medium">
              {language === 'ta' ? 'வணக்கம்,' : language === 'hi' ? 'नमस्ते,' : 'Welcome,'}
            </span>{' '}
            <span className="text-xs font-bold text-primary">{user.name}</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/20">
            {language === 'ta' ? 'சரிபார்க்கப்பட்ட வாங்குபவர்' : language === 'hi' ? 'सत्यापित खरीदार' : 'Verified Patron'}
          </span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <HeroBanner
        language={language}
        onExploreCrafts={scrollToProducts}
        onMeetArtisans={scrollToArtisans}
      />

      {/* 2. MULTIMODAL SEARCH & QUICK CHIPS */}
      <MarketplaceSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setIsFiltering(true);
          setSearchQuery(q);
          setTimeout(() => setIsFiltering(false), 150);
        }}
        onOpenVoice={handleVoiceSearch}
        onOpenFilters={() => setShowFiltersModal(true)}
        activeFilterCount={activeFilterCount}
        language={language}
        onQuickChipClick={(keyword) => {
          setIsFiltering(true);
          setSearchQuery(keyword);
          setTimeout(() => {
            setIsFiltering(false);
            scrollToProducts();
          }, 150);
        }}
        selectedCategory={selectedCategory}
        selectedRegion={selectedRegion}
        selectedMaterial={selectedMaterial}
        onlyHandmade={onlyHandmade}
        onlyReadyToShip={onlyReadyToShip}
        onlyBulk={onlyBulk}
        onClearAllFilters={handleClearAllFilters}
        totalResultsCount={filteredProducts.length}
      />

      {/* 3. CATEGORIES SECTION */}
      <CategoriesSection
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setIsFiltering(true);
          setSelectedCategory(cat);
          setTimeout(() => {
            setIsFiltering(false);
            if (cat) scrollToProducts();
          }, 150);
        }}
        language={language}
      />

      {/* 4. FEATURED PRODUCTS & CURATED CATALOG */}
      <section ref={productsSectionRef} className="space-y-4 w-full pt-1 scroll-mt-28">
        {/* Section Header & View Tabs */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-secondary mb-0.5">
                <span className="material-symbols-outlined text-[16px]">stars</span>
                <span className="text-[11px] uppercase tracking-wider font-bold">
                  {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டவை' : language === 'hi' ? 'विशेष संग्रह' : 'Curated Selection'}
                </span>
              </div>
              <h2 className="font-bold text-lg font-sans text-primary">
                {language === 'ta' ? 'கைவினைப் படைப்புகள்' : language === 'hi' ? 'प्रमाणित हस्तशिल्प' : 'Authentic Crafts Catalog'}
              </h2>
            </div>

            <span className="text-xs text-outline font-semibold">
              {filteredProducts.length} {language === 'ta' ? 'பொருட்கள்' : language === 'hi' ? 'शिल्प' : 'crafts'}
            </span>
          </div>

          {/* Interactive Filtering Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                activeTab === 'featured'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {language === 'ta' ? 'சிறப்பானவை' : language === 'hi' ? 'फीचर्ड' : 'Featured Masterpieces'}
            </button>

            <button
              onClick={() => setActiveTab('ready')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1 ${
                activeTab === 'ready'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>{language === 'ta' ? 'உடனடி அனுப்பல்' : language === 'hi' ? 'तुरंत उपलब्ध' : 'Ready to Ship'}</span>
            </button>

            <button
              onClick={() => setActiveTab('gi_certified')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1 ${
                activeTab === 'gi_certified'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[13px] text-secondary">verified</span>
              <span>{language === 'ta' ? 'புவிசார் சான்றிதழ்' : language === 'hi' ? 'जीआई प्रमाणित' : 'GI Certified'}</span>
            </button>

            {/* B2B Wholesale & Bulk Sourcing Mode Tab */}
            <button
              onClick={() => setActiveTab('b2b')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
                activeTab === 'b2b'
                  ? 'bg-secondary text-on-secondary shadow-sm font-bold'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
              <span>B2B Wholesale Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
                activeTab === 'wishlist'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <span>
                {language === 'ta' ? 'விருப்பப்பட்டியல்' : language === 'hi' ? 'विशलिस्ट' : 'Wishlist'} ({wishlistItemsCount})
              </span>
            </button>
          </div>
        </div>

        {/* Loading State / Shimmer feedback */}
        {isFiltering ? (
          <div className="grid grid-cols-2 gap-3 py-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-surface-container-lowest rounded-3xl p-3 border border-outline-variant/20 shadow-xs space-y-3 animate-pulse"
              >
                <div className="w-full aspect-square rounded-2xl bg-surface-container" />
                <div className="h-3 w-1/2 bg-surface-container rounded" />
                <div className="h-4 w-3/4 bg-surface-container rounded" />
                <div className="h-4 w-1/3 bg-surface-container rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty States Handling */
          <div className="py-12 px-6 text-center space-y-3 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-xs">
            {activeTab === 'wishlist' && !searchQuery ? (
              <>
                <div className="w-14 h-14 mx-auto rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-3xl">favorite_border</span>
                </div>
                <h3 className="font-bold text-base text-primary">
                  {language === 'ta' ? 'விருப்பப்பட்டியல் காலியாக உள்ளது' : language === 'hi' ? 'आपकी विशलिस्ट अभी खाली है' : 'Your Wishlist is Empty'}
                </h3>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                  {language === 'ta'
                    ? 'உங்களுக்குப் பிடித்த கைவினைப் பொருட்களின் இதயக் குறியீட்டைத் தட்டி சேமிக்கவும்.'
                    : language === 'hi'
                    ? 'कारीगरों के प्रामाणिक शिल्प को विशलिस्ट में सहेजने के लिए दिल के निशान पर टैप करें।'
                    : 'Tap the heart icon on any authentic craft to save it here for mindful consideration.'}
                </p>
                <button
                  onClick={() => setActiveTab('featured')}
                  className="mt-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs active:scale-95 transition-transform"
                >
                  {language === 'ta' ? 'கைவினைகளைத் தேடுங்கள்' : language === 'hi' ? 'शिल्प देखें' : 'Explore Featured Crafts'}
                </button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 mx-auto rounded-full bg-surface-container flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-3xl">search_off</span>
                </div>
                <h3 className="font-bold text-base text-primary">
                  {language === 'ta' ? 'கைவினைப் பொருட்கள் எதுவும் கிடைக்கவில்லை' : language === 'hi' ? 'कोई मेल खाता शिल्प नहीं मिला' : 'No Authentic Crafts Found'}
                </h3>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                  {language === 'ta'
                    ? 'உங்கள் தேடல் அல்லது வடிப்பான்களை மாற்றியமைத்துப் பார்க்கவும்.'
                    : language === 'hi'
                    ? 'कृपया अपने खोज शब्द या फ़िल्टर बदलकर पुनः प्रयास करें।'
                    : 'We couldn’t find any verified crafts matching your exact filter criteria. Try resetting or exploring other clusters.'}
                </p>

                {/* Suggested craft chips in empty state */}
                <div className="pt-2 flex flex-wrap justify-center gap-1.5">
                  {['Terracotta', 'Dhokra', 'Blue Pottery', 'Chanderi Silk'].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setSearchQuery(chip);
                        setSelectedCategory(null);
                        setSelectedRegion(null);
                      }}
                      className="px-3 py-1 rounded-full bg-surface-container text-primary font-semibold text-xs hover:bg-secondary/15 hover:text-secondary transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleClearAllFilters}
                    className="px-5 py-2.5 rounded-full bg-secondary text-on-secondary text-xs font-bold shadow-md hover:bg-secondary/90 transition-all active:scale-95"
                  >
                    {language === 'ta' ? 'அனைத்து வடிப்பான்களையும் மீட்டமைக்கவும்' : language === 'hi' ? 'सभी फ़िल्टर रीसेट करें' : 'Reset All Filters'}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* 2-Column Responsive Product Grid */
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={(p) => {
                  onSelectProduct(p);
                  onNavigate('product-detail');
                }}
                onAddToCart={(p) => {
                  onAddToCart(p);
                  onShowToast(t.toastAddedToBag);
                }}
                isWishlisted={!!currentWishlist[prod.id]}
                onToggleWishlist={handleToggleWishlist}
                language={language}
                isB2BMode={activeTab === 'b2b' || onlyBulk}
                onRequestBulkQuote={(p) => setBulkProductForQuote(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. MEET THE ARTISANS (ARTISAN STORIES) */}
      <div ref={artisansSectionRef} className="scroll-mt-28">
        <ArtisanStoriesSection
          onSelectArtisan={(artisan) => {
            handleFilterByArtisan(artisan.name);
          }}
          onFilterByArtisan={handleFilterByArtisan}
          language={language}
        />
      </div>

      {/* 6. AUTHENTIC CRAFT COLLECTIONS */}
      <CraftCollectionsSection
        onSelectCollection={handleSelectCollection}
        language={language}
      />

      {/* 7. B2B SECTION ("Looking to source in bulk?") */}
      <B2BSection
        onNavigateB2B={() => onNavigate('b2b-portal')}
        onRequestWholesaleCatalog={() => setShowWholesaleModal(true)}
        language={language}
      />

      {/* Filters Modal Drawer */}
      <MarketplaceFiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        selectedMaterial={selectedMaterial}
        onSelectMaterial={setSelectedMaterial}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        onlyHandmade={onlyHandmade}
        onToggleHandmade={() => setOnlyHandmade(!onlyHandmade)}
        onlyReadyToShip={onlyReadyToShip}
        onToggleReadyToShip={() => setOnlyReadyToShip(!onlyReadyToShip)}
        onlyBulk={onlyBulk}
        onToggleBulk={() => setOnlyBulk(!onlyBulk)}
        onResetFilters={handleClearAllFilters}
        language={language}
        activeFilterCount={activeFilterCount}
      />

      {/* Wholesale & Bulk Sourcing Inquiry Modal */}
      <WholesaleInquiryModal
        isOpen={showWholesaleModal}
        onClose={() => setShowWholesaleModal(false)}
        onSubmit={handleWholesaleSubmit}
        language={language}
      />

      {/* B2B Direct Product Bulk Inquiry Modal */}
      {bulkProductForQuote && (
        <BulkInquiryModal
          isOpen={!!bulkProductForQuote}
          onClose={() => setBulkProductForQuote(null)}
          product={bulkProductForQuote}
          onShowToast={onShowToast}
          language={language}
          onInquirySubmitted={() => {
            setBulkProductForQuote(null);
            onNavigate('b2b-portal');
          }}
        />
      )}
    </div>
  );
};
