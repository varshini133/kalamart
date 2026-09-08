import React, { useState, useEffect, useRef } from 'react';
import { ScreenType, Language, Product, User, ProductDraft } from '../types';
import { getTranslations } from '../services/localizationService';
import {
  generateCatalogFromVoice,
  generateMarketplaceTranslations,
  detectLanguageFromText,
  SUPPORTED_LANGUAGES,
  ExtendedLanguage,
  ExtractedCatalogData,
  MarketplaceTranslations
} from '../services/catalogService';
import { AIProductDescriptionGenerator } from '../components/AIProductDescriptionGenerator';
import { IntelligentPricingAssistant } from '../components/IntelligentPricingAssistant';
import { offlineSyncService } from '../services/offlineSyncService';

interface VoiceCatalogingScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (msg: string) => void;
  currentLanguage: Language;
  onPublishProduct?: (newProduct: Product) => void;
  user?: User | null;
}

// Sample craft images for quick testing if no device camera is available
const SAMPLE_CRAFT_PHOTOS = [
  {
    label: 'Terracotta Water Pot',
    url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Close-up Texture',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Workshop Wheel',
    url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80'
  },
  {
    label: 'Handloom Saree',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
  }
];

// Sample spoken stories for 1-tap testing
const SAMPLE_SPOKEN_STORIES: Record<string, string> = {
  en: 'This is an authentic handcrafted terracotta water pot made from natural riverbed clay harvested from dried riverbeds in Kutch. We shape it entirely by hand on a manual wheel and fire it with rice husks in an underground pit. It holds 2.5 litres of water and naturally cools it by 4 to 6 degrees without electricity. It takes 4 days of slow drying and firing to finish. Our family has crafted this pottery across five generations.',
  hi: 'यह शुद्ध नदी की मिट्टी से चाक पर हस्तनिर्मित पारंपरिक मटका है। इसमें लगभग ढाई लीटर पानी आता है और यह बिना बिजली के पानी को प्राकृतिक रूप से ठंडा और मीठा रखता है। इसे बनाने में लगभग चार दिन का समय लगता है। हमारे परिवार में पांच पीढ़ियों से मिट्टी के बर्तन बनाने की यह परंपरा जारी है।',
  ta: 'இது கச்சின் ஆற்று வண்டல் களிமண்ணால் செய்யப்பட்ட பாரம்பரிய மண்பாண்டக் குடம். இதில் இரண்டரை லிட்டர் தண்ணீர் பிடிக்கும். மின்சாரம் இன்றி இயற்கையாகவே தண்ணீரை குளிர்ச்சியாகவும் சுவையாகவும் வைத்திருக்கும். இதை உருவாக்க நான்கு நாட்கள் ஆகும். எங்கள் குடும்பத்தில் ஐந்து தலைமுறைகளாக இந்த கைவினை முறை பாதுகாக்கப்படுகிறது.'
};

