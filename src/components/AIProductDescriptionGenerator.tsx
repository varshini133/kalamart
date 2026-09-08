import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Edit3,
  Check,
  Copy,
  Eye,
  Languages,
  ShieldCheck,
  ArrowRight,
  Plus,
  Trash2,
  Info,
  Award,
  Feather,
  X,
  Volume2,
  Sliders,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  AIDescriptionInput,
  DescriptionTone,
  FullDescriptionPayload,
  GeneratedCatalogSections,
  generateAIDescription
} from '../services/catalogService';

interface AIProductDescriptionGeneratorProps {
  initialTranscription: string;
  artisanInfo?: string;
  category: string;
  materials: string;
  technique: string;
  dimensions?: string;
  artisanStory?: string;
  artisanName?: string;
  artisanLocation?: string;
  originalLanguage?: string;
  images?: string[];
  estimatedPrice?: number;
  onPublish: (finalData: {
    title: string;
    shortDescription: string;
    fullDescription: string;
    highlights: string[];
    materialDetails: string;
    craftsmanshipDetails: string;
    careInstructions: string;
    artisanStoryConnection: string;
    language: string;
    translations: {
      en: GeneratedCatalogSections;
      hi: GeneratedCatalogSections;
      original: GeneratedCatalogSections;
    };
  }) => void;
  onCancel?: () => void;
}

