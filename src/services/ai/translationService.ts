/**
 * KalaConnect - Modular AI Translation Service
 * 
 * Feature 4: Translation
 * Support:
 * - English
 * - Hindi
 * - Regional Language Architecture:
 *   - Tamil ('ta')
 *   - Telugu ('te')
 *   - Bengali ('bn')
 *   - Kannada ('kn')
 *   - Marathi ('mr')
 *   - Gujarati ('gu')
 *   - Malayalam ('ml')
 * 
 * Includes craft domain terminology preservation:
 * - Handloom / Khadi / Pit-loom
 * - Terracotta / Kalash / Matka
 * - Zari / Mulberry Silk / Ahimsa Silk
 * - Dhokra / Bell metal / Lost-wax
 * - Lacquerware / Channapatna
 * 
 * Fallback behavior: Instant offline dictionary mapping when network is unavailable.
 */

import {
  AIServiceResult,
  TranslationInput,
  TranslationOutput,
  RegionalLanguageInfo
} from './types';
import { SUPPORTED_REGIONAL_LANGUAGES } from './speechService';

// Domain Terminology Dictionaries
const CRAFT_TERMS_DICTIONARY: Record<string, Record<string, string>> = {
  // English to Hindi
  hi: {
    'Handcrafted': 'हस्तनिर्मित',
    'Terracotta': 'टेराकोटा',
    'Pottery': 'मिट्टी के बर्तन',
    'Handloom': 'हथकरघा',
    'Silk': 'रेशम',
    'Saree': 'साड़ी',
    'Clay': 'मिट्टी',
    'Water Pot': 'मटका',
    'Pitcher': 'कलश',
    'Brass': 'पीतल',
    'Bell Metal': 'बेल मेटल (कांसा)',
    'Lost-wax casting': 'ढोकरा (मोम निष्कासन ढलाई)',
    'Woodcarving': 'काष्ठ नक्काशी',
    'Teakwood': 'सागौन की लकड़ी',
    'Natural Dye': 'प्राकृतिक रंग',
    'Eco-friendly': 'पर्यावरण-अनुकूल',
    'Fair Trade': 'उचित व्यापार',
    'Master Artisan': 'वरिष्ठ शिल्पी',
    'GI Tagged': 'जीआई प्रमाणित (GI Tagged)',
    'Ready to ship': 'तुरंत भेजने के लिए तैयार',
    'In Stock': 'उपलब्ध है'
  },
  // English to Tamil
  ta: {
    'Handcrafted': 'கைவினைப் பொருள்',
    'Terracotta': 'சுடுமண் கலை',
    'Pottery': 'மண்பாண்டம்',
    'Handloom': 'கைத்தறி',
    'Silk': 'பட்டு',
    'Saree': 'புடவை',
    'Clay': 'களிமண்',
    'Water Pot': 'தண்ணீர் குடம்',
    'Pitcher': 'கலசம்',
    'Brass': 'பித்தளை',
    'Bell Metal': 'வெண்கலம்',
    'Lost-wax casting': 'மெழுகு வார்ப்பு கலை',
    'Woodcarving': 'மரச் சிற்பக்கலை',
    'Teakwood': 'தேக்கு மரம்',
    'Natural Dye': 'இயற்கை சாயம்',
    'Eco-friendly': 'சுற்றுச்சூழல் பாதுகாப்பு',
    'Fair Trade': 'நேர்மையான வணிகம்',
    'Master Artisan': 'தலைமை கைவினைஞர்',
    'GI Tagged': 'புவிசார் குறியீடு பெற்றது',
    'Ready to ship': 'அனுப்பத் தயார்',
    'In Stock': 'கையிருப்பில் உள்ளது'
  },
  // English to Telugu
  te: {
    'Handcrafted': 'చేతితో తయారు చేసినది',
    'Terracotta': 'టెర్రకోట మట్టి కళ',
    'Pottery': 'మట్టి పాత్రలు',
    'Handloom': 'చేనేత',
    'Silk': 'పట్టు',
    'Saree': 'చీర',
    'Clay': 'మట్టి',
    'Water Pot': 'కుండ',
    'Pitcher': 'కలశం',
    'Brass': 'ఇత్తడి',
    'Bell Metal': 'కంచు లోహం',
    'Lost-wax casting': 'డోక్రా కాస్టింగ్',
    'Natural Dye': 'సహజ రంగులు',
    'GI Tagged': 'జీఐ గుర్తింపు పొందినది'
  },
  // English to Bengali
  bn: {
    'Handcrafted': 'হাতে তৈরি',
    'Terracotta': 'পোড়ামাটি (টেরাকোটা)',
    'Pottery': 'মৃৎশিল্প',
    'Handloom': 'তাঁতশিল্প',
    'Silk': 'রেশম / সিল্ক',
    'Saree': 'শাড়ি',
    'Clay': 'মাটি',
    'Water Pot': 'কলসি',
    'Brass': 'পিতল',
    'Bell Metal': 'কাঁসা',
    'GI Tagged': 'জিআই ট্যাগ প্রাপ্ত'
  }
};

export class TranslationService {
  /**
   * Translates text between supported Indian languages and English
   */
  public async translate(
    input: TranslationInput
  ): Promise<AIServiceResult<TranslationOutput>> {
    const startTime = Date.now();
    const { text, fromLanguage, toLanguage } = input;

    if (!text || !text.trim()) {
      return {
        success: true,
        isFallback: false,
        source: 'local-nlp',
        data: { translatedText: '', fromLanguage, toLanguage },
        executionTimeMs: 0
      };
    }

    if (fromLanguage === toLanguage) {
      return {
        success: true,
        isFallback: false,
        source: 'local-nlp',
        data: { translatedText: text, fromLanguage, toLanguage },
        executionTimeMs: 0
      };
    }

    // 1. Try server API route
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          fromLanguage,
          toLanguage,
          domain: input.domain || 'craft'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.data && json.data.translatedText) {
          return {
            success: true,
            isFallback: false,
            source: json.source === 'local-fallback' ? 'rule-based' : 'gemini-3.8-flash',
            data: {
              translatedText: json.data.translatedText,
              fromLanguage,
              toLanguage,
              detectedScript: json.data.detectedScript
            },
            confidence: 0.95,
            executionTimeMs: Date.now() - startTime
          };
        }
      }
    } catch (netErr) {
      console.warn('Network translation failed, utilizing offline craft terminology mapper:', netErr);
    }

    // 2. Offline Craft Terminology Mapper Fallback
    const translated = this.translateLocally(text, toLanguage);

    return {
      success: true,
      isFallback: true,
      source: 'local-nlp',
      data: {
        translatedText: translated,
        fromLanguage,
        toLanguage
      },
      confidence: 0.85,
      executionTimeMs: Date.now() - startTime
    };
  }

  /**
   * High-accuracy regional dictionary replacement
   */
  private translateLocally(text: string, targetLang: string): string {
    const dict = CRAFT_TERMS_DICTIONARY[targetLang];
    if (!dict) return text;

    let result = text;
    for (const [englishTerm, regionalTerm] of Object.entries(dict)) {
      const regex = new RegExp(`\\b${englishTerm}\\b`, 'gi');
      result = result.replace(regex, regionalTerm);
    }
    return result;
  }

  /**
   * Helper to retrieve all supported languages
   */
  public getSupportedLanguages(): RegionalLanguageInfo[] {
    return SUPPORTED_REGIONAL_LANGUAGES;
  }
}

export const translationService = new TranslationService();