export const VoiceCatalogingScreen: React.FC<VoiceCatalogingScreenProps> = ({
  onNavigate,
  onShowToast,
  currentLanguage,
  onPublishProduct,
  user
}) => {
  const t = getTranslations(currentLanguage);

  // 5 Step Flow:
  // Step 1: ADD PRODUCT PHOTO (Camera capture, Gallery upload, Multiple photos, Previews)
  // Step 2: SPEAK ABOUT YOUR PRODUCT (Microphone, prompts, record, stop, playback, delete, re-record)
  // Step 3: TRANSCRIBE VOICE (Speech-to-text, editable transcription, language detection & correction)
  // Step 4: AI STRUCTURING (Extracts 8 structured attributes from speech)
  // Step 5: PRODUCT PREVIEW (Simple preview, fallback manual editing for all fields, publish)
  // Step 6: Published Success
  const [step, setStep] = useState<number>(1);

  // =========================================================================
  // STEP 1 STATE: PHOTOS
  // =========================================================================
  const [images, setImages] = useState<string[]>([SAMPLE_CRAFT_PHOTOS[0].url]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [enhancedImages, setEnhancedImages] = useState<number[]>([]);
  const [isEnhancingImage, setIsEnhancingImage] = useState<boolean>(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // =========================================================================
  // STEP 2 STATE: VOICE RECORDING & CONTROLS
  // =========================================================================
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const audioIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Raw spoken text gathered
  const [spokenText, setSpokenText] = useState<string>('');

  // =========================================================================
  // STEP 3 STATE: TRANSCRIPTION & LANGUAGE CORRECTION
  // =========================================================================
  const [editableTranscription, setEditableTranscription] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<ExtendedLanguage>(
    (user?.preferredLanguage as ExtendedLanguage) || (currentLanguage as ExtendedLanguage) || 'en'
  );
  const [detectedLanguage, setDetectedLanguage] = useState<ExtendedLanguage>('en');
  const [showLanguagePicker, setShowLanguagePicker] = useState<boolean>(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  // =========================================================================
  // STEP 4 & 5 STATE: AI STRUCTURING & PRODUCT PREVIEW
  // =========================================================================
  const [isStructuringAI, setIsStructuringAI] = useState<boolean>(false);
  const [structuringPhase, setStructuringPhase] = useState<number>(1);
  const [structuredProduct, setStructuredProduct] = useState<ExtractedCatalogData | null>(null);
  const [publishPrice, setPublishPrice] = useState<number>(850);
  const [stockCount, setStockCount] = useState<number>(10);

  // Step 5 View Modes: AI Description, Intelligent Pricing, or Raw Specifications
  const [step5View, setStep5View] = useState<'ai-description' | 'pricing-assistant' | 'specifications'>('ai-description');
  const [isEditingField, setIsEditingField] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<ExtractedCatalogData | null>(null);

  // Step 6: Published product
  const [publishedItem, setPublishedItem] = useState<Product | null>(null);

  // Offline Architecture State
  const [isOnline, setIsOnline] = useState<boolean>(() => offlineSyncService.isOnline());
  const [showDraftsModal, setShowDraftsModal] = useState<boolean>(false);
  const [savedDrafts, setSavedDrafts] = useState<ProductDraft[]>(() => offlineSyncService.getOfflineDrafts());

  useEffect(() => {
    const unsubscribe = offlineSyncService.subscribe((event) => {
      if (event.type === 'network-change') {
        setIsOnline(event.payload.isOnline);
      } else if (event.type === 'draft-saved' || event.type === 'queue-updated') {
        setSavedDrafts(offlineSyncService.getOfflineDrafts());
      }
    });
    return () => unsubscribe();
  }, []);

  // Save current progress as local draft
  const handleSaveDraftLocally = () => {
    const draftTitle = structuredProduct?.productName || 
      (spokenText.trim() ? spokenText.slice(0, 35) + '...' : 'Handcrafted Craft Draft');

    const draft = offlineSyncService.saveProductDraft({
      title: draftTitle,
      price: publishPrice,
      category: structuredProduct?.category || 'Handmade Crafts',
      craftTechnique: structuredProduct?.craftTechnique || 'Traditional Technique',
      material: structuredProduct?.materials || 'Natural Sourced Materials',
      dimensions: structuredProduct?.dimensions || 'Standard Size',
      productionTime: structuredProduct?.productionTime || '2-3 days',
      stockCount: stockCount,
      description: structuredProduct?.description || spokenText,
      storyBehindProduct: structuredProduct?.culturalSignificance || spokenText,
      images: images,
      audioMetadata: {
        durationSeconds: recordingSeconds || 14,
        recordedAt: Date.now(),
        transcript: spokenText || editableTranscription,
        language: (selectedLanguage as Language) || 'en'
      }
    });

    setSavedDrafts(offlineSyncService.getOfflineDrafts());
    if (!isOnline) {
      onShowToast("You're offline. Your work is safely saved on this device.");
    } else {
      onShowToast('Product draft saved locally on this device!');
    }
  };

  // Resume draft from local device storage
  const handleResumeDraft = (draft: ProductDraft) => {
    if (draft.images && draft.images.length > 0) {
      setImages(draft.images);
      setPrimaryImageIndex(0);
    }
    if (draft.price) setPublishPrice(draft.price);
    if (draft.stockCount) setStockCount(draft.stockCount);

    const transcript = draft.audioMetadata?.transcript || draft.description || '';
    setSpokenText(transcript);
    setEditableTranscription(transcript);

    setStructuredProduct({
      productName: draft.title,
      category: draft.category || 'Handmade Crafts',
      materials: draft.material || 'Natural Handcrafted Raw Materials',
      craftTechnique: draft.craftTechnique || 'Traditional Artisan Technique',
      dimensions: draft.dimensions || 'Standard Size',
      productionTime: draft.productionTime || '2-3 days',
      careInstructions: 'Clean with soft dry cloth, keep away from excessive moisture.',
      culturalSignificance: draft.storyBehindProduct || 'Passed down through generational master artisans.',
      uniqueFeatures: ['100% Handcrafted', 'Zero toxic chemicals', 'Fair trade certified'],
      suggestedTags: ['handmade', 'artisan', 'heritage'],
      rawSpeechTranscription: transcript
    });

    setStep(5);
    setShowDraftsModal(false);
    onShowToast(`Resumed draft: "${draft.title}"`);
  };

  // Default sample speech when changing language
  useEffect(() => {
    if (!spokenText) {
      const sample = SAMPLE_SPOKEN_STORIES[selectedLanguage] || SAMPLE_SPOKEN_STORIES['en'];
      setSpokenText(sample);
      setEditableTranscription(sample);
      setDetectedLanguage(detectLanguageFromText(sample));
    }
  }, [selectedLanguage]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // =========================================================================
  // STEP 1 HANDLERS: ADD PRODUCT PHOTO
  // =========================================================================
  const handleTriggerCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleTriggerGallery = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files) as File[];
      const newUrls: string[] = [];
      let readCount = 0;

      filesArray.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newUrls.push(event.target.result as string);
          }
          readCount++;
          if (readCount === filesArray.length) {
            setImages((prev) => [...prev, ...newUrls]);
            onShowToast(
              newUrls.length === 1
                ? 'Photo added to product!'
                : `${newUrls.length} photos added!`
            );
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (index: number) => {
    if (images.length <= 1) {
      onShowToast('Keep at least 1 photo for your product.');
      return;
    }
    const newImgs = images.filter((_, i) => i !== index);
    setImages(newImgs);
    if (primaryImageIndex >= newImgs.length) {
      setPrimaryImageIndex(0);
    }
    onShowToast('Photo removed');
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
    onShowToast('Set as primary cover image');
  };

  const handleSelectSampleImage = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
      onShowToast('Sample photo added');
    }
  };

  const handleToggleEnhanceImage = (index: number) => {
    setIsEnhancingImage(true);
    setTimeout(() => {
      setIsEnhancingImage(false);
      setEnhancedImages((prev) => {
        const isEnhanced = prev.includes(index);
        if (isEnhanced) {
          onShowToast('Image enhancement turned off');
          return prev.filter((i) => i !== index);
        } else {
          onShowToast('AI Clarity Enhanced: Balanced lighting & sharpened craft textures');
          return [...prev, index];
        }
      });
    }, 450);
  };

  // =========================================================================
  // STEP 2 HANDLERS: SPEAK ABOUT YOUR PRODUCT
  // =========================================================================
  const handleStartRecording = () => {
    setIsRecording(true);
    setHasRecordedAudio(false);
    setRecordingSeconds(0);
    setTranscriptionError(null);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;

        // Map selected language to speech recognition code
        const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);
        rec.lang = langObj ? langObj.speechCode : 'en-IN';

        rec.onresult = (event: any) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setSpokenText(transcript);
            setEditableTranscription(transcript);
            const detected = detectLanguageFromText(transcript);
            setDetectedLanguage(detected);
          }
        };

        rec.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          if (event.error === 'not-allowed') {
            setTranscriptionError(
              'Microphone permission needed. You can allow mic access or use the sample description below.'
            );
          }
        };

        rec.start();
        recognitionRef.current = rec;
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    } else {
      // Browser doesn't support Web Speech API
      setTranscriptionError(
        'Speech recognition not supported in this browser. You can type or use the sample description.'
      );
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    setHasRecordedAudio(true);

    // If speech recognition didn't yield text (e.g. mic blocked), supply contextual starter
    if (!spokenText.trim()) {
      const fallbackText =
        SAMPLE_SPOKEN_STORIES[selectedLanguage] || SAMPLE_SPOKEN_STORIES['en'];
      setSpokenText(fallbackText);
      setEditableTranscription(fallbackText);
      setDetectedLanguage(detectLanguageFromText(fallbackText));
    }

    onShowToast('Voice recording saved!');
  };

  const handleToggleAudioPlayback = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioPlaybackProgress(0);
    } else {
      setIsPlayingAudio(true);
      setAudioPlaybackProgress(0);
      const totalSec = Math.max(recordingSeconds, 6);
      const stepInterval = 100;
      const progressIncrement = 100 / ((totalSec * 1000) / stepInterval);

      audioIntervalRef.current = setInterval(() => {
        setAudioPlaybackProgress((prev) => {
          if (prev >= 100) {
            clearInterval(audioIntervalRef.current);
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + progressIncrement;
        });
      }, stepInterval);
    }
  };

  const handleDeleteRecording = () => {
    if (isRecording) {
      handleStopRecording();
    }
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    setHasRecordedAudio(false);
    setRecordingSeconds(0);
    setSpokenText('');
    setEditableTranscription('');
    onShowToast('Recording deleted. Tap mic to record again.');
  };

  const handleReRecord = () => {
    handleDeleteRecording();
    setTimeout(() => {
      handleStartRecording();
    }, 150);
  };

  const handleLoadSampleSpeech = (langCode: string) => {
    const text = SAMPLE_SPOKEN_STORIES[langCode] || SAMPLE_SPOKEN_STORIES['en'];
    setSpokenText(text);
    setEditableTranscription(text);
    setHasRecordedAudio(true);
    setRecordingSeconds(14);
    setSelectedLanguage(langCode as ExtendedLanguage);
    setDetectedLanguage(detectLanguageFromText(text));
    onShowToast(`Loaded authentic artisan voice story (${langCode.toUpperCase()})`);
  };

  // =========================================================================
  // STEP 3 HANDLERS: TRANSCRIBE & LANGUAGE CORRECTION
  // =========================================================================
  const handleSelectLanguageCorrection = (langCode: ExtendedLanguage) => {
    setSelectedLanguage(langCode);
    setShowLanguagePicker(false);
    // If the text is empty or matches sample, switch sample to the newly selected language
    if (!editableTranscription.trim() || Object.values(SAMPLE_SPOKEN_STORIES).includes(editableTranscription)) {
      const newSample = SAMPLE_SPOKEN_STORIES[langCode] || SAMPLE_SPOKEN_STORIES['en'];
      setEditableTranscription(newSample);
      setSpokenText(newSample);
    }
    onShowToast(`Language set to ${SUPPORTED_LANGUAGES.find((l) => l.code === langCode)?.nameEn}`);
  };

  // Advance from Step 3 to Step 4 (Trigger AI Structuring)
  const handleProceedToAIStructuring = async () => {
    if (!editableTranscription.trim()) {
      onShowToast('Please speak or type about your product first.');
      return;
    }

    setStep(4);
    setIsStructuringAI(true);
    setStructuringPhase(1);

    const timer1 = setTimeout(() => setStructuringPhase(2), 600);
    const timer2 = setTimeout(() => setStructuringPhase(3), 1300);

    try {
      const extracted = await generateCatalogFromVoice({
        spokenText: editableTranscription,
        sourceLanguage: selectedLanguage,
        productPhotoUrl: images[primaryImageIndex] || images[0],
        artisanContext: {
          name: user?.name,
          location: user?.location,
          craftCategory: user?.craftCategory,
          specialtyTechnique: user?.specialtyTechnique
        }
      });

      setStructuredProduct(extracted);
      setEditFormData(extracted);
      setPublishPrice(extracted.estimatedPrice || 850);
      setIsStructuringAI(false);
      setStep(5);
      onShowToast('Product details structured successfully!');
    } catch (err) {
      console.warn('Structuring error:', err);
      setIsStructuringAI(false);
      onShowToast('Could not complete structuring. Please try again.');
      setStep(3);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  };

  // =========================================================================
  // STEP 5 HANDLERS: FALLBACK MANUAL EDITING & PUBLISH
  // =========================================================================
  const handleSaveFieldEdit = () => {
    if (editFormData && structuredProduct) {
      setStructuredProduct({ ...editFormData });
      setIsEditingField(null);
      onShowToast('Field updated');
    }
  };

  const handlePublishListing = () => {
    if (!structuredProduct) return;

    const primaryPhoto = images[primaryImageIndex] || images[0] || SAMPLE_CRAFT_PHOTOS[0].url;

    const newProd: Product = {
      id: `kala-prod-${Date.now()}`,
      title: structuredProduct.productName,
      price: publishPrice,
      originalPrice: Math.round(publishPrice * 1.2),
      discount: 'Direct Artisan Rate',
      category: structuredProduct.category,
      craftType: structuredProduct.craftTechnique,
      artisanId: user?.id || 'artisan-user',
      artisanName: user?.name || 'Master Artisan',
      artisanLocation: user?.location || 'Bhuj, Gujarat',
      artisanRole: `${structuredProduct.category} Artisan`,
      images: images.length > 0 ? images : [primaryPhoto],
      material: structuredProduct.materials,
      technique: structuredProduct.craftTechnique,
      craftOrigin: user?.location || 'Gujarat, India',
      capacity: structuredProduct.dimensions,
      rating: 5.0,
      reviewsCount: 1,
      badge: 'GI Verified Lineage',
      giTag: 'GI-IN-KALA-DIRECT',
      giCertified: true,
      description: structuredProduct.description,
      storyBehindProduct: structuredProduct.culturalSignificance,
      specialFeatures: structuredProduct.uniqueFeatures,
      suggestedTags: structuredProduct.suggestedTags,
      inStock: true,
      stockCount: stockCount,
      moq: 1,
      bulkPrice: Math.round(publishPrice * 0.8),
      isApprovedByAdmin: true,
      syncStatus: isOnline ? 'synced' : 'saved_local'
    };

    if (!isOnline) {
      offlineSyncService.enqueueOperation({
        entityId: newProd.id,
        entityType: 'product',
        operationType: 'create',
        title: newProd.title,
        payload: newProd,
        status: 'saved_local'
      });
      onShowToast("You're offline. Your work is safely saved on this device.");
    } else {
      onShowToast('Your product is live on KalaConnect!');
    }

    setPublishedItem(newProd);
    if (onPublishProduct) {
      onPublishProduct(newProd);
    }
    setStep(6);
  };

  const handlePublishFromAIDescription = (finalData: {
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
      en: any;
      hi: any;
      original: any;
    };
  }) => {
    if (!structuredProduct) return;
    const primaryPhoto = images[primaryImageIndex] || images[0] || SAMPLE_CRAFT_PHOTOS[0].url;

    const newProd: Product = {
      id: `kala-prod-${Date.now()}`,
      title: finalData.title || structuredProduct.productName,
      price: publishPrice,
      originalPrice: Math.round(publishPrice * 1.2),
      discount: 'Direct Artisan Rate',
      category: structuredProduct.category,
      craftType: structuredProduct.craftTechnique,
      artisanId: user?.id || 'artisan-user',
      artisanName: user?.name || 'Master Artisan',
      artisanLocation: user?.location || 'Bhuj, Gujarat',
      artisanRole: `${structuredProduct.category} Artisan`,
      images: images.length > 0 ? images : [primaryPhoto],
      material: finalData.materialDetails || structuredProduct.materials,
      technique: finalData.craftsmanshipDetails || structuredProduct.craftTechnique,
      craftOrigin: user?.location || 'Gujarat, India',
      capacity: structuredProduct.dimensions,
      rating: 5.0,
      reviewsCount: 1,
      badge: 'GI Verified Lineage',
      giTag: 'GI-IN-KALA-DIRECT',
      giCertified: true,
      description: finalData.fullDescription || structuredProduct.description,
      storyBehindProduct: finalData.artisanStoryConnection || structuredProduct.culturalSignificance,
      specialFeatures: finalData.highlights || structuredProduct.uniqueFeatures,
      suggestedTags: structuredProduct.suggestedTags,
      inStock: true,
      stockCount: stockCount,
      moq: 1,
      bulkPrice: Math.round(publishPrice * 0.8),
      isApprovedByAdmin: true,
      syncStatus: isOnline ? 'synced' : 'saved_local',
      marketplaceTranslations: {
        en: {
          title: finalData.translations?.en?.productTitle || finalData.title,
          description: finalData.translations?.en?.fullDescription || finalData.fullDescription,
          story: finalData.translations?.en?.artisanStoryConnection || finalData.artisanStoryConnection
        },
        hi: {
          title: finalData.translations?.hi?.productTitle || finalData.title,
          description: finalData.translations?.hi?.fullDescription || finalData.fullDescription,
          story: finalData.translations?.hi?.artisanStoryConnection || finalData.artisanStoryConnection
        },
        ta: {
          title: finalData.translations?.original?.productTitle || finalData.title,
          description: finalData.translations?.original?.fullDescription || finalData.fullDescription,
          story: finalData.translations?.original?.artisanStoryConnection || finalData.artisanStoryConnection
        }
      }
    };

    if (!isOnline) {
      offlineSyncService.enqueueOperation({
        entityId: newProd.id,
        entityType: 'product',
        operationType: 'create',
        title: newProd.title,
        payload: newProd,
        status: 'saved_local'
      });
      onShowToast("You're offline. Your work is safely saved on this device.");
    } else {
      onShowToast('Your product is live on KalaConnect!');
    }

    setPublishedItem(newProd);
    if (onPublishProduct) {
      onPublishProduct(newProd);
    }
    setStep(6);
  };

  // =========================================================================
  // CELEBRATION / SUCCESS SCREEN (STEP 6)
  // =========================================================================
  if (step === 6 && publishedItem) {
    const isSavedOffline = publishedItem.syncStatus === 'saved_local';

    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 max-w-md mx-auto w-full animate-fadeIn">
        <div className="w-full p-6 rounded-3xl bg-surface-container-lowest border border-secondary/30 shadow-xl text-center relative overflow-hidden space-y-5">
          <div className={`w-18 h-18 rounded-full border-2 shadow-md flex items-center justify-center mx-auto ${
            isSavedOffline 
              ? 'bg-amber-500/15 text-amber-700 border-amber-500/40' 
              : 'bg-linear-to-tr from-secondary/20 to-primary/20 text-secondary border-secondary/40'
          }`}>
            <span className="material-symbols-outlined text-[38px]">
              {isSavedOffline ? 'save' : 'verified'}
            </span>
          </div>

          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              isSavedOffline
                ? 'bg-amber-500/15 text-amber-800'
                : 'bg-secondary/15 text-secondary'
            }`}>
              <span className="material-symbols-outlined text-[15px]">
                {isSavedOffline ? 'cloud_off' : 'cloud_done'}
              </span>
              <span>{isSavedOffline ? 'Saved Locally (Waiting to Sync)' : 'Live on KalaMart Marketplace'}</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary">
              {isSavedOffline ? 'Craft Saved Offline!' : 'Product Published!'}
            </h1>
            <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
              {isSavedOffline
                ? "You're offline. Your work is safely saved on this device. It will automatically synchronize to the marketplace once internet is restored."
                : 'Your voice-created listing is now live with fair pricing, verified heritage tags, and buyer direct order access.'}
            </p>
          </div>

          {/* Mini Preview Card */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-left flex items-center gap-3">
            <img
              src={publishedItem.images[0]}
              alt={publishedItem.title}
              className="w-16 h-16 rounded-xl object-cover ring-1 ring-secondary/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-secondary uppercase tracking-wider">
                {publishedItem.category}
              </div>
              <div className="text-sm font-bold text-primary truncate">
                {publishedItem.title}
              </div>
              <div className="text-xs font-bold text-primary mt-1">
                ₹{publishedItem.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('discover')}
              className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>View in Marketplace</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('studio')}
              className="w-full py-3 rounded-2xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Go to Artisan Studio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN WIZARD VIEW (STEPS 1 TO 5)
  // =========================================================================
  const stepTitles = [
    { num: 1, title: 'Product Photos', sub: 'Camera or Gallery Upload' },
    { num: 2, title: 'Speak Your Craft', sub: 'Tell us in your own words' },
    { num: 3, title: 'Voice Transcription', sub: 'Review & language check' },
    { num: 4, title: 'AI Structuring', sub: 'Extracting craft data' },
    { num: 5, title: 'Product Preview', sub: 'Review, tweak & publish' }
  ];

  return (
    <div className={`flex-1 flex flex-col relative w-full pt-3 pb-24 px-3.5 sm:px-4 ${step === 5 && (step5View === 'ai-description' || step5View === 'pricing-assistant') ? 'max-w-4xl' : 'max-w-md'} mx-auto space-y-4 animate-fadeIn bg-surface`}>
      {/* Hidden file inputs for Camera and Gallery */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* TOP HEADER & STEP TRACKER */}
      <div className="p-4 rounded-3xl bg-primary text-on-primary shadow-lg border border-secondary/30 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onNavigate('studio');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary/20 text-secondary-fixed-dim text-xs font-bold">
            <span className="material-symbols-outlined text-[15px]">mic</span>
            <span>Voice Cataloging</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
            {stepTitles[Math.min(step - 1, 4)].title}
          </h1>
          <span className="text-xs text-white/80 font-medium">
            Step {step} of 5
          </span>
        </div>
        <p className="text-xs text-white/75 mt-0.5">
          {stepTitles[Math.min(step - 1, 4)].sub}
        </p>

        {/* 5-Step Progress Bar */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/15">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                s === step
                  ? 'bg-secondary ring-2 ring-secondary/40'
                  : s < step
                  ? 'bg-secondary/80'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Offline & Drafts Quick Controls */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-white/90 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-[11px]">
              {isOnline ? 'Network Connected' : 'Offline Mode (Local Storage)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-save-draft-local"
              onClick={handleSaveDraftLocally}
              className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              title="Save current craft progress to local device storage"
            >
              <span className="material-symbols-outlined text-[14px]">save</span>
              <span>Save Draft</span>
            </button>

            {savedDrafts.length > 0 && (
              <button
                type="button"
                id="btn-view-saved-drafts"
                onClick={() => setShowDraftsModal(true)}
                className="px-2.5 py-1 rounded-xl bg-secondary text-on-secondary font-bold text-[11px] flex items-center gap-1 shadow-xs hover:opacity-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">draft</span>
                <span>Drafts ({savedDrafts.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Offline Alert Indicator */}
      {!isOnline && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-2 text-xs text-amber-950 dark:text-amber-100 font-semibold shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[20px] text-amber-600 shrink-0">wifi_off</span>
            <span className="truncate">You're offline. Your work is safely saved on this device.</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 text-[10px] font-extrabold uppercase shrink-0">
            Saved locally
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: ADD PRODUCT PHOTO                                                 */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-primary">Capture or Upload Photos</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Take a direct workshop photo or choose multiple pictures from your gallery.
              </p>
            </div>

            {/* Action Buttons: Camera Capture & Gallery Upload */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-add-photo-camera"
                type="button"
                onClick={handleTriggerCamera}
                className="p-4 rounded-2xl bg-surface-container-lowest border-2 border-dashed border-secondary/50 hover:border-secondary hover:bg-secondary/5 text-primary transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer active:scale-95 group shadow-xs"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">photo_camera</span>
                </div>
                <div className="text-xs font-bold">Take Photo</div>
                <div className="text-[10px] text-on-surface-variant">Camera Capture</div>
              </button>

              <button
                id="btn-add-photo-gallery"
                type="button"
                onClick={handleTriggerGallery}
                className="p-4 rounded-2xl bg-surface-container-lowest border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer active:scale-95 group shadow-xs"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">photo_library</span>
                </div>
                <div className="text-xs font-bold">Gallery Upload</div>
                <div className="text-[10px] text-on-surface-variant">Multiple Images</div>
              </button>
            </div>

            {/* Image Previews */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-on-surface">
                  Selected Photos ({images.length})
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  Tap star to set primary cover
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {images.map((imgUrl, idx) => {
                  const isEnhanced = enhancedImages.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all group ${
                        idx === primaryImageIndex
                          ? 'border-secondary ring-2 ring-secondary/30 shadow-md'
                          : 'border-outline-variant/30'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Product photo ${idx + 1}`}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isEnhanced ? 'brightness-[1.08] contrast-[1.06] saturate-[1.08]' : ''
                        }`}
                      />

                      {/* Primary Badge */}
                      {idx === primaryImageIndex && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-secondary text-on-secondary text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                          <span className="material-symbols-outlined text-[11px]">star</span>
                          <span>Cover</span>
                        </div>
                      )}

                      {/* Enhanced Badge */}
                      {isEnhanced && (
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-emerald-700/90 text-white text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
                          <span className="material-symbols-outlined text-[10px]">auto_fix_high</span>
                          <span>AI Clarity</span>
                        </div>
                      )}

                      {/* Top-Right Delete Action */}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <span className="material-symbols-outlined text-[13px]">close</span>
                      </button>

                      {/* Set As Primary Button */}
                      {idx !== primaryImageIndex && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="absolute bottom-1 right-1 px-2 py-0.5 rounded-lg bg-black/60 hover:bg-secondary text-white text-[9px] font-semibold text-center transition-colors cursor-pointer"
                        >
                          Set Cover
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* AI Image Enhancement Control Card */}
              <div className="mt-3 p-3 rounded-2xl bg-surface-container-low border border-secondary/20 flex items-center justify-between gap-2 text-left shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-primary truncate">AI Workshop Image Enhancement</div>
                    <div className="text-[10px] text-on-surface-variant truncate">Auto-balance lighting & sharpen craft textures</div>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-enhance-image"
                  onClick={() => handleToggleEnhanceImage(primaryImageIndex)}
                  disabled={isEnhancingImage}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                    enhancedImages.includes(primaryImageIndex)
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-primary text-on-primary hover:bg-primary-container active:scale-95'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[15px] ${isEnhancingImage ? 'animate-spin' : ''}`}>
                    {isEnhancingImage ? 'sync' : enhancedImages.includes(primaryImageIndex) ? 'check_circle' : 'auto_fix_high'}
                  </span>
                  <span>{isEnhancingImage ? 'Enhancing...' : enhancedImages.includes(primaryImageIndex) ? 'Enhanced' : 'Enhance Image'}</span>
                </button>
              </div>
            </div>

            {/* Quick Sample Presets (For testing or demo) */}
            <div className="pt-2 border-t border-outline-variant/20">
              <span className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">
                Or tap a sample craft photo:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {SAMPLE_CRAFT_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSampleImage(sample.url)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 shrink-0 text-left transition-all cursor-pointer"
                  >
                    <img
                      src={sample.url}
                      alt={sample.label}
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                    <span className="text-[11px] font-medium text-on-surface whitespace-nowrap">
                      {sample.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary CTA: Next */}
          <button
            id="btn-step1-next"
            type="button"
            disabled={images.length === 0}
            onClick={() => setStep(2)}
            className="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>Next: Speak About Your Product</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: SPEAK ABOUT YOUR PRODUCT                                          */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Instructions Card */}
          <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-3 shadow-xs">
            <div className="text-center space-y-1">
              <h2 className="font-serif text-lg font-bold text-primary">
                "Tell us about your product in your own words."
              </h2>
              <p className="text-xs text-on-surface-variant">
                Speak naturally in your mother tongue. No complex typing needed.
              </p>
            </div>

            {/* Guiding Examples Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                  category
                </span>
                <div>
                  <div className="text-[11px] font-bold text-primary">What is it?</div>
                  <div className="text-[10px] text-on-surface-variant leading-tight">
                    Name, type or usage of the item
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                  grass
                </span>
                <div>
                  <div className="text-[11px] font-bold text-primary">What material?</div>
                  <div className="text-[10px] text-on-surface-variant leading-tight">
                    Natural clay, wood, pure silk, etc.
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                  schedule
                </span>
                <div>
                  <div className="text-[11px] font-bold text-primary">How long to make?</div>
                  <div className="text-[10px] text-on-surface-variant leading-tight">
                    Hours, days or weeks of manual labor
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                  auto_awesome
                </span>
                <div>
                  <div className="text-[11px] font-bold text-primary">What makes it special?</div>
                  <div className="text-[10px] text-on-surface-variant leading-tight">
                    Ancestral lineage, natural cooling, etc.
                  </div>
                </div>
              </div>
            </div>

            {/* LARGE VISUALLY PROMINENT MICROPHONE BUTTON */}
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="relative">
                {/* Outer animated pulse waves when recording */}
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                    <div className="absolute -inset-3 rounded-full bg-red-500/15 animate-pulse" />
                  </>
                )}

                <button
                  id="btn-large-microphone"
                  type="button"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer active:scale-95 ${
                    isRecording
                      ? 'bg-red-600 text-white ring-4 ring-red-300 animate-pulse'
                      : hasRecordedAudio
                      ? 'bg-secondary text-on-secondary ring-4 ring-secondary/30'
                      : 'bg-primary text-on-primary ring-4 ring-primary/20 hover:bg-primary-container'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Recording'}
                >
                  <span className="material-symbols-outlined text-[44px]">
                    {isRecording ? 'stop' : 'mic'}
                  </span>
                </button>
              </div>

              {/* Status text & live duration timer */}
              <div className="text-center space-y-1">
                {isRecording ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      Listening... {recordingSeconds}s
                    </span>
                  </div>
                ) : hasRecordedAudio ? (
                  <div className="text-xs font-bold text-secondary flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Recording Captured ({recordingSeconds || 14}s)</span>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-primary">
                    Tap to Start Speaking
                  </div>
                )}
                <div className="text-[11px] text-on-surface-variant">
                  {isRecording
                    ? 'Speak freely. Tap again to stop.'
                    : hasRecordedAudio
                    ? 'You can listen back, delete, or proceed.'
                    : 'Tap the mic to record your craft story'}
                </div>
              </div>

              {/* Audio Controls: Playback, Delete, Re-record */}
              {hasRecordedAudio && (
                <div className="w-full pt-2 border-t border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {/* Audio Playback Button */}
                    <button
                      type="button"
                      onClick={handleToggleAudioPlayback}
                      className="px-3.5 py-2 rounded-xl bg-surface-container-high text-primary hover:bg-secondary/20 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isPlayingAudio ? 'pause' : 'play_arrow'}
                      </span>
                      <span>{isPlayingAudio ? 'Pause' : 'Play Recording'}</span>
                    </button>

                    {/* Re-record Button */}
                    <button
                      type="button"
                      onClick={handleReRecord}
                      className="px-3 py-2 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      <span>Re-record</span>
                    </button>

                    {/* Delete Recording Button */}
                    <button
                      type="button"
                      onClick={handleDeleteRecording}
                      className="p-2 rounded-xl bg-surface-container text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Delete recording"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  {/* Playback progress bar */}
                  {isPlayingAudio && (
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary transition-all"
                        style={{ width: `${audioPlaybackProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Inspiration Chips (Tamil, Hindi, English) */}
            <div className="pt-2 border-t border-outline-variant/20">
              <span className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">
                Quick testing voice samples:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleLoadSampleSpeech('ta')}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-surface-container hover:bg-secondary/15 text-[11px] font-bold text-primary border border-outline-variant/30 text-center transition-all cursor-pointer"
                >
                  தமிழ் மாதிரி
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSampleSpeech('hi')}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-surface-container hover:bg-secondary/15 text-[11px] font-bold text-primary border border-outline-variant/30 text-center transition-all cursor-pointer"
                >
                  हिन्दी नमूना
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSampleSpeech('en')}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-surface-container hover:bg-secondary/15 text-[11px] font-bold text-primary border border-outline-variant/30 text-center transition-all cursor-pointer"
                >
                  English Sample
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-[50px] px-5 rounded-2xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              id="btn-step2-next"
              type="button"
              disabled={!hasRecordedAudio && !spokenText.trim()}
              onClick={() => setStep(3)}
              className="flex-1 min-h-[50px] py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Next: Review Transcription</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: TRANSCRIBE VOICE & DETECT LANGUAGE                                 */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Friendly reminder banner */}
          <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
              translate
            </span>
            <div className="text-xs text-on-surface leading-relaxed">
              <span className="font-bold text-primary">Speech to Text:</span>{' '}
              Speech recognition can sometimes miss accents or workshop noise. You can easily adjust any words below.
            </div>
          </div>

          {/* Transcription Card */}
          <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-3.5 shadow-xs">
            {/* Language Detection & Correction Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-primary">Detected Language:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs font-bold">
                  {SUPPORTED_LANGUAGES.find((l) => l.code === detectedLanguage)?.nameEn || 'English'}
                </span>
              </div>

              {/* Language Correction Trigger */}
              <button
                type="button"
                onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
                <span>Change Language</span>
              </button>
            </div>

            {/* Language Selector Dropdown / Pills (Multi-regional architecture) */}
            {showLanguagePicker && (
              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 space-y-2 animate-fadeIn">
                <div className="text-[11px] font-bold text-primary">
                  Select correct spoken language:
                </div>
                <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1 no-scrollbar">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguageCorrection(lang.code)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col ${
                        selectedLanguage === lang.code
                          ? 'bg-secondary/15 border-secondary text-primary font-bold shadow-xs'
                          : 'bg-surface-container border-outline-variant/20 text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="text-xs font-bold">{lang.nativeName}</span>
                      <span className="text-[10px] text-on-surface-variant">{lang.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Editable Transcription Text Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-on-surface">
                  Spoken Craft Description (Editable)
                </label>
                <span className="text-[11px] text-on-surface-variant">
                  {editableTranscription.length} characters
                </span>
              </div>
              <textarea
                id="textarea-transcription"
                rows={5}
                value={editableTranscription}
                onChange={(e) => {
                  setEditableTranscription(e.target.value);
                  setDetectedLanguage(detectLanguageFromText(e.target.value));
                }}
                placeholder="Your spoken words will appear here. You can also type or edit directly..."
                className="w-full p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium leading-relaxed resize-none shadow-inner"
              />
            </div>

            {/* Quick Actions: Re-record or Clear */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-secondary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">mic</span>
                <span>Speak Again / Retry Voice</span>
              </button>

              <button
                type="button"
                onClick={() => setEditableTranscription('')}
                className="text-xs text-on-surface-variant hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear text
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="min-h-[50px] px-5 rounded-2xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              id="btn-step3-structure-ai"
              type="button"
              onClick={handleProceedToAIStructuring}
              className="flex-1 min-h-[50px] py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Structure with AI</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: AI STRUCTURING (PROCESSING STATE)                                 */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 text-center space-y-6 animate-fadeIn my-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
            <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-secondary animate-pulse">
                auto_awesome
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-primary">
              AI is Structuring Your Craft
            </h2>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
              Transforming your natural spoken words into a verified marketplace listing.
            </p>
          </div>

          {/* Progressive Checklist */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 text-left space-y-2.5 max-w-xs mx-auto text-xs">
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="material-symbols-outlined text-secondary text-[16px]">
                {structuringPhase >= 1 ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span>Extracting product name, category & materials</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="material-symbols-outlined text-secondary text-[16px]">
                {structuringPhase >= 2 ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span>Detecting craft technique & dimensions</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="material-symbols-outlined text-secondary text-[16px]">
                {structuringPhase >= 3 ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span>Preserving cultural significance & features</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: PRODUCT PREVIEW & AI CATALOG GENERATION / MANUAL EDITING          */}
      {/* ========================================================================= */}
      {step === 5 && structuredProduct && (
        <div className="space-y-4 animate-fadeIn">
          {/* View Mode Switcher: AI Product Description vs Intelligent Pricing vs Raw Specs */}
          <div className="p-1 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center gap-1 shadow-xs">
            <button
              type="button"
              id="tab-ai-description-generator"
              onClick={() => setStep5View('ai-description')}
              className={`flex-1 py-2.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                step5View === 'ai-description'
                  ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-secondary">auto_awesome</span>
              <span className="hidden sm:inline">AI Description</span>
              <span className="sm:hidden">Description</span>
              <span className="px-1.5 py-0.5 rounded-md bg-secondary/15 text-secondary text-[10px] font-extrabold uppercase tracking-wide">
                8 Parts
              </span>
            </button>
            <button
              type="button"
              id="tab-intelligent-pricing"
              onClick={() => setStep5View('pricing-assistant')}
              className={`flex-1 py-2.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                step5View === 'pricing-assistant'
                  ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-emerald-600">price_change</span>
              <span>Fair Pricing</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wide">
                AI
              </span>
            </button>
            <button
              type="button"
              id="tab-specs-pricing"
              onClick={() => setStep5View('specifications')}
              className={`flex-1 py-2.5 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                step5View === 'specifications'
                  ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">tune</span>
              <span>Specs & Review</span>
            </button>
          </div>

          {step5View === 'ai-description' ? (
            <AIProductDescriptionGenerator
              initialTranscription={editableTranscription || spokenText}
              category={structuredProduct.category}
              materials={structuredProduct.materials}
              technique={structuredProduct.craftTechnique}
              dimensions={structuredProduct.dimensions}
              artisanStory={structuredProduct.culturalSignificance}
              artisanName={user?.name || 'Master Artisan'}
              artisanLocation={user?.location || 'Bhuj, Gujarat'}
              originalLanguage={selectedLanguage}
              images={images.length > 0 ? images : [SAMPLE_CRAFT_PHOTOS[0].url]}
              estimatedPrice={publishPrice}
              onPublish={handlePublishFromAIDescription}
              onCancel={() => setStep(3)}
            />
          ) : step5View === 'pricing-assistant' ? (
            <IntelligentPricingAssistant
              initialMaterialCost={Math.max(100, Math.round(publishPrice * 0.35))}
              initialLaborHours={
                structuredProduct.productionTime.toLowerCase().includes('day')
                  ? (parseInt(structuredProduct.productionTime, 10) || 2) * 8
                  : parseInt(structuredProduct.productionTime, 10) || 6
              }
              initialHourlyRate={150}
              initialPackagingCost={60}
              initialShippingCost={90}
              initialSelectedPrice={publishPrice}
              category={structuredProduct.category}
              craftType={structuredProduct.craftTechnique}
              productionTimeText={structuredProduct.productionTime}
              giCertified={true}
              language={selectedLanguage === 'ta' || selectedLanguage === 'hi' ? selectedLanguage : 'en'}
              onSavePrice={(finalPrice) => {
                setPublishPrice(finalPrice);
                onShowToast(
                  selectedLanguage === 'ta'
                    ? `விலை ₹${finalPrice} ஆக நிர்ணயிக்கப்பட்டது!`
                    : selectedLanguage === 'hi'
                    ? `विक्रय मूल्य ₹${finalPrice} सुरक्षित किया गया!`
                    : `Artisan price set to ₹${finalPrice}!`
                );
                setStep5View('specifications');
              }}
              onClose={() => setStep5View('specifications')}
              isInline={true}
            />
          ) : (
            <>
              {/* Top Banner */}
          <div className="p-3.5 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                verified
              </span>
              <div className="text-xs font-bold text-primary">
                AI Extracted Listing • Ready for Review
              </div>
            </div>
            <span className="text-[11px] text-on-surface-variant">Tap any field to edit</span>
          </div>

          {/* Product Preview Card */}
          <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-sm">
            {/* Main Photo Gallery Strip */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/5">
              <img
                src={images[primaryImageIndex] || images[0]}
                alt={structuredProduct.productName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                {structuredProduct.category}
              </div>
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-secondary text-on-secondary text-xs font-bold shadow-md">
                ₹{publishPrice.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrimaryImageIndex(i)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      i === primaryImageIndex ? 'border-secondary shadow-xs scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* 1. PRODUCT NAME */}
            <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-0.5">
                  1. Product Name
                </span>
                <div className="text-sm font-bold text-primary leading-tight">
                  {structuredProduct.productName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingField('productName')}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary/15 text-secondary cursor-pointer"
                title="Edit Product Name"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
              </button>
            </div>

            {/* 2. CATEGORY */}
            <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-0.5">
                  2. Category
                </span>
                <div className="text-xs font-bold text-primary">
                  {structuredProduct.category}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingField('category')}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary/15 text-secondary cursor-pointer"
                title="Edit Category"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
              </button>
            </div>

            {/* 3. MATERIALS */}
            <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-0.5">
                  3. Materials
                </span>
                <div className="text-xs font-semibold text-primary">
                  {structuredProduct.materials}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingField('materials')}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary/15 text-secondary cursor-pointer"
                title="Edit Materials"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
              </button>
            </div>

            {/* 4. CRAFT TECHNIQUE */}
            <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-0.5">
                  4. Craft Technique
                </span>
                <div className="text-xs font-semibold text-primary">
                  {structuredProduct.craftTechnique}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingField('craftTechnique')}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary/15 text-secondary cursor-pointer"
                title="Edit Technique"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
              </button>
            </div>

            {/* 5. DIMENSIONS & 6. PRODUCTION TIME */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-1">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-0.5">
                    5. Dimensions
                  </span>
                  <div className="text-xs font-semibold text-primary truncate">
                    {structuredProduct.dimensions}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingField('dimensions')}
                  className="p-1 rounded-lg bg-surface-container hover:bg-secondary/15 text-secondary cursor-pointer"
                  title="Edit Dimensions"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-1">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-0.5">
                    6. Production Time
                  </span>
                  <div className="text-xs font-semibold text-primary truncate">
                    {structuredProduct.productionTime}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingField('productionTime')}
                  className="p-1 rounded-lg bg-surface-container hover:bg-secondary/15 text-secondary cursor-pointer"
                  title="Edit Time"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
              </div>
            </div>

            {/* 7. CULTURAL SIGNIFICANCE */}
            <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-0.5">
                  7. Cultural Significance
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {structuredProduct.culturalSignificance}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingField('culturalSignificance')}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary/15 text-secondary cursor-pointer"
                title="Edit Cultural Significance"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
              </button>
            </div>

            {/* 8. UNIQUE FEATURES */}
            <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-1">
                  8. Unique Features
                </span>
                <ul className="space-y-1">
                  {structuredProduct.uniqueFeatures.map((feat, idx) => (
                    <li key={idx} className="text-xs text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[14px]">
                        check
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingField('uniqueFeatures')}
                className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary/15 text-secondary cursor-pointer"
                title="Edit Unique Features"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
              </button>
            </div>

            {/* PRICE & STOCK CONFIGURATION */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <span>Direct Artisan Price</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-700 text-[9px] font-extrabold uppercase">
                      Fair Trade
                    </span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant">Your net earnings per item</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-secondary">₹</span>
                  <input
                    type="number"
                    value={publishPrice}
                    onChange={(e) => setPublishPrice(Math.max(100, Number(e.target.value)))}
                    className="w-24 p-1.5 text-right font-bold text-sm bg-surface-container rounded-xl border border-outline-variant/30 text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
              </div>

              {/* Quick Jump to Intelligent Pricing Assistant */}
              <button
                type="button"
                id="btn-open-pricing-assistant"
                onClick={() => setStep5View('pricing-assistant')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[17px] text-emerald-700">price_change</span>
                <span>Open Intelligent Pricing Assistant (Breakdown & Suggestions)</span>
              </button>

              <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                <div>
                  <div className="text-xs font-bold text-primary">Initial Stock Quantity</div>
                  <div className="text-[10px] text-on-surface-variant">Units ready to pack</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStockCount((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-primary min-w-[20px] text-center">
                    {stockCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStockCount((prev) => prev + 1)}
                    className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FALLBACK EDITING MODAL / DRAWER */}
          {isEditingField && editFormData && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fadeIn">
              <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-primary">
                    Edit {isEditingField.replace(/([A-Z])/g, ' $1')}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingField(null)}
                    className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div>
                  {isEditingField === 'uniqueFeatures' ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface">
                        Features (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={editFormData.uniqueFeatures.join('\n')}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            uniqueFeatures: e.target.value.split('\n').filter((f) => f.trim())
                          })
                        }
                        className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface resize-none font-medium"
                      />
                    </div>
                  ) : isEditingField === 'culturalSignificance' ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface">
                        Cultural Significance & Story
                      </label>
                      <textarea
                        rows={4}
                        value={editFormData.culturalSignificance}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            culturalSignificance: e.target.value
                          })
                        }
                        className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface resize-none font-medium"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface">
                        {isEditingField}
                      </label>
                      <input
                        type="text"
                        value={(editFormData as any)[isEditingField] || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            [isEditingField]: e.target.value
                          })
                        }
                        className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface font-medium"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingField(null)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFieldEdit}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs"
                  >
                    Save Field
                  </button>
                </div>
              </div>
            </div>
          )}

              {/* Action Buttons: Publish or Back */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="min-h-[50px] px-5 rounded-2xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  id="btn-publish-product-listing"
                  type="button"
                  onClick={handlePublishListing}
                  className="flex-1 min-h-[50px] py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  <span>{isOnline ? 'Publish Product Listing' : 'Save & Queue for Cloud Sync'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Saved Drafts Modal */}
      {showDraftsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">draft</span>
                <div>
                  <h3 className="font-bold text-sm text-primary">Saved Product Drafts</h3>
                  <p className="text-[10px] text-on-surface-variant">Stored safely on this device</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDraftsModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {savedDrafts.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant text-xs space-y-2">
                  <span className="material-symbols-outlined text-[32px] text-outline-variant">edit_note</span>
                  <p>No saved drafts found on this device.</p>
                </div>
              ) : (
                savedDrafts.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40 transition-all flex items-center justify-between gap-3 shadow-xs"
                  >
                    {d.images?.[0] && (
                      <img
                        src={d.images[0]}
                        alt={d.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-outline-variant/20"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-primary truncate">{d.title}</h4>
                      <div className="text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-secondary">₹{d.price}</span>
                        <span>•</span>
                        <span>{d.category}</span>
                      </div>
                      {d.audioMetadata && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-700 font-semibold mt-0.5">
                          <span className="material-symbols-outlined text-[10px]">mic</span>
                          Voice metadata saved ({d.audioMetadata.durationSeconds}s)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleResumeDraft(d)}
                        className="px-2.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                      >
                        Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          offlineSyncService.deleteOfflineDraft(d.id);
                          setSavedDrafts(offlineSyncService.getOfflineDrafts());
                          onShowToast('Draft deleted.');
                        }}
                        className="p-1.5 text-on-surface-variant hover:text-rose-600 rounded-lg hover:bg-surface-container cursor-pointer"
                        title="Delete draft"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDraftsModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