export const AIProductDescriptionGenerator: React.FC<AIProductDescriptionGeneratorProps> = ({
  initialTranscription,
  artisanInfo = '',
  category,
  materials,
  technique,
  dimensions = 'Standard Handcrafted Size',
  artisanStory = '',
  artisanName = 'Master Artisan',
  artisanLocation = 'India',
  originalLanguage = 'en',
  images = [],
  estimatedPrice = 850,
  onPublish,
  onCancel
}) => {
  // Input states (artisan can adjust base inputs)
  const [transcription, setTranscription] = useState(initialTranscription);
  const [extraNotes, setExtraNotes] = useState(artisanInfo);
  const [currentCategory, setCurrentCategory] = useState(category);
  const [currentMaterials, setCurrentMaterials] = useState(materials);
  const [currentTechnique, setCurrentTechnique] = useState(technique);
  const [showBaseInputs, setShowBaseInputs] = useState(false);

  // Active language & tone
  const [activeLangTab, setActiveLangTab] = useState<'original' | 'en' | 'hi'>('en');
  const [tone, setTone] = useState<DescriptionTone>('authentic');

  // Loading & generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSource, setGenerationSource] = useState<string>('ai');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Stored multi-language sections
  const [multiLangData, setMultiLangData] = useState<{
    original: GeneratedCatalogSections;
    en: GeneratedCatalogSections;
    hi: GeneratedCatalogSections;
  }>({
    original: {
      productTitle: '',
      shortDescription: '',
      fullDescription: '',
      highlights: [],
      materialDetails: '',
      craftsmanshipDetails: '',
      careInstructions: '',
      artisanStoryConnection: ''
    },
    en: {
      productTitle: '',
      shortDescription: '',
      fullDescription: '',
      highlights: [],
      materialDetails: '',
      craftsmanshipDetails: '',
      careInstructions: '',
      artisanStoryConnection: ''
    },
    hi: {
      productTitle: '',
      shortDescription: '',
      fullDescription: '',
      highlights: [],
      materialDetails: '',
      craftsmanshipDetails: '',
      careInstructions: '',
      artisanStoryConnection: ''
    }
  });

  // Inline editing modal state
  const [editingSection, setEditingSection] = useState<{
    key: keyof GeneratedCatalogSections;
    label: string;
    value: string | string[];
  } | null>(null);

  // Preview Modal
  const [showMarketplacePreview, setShowMarketplacePreview] = useState(false);
  const [activePreviewImageIndex, setActivePreviewImageIndex] = useState(0);

  // Fetch or trigger initial generation
  const runGeneration = async (selectedTone: DescriptionTone = tone) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const input: AIDescriptionInput = {
        transcription: transcription.trim(),
        artisanInfo: extraNotes.trim(),
        category: currentCategory,
        materials: currentMaterials,
        technique: currentTechnique,
        dimensions,
        artisanStory,
        artisanName,
        artisanLocation,
        tone: selectedTone,
        originalLanguage
      };

      const result: FullDescriptionPayload = await generateAIDescription(input);
      setGenerationSource(result.source);
      setMultiLangData({
        original: result.originalLanguage,
        en: result.english,
        hi: result.hindi
      });
    } catch (err: any) {
      console.error('Failed generating description:', err);
      setGenerationError(err?.message || 'Could not complete AI description generation. You can retry or edit sections manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    runGeneration(tone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Currently active language data
  const currentData: GeneratedCatalogSections =
    activeLangTab === 'original'
      ? multiLangData.original
      : activeLangTab === 'hi'
      ? multiLangData.hi
      : multiLangData.en;

  // Handler to update a section in the active language
  const handleUpdateSection = (
    key: keyof GeneratedCatalogSections,
    value: string | string[]
  ) => {
    setMultiLangData((prev) => ({
      ...prev,
      [activeLangTab === 'original' ? 'original' : activeLangTab]: {
        ...prev[activeLangTab === 'original' ? 'original' : activeLangTab],
        [key]: value
      }
    }));
  };

  // Quick action: Tone toggle
  const handleToneChange = (newTone: DescriptionTone) => {
    setTone(newTone);
    runGeneration(newTone);
  };

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getLanguageLabel = (key: 'original' | 'en' | 'hi') => {
    if (key === 'original') {
      if (originalLanguage === 'ta') return 'தமிழ் (Native)';
      if (originalLanguage === 'hi') return 'हिन्दी (Native)';
      return 'Native Voice';
    }
    if (key === 'hi') return 'हिन्दी (Hindi)';
    return 'English';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      {/* 1. Header Banner & AI Ethics Badge */}
      <div className="bg-gradient-to-r from-surface-container-lowest to-surface-container-low border border-primary/15 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold font-serif text-primary">
                AI Product Description Generator
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
              Transforms raw voice recordings and verified craft inputs into culturally honest,
              professional marketplace descriptions across multiple languages.
            </p>
          </div>

          {/* AI Ethics & Trust Seal */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-medium self-start md:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-secondary" />
            <span>Zero False Claims • Verified Artisan Inputs Only</span>
          </div>
        </div>

        {/* Action Controls Strip: Languages, Tone & Quick Regenerate */}
        <div className="mt-6 pt-5 border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 bg-surface-container-high p-1 rounded-2xl">
            <Languages className="w-3.5 h-3.5 text-on-surface-variant ml-2 mr-1" />
            {(['original', 'en', 'hi'] as const).map((langKey) => (
              <button
                key={langKey}
                onClick={() => setActiveLangTab(langKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeLangTab === langKey
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest'
                }`}
              >
                {getLanguageLabel(langKey)}
              </button>
            ))}
          </div>

          {/* Tone Tuners (Simplify vs Authentic vs Make Premium) */}
          <div className="flex items-center gap-1.5 bg-surface-container-high p-1 rounded-2xl">
            <button
              onClick={() => handleToneChange('simplified')}
              disabled={isGenerating}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tone === 'simplified'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest'
              }`}
              title="Simplify vocabulary for everyday buyers"
            >
              <Feather className="w-3 h-3" />
              <span>Simplify</span>
            </button>

            <button
              onClick={() => handleToneChange('authentic')}
              disabled={isGenerating}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tone === 'authentic'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest'
              }`}
              title="Balanced, honest artisanal warmth"
            >
              <Sliders className="w-3 h-3" />
              <span>Authentic</span>
            </button>

            <button
              onClick={() => handleToneChange('premium')}
              disabled={isGenerating}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                tone === 'premium'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-amber-700 hover:bg-surface-container-highest'
              }`}
              title="Refined language for luxury & heirloom collectors"
            >
              <Award className="w-3 h-3" />
              <span>Make Premium</span>
            </button>
          </div>

          {/* Regenerate Button */}
          <button
            onClick={() => runGeneration(tone)}
            disabled={isGenerating}
            className="px-4 py-2 rounded-2xl bg-surface-container-highest hover:bg-primary/10 border border-outline-variant/30 text-primary text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>
        </div>
      </div>

      {/* 2. Artisan Verified Inputs Drawer / Collapsible Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <Lock className="w-3 h-3" />
            </span>
            <div>
              <span className="text-xs font-bold text-primary block">
                Artisan Verified Inputs
              </span>
              <span className="text-[11px] text-on-surface-variant">
                Ground truth from voice and craft registry — AI is constrained by these facts.
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowBaseInputs(!showBaseInputs)}
            className="text-xs text-secondary font-bold hover:underline flex items-center gap-1"
          >
            <span>{showBaseInputs ? 'Hide Base Details' : 'View & Edit Base Inputs'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showBaseInputs ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Badges of Ground Truth */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-outline-variant/20">
          <div className="bg-surface-container-low px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block">Category</span>
            <span className="text-xs font-semibold text-primary truncate block">{currentCategory}</span>
          </div>
          <div className="bg-surface-container-low px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block">Raw Materials</span>
            <span className="text-xs font-semibold text-primary truncate block">{currentMaterials}</span>
          </div>
          <div className="bg-surface-container-low px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block">Technique</span>
            <span className="text-xs font-semibold text-primary truncate block">{currentTechnique}</span>
          </div>
          <div className="bg-surface-container-low px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block">Artisan / Origin</span>
            <span className="text-xs font-semibold text-primary truncate block">{artisanName}, {artisanLocation}</span>
          </div>
        </div>

        {/* Expandable Editor for Base Inputs */}
        {showBaseInputs && (
          <div className="mt-4 pt-4 border-t border-outline-variant/30 space-y-3 bg-surface-container-low/50 p-4 rounded-xl">
            <p className="text-[11px] font-semibold text-on-surface-variant">
              Edit the baseline data to steer the description:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1">Category</label>
                <input
                  type="text"
                  value={currentCategory}
                  onChange={(e) => setCurrentCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1">Materials</label>
                <input
                  type="text"
                  value={currentMaterials}
                  onChange={(e) => setCurrentMaterials(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant block mb-1">Craft Technique</label>
                <input
                  type="text"
                  value={currentTechnique}
                  onChange={(e) => setCurrentTechnique(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-on-surface-variant block mb-1">Spoken Transcription</label>
              <textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-on-surface-variant block mb-1">Artisan Notes / Additional Info</label>
              <input
                type="text"
                value={extraNotes}
                placeholder="e.g. Needs gentle initial wash, takes 6 days to weave"
                onChange={(e) => setExtraNotes(e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => runGeneration(tone)}
                disabled={isGenerating}
                className="px-4 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Apply & Re-Generate</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error & Retry Banner */}
      {generationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0">
            <Info className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-xs font-semibold">{generationError}</p>
          </div>
          <button
            type="button"
            onClick={() => runGeneration(tone)}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Overlay or Placeholder */}
      {isGenerating && (
        <div className="p-8 bg-surface-container-lowest border border-primary/20 rounded-3xl text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <p className="font-bold text-sm text-primary">Generating authentic catalog description...</p>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Synthesizing spoken story, raw materials, and traditional techniques into warm, culturally accurate copy in English, Hindi, and regional scripts.
          </p>
        </div>
      )}

      {/* 3. The 8 Generated Sections */}
      {!isGenerating && (
        <div className="space-y-4">
          {/* Section 1: Product Title */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI Crafted Title
                </span>
                <span className="text-xs font-semibold text-on-surface-variant">1. Product Title</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(currentData.productTitle, 'title')}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Copy Title"
                >
                  {copiedSection === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setEditingSection({ key: 'productTitle', label: 'Product Title', value: currentData.productTitle })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Edit Title"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold font-serif text-primary leading-snug">
              {currentData.productTitle || 'Untitled Artisan Craft'}
            </h3>
          </div>

          {/* Section 2: Short Description (for product cards) */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> 2-3 Lines Card Snippet
                </span>
                <span className="text-xs font-semibold text-on-surface-variant">2. Short Description</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(currentData.shortDescription, 'short')}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Copy Short Description"
                >
                  {copiedSection === 'short' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setEditingSection({ key: 'shortDescription', label: 'Short Description (Product Card)', value: currentData.shortDescription })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Edit Short Description"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs md:text-sm text-on-surface leading-relaxed italic bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/20">
              "{currentData.shortDescription}"
            </p>
          </div>

          {/* Section 3: Full Product Description */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Authentic Narrative
                </span>
                <span className="text-xs font-semibold text-on-surface-variant">3. Full Product Description</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(currentData.fullDescription, 'full')}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Copy Full Description"
                >
                  {copiedSection === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setEditingSection({ key: 'fullDescription', label: 'Full Product Description', value: currentData.fullDescription })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Edit Full Description"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-xs md:text-sm text-on-surface leading-relaxed whitespace-pre-line">
              {currentData.fullDescription}
            </div>
          </div>

          {/* Section 4: Product Highlights */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Bullet Points
                </span>
                <span className="text-xs font-semibold text-on-surface-variant">4. Product Highlights</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(currentData.highlights.join('\n• '), 'highlights')}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Copy Highlights"
                >
                  {copiedSection === 'highlights' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setEditingSection({ key: 'highlights', label: 'Product Highlights', value: currentData.highlights })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Edit Highlights"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <ul className="space-y-1.5">
              {currentData.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2-Column Grid for Sections 5 & 6 (Materials & Craftsmanship) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 5: Material Details */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified Origin
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant">5. Material Details</span>
                </div>
                <button
                  onClick={() => setEditingSection({ key: 'materialDetails', label: 'Material Details', value: currentData.materialDetails })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Edit Material Details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-on-surface leading-relaxed">
                {currentData.materialDetails}
              </p>
            </div>

            {/* Section 6: Craftsmanship Details */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Technique Insight
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant">6. Craftsmanship Details</span>
                </div>
                <button
                  onClick={() => setEditingSection({ key: 'craftsmanshipDetails', label: 'Craftsmanship Details', value: currentData.craftsmanshipDetails })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Edit Craftsmanship Details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-on-surface leading-relaxed">
                {currentData.craftsmanshipDetails}
              </p>
            </div>
          </div>

          {/* 2-Column Grid for Sections 7 & 8 (Care Instructions & Artisan Story) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 7: Care Instructions */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Info className="w-2.5 h-2.5" /> Craft-Specific Care
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant">7. Care Instructions</span>
                </div>
                <button
                  onClick={() => setEditingSection({ key: 'careInstructions', label: 'Care Instructions', value: currentData.careInstructions })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Edit Care Instructions"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-on-surface leading-relaxed">
                {currentData.careInstructions || 'Wipe gently with a soft, clean dry cloth. Avoid exposure to extreme weather.'}
              </p>
            </div>

            {/* Section 8: Artisan Story Connection */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                    <Award className="w-2.5 h-2.5" /> Living Lineage
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant">8. Artisan Story Connection</span>
                </div>
                <button
                  onClick={() => setEditingSection({ key: 'artisanStoryConnection', label: 'Artisan Story Connection', value: currentData.artisanStoryConnection })}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                  title="Edit Artisan Story Connection"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs md:text-sm text-on-surface leading-relaxed">
                {currentData.artisanStoryConnection}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Action Bar: Preview & Publish */}
      <div className="sticky bottom-4 z-20 bg-surface-container-lowest/95 backdrop-blur-md border border-primary/20 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Catalog description ready in 3 languages (English, Hindi & Native).</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-outline-variant/50 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Back
            </button>
          )}

          {/* Professional Preview Button */}
          <button
            onClick={() => setShowMarketplacePreview(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Listing</span>
          </button>

          {/* Final Publish Button */}
          <button
            onClick={() => {
              onPublish({
                title: currentData.productTitle,
                shortDescription: currentData.shortDescription,
                fullDescription: currentData.fullDescription,
                highlights: currentData.highlights,
                materialDetails: currentData.materialDetails,
                craftsmanshipDetails: currentData.craftsmanshipDetails,
                careInstructions: currentData.careInstructions,
                artisanStoryConnection: currentData.artisanStoryConnection,
                language: activeLangTab,
                translations: {
                  en: multiLangData.en,
                  hi: multiLangData.hi,
                  original: multiLangData.original
                }
              });
            }}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
          >
            <span>Confirm & Publish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Section Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 max-w-lg w-full p-5 md:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-primary">
                  Edit {editingSection.label} ({getLanguageLabel(activeLangTab)})
                </h3>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editingSection.key === 'highlights' ? (
              <div className="space-y-2">
                <p className="text-[11px] text-on-surface-variant">Edit or add bullet points:</p>
                {Array.isArray(editingSection.value) &&
                  editingSection.value.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updated = [...(editingSection.value as string[])];
                          updated[index] = e.target.value;
                          setEditingSection({ ...editingSection, value: updated });
                        }}
                        className="flex-1 text-xs p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const updated = (editingSection.value as string[]).filter((_, i) => i !== index);
                          setEditingSection({ ...editingSection, value: updated });
                        }}
                        className="p-2 text-error hover:bg-error/10 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                <button
                  onClick={() => {
                    const currentArr = Array.isArray(editingSection.value) ? editingSection.value : [];
                    setEditingSection({
                      ...editingSection,
                      value: [...currentArr, 'New authentic feature']
                    });
                  }}
                  className="text-xs text-primary font-bold flex items-center gap-1.5 mt-2 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add bullet point
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  rows={editingSection.key === 'productTitle' ? 2 : 5}
                  value={editingSection.value as string}
                  onChange={(e) => setEditingSection({ ...editingSection, value: e.target.value })}
                  className="w-full text-xs md:text-sm p-3 rounded-2xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none leading-relaxed"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>Authentic, natural tone recommended.</span>
                  <span>{(editingSection.value as string).length} characters</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/30">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateSection(editingSection.key, editingSection.value);
                  setEditingSection(null);
                }}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Complete Professional Product Preview Modal */}
      {showMarketplacePreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-outline-variant/30 max-w-3xl w-full my-auto shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 md:px-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-primary">Live Marketplace Listing Preview</h3>
                  <span className="text-[11px] text-on-surface-variant">
                    Showing as buyers see this on KalaConnect ({getLanguageLabel(activeLangTab)})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMarketplacePreview(false)}
                  className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 md:p-6 overflow-y-auto space-y-6">
              {/* Product Hero Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Image Gallery Column */}
                <div className="space-y-3">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-high border border-outline-variant/20 relative shadow-inner">
                    {images.length > 0 ? (
                      <img
                        src={images[activePreviewImageIndex] || images[0]}
                        alt={currentData.productTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant p-4 text-center">
                        <Feather className="w-10 h-10 text-primary/30 mb-2" />
                        <span className="text-xs">No craft photo uploaded yet</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md text-on-primary text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3 text-secondary" />
                      <span>Direct from Artisan</span>
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePreviewImageIndex(i)}
                          className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                            activePreviewImageIndex === i ? 'border-primary scale-95' : 'border-transparent opacity-70'
                          }`}
                        >
                          <img src={img} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Summary Column */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                      {currentCategory}
                    </span>
                    <h1 className="text-xl md:text-2xl font-bold font-serif text-primary leading-tight">
                      {currentData.productTitle}
                    </h1>
                  </div>

                  {/* Artisan Profile Line */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {artisanName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <span>{artisanName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-normal">
                          Verified
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant block">{artisanLocation}</span>
                    </div>
                  </div>

                  {/* Price & Guarantee */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-primary">₹{estimatedPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-on-surface-variant">100% directly paid to artisan</span>
                  </div>

                  {/* Short Card Description */}
                  <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20">
                    {currentData.shortDescription}
                  </p>

                  {/* Quick Highlights */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-primary block">Craft Highlights:</span>
                    <ul className="space-y-1">
                      {currentData.highlights.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-on-surface">
                          <Check className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Full Details Breakdown */}
              <div className="border-t border-outline-variant/30 pt-5 space-y-4">
                {/* Full Description */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-2">
                    About This Handcrafted Piece
                  </h4>
                  <p className="text-xs md:text-sm text-on-surface leading-relaxed whitespace-pre-line">
                    {currentData.fullDescription}
                  </p>
                </div>

                {/* Materials & Craftsmanship Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                      Pure Materials
                    </span>
                    <p className="text-xs text-on-surface leading-relaxed">{currentData.materialDetails}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                      Traditional Craftsmanship
                    </span>
                    <p className="text-xs text-on-surface leading-relaxed">{currentData.craftsmanshipDetails}</p>
                  </div>
                </div>

                {/* Care & Story */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                      Care & Maintenance
                    </span>
                    <p className="text-xs text-on-surface leading-relaxed">{currentData.careInstructions}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                      Artisan Heritage Connection
                    </span>
                    <p className="text-xs text-on-surface leading-relaxed">{currentData.artisanStoryConnection}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between shrink-0">
              <button
                onClick={() => setShowMarketplacePreview(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                Close Preview
              </button>

              <button
                onClick={() => {
                  setShowMarketplacePreview(false);
                  onPublish({
                    title: currentData.productTitle,
                    shortDescription: currentData.shortDescription,
                    fullDescription: currentData.fullDescription,
                    highlights: currentData.highlights,
                    materialDetails: currentData.materialDetails,
                    craftsmanshipDetails: currentData.craftsmanshipDetails,
                    careInstructions: currentData.careInstructions,
                    artisanStoryConnection: currentData.artisanStoryConnection,
                    language: activeLangTab,
                    translations: {
                      en: multiLangData.en,
                      hi: multiLangData.hi,
                      original: multiLangData.original
                    }
                  });
                }}
                className="px-6 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Publish Listing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
