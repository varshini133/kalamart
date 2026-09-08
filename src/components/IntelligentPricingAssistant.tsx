import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import {
  calculateIntelligentPrice,
  PricingFactorsInput,
  CRAFT_MARKET_BENCHMARKS
} from '../services/intelligentPricingService';

interface IntelligentPricingAssistantProps {
  initialMaterialCost?: number;
  initialLaborHours?: number;
  initialHourlyRate?: number;
  initialPackagingCost?: number;
  initialShippingCost?: number;
  initialSelectedPrice?: number;
  category?: string;
  craftType?: string;
  productionTimeText?: string;
  giCertified?: boolean;
  language?: Language;
  onSavePrice: (finalPrice: number, breakdownSummary?: string) => void;
  onClose?: () => void;
  isInline?: boolean;
}

export const IntelligentPricingAssistant: React.FC<IntelligentPricingAssistantProps> = ({
  initialMaterialCost = 350,
  initialLaborHours = 6,
  initialHourlyRate = 150,
  initialPackagingCost = 60,
  initialShippingCost = 90,
  initialSelectedPrice,
  category = 'Pottery & Ceramics',
  craftType = 'Terracotta Wheel Throwing',
  productionTimeText = '1 to 2 days',
  giCertified = true,
  language = 'en',
  onSavePrice,
  onClose,
  isInline = false
}) => {
  // Required Inputs State
  const [materialCost, setMaterialCost] = useState<number>(initialMaterialCost);
  const [laborHours, setLaborHours] = useState<number>(initialLaborHours);
  const [desiredHourlyRate, setDesiredHourlyRate] = useState<number>(initialHourlyRate);

  // Optional Inputs State
  const [showOptionalCosts, setShowOptionalCosts] = useState<boolean>(true);
  const [packagingCost, setPackagingCost] = useState<number>(initialPackagingCost);
  const [shippingCost, setShippingCost] = useState<number>(initialShippingCost);
  const [includePlatformFee, setIncludePlatformFee] = useState<boolean>(true);

  // Explanation Modal / Expand State
  const [showExplanationModal, setShowExplanationModal] = useState<boolean>(false);
  const [showBenchmarkDetails, setShowBenchmarkDetails] = useState<boolean>(false);

  // Pricing Calculation
  const pricingResult = useMemo(() => {
    const input: PricingFactorsInput = {
      materialCost,
      laborHours,
      desiredHourlyRate,
      packagingCost: showOptionalCosts ? packagingCost : 0,
      shippingCost: showOptionalCosts ? shippingCost : 0,
      platformFeePercent: includePlatformFee ? 2.5 : 0,
      category,
      craftType,
      productionTimeText,
      giCertified,
      language: language as Language
    };
    return calculateIntelligentPrice(input);
  }, [
    materialCost,
    laborHours,
    desiredHourlyRate,
    packagingCost,
    shippingCost,
    showOptionalCosts,
    includePlatformFee,
    category,
    craftType,
    productionTimeText,
    giCertified,
    language
  ]);

  // Artisan Chosen Final Price (defaults to Recommended Price)
  const [customPrice, setCustomPrice] = useState<number>(
    initialSelectedPrice || pricingResult.recommendedPrice
  );

  // Update custom price when recommended price changes if user hasn't explicitly diverged
  const [hasManuallyEditedPrice, setHasManuallyEditedPrice] = useState<boolean>(
    Boolean(initialSelectedPrice && initialSelectedPrice !== pricingResult.recommendedPrice)
  );

  const handleApplyPresetPrice = (price: number) => {
    setCustomPrice(price);
    setHasManuallyEditedPrice(true);
  };

  const handleSave = () => {
    const finalPrice = Math.max(100, customPrice);
    const summary = `₹${finalPrice} (Base Cost: ₹${pricingResult.baseCost}, Rec: ₹${pricingResult.recommendedPrice})`;
    onSavePrice(finalPrice, summary);
  };

  // Quick Preset Options for Labor Hours
  const HOUR_PRESETS = [2, 4, 6, 8, 16, 24];

  // Quick Preset Options for Hourly Wage (₹/hr)
  const WAGE_PRESETS = [
    { label: '₹100/hr', value: 100 },
    { label: '₹150/hr', value: 150 },
    { label: '₹200/hr', value: 200 },
    { label: '₹250/hr', value: 250 }
  ];

  // Labels based on language
  const t = {
    en: {
      title: 'KalaConnect Intelligent Pricing Assistant',
      subtitle: 'Transparent, fair artisan pricing engine with full maker control.',
      disclaimer: 'AI Recommendation – You are always in control of your final price.',
      productContext: 'Craft Context',
      requiredInputs: '1. Production Costs & Labor',
      materialCostLabel: 'Material Cost',
      materialCostSub: 'Clay, natural dyes, silk yarn, metals, fuel',
      laborHoursLabel: 'Crafting Time',
      laborHoursSub: 'Total hours dedicated to making this piece',
      hourlyWageLabel: 'Desired Hourly Wage',
      hourlyWageSub: 'Fair compensation per hour of artisanal skill',
      optionalCosts: '2. Additional Costs & Logistics',
      packagingLabel: 'Protective Packaging',
      shippingLabel: 'Estimated Shipping / Transit',
      platformHandling: 'Nominal Payment Gateway (2.5%)',
      baseCostTitle: 'Total Production Base Cost',
      baseCostSub: 'Direct Materials + Labor + Packaging',
      pricingTiersTitle: 'Pricing Suggestions',
      minimumTier: 'Minimum Sustainable',
      minimumSub: 'Break-even + safety buffer',
      recommendedTier: 'Recommended Fair Price',
      recommendedSub: 'Sustainable 28% artisan livelihood margin',
      premiumTier: 'Premium Collector Range',
      premiumSub: 'Master craftsmanship & GI heritage tier',
      benchmarkTitle: 'Market Benchmark Comparison',
      benchmarkSub: 'Compared strictly with verified similar handcrafted products',
      explainBtn: 'Why this price? View Breakdown',
      finalPriceTitle: 'Your Chosen Selling Price',
      finalPriceSub: 'Adjust freely to match your exact craft valuation',
      confirmPriceBtn: 'Confirm & Apply Price',
      saveAndClose: 'Save Price',
      cancel: 'Cancel',
      close: 'Close',
      benchmarkRange: 'Market Range',
      benchmarkAvg: 'Market Avg'
    },
    hi: {
      title: 'कलाकनेक्ट इंटेलिजेंट मूल्य निर्धारण सहायक',
      subtitle: 'पारदर्शी व उचित कारीगर मूल्य निर्धारण प्रणाली - पूरा नियंत्रण आपके हाथ में।',
      disclaimer: 'एआई अनुशंसा – आप हमेशा अपने अंतिम मूल्य के पूर्ण नियंत्रण में हैं।',
      productContext: 'शिल्प संदर्भ',
      requiredInputs: '1. उत्पादन लागत एवं श्रम',
      materialCostLabel: 'कच्ची सामग्री लागत',
      materialCostSub: 'मिट्टी, प्राकृतिक रंग, रेशम धागा, धातु, ईंधन',
      laborHoursLabel: 'कारीगरी समय (घंटे)',
      laborHoursSub: 'इस शिल्पकृति को बनाने में लगे कुल घंटे',
      hourlyWageLabel: 'वांछित प्रति घंटा मजदूरी',
      hourlyWageSub: 'पारंपरिक हुनर का उचित प्रति घंटा पारिश्रमिक',
      optionalCosts: '2. अतिरिक्त लॉजिस्टिक्स व पैकेजिंग',
      packagingLabel: 'सुरक्षात्मक पैकेजिंग',
      shippingLabel: 'अनुमानित परिवहन व कूरियर',
      platformHandling: 'पेमेंट गेटवे शुल्क (2.5%)',
      baseCostTitle: 'कुल उत्पादन आधार लागत',
      baseCostSub: 'सामग्री + श्रम + पैकेजिंग',
      pricingTiersTitle: 'मूल्य सुझाव',
      minimumTier: 'न्यूनतम टिकाऊ मूल्य',
      minimumSub: 'लागत पूर्ति + सुरक्षा बफर',
      recommendedTier: 'अनुशंसित उचित मूल्य',
      recommendedSub: 'टिकाऊ 28% कारीगर आजीविका मुनाफा',
      premiumTier: 'प्रीमियम बाज़ार दायरा',
      premiumSub: 'विरासत एवं उस्ताद कारीगरी स्तर',
      benchmarkTitle: 'बाज़ार तुलना (बेंचमार्क)',
      benchmarkSub: 'समान प्रामाणिक हस्तशिल्प से तुलना',
      explainBtn: 'यह मूल्य क्यों? विवरण देखें',
      finalPriceTitle: 'आपका चुना हुआ विक्रय मूल्य',
      finalPriceSub: 'अपने शिल्प के अनुसार स्वतंत्र रूप से तय करें',
      confirmPriceBtn: 'मूल्य सुरक्षित करें',
      saveAndClose: 'मूल्य सहेजें',
      cancel: 'रद्द करें',
      close: 'बंद करें',
      benchmarkRange: 'बाज़ार दायरा',
      benchmarkAvg: 'बाज़ार औसत'
    },
    ta: {
      title: 'கலாகனெக்ட் புத்திசாலி விலை நிர்ணய உதவியாளர்',
      subtitle: 'வெளிப்படையான நியாயமான கைவினைஞர் விலை என்ஜின் - முழு கட்டுப்பாடு உங்களிடம்.',
      disclaimer: 'AI பரிந்துரை – உங்கள் இறுதி விலையை நீங்களே முழுமையாகத் தீர்மானிக்கலாம்.',
      productContext: 'கைவினை சூழல்',
      requiredInputs: '1. உற்பத்தி செலவு மற்றும் உழைப்பு',
      materialCostLabel: 'மூலப்பொருள் செலவு',
      materialCostSub: 'மண், இயற்கை சாயங்கள், பட்டு நூல், உலோகங்கள்',
      laborHoursLabel: 'கைவினை உழைப்பு நேரம் (மணிகள்)',
      laborHoursSub: 'இப்பொருளை உருவாக்க எடுத்துக்கொண்ட மொத்த மணிநேரம்',
      hourlyWageLabel: 'விரும்பிய மணிநேர கூலி',
      hourlyWageSub: 'பாரம்பரிய கைவினைத் திறனுக்கான நியாயமான கூலி',
      optionalCosts: '2. கூடுதல் செலவுகள் & பேக்கிங்',
      packagingLabel: 'பாதுகாப்பு பேக்கிங்',
      shippingLabel: 'மதிப்பிடப்பட்ட அஞ்சல் / கூரியர்',
      platformHandling: 'கட்டண நுழைவாயில் கட்டணம் (2.5%)',
      baseCostTitle: 'மொத்த அடிப்படை உற்பத்திச் செலவு',
      baseCostSub: 'பொருட்கள் + உழைப்பு + பேக்கிங்',
      pricingTiersTitle: 'விலை பரிந்துரைகள்',
      minimumTier: 'குறைந்தபட்ச நீடித்த விலை',
      minimumSub: 'செலவு மீட்பு + அவசர சேத நிதி',
      recommendedTier: 'பரிந்துரைக்கப்பட்ட நியாய விலை',
      recommendedSub: 'வாழ்வாதாரத்தை உறுதிசெய்யும் 28% நேரடி லாபம்',
      premiumTier: 'பிரீமியம் சந்தை விலை',
      premiumSub: 'தலைசிறந்த பாரம்பரிய கைவினை அடுக்கு',
      benchmarkTitle: 'சந்தை ஒப்பீடு (பெஞ்ச்மார்க்)',
      benchmarkSub: 'ஒத்த பாரம்பரிய பொருட்களுடன் துல்லிய ஒப்பீடு',
      explainBtn: 'இந்த விலை ஏன்? விளக்கம் காண்க',
      finalPriceTitle: 'நீங்கள் தேர்ந்தெடுத்த விற்பனை விலை',
      finalPriceSub: 'உங்கள் கைவினைக்கு ஏற்ப சுதந்திரமாக மாற்றலாம்',
      confirmPriceBtn: 'விலையை உறுதிசெய்',
      saveAndClose: 'சேமி',
      cancel: 'ரத்து செய்',
      close: 'மூடு',
      benchmarkRange: 'சந்தை வரம்பு',
      benchmarkAvg: 'சந்தை சராசரி'
    }
  }[language] || {
    title: 'KalaConnect Intelligent Pricing Assistant',
    subtitle: 'Transparent, fair artisan pricing engine with full maker control.',
    disclaimer: 'AI Recommendation – You are always in control of your final price.',
    productContext: 'Craft Context',
    requiredInputs: '1. Production Costs & Labor',
    materialCostLabel: 'Material Cost',
    materialCostSub: 'Clay, natural dyes, silk yarn, metals, fuel',
    laborHoursLabel: 'Crafting Time',
    laborHoursSub: 'Total hours dedicated to making this piece',
    hourlyWageLabel: 'Desired Hourly Wage',
    hourlyWageSub: 'Fair compensation per hour of artisanal skill',
    optionalCosts: '2. Additional Costs & Logistics',
    packagingLabel: 'Protective Packaging',
    shippingLabel: 'Estimated Shipping / Transit',
    platformHandling: 'Nominal Payment Gateway (2.5%)',
    baseCostTitle: 'Total Production Base Cost',
    baseCostSub: 'Direct Materials + Labor + Packaging',
    pricingTiersTitle: 'Pricing Suggestions',
    minimumTier: 'Minimum Sustainable',
    minimumSub: 'Break-even + safety buffer',
    recommendedTier: 'Recommended Fair Price',
    recommendedSub: 'Sustainable 28% artisan livelihood margin',
    premiumTier: 'Premium Collector Range',
    premiumSub: 'Master craftsmanship & GI heritage tier',
    benchmarkTitle: 'Market Benchmark Comparison',
    benchmarkSub: 'Compared strictly with verified similar handcrafted products',
    explainBtn: 'Why this price? View Breakdown',
    finalPriceTitle: 'Your Chosen Selling Price',
    finalPriceSub: 'Adjust freely to match your exact craft valuation',
    confirmPriceBtn: 'Confirm & Apply Price',
    saveAndClose: 'Save Price',
    cancel: 'Cancel',
    close: 'Close',
    benchmarkRange: 'Market Range',
    benchmarkAvg: 'Market Avg'
  };

  return (
    <div
      id="intelligent-pricing-assistant"
      className={`rounded-3xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden shadow-md flex flex-col ${
        isInline ? 'w-full' : 'w-full max-w-2xl mx-auto'
      }`}
    >
      {/* 1. HEADER & MANDATORY ETHICAL DISCLAIMER */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-secondary/15 via-primary/5 to-surface-container-low border-b border-outline-variant/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[24px]">price_change</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-primary">{t.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-extrabold uppercase tracking-wide">
                  Fair Trade AI
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">{t.subtitle}</p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* PROMINENT MANDATORY DISCLAIMER BOX */}
        <div
          id="pricing-disclaimer-banner"
          className="mt-3.5 p-3 rounded-2xl bg-surface-container-lowest/90 border border-secondary/30 flex items-center gap-2.5 shadow-xs"
        >
          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
            shield_person
          </span>
          <p className="text-xs font-bold text-primary leading-tight">
            {t.disclaimer}
          </p>
        </div>

        {/* Product Context Badges */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-on-surface-variant">
          <span className="font-semibold text-primary">{t.productContext}:</span>
          <span className="px-2.5 py-1 rounded-xl bg-surface-container font-medium text-primary">
            {category}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-surface-container font-medium text-primary">
            {craftType}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-surface-container text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {productionTimeText}
          </span>
          {giCertified && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 text-[10px] font-extrabold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              GI Verified
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* 2. REQUIRED INPUTS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs sm:text-sm text-primary uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              {t.requiredInputs}
            </h4>
            <span className="text-[11px] text-secondary font-semibold">Required</span>
          </div>

          {/* A. MATERIAL COST INPUT */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-primary block">
                  {t.materialCostLabel}
                </label>
                <span className="text-[11px] text-on-surface-variant block">
                  {t.materialCostSub}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant/30 shadow-xs">
                <span className="text-sm font-bold text-secondary">₹</span>
                <input
                  id="input-material-cost"
                  type="number"
                  min="0"
                  step="50"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-20 text-right font-bold text-sm text-primary bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={materialCost}
              onChange={(e) => setMaterialCost(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant">
              <span>₹50 (Basic Clay/Dyes)</span>
              <span>₹2,500</span>
              <span>₹5,000 (Pure Silk/Cast Bronze)</span>
            </div>
          </div>

          {/* B. LABOR TIME (HOURS) INPUT */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-primary block">
                  {t.laborHoursLabel}
                </label>
                <span className="text-[11px] text-on-surface-variant block">
                  {t.laborHoursSub}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant/30 shadow-xs">
                <input
                  id="input-labor-hours"
                  type="number"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={laborHours}
                  onChange={(e) => setLaborHours(Math.max(0.5, Number(e.target.value) || 0.5))}
                  className="w-16 text-right font-bold text-sm text-primary bg-transparent focus:outline-none"
                />
                <span className="text-xs font-semibold text-on-surface-variant">hrs</span>
              </div>
            </div>

            {/* Quick chips for hours */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {HOUR_PRESETS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setLaborHours(h)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    laborHours === h
                      ? 'bg-secondary text-on-secondary shadow-xs scale-105'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:text-primary border border-outline-variant/20'
                  }`}
                >
                  {h} hrs
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={laborHours}
              onChange={(e) => setLaborHours(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
          </div>

          {/* C. DESIRED HOURLY LABOR VALUE */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-primary block">
                  {t.hourlyWageLabel}
                </label>
                <span className="text-[11px] text-on-surface-variant block">
                  {t.hourlyWageSub}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant/30 shadow-xs">
                <span className="text-sm font-bold text-secondary">₹</span>
                <input
                  id="input-hourly-rate"
                  type="number"
                  min="50"
                  max="1000"
                  step="25"
                  value={desiredHourlyRate}
                  onChange={(e) => setDesiredHourlyRate(Math.max(50, Number(e.target.value) || 50))}
                  className="w-20 text-right font-bold text-sm text-primary bg-transparent focus:outline-none"
                />
                <span className="text-[11px] text-on-surface-variant">/hr</span>
              </div>
            </div>

            {/* Wage Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {WAGE_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setDesiredHourlyRate(p.value)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    desiredHourlyRate === p.value
                      ? 'bg-secondary text-on-secondary shadow-xs scale-105'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:text-primary border border-outline-variant/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="75"
              max="500"
              step="25"
              value={desiredHourlyRate}
              onChange={(e) => setDesiredHourlyRate(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
          </div>
        </section>

        {/* 3. OPTIONAL COSTS SECTION (COLLAPSIBLE) */}
        <section className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setShowOptionalCosts(!showOptionalCosts)}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                local_shipping
              </span>
              <div>
                <h4 className="text-xs font-bold text-primary">{t.optionalCosts}</h4>
                <p className="text-[10px] text-on-surface-variant">Packaging, transit & fees</p>
              </div>
            </div>
            <button
              type="button"
              className="p-1 rounded-lg text-secondary hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showOptionalCosts ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {showOptionalCosts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-outline-variant/20">
              {/* Packaging */}
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-primary block">
                    {t.packagingLabel}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Eco padding & box</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-secondary">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(Math.max(0, Number(e.target.value) || 0))}
                    className="w-16 p-1 text-right text-xs font-bold bg-surface-container rounded-lg text-primary"
                  />
                </div>
              </div>

              {/* Shipping */}
              <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-primary block">
                    {t.shippingLabel}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Courier transit</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-secondary">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Math.max(0, Number(e.target.value) || 0))}
                    className="w-16 p-1 text-right text-xs font-bold bg-surface-container rounded-lg text-primary"
                  />
                </div>
              </div>

              {/* Platform Gateway Toggle */}
              <div className="sm:col-span-2 p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk-platform-fee"
                    checked={includePlatformFee}
                    onChange={(e) => setIncludePlatformFee(e.target.checked)}
                    className="w-4 h-4 accent-secondary rounded cursor-pointer"
                  />
                  <label htmlFor="chk-platform-fee" className="text-xs font-semibold text-primary cursor-pointer">
                    {t.platformHandling}
                  </label>
                </div>
                <span className="text-[11px] font-bold text-secondary">
                  {includePlatformFee ? `₹${pricingResult.breakdown.platformFee}` : '₹0'}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* 4. BASE COST SUMMARY CARD */}
        <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">
                calculate
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wide text-primary">
                {t.baseCostTitle}
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              ₹{materialCost} materials + ₹{pricingResult.breakdown.laborCost} labor ({laborHours}h × ₹{desiredHourlyRate})
              {showOptionalCosts && (packagingCost + shippingCost > 0) ? ` + ₹${packagingCost + shippingCost} logistics` : ''}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg sm:text-xl font-extrabold text-primary">
              ₹{pricingResult.baseCost.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-on-surface-variant">Zero-profit floor</span>
          </div>
        </div>

        {/* 5. PRICING SUGGESTIONS TIERS (3 TIERS) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs sm:text-sm text-primary uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                auto_awesome
              </span>
              {t.pricingTiersTitle}
            </h4>
            <button
              type="button"
              id="btn-show-price-explanation"
              onClick={() => setShowExplanationModal(true)}
              className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">info</span>
              <span>{t.explainBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* TIER 1: MINIMUM SUSTAINABLE */}
            <div
              onClick={() => handleApplyPresetPrice(pricingResult.minimumSustainablePrice)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                customPrice === pricingResult.minimumSustainablePrice
                  ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-500/30'
                  : 'bg-surface-container-low border-outline-variant/30 hover:border-amber-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                    1. {t.minimumTier}
                  </span>
                  <span className="material-symbols-outlined text-amber-600 text-[16px]">
                    shield
                  </span>
                </div>
                <div className="text-lg font-black text-primary">
                  ₹{pricingResult.minimumSustainablePrice.toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">
                  {t.minimumSub} (covers tool wear & supplies)
                </p>
              </div>

              <button
                type="button"
                className="mt-3 w-full py-1.5 px-2 rounded-xl bg-surface-container text-xs font-bold text-primary hover:bg-amber-500/20 hover:text-amber-800 transition-colors"
              >
                Select ₹{pricingResult.minimumSustainablePrice}
              </button>
            </div>

            {/* TIER 2: RECOMMENDED FAIR SELLING PRICE (HIGHLIGHTED) */}
            <div
              onClick={() => handleApplyPresetPrice(pricingResult.recommendedPrice)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                customPrice === pricingResult.recommendedPrice
                  ? 'bg-secondary/15 border-secondary shadow-md ring-2 ring-secondary/40'
                  : 'bg-surface-container-lowest border-secondary/40 hover:border-secondary'
              }`}
            >
              <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[9px] font-black uppercase tracking-wider shadow-xs">
                Best Balance
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-secondary">
                    2. {t.recommendedTier}
                  </span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">
                    verified
                  </span>
                </div>
                <div className="text-xl font-black text-primary">
                  ₹{pricingResult.recommendedPrice.toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">
                  {t.recommendedSub} + healthy direct savings
                </p>
              </div>

              <button
                type="button"
                className="mt-3 w-full py-1.5 px-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold shadow-xs hover:bg-secondary/90 transition-colors"
              >
                Select ₹{pricingResult.recommendedPrice}
              </button>
            </div>

            {/* TIER 3: PREMIUM MARKET RANGE */}
            <div
              onClick={() => handleApplyPresetPrice(pricingResult.premiumRange.min)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                customPrice >= pricingResult.premiumRange.min
                  ? 'bg-purple-500/10 border-purple-500 shadow-sm ring-2 ring-purple-500/30'
                  : 'bg-surface-container-low border-outline-variant/30 hover:border-purple-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-purple-700 dark:text-purple-400">
                    3. {t.premiumTier}
                  </span>
                  <span className="material-symbols-outlined text-purple-600 text-[16px]">
                    diamond
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-primary">
                  ₹{pricingResult.premiumRange.min.toLocaleString('en-IN')} - ₹{pricingResult.premiumRange.max.toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">
                  {t.premiumSub} for collectors & exhibitions
                </p>
              </div>

              <button
                type="button"
                className="mt-3 w-full py-1.5 px-2 rounded-xl bg-surface-container text-xs font-bold text-primary hover:bg-purple-500/20 hover:text-purple-800 transition-colors"
              >
                Select ₹{pricingResult.premiumRange.min}
              </button>
            </div>
          </div>
        </section>

        {/* 6. PRICE RANGE VISUALIZER */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[16px]">
                linear_scale
              </span>
              <span>Price Range Spectrum</span>
            </span>
            <span className="text-xs font-extrabold text-secondary">
              Selected: ₹{customPrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Visual Spectrum Bar */}
          <div className="relative pt-6 pb-2">
            {/* Range Bar Background */}
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-500 to-purple-600 shadow-inner flex overflow-hidden">
              <div className="w-1/3 h-full border-r border-white/30" title="Minimum Sustainable"></div>
              <div className="w-1/3 h-full border-r border-white/30" title="Recommended Fair Trade"></div>
              <div className="w-1/3 h-full" title="Premium Heritage"></div>
            </div>

            {/* Labels below bar */}
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mt-2 px-1">
              <span className="text-amber-700 dark:text-amber-400">
                Min: ₹{pricingResult.minimumSustainablePrice}
              </span>
              <span className="text-emerald-700 dark:text-emerald-400">
                Fair: ₹{pricingResult.recommendedPrice}
              </span>
              <span className="text-purple-700 dark:text-purple-400">
                Premium: ₹{pricingResult.premiumRange.max}
              </span>
            </div>
          </div>
        </div>

        {/* 7. MARKET BENCHMARK SECTION (ONLY IF RELEVANT DATA EXISTS) */}
        {pricingResult.benchmark && (
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  monitoring
                </span>
                <div>
                  <h4 className="text-xs font-bold text-primary">{t.benchmarkTitle}</h4>
                  <p className="text-[10px] text-on-surface-variant">{t.benchmarkSub}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-extrabold uppercase">
                {pricingResult.benchmark.craftName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold text-on-surface-variant block">
                  {t.benchmarkRange}
                </span>
                <div className="text-sm font-bold text-primary">
                  ₹{pricingResult.benchmark.minMarketPrice.toLocaleString('en-IN')} - ₹{pricingResult.benchmark.maxMarketPrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-semibold text-on-surface-variant block">
                  {t.benchmarkAvg}
                </span>
                <div className="text-sm font-bold text-secondary">
                  ₹{pricingResult.benchmark.avgMarketPrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold text-on-surface-variant block">
                  Market Demand
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  High
                </span>
              </div>
            </div>

            <p className="text-[10px] text-on-surface-variant italic">
              Source: {pricingResult.benchmark.sourceNote}
            </p>
          </div>
        )}

        {/* 8. FINAL PRICE CONFIRMATION SECTION (ARTISAN HAS COMPLETE CONTROL) */}
        <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-secondary/10 via-surface-container to-surface-container-low border-2 border-secondary/40 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h4 className="text-sm font-black text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  check_circle
                </span>
                {t.finalPriceTitle}
              </h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                {t.finalPriceSub}
              </p>
            </div>

            {/* Price badge status */}
            <div className="flex items-center gap-2">
              {customPrice < pricingResult.minimumSustainablePrice && (
                <span className="px-2 py-0.5 rounded-lg bg-rose-500/15 text-rose-700 text-[10px] font-extrabold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  Below Break-even
                </span>
              )}
              {customPrice >= pricingResult.recommendedPrice && customPrice <= pricingResult.premiumRange.max && (
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">eco</span>
                  Fair Artisan Livelihood
                </span>
              )}
            </div>
          </div>

          {/* LARGE READABLE FINAL PRICE INPUT WITH STEPPERS */}
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between gap-4 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setCustomPrice((p) => Math.max(100, p - 50));
                setHasManuallyEditedPrice(true);
              }}
              className="w-11 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-black text-lg flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              title="Decrease price by ₹50"
            >
              -
            </button>

            <div className="flex items-baseline justify-center gap-1">
              <span className="text-xl sm:text-2xl font-black text-secondary">₹</span>
              <input
                id="input-artisan-final-price"
                type="number"
                min="100"
                step="25"
                value={customPrice}
                onChange={(e) => {
                  setCustomPrice(Math.max(100, Number(e.target.value) || 100));
                  setHasManuallyEditedPrice(true);
                }}
                className="w-36 sm:w-44 text-center font-black text-2xl sm:text-3xl text-primary bg-transparent focus:outline-none focus:ring-0"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setCustomPrice((p) => p + 50);
                setHasManuallyEditedPrice(true);
              }}
              className="w-11 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-black text-lg flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              title="Increase price by ₹50"
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] px-4 rounded-xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high cursor-pointer transition-all"
              >
                {t.cancel}
              </button>
            )}

            <button
              id="btn-confirm-final-artisan-price"
              type="button"
              onClick={handleSave}
              className="flex-1 min-h-[48px] py-3 px-5 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{t.confirmPriceBtn} (₹{customPrice.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </section>
      </div>

      {/* 9. TRANSPARENT PRICE EXPLANATION MODAL */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div
            id="modal-price-explanation"
            className="w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-primary">
                    Transparent Price Breakdown
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Formula: Materials + Labor + Logistics + Fair Margin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExplanationModal(false)}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/20 text-xs text-primary leading-relaxed">
                {pricingResult.explanation.summary}
              </div>

              {/* Itemized Table */}
              <div className="rounded-2xl border border-outline-variant/30 overflow-hidden text-xs">
                <div className="p-3 bg-surface-container-low font-bold text-primary border-b border-outline-variant/20 flex justify-between">
                  <span>Cost Element</span>
                  <span>Amount (₹)</span>
                </div>

                {/* Materials */}
                <div className="p-3 border-b border-outline-variant/10 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-primary block">Raw Materials</span>
                    <span className="text-[10px] text-on-surface-variant">Clay, dyes, yarn, kiln fuel</span>
                  </div>
                  <span className="font-bold text-primary">₹{materialCost}</span>
                </div>

                {/* Labor */}
                <div className="p-3 border-b border-outline-variant/10 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-primary block">Artisan Labor Cost</span>
                    <span className="text-[10px] text-on-surface-variant">
                      {laborHours} hours × ₹{desiredHourlyRate}/hour wage
                    </span>
                  </div>
                  <span className="font-bold text-primary">₹{pricingResult.breakdown.laborCost}</span>
                </div>

                {/* Packaging & Shipping */}
                <div className="p-3 border-b border-outline-variant/10 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-primary block">Logistics & Packaging</span>
                    <span className="text-[10px] text-on-surface-variant">Transit protection + postal courier</span>
                  </div>
                  <span className="font-bold text-primary">
                    ₹{showOptionalCosts ? packagingCost + shippingCost : 0}
                  </span>
                </div>

                {/* Base Cost Subtotal */}
                <div className="p-3 bg-surface-container/50 border-b border-outline-variant/20 flex justify-between items-center font-bold text-primary">
                  <span>Total Base Cost (Break-Even)</span>
                  <span>₹{pricingResult.baseCost}</span>
                </div>

                {/* Artisan Fair Margin */}
                <div className="p-3 border-b border-outline-variant/10 flex justify-between items-center bg-emerald-500/5">
                  <div>
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 block">
                      Artisan Fair Livelihood Margin (+28%)
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Direct profit for savings, education, & craft tool reinvestment
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    +₹{pricingResult.breakdown.artisanMargin}
                  </span>
                </div>

                {/* Platform Fee */}
                <div className="p-3 border-b border-outline-variant/10 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-primary block">Payment Gateway Fee (2.5%)</span>
                    <span className="text-[10px] text-on-surface-variant">Direct bank processing fee</span>
                  </div>
                  <span className="font-bold text-primary">₹{pricingResult.breakdown.platformFee}</span>
                </div>

                {/* Recommended Total */}
                <div className="p-3 bg-secondary/15 font-black text-sm text-primary flex justify-between items-center">
                  <span>Recommended Selling Price</span>
                  <span className="text-secondary text-base">₹{pricingResult.recommendedPrice}</span>
                </div>
              </div>

              {/* Ethical Note */}
              <div className="p-3 rounded-xl bg-surface-container flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                  verified
                </span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  <strong>Zero Middleman Deduction:</strong> Unlike commercial aggregators that charge 30-40% broker commissions, KalaConnect ensures over 95% of every transaction flows directly into the artisan's bank account.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExplanationModal(false)}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
