/**
 * KalaConnect - Modular AI Service Layer Types
 * 
 * Defines comprehensive contracts for:
 * 1. Speech Processing (Transcription & Language Detection)
 * 2. Product Information Extraction (Natural Speech to Structured Data)
 * 3. Product Description Generation (Multilingual Catalog Narratives)
 * 4. Translation (English, Hindi, and Regional Language Architecture)
 * 5. Pricing Assistance (Explainable Pricing Recommendations)
 */

export type AIProcessingState = 'idle' | 'loading' | 'success' | 'error';

export interface AIServiceResult<T> {
  success: boolean;
  data: T;
  isFallback: boolean;
  source: 'gemini-3.8-flash' | 'local-nlp' | 'rule-based' | 'speech-api' | 'cache';
  error?: string;
  confidence?: number;
  executionTimeMs?: number;
}

// ============================================================================
// 1. SPEECH PROCESSING
// ============================================================================
export interface SpeechProcessingInput {
  audioBlob?: Blob;
  audioBase64?: string;
  spokenText?: string;
  languageHint?: string;
  durationSeconds?: number;
}

export interface SpeechProcessingOutput {
  transcript: string;
  detectedLanguage: string; // e.g., 'en', 'hi', 'ta', 'te', 'bn', 'kn', 'mr', 'gu', 'ml'
  languageName: string;
  script: string; // 'Devanagari', 'Tamil', 'Latin', etc.
  confidence: number; // 0 to 1
  durationSeconds?: number;
  wordCount: number;
}

// ============================================================================
// 2. PRODUCT INFORMATION EXTRACTION
// ============================================================================
export interface ProductExtractionInput {
  speechText: string;
  language?: string;
  artisanContext?: {
    name?: string;
    location?: string;
    craftCategory?: string;
    specialtyTechnique?: string;
    hasGiCertification?: boolean;
    knownAwards?: string[];
  };
  existingProduct?: Partial<ExtractedProductInfo>;
}

export interface ExtractedProductInfo {
  productName: string;
  category: string;
  materials: string;
  craftTechnique: string;
  dimensions: string;
  productionTime: string;
  culturalSignificance: string;
  uniqueFeatures: string[];
  description: string;
  estimatedPrice: number;
  estimatedLaborHours: number;
  estimatedMaterialCost: number;
  detectedLanguage: string;
  // Guardrail indicators
  verifiedClaimsOnly: boolean;
  giCertifiedClaimed: boolean;
  unsupportedClaimsFiltered?: string[];
}

// ============================================================================
// 3. PRODUCT DESCRIPTION GENERATION
// ============================================================================
export type DescriptionTone = 'authentic' | 'simplified' | 'premium';

export interface DescriptionSections {
  productTitle: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  materialDetails: string;
  craftsmanshipDetails: string;
  careInstructions: string;
  artisanStoryConnection: string;
}

export interface DescriptionGenerationInput {
  transcription?: string;
  artisanInfo?: string;
  category: string;
  materials: string;
  technique: string;
  dimensions?: string;
  artisanStory?: string;
  artisanName?: string;
  artisanLocation?: string;
  tone?: DescriptionTone;
  originalLanguage?: string;
  existingData?: Partial<CatalogDescriptionBundle>;
}

export interface CatalogDescriptionBundle {
  originalLanguage: DescriptionSections;
  english: DescriptionSections;
  hindi: DescriptionSections;
  detectedOriginLanguage: string;
  toneApplied: DescriptionTone;
  preservesArtisanFacts: boolean;
}

// ============================================================================
// 4. TRANSLATION
// ============================================================================
export interface TranslationInput {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  domain?: 'craft' | 'material' | 'care' | 'general';
}

export interface TranslationOutput {
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  detectedScript?: string;
}

export interface RegionalLanguageInfo {
  code: string;
  nameEn: string;
  nativeName: string;
  script: string;
  speechCode: string;
  region: string;
}

// ============================================================================
// 5. PRICING ASSISTANCE
// ============================================================================
export interface PricingAssistanceInput {
  materialCost: number;
  laborHours: number;
  desiredHourlyRate: number;
  packagingCost?: number;
  shippingCost?: number;
  platformFeePercent?: number;
  category?: string;
  craftType?: string;
  productionTimeText?: string;
  giCertified?: boolean;
  language?: string;
}

export interface PricingCostBreakdown {
  materialCost: number;
  laborCost: number;
  laborHours: number;
  hourlyRate: number;
  packagingCost: number;
  shippingCost: number;
  additionalCosts: number;
  baseCost: number;
  platformFee: number;
  artisanMargin: number;
}

export interface PricingMarketBenchmark {
  category: string;
  craftName: string;
  minMarketPrice: number;
  maxMarketPrice: number;
  avgMarketPrice: number;
  demandTrend: 'high' | 'steady' | 'seasonal';
  sourceNote: string;
}

export interface PricingAssistanceOutput {
  baseCost: number;
  minimumSustainablePrice: number;
  recommendedPrice: number;
  premiumRange: {
    min: number;
    max: number;
  };
  breakdown: PricingCostBreakdown;
  benchmark?: PricingMarketBenchmark;
  explanation: {
    summary: string;
    materialNote: string;
    laborNote: string;
    bufferNote: string;
    fairLivelihoodNote: string;
  };
  disclaimer: string;
}
