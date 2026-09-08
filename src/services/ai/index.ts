/**
 * KalaConnect - Modular AI Services Entrypoint
 * 
 * Provides unified, modular access to all 5 AI capabilities:
 * 1. Speech Processing (Transcription & Language Detection)
 * 2. Product Information Extraction (Natural Speech to Structured Specifications)
 * 3. Product Description Generation (Multilingual Catalog Narratives & Highlights)
 * 4. Translation (English, Hindi, and Regional Language Architecture)
 * 5. Pricing Assistance (Transparent & Explainable Suggested Pricing)
 */

export * from './types';
export * from './speechService';
export * from './productExtractionService';
export * from './descriptionService';
export * from './translationService';
export * from './pricingService';

import { speechService } from './speechService';
import { productExtractionService } from './productExtractionService';
import { descriptionService } from './descriptionService';
import { translationService } from './translationService';
import { pricingService } from './pricingService';
import {
  SpeechProcessingInput,
  ProductExtractionInput,
  DescriptionGenerationInput,
  TranslationInput,
  PricingAssistanceInput
} from './types';

export const aiService = {
  // 1. Speech Processing
  processSpeech: (input: SpeechProcessingInput) => speechService.processSpeech(input),
  detectLanguageFromText: (text: string) => speechService.detectLanguageFromText(text),
  getSupportedLanguages: () => translationService.getSupportedLanguages(),

  // 2. Product Information Extraction
  extractProductInfo: (input: ProductExtractionInput) => productExtractionService.extractProductInfo(input),

  // 3. Product Description Generation
  generateDescriptions: (input: DescriptionGenerationInput) => descriptionService.generateDescriptions(input),

  // 4. Translation
  translate: (input: TranslationInput) => translationService.translate(input),

  // 5. Pricing Assistance
  calculatePricing: (input: PricingAssistanceInput) => pricingService.calculatePricing(input)
};

export default aiService;
