/**
 * KalaConnect - Modular AI Service Layer
 * 
 * Proxies AI operations to backend Express endpoints (/api/*) and modular client services.
 * Never exposes GEMINI_API_KEY to the browser client.
 * Provides fallback implementations for offline/disconnected states.
 */

import { Language } from '../types';
import {
  aiService as modularAIService,
  speechService,
  productExtractionService,
  descriptionService,
  translationService,
  pricingService
} from './ai';

export * from './ai';

export interface StructureProductAIRequest {
  speechText: string;
  language: Language | string;
  artisanContext?: {
    name?: string;
    location?: string;
    craftCategory?: string;
    specialtyTechnique?: string;
    hasGiCertification?: boolean;
    knownAwards?: string[];
  };
}

export interface GenerateDescriptionAIRequest {
  transcription?: string;
  artisanInfo?: string;
  category?: string;
  materials?: string;
  technique?: string;
  artisanStory?: string;
  artisanName?: string;
  artisanLocation?: string;
  tone?: 'authentic' | 'simplified' | 'premium';
  originalLanguage?: string;
}

class AIService {
  // 1. Speech Processing
  public processSpeech = modularAIService.processSpeech;
  public detectLanguageFromText = modularAIService.detectLanguageFromText;
  public getSupportedLanguages = modularAIService.getSupportedLanguages;

  // 2. Product Extraction
  public extractProductInfo = modularAIService.extractProductInfo;

  // 3. Product Description Generation
  public generateDescriptions = modularAIService.generateDescriptions;

  // 4. Translation
  public translate = modularAIService.translate;

  // 5. Pricing Assistance
  public calculatePricing = modularAIService.calculatePricing;

  /**
   * Transforms speech voice transcript into structured craft listing via backend API or offline fallback
   */
  public async structureProductFromVoice(params: StructureProductAIRequest) {
    const res = await productExtractionService.extractProductInfo({
      speechText: params.speechText,
      language: typeof params.language === 'string' ? params.language : 'en',
      artisanContext: params.artisanContext
    });
    return res.data;
  }

  /**
   * Generates multilingual catalog narratives via backend API or offline fallback
   */
  public async generateCatalogDescriptions(params: GenerateDescriptionAIRequest) {
    const res = await descriptionService.generateDescriptions({
      transcription: params.transcription,
      artisanInfo: params.artisanInfo,
      category: params.category || 'Handicrafts',
      materials: params.materials || 'Natural raw materials',
      technique: params.technique || 'Traditional crafting technique',
      artisanStory: params.artisanStory,
      artisanName: params.artisanName,
      artisanLocation: params.artisanLocation,
      tone: params.tone || 'authentic',
      originalLanguage: params.originalLanguage || 'en'
    });
    return res.data;
  }
}

export const aiService = new AIService();
export default aiService;

