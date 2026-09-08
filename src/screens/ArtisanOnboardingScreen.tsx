import React, { useState, useEffect, useRef } from 'react';
import { Language, ScreenType, User } from '../types';
import {
  completeArtisanOnboarding,
  saveArtisanOnboardingDraft,
  getArtisanOnboardingDraft,
  clearArtisanOnboardingDraft
} from '../services/authService';
import { RAMDEV_PORTRAIT } from '../data/mockData';

interface ArtisanOnboardingScreenProps {
  user: User | null;
  onComplete: (updatedUser: User) => void;
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (msg: string) => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
}

// 10 Mandatory Craft Categories
const CRAFT_CATEGORIES = [
  { id: 'Handloom', labelEn: 'Handloom', labelHi: 'हथकरघा (Handloom)', labelTa: 'கைத்தறி (Handloom)', icon: 'texture' },
  { id: 'Pottery', labelEn: 'Pottery', labelHi: 'मिट्टी के बर्तन (Pottery)', labelTa: 'மண்பாண்டம் (Pottery)', icon: 'potted_plant' },
  { id: 'Woodwork', labelEn: 'Woodwork', labelHi: 'काष्ठ कला (Woodwork)', labelTa: 'மர வேலைப்பாடு (Woodwork)', icon: 'carpenter' },
  { id: 'Jewelry', labelEn: 'Jewelry', labelHi: 'पारंपरिक आभूषण (Jewelry)', labelTa: 'பாரம்பரிய நகைகள் (Jewelry)', icon: 'diamond' },
  { id: 'Textiles', labelEn: 'Textiles', labelHi: 'वस्त्र एवं छपाई (Textiles)', labelTa: 'துணிநூல் கலை (Textiles)', icon: 'checkroom' },
  { id: 'Painting', labelEn: 'Painting', labelHi: 'पारंपरिक चित्रकला (Painting)', labelTa: 'பாரம்பரிய ஓவியம் (Painting)', icon: 'palette' },
  { id: 'Bamboo craft', labelEn: 'Bamboo craft', labelHi: 'बांस एवं बेंत शिल्प (Bamboo)', labelTa: 'மூங்கில் கைவினை (Bamboo)', icon: 'yard' },
  { id: 'Leather craft', labelEn: 'Leather craft', labelHi: 'चर्म शिल्प (Leather)', labelTa: 'தோல் கைவினை (Leather)', icon: 'work' },
  { id: 'Handicrafts', labelEn: 'Handicrafts', labelHi: 'हस्तशिल्प (Handicrafts)', labelTa: 'கைவினைப் பொருட்கள் (Handicrafts)', icon: 'handyman' },
  { id: 'Other', labelEn: 'Other', labelHi: 'अन्य शिल्प (Other)', labelTa: 'பிற கைவினை (Other)', icon: 'category' }
];

// Curated avatar options for instant 1-tap photo selection
const AVATAR_PRESETS = [
  { label: 'Master Potter', url: RAMDEV_PORTRAIT },
  { label: 'Silk Weaver', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Metal Sculptor', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Heritage Painter', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Wood Carver', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' }
];

// Experience Level Presets
const EXPERIENCE_PRESETS = [
  { id: '1-3 years', label: '1–3 Years', sub: 'Emerging Artisan' },
  { id: '4-10 years', label: '4–10 Years', sub: 'Skilled Craftsman' },
  { id: '10-20 years', label: '10–20 Years', sub: 'Master Artisan' },
  { id: '20+ years (Lineage Heritage)', label: '20+ Years', sub: 'Family Lineage' }
];

// Popular Indian craft clusters for 1-tap location setting
const LOCATION_CHIPS = [
  'Bhuj, Gujarat',
  'Varanasi, Uttar Pradesh',
  'Jaipur, Rajasthan',
  'Madurai, Tamil Nadu',
  'Bastar, Chhattisgarh',
  'Kanchipuram, Tamil Nadu',
  'Raghurajpur, Odisha',
  'Srinagar, Kashmir'
];

// Quick suggestions for craft types based on category
const CRAFT_SUGGESTIONS: Record<string, string[]> = {
  Handloom: ['Kanchipuram Mulberry Silk', 'Chanderi Zari Weave', 'Khadi Cotton Fabric', 'Sambalpuri Ikat'],
  Pottery: ['Terracotta Indus Water Pitcher', 'Jaipur Quartz Blue Pottery', 'Nizamabad Black Pottery', 'Khurja Ceramic Planter'],
  Woodwork: ['Saharanpur Carved Sheesham', 'Kashmir Walnut Carving', 'Channapatna Lacquer Toys', 'Sandalwood Carved Box'],
  Jewelry: ['Kundan Jadau Filigree', 'Meenakari Enamel Silver', 'Terracotta Hand-Painted Beads', 'Dokra Bell Metal Tribal'],
  Textiles: ['Ajrakh Block Print Modal', 'Kutch Bandhani Silk Dupatta', 'Bagh Hand Block Cotton', 'Kalamkari Hand-Drawn Yardage'],
  Painting: ['Madhubani Mithila Art', 'Pattachitra Scroll Painting', 'Warli Tribal Canvas', 'Tanjore Gold Foil Artwork'],
  'Bamboo craft': ['Assam Cane Bamboo Baskets', 'Tripura Bamboo Lampshade', 'Woven Bamboo Fruit Trays'],
  'Leather craft': ['Kolhapuri Hand-Braided Sandals', 'Shantiniketan Embossed Leather', 'Natural Tanned Journal'],
  Handicrafts: ['Dhokra Lost-Wax Bell Metal', 'Bidriware Silver Inlay', 'Marble Inlay Pietra Dura', 'Brass Temple Bell'],
  Other: ['Handmade Natural Clay Items', 'Upcycled Heritage Art', 'Traditional Fibre Craft']
};

// Traditional Technique Presets
const TECHNIQUE_PRESETS: Record<string, string[]> = {
  Handloom: ['Throw-shuttle pit loom weaving', 'Hand-spun charkha yarn', 'Jacquard border technique', 'Natural vegetable dyeing'],
  Pottery: ['Hand wheel throwing and sun drying', 'Sawdust underground kiln reduction', 'Natural mineral slip burnishing'],
  Woodwork: ['Hand chisel relief carving', 'Natural vegetable oil finishing', 'Channapatna natural vegetable lac turning'],
  Jewelry: ['Lost-wax bell metal casting', 'Pachchikam glass inlay work', 'Hand-hammered silver sheet filigree'],
  Textiles: ['Carved teakwood block stamping', 'Resist tie-and-dye mud resist', 'Kalam bamboo pen drawing with iron mordant'],
  Painting: ['Natural rock and mineral pigments', 'Squirrel hair brush detailing', 'Canvas treated with cowdung & rice paste'],
  'Bamboo craft': ['Hand-split bamboo weaving', 'Smoked bamboo curing and plaiting', 'Natural resin weatherproofing'],
  'Leather craft': ['Vegetable tanning with babool bark', 'Hand punching and thread braiding', 'Embossed motif stamping'],
  Handicrafts: ['Lost-wax clay core casting', 'Zinc-copper alloy oxidation & silver inlay', 'Hand-beaten repoussé'],
  Other: ['Ancestral manual handcraft technique', 'Locally harvested natural ingredients', 'Zero-chemical processing']
};

export const ArtisanOnboardingScreen: React.FC<ArtisanOnboardingScreenProps> = ({
  user,
  onComplete,
  onNavigate,
  onShowToast,
  language,
  onLanguageChange
}) => {
  // Current active step (1 to 5)
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [lastSavedDraftTime, setLastSavedDraftTime] = useState<string | null>(null);

  // File input ref for custom avatar
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STEP 1: Personal Information
  const [avatar, setAvatar] = useState<string>(user?.avatar || RAMDEV_PORTRAIT);
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [preferredLang, setPreferredLang] = useState<Language>(user?.preferredLanguage || language || 'en');

  // STEP 2: Craft Information
  const [craftSpecialization, setCraftSpecialization] = useState<string>(
    user?.craftSpecialization || 'Handcrafted Terracotta Clay Pitcher'
  );
  const [craftCategory, setCraftCategory] = useState<string>(user?.craftCategory || 'Pottery');
  const [yearsOfExperience, setYearsOfExperience] = useState<string>(
    user?.yearsOfExperience || '10-20 years'
  );
  const [location, setLocation] = useState<string>(user?.location || 'Bhuj, Gujarat');
  const [specialtyTechnique, setSpecialtyTechnique] = useState<string>(
    user?.specialtyTechnique || 'Hand wheel throwing and sawdust underground kiln reduction'
  );

  // STEP 3: Artisan Story
  const [heritageStory, setHeritageStory] = useState<string>(
    user?.bio ||
      'I learned this craft from my grandparents by the Rann of Kutch. We gather natural clay from dried riverbeds, shape every piece slowly on the manual wheel, and fire them with rice husks. Every piece breathes cooling air into water naturally without electricity.'
  );
  const [isRecordingStory, setIsRecordingStory] = useState<boolean>(false);
  const [storyRecorded, setStoryRecorded] = useState<boolean>(false);
  const [recordedSeconds, setRecordedSeconds] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // STEP 4: Business Information
  const [madeToOrder, setMadeToOrder] = useState<boolean>(user?.madeToOrder ?? true);
  const [bulkOrdersAccepted, setBulkOrdersAccepted] = useState<boolean>(user?.bulkOrdersAccepted ?? true);
  const [minBulkQuantity, setMinBulkQuantity] = useState<number>(user?.minBulkQuantity || 25);
  const [productionTime, setProductionTime] = useState<string>(user?.productionTime || '1-2 Weeks');

  // General Speech recognition for text inputs
  const [activeDictatingField, setActiveDictatingField] = useState<string | null>(null);

  // Load draft on mount
  useEffect(() => {
    if (user?.id) {
      const draft = getArtisanOnboardingDraft(user.id);
      if (draft) {
        if (draft.fullName) setFullName(draft.fullName);
        if (draft.avatar) setAvatar(draft.avatar);
        if (draft.phone) setPhone(draft.phone);
        if (draft.preferredLanguage) setPreferredLang(draft.preferredLanguage);
        if (draft.craftSpecialization) setCraftSpecialization(draft.craftSpecialization);
        if (draft.craftCategory) setCraftCategory(draft.craftCategory);
        if (draft.yearsOfExperience) setYearsOfExperience(draft.yearsOfExperience);
        if (draft.location) setLocation(draft.location);
        if (draft.specialtyTechnique) setSpecialtyTechnique(draft.specialtyTechnique);
        if (draft.heritageStory) setHeritageStory(draft.heritageStory);
        if (draft.madeToOrder !== undefined) setMadeToOrder(draft.madeToOrder);
        if (draft.bulkOrdersAccepted !== undefined) setBulkOrdersAccepted(draft.bulkOrdersAccepted);
        if (draft.minBulkQuantity) setMinBulkQuantity(draft.minBulkQuantity);
        if (draft.productionTime) setProductionTime(draft.productionTime);
        if (draft.savedAt) {
          try {
            const date = new Date(draft.savedAt);
            setLastSavedDraftTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          } catch {}
        }
      }
    }
  }, [user?.id]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  // Save Draft Handler
  const handleSaveDraft = () => {
    if (!user?.id) return;
    const draftData = {
      fullName,
      avatar,
      phone,
      preferredLanguage: preferredLang,
      craftSpecialization,
      craftCategory,
      yearsOfExperience,
      location,
      specialtyTechnique,
      heritageStory,
      madeToOrder,
      bulkOrdersAccepted,
      minBulkQuantity,
      productionTime
    };
    saveArtisanOnboardingDraft(user.id, draftData);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedDraftTime(timeStr);
    onShowToast(
      language === 'ta'
        ? `வரைவு வெற்றிகரமாகச் சேமிக்கப்பட்டது (${timeStr})`
        : language === 'hi'
        ? `प्रगति सहेज ली गई है (${timeStr})`
        : `Draft saved successfully at ${timeStr}`
    );
  };

  // Avatar Upload Handlers
  const handleTriggerAvatarUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setAvatar(url);
        onShowToast(
          language === 'ta' ? 'சுயவிவரப் படம் புதுப்பிக்கப்பட்டது!' : language === 'hi' ? 'तस्वीर अपडेट की गई!' : 'Profile photo updated!'
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Language Change in Step 1
  const handleLanguageSelect = (lang: Language) => {
    setPreferredLang(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    onShowToast(
      lang === 'ta'
        ? 'மொழி தமிழுக்கு மாற்றப்பட்டது'
        : lang === 'hi'
        ? 'भाषा हिंदी में बदली गई'
        : 'Language set to English'
    );
  };

  // Voice recording for Story in Step 3
  const handleToggleStoryRecording = () => {
    if (isRecordingStory) {
      // Stop recording
      setIsRecordingStory(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setStoryRecorded(true);
      onShowToast(
        language === 'ta'
          ? 'குரல் கதை பதிவு செய்யப்பட்டது! வாங்குபவர்கள் கேட்கலாம்.'
          : language === 'hi'
          ? 'आवाज की कहानी रिकॉर्ड हो गई! खरीदार इसे सुन सकेंगे।'
          : 'Voice story recorded! Buyers will be able to hear your voice.'
      );
    } else {
      // Start recording
      setIsRecordingStory(true);
      setStoryRecorded(false);
      setRecordedSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordedSeconds((prev) => prev + 1);
      }, 1000);

      // Web Speech recognition for voice-to-text
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = preferredLang === 'ta' ? 'ta-IN' : preferredLang === 'hi' ? 'hi-IN' : 'en-IN';
          rec.onresult = (event: any) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
              transcript += event.results[i][0].transcript;
            }
            if (transcript.trim()) {
              setHeritageStory(transcript);
            }
          };
          rec.start();
        } catch {
          // If browser mic is blocked, timer fallback remains visible
        }
      }
    }
  };

  // Simulated Voice playback
  const handleTogglePlayAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, (recordedSeconds || 12) * 1000);
    }
  };

  // Speech-to-text helper for input fields (Craft name, Location, Technique)
  const handleFieldVoiceInput = (fieldName: 'craft' | 'location' | 'technique') => {
    setActiveDictatingField(fieldName);
    onShowToast(
      language === 'ta'
        ? 'பேசத் தொடங்குங்கள்...'
        : language === 'hi'
        ? 'कृपया बोलें...'
        : 'Listening... Speak naturally'
    );

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = preferredLang === 'ta' ? 'ta-IN' : preferredLang === 'hi' ? 'hi-IN' : 'en-IN';
        rec.onresult = (e: any) => {
          const text = e.results[0][0].transcript;
          if (text) {
            if (fieldName === 'craft') setCraftSpecialization(text);
            if (fieldName === 'location') setLocation(text);
            if (fieldName === 'technique') setSpecialtyTechnique(text);
          }
          setActiveDictatingField(null);
        };
        rec.onerror = () => setActiveDictatingField(null);
        rec.onend = () => setActiveDictatingField(null);
        rec.start();
        return;
      } catch {}
    }

    // Fallback simulation if no browser API
    setTimeout(() => {
      setActiveDictatingField(null);
      if (fieldName === 'craft' && !craftSpecialization) setCraftSpecialization('Handmade Terracotta Pottery');
      if (fieldName === 'location' && !location) setLocation('Bhuj, Gujarat');
      if (fieldName === 'technique' && !specialtyTechnique) setSpecialtyTechnique('Natural wood reduction kiln firing');
    }, 1500);
  };

  // Validation before advancing steps
  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName.trim()) {
        onShowToast(language === 'ta' ? 'முழுப் பெயரை உள்ளிடவும்' : language === 'hi' ? 'कृपया अपना पूरा नाम लिखें' : 'Please enter your full name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!craftSpecialization.trim()) {
        onShowToast(language === 'ta' ? 'கைவினை வகையை உள்ளிடவும்' : language === 'hi' ? 'कृपया अपने शिल्प का नाम लिखें' : 'Please enter your craft name');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  // Final Step 5 Submission
  const handleFinishOnboarding = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const updated = await completeArtisanOnboarding(user.id, {
        fullName: fullName.trim() || user.name,
        avatar,
        phone: phone.trim() || user.phone,
        preferredLanguage: preferredLang,
        craftSpecialization: craftSpecialization.trim(),
        craftCategory,
        yearsOfExperience,
        location: location.trim(),
        specialtyTechnique: specialtyTechnique.trim(),
        guildName: `${craftCategory} Artisans Guild • ${location.split(',')[0] || 'India'}`,
        heritageStory: heritageStory.trim(),
        storyAudioUrl: storyRecorded ? 'recorded_audio_profile.wav' : undefined,
        storyVoiceDuration: storyRecorded ? `${recordedSeconds || 18}s` : undefined,
        madeToOrder,
        bulkOrdersAccepted,
        minBulkQuantity,
        productionTime,
        giCertified: true
      });

      // Show completion screen
      setIsCompleted(true);
      onShowToast(
        language === 'ta'
          ? 'உங்கள் டிஜிட்டல் கடை வெற்றிகரமாக உருவாக்கப்பட்டது!'
          : language === 'hi'
          ? 'आपकी डिजिटल दुकान तैयार है!'
          : 'Your digital shop is ready!'
      );
    } catch {
      onShowToast('Could not save profile. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  // Handler for primary CTA: "Create My First Product"
  const handleCreateFirstProduct = () => {
    if (user) {
      const updatedUser: User = {
        ...user,
        name: fullName || user.name,
        avatar,
        phone,
        preferredLanguage: preferredLang,
        craftSpecialization,
        craftCategory,
        yearsOfExperience,
        location,
        specialtyTechnique,
        bio: heritageStory,
        madeToOrder,
        bulkOrdersAccepted,
        minBulkQuantity,
        productionTime,
        hasCompletedOnboarding: true,
        isNewUser: false
      };
      onComplete(updatedUser);
    }
    // Route to voice cataloging / product creation studio
    onNavigate('voice-cataloging');
  };

  // Handler to go to Studio directly
  const handleGoToStudio = () => {
    if (user) {
      const updatedUser: User = {
        ...user,
        name: fullName || user.name,
        avatar,
        phone,
        preferredLanguage: preferredLang,
        craftSpecialization,
        craftCategory,
        yearsOfExperience,
        location,
        specialtyTechnique,
        bio: heritageStory,
        madeToOrder,
        bulkOrdersAccepted,
        minBulkQuantity,
        productionTime,
        hasCompletedOnboarding: true,
        isNewUser: false
      };
      onComplete(updatedUser);
    }
    onNavigate('studio');
  };

  // =========================================================================
  // CELEBRATORY SUCCESS VIEW: "Your digital shop is ready!"
  // =========================================================================
  if (isCompleted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 max-w-md mx-auto w-full animate-fadeIn">
        <div className="w-full p-6 rounded-3xl bg-surface-container-lowest border border-secondary/30 shadow-xl text-center relative overflow-hidden space-y-5">
          {/* Decorative Sparkle Highlights */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-primary/10 rounded-full blur-xl pointer-events-none" />

          {/* Success Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-tr from-secondary/20 to-primary/20 text-secondary border-2 border-secondary/40 shadow-md mx-auto">
            <span className="material-symbols-outlined text-[42px]">storefront</span>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Shop Active • KalaConnect Direct</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Your digital shop is ready!
            </h1>
            <p className="text-sm text-on-surface-variant mt-2 max-w-xs mx-auto leading-relaxed">
              Welcome, <span className="font-bold text-primary">{fullName || 'Master Artisan'}</span>! Your master craft story and verified shop profile are live.
            </p>
          </div>

          {/* Mini Shop ID Card */}
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-left space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt={fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary/40 shadow-xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-primary truncate">{fullName}</div>
                <div className="text-xs text-on-surface-variant flex items-center gap-1 truncate">
                  <span className="material-symbols-outlined text-[14px] text-secondary">handyman</span>
                  <span>{craftCategory} • {location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant">
              <span>Craft Specialty:</span>
              <span className="font-semibold text-primary truncate max-w-[170px]">{craftSpecialization}</span>
            </div>
          </div>

          {/* Primary CTA: "Create My First Product" */}
          <div className="space-y-2.5 pt-2">
            <button
              id="btn-onboarding-create-first-product"
              type="button"
              onClick={handleCreateFirstProduct}
              className="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">add_a_photo</span>
              <span>Create My First Product</span>
            </button>

            <button
              id="btn-onboarding-goto-studio"
              type="button"
              onClick={handleGoToStudio}
              className="w-full py-3.5 rounded-2xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
  // MULTI-STEP ONBOARDING WIZARD
  // =========================================================================
  const stepTitles = [
    { num: 1, name: 'Personal', subtitle: 'Profile Photo & Identity' },
    { num: 2, name: 'Craft', subtitle: 'Heritage & Category' },
    { num: 3, name: 'Story', subtitle: 'Voice or Written Bio' },
    { num: 4, name: 'Business', subtitle: 'Custom Orders & Bulk Terms' },
    { num: 5, name: 'Review', subtitle: 'Profile Preview & Launch' }
  ];

  return (
    <div className="flex-1 flex flex-col relative w-full pt-3 pb-24 px-3.5 sm:px-4 max-w-md mx-auto space-y-4 animate-fadeIn bg-surface">
      {/* Hidden file input for custom profile photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileChange}
        className="hidden"
      />

      {/* TOP HEADER & STEP TRACKER */}
      <div className="p-4 rounded-3xl bg-primary text-on-primary shadow-lg border border-secondary/30 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top actions bar: Back & Save Draft */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-secondary-fixed-dim text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Artisan Onboarding</span>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold transition-all cursor-pointer"
            title="Save Draft to continue later"
          >
            <span className="material-symbols-outlined text-[14px]">bookmark</span>
            <span>Save Draft</span>
          </button>
        </div>

        {/* Title and active step */}
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
            {stepTitles[step - 1].name} Details
          </h1>
          <span className="text-xs text-white/80 font-medium">
            Step {step} of 5
          </span>
        </div>
        <p className="text-xs text-white/75 mt-0.5">
          {stepTitles[step - 1].subtitle}
        </p>

        {/* 5-Step Progress Indicator Bar */}
        <div className="flex items-center gap-1.5 mt-3.5 pt-2.5 border-t border-white/15">
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

        {/* Draft timestamp if available */}
        {lastSavedDraftTime && (
          <div className="text-[10px] text-white/60 mt-1 text-right">
            Draft saved at {lastSavedDraftTime}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: PERSONAL INFORMATION */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Card: Photo & Basic Details */}
          <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-[20px] text-secondary">person</span>
              <span>Profile Photo & Identification</span>
            </div>

            {/* Profile Photo Selector */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Profile Photo <span className="text-secondary">*</span>
              </label>
              <div className="flex items-center gap-3.5">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt={fullName || 'Artisan'}
                    className="w-18 h-18 rounded-full object-cover ring-2 ring-secondary shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleTriggerAvatarUpload}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-primary-container cursor-pointer"
                    title="Upload photo from camera or files"
                  >
                    <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs text-on-surface-variant mb-1.5 leading-tight">
                    Upload your workshop photo or tap a crafted avatar:
                  </div>
                  {/* Preset Avatar Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(p.url)}
                        className={`w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          avatar === p.url ? 'border-secondary scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={p.label}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleTriggerAvatarUpload}
                      className="px-2.5 py-1.5 rounded-full bg-surface-container text-primary text-[11px] font-semibold border border-outline-variant/40 shrink-0 hover:bg-surface-container-high cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">upload</span>
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Full Name <span className="text-secondary">*</span>
              </label>
              <input
                id="input-artisan-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramdev Kumbhar"
                className="w-full min-h-[48px] px-3.5 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Phone Number (WhatsApp & Direct Orders) <span className="text-secondary">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-on-surface-variant">
                  +91
                </span>
                <input
                  id="input-artisan-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  className="w-full min-h-[48px] pl-12 pr-3.5 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
                />
              </div>
            </div>

            {/* Preferred Language Selection */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Preferred App Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'en' as Language, title: 'English', native: 'English' },
                  { code: 'hi' as Language, title: 'Hindi', native: 'हिन्दी' },
                  { code: 'ta' as Language, title: 'Tamil', native: 'தமிழ்' }
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleLanguageSelect(l.code)}
                    className={`min-h-[48px] p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      preferredLang === l.code
                        ? 'bg-secondary/15 border-secondary text-primary font-bold shadow-xs'
                        : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="text-xs font-bold">{l.native}</span>
                    <span className="text-[10px] text-on-surface-variant">{l.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Action */}
          <div className="flex gap-2.5 pt-1">
            <button
              id="btn-step1-next"
              type="button"
              onClick={handleNextStep}
              className="flex-1 min-h-[50px] py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Craft Information</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: CRAFT INFORMATION */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-[20px] text-secondary">handyman</span>
              <span>Craft Heritage & Technique</span>
            </div>

            {/* Craft Category (10 Selectable Categories) */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Select Craft Category <span className="text-secondary">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                {CRAFT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCraftCategory(cat.id);
                      if (CRAFT_SUGGESTIONS[cat.id] && CRAFT_SUGGESTIONS[cat.id][0]) {
                        setCraftSpecialization(CRAFT_SUGGESTIONS[cat.id][0]);
                      }
                      if (TECHNIQUE_PRESETS[cat.id] && TECHNIQUE_PRESETS[cat.id][0]) {
                        setSpecialtyTechnique(TECHNIQUE_PRESETS[cat.id][0]);
                      }
                    }}
                    className={`min-h-[48px] p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      craftCategory === cat.id
                        ? 'bg-secondary/15 border-secondary text-primary font-bold shadow-xs'
                        : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-secondary shrink-0">
                      {cat.icon}
                    </span>
                    <span className="text-xs leading-tight font-medium truncate">
                      {preferredLang === 'ta' ? cat.labelTa : preferredLang === 'hi' ? cat.labelHi : cat.labelEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* What type of craft do you create? */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-on-surface">
                  What type of craft do you create? <span className="text-secondary">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleFieldVoiceInput('craft')}
                  className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                    activeDictatingField === 'craft' ? 'text-red-600 animate-pulse' : 'text-secondary hover:underline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">mic</span>
                  <span>{activeDictatingField === 'craft' ? 'Listening...' : 'Voice Speak'}</span>
                </button>
              </div>
              <input
                id="input-craft-specialization"
                type="text"
                value={craftSpecialization}
                onChange={(e) => setCraftSpecialization(e.target.value)}
                placeholder="e.g. Terracotta Water Vessels, Kanchipuram Silk"
                className="w-full min-h-[48px] px-3.5 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
              />
              {/* Preset suggestion chips */}
              {CRAFT_SUGGESTIONS[craftCategory] && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {CRAFT_SUGGESTIONS[craftCategory].map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCraftSpecialization(sug)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                        craftSpecialization === sug
                          ? 'bg-secondary text-on-secondary font-semibold'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Years of Experience
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EXPERIENCE_PRESETS.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setYearsOfExperience(exp.id)}
                    className={`min-h-[48px] p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      yearsOfExperience === exp.id
                        ? 'bg-secondary/15 border-secondary text-primary font-bold shadow-xs'
                        : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <div className="text-xs font-bold">{exp.label}</div>
                    <div className="text-[10px] text-on-surface-variant">{exp.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location (city/state only) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-on-surface">
                  Location (City & State only) <span className="text-secondary">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleFieldVoiceInput('location')}
                  className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                    activeDictatingField === 'location' ? 'text-red-600 animate-pulse' : 'text-secondary hover:underline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">mic</span>
                  <span>{activeDictatingField === 'location' ? 'Listening...' : 'Speak City'}</span>
                </button>
              </div>
              <input
                id="input-artisan-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bhuj, Gujarat"
                className="w-full min-h-[48px] px-3.5 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
              />
              {/* Quick craft cluster chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
                {LOCATION_CHIPS.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className={`text-[11px] px-2.5 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      location === loc
                        ? 'bg-secondary text-on-secondary font-semibold'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Traditional technique or specialty */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-on-surface">
                  Traditional Technique or Specialty
                </label>
                <button
                  type="button"
                  onClick={() => handleFieldVoiceInput('technique')}
                  className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                    activeDictatingField === 'technique' ? 'text-red-600 animate-pulse' : 'text-secondary hover:underline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">mic</span>
                  <span>{activeDictatingField === 'technique' ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>
              <input
                id="input-artisan-technique"
                type="text"
                value={specialtyTechnique}
                onChange={(e) => setSpecialtyTechnique(e.target.value)}
                placeholder="e.g. Natural vegetable dye, Lost-wax casting"
                className="w-full min-h-[48px] px-3.5 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 font-medium"
              />
              {/* Quick technique suggestions */}
              {TECHNIQUE_PRESETS[craftCategory] && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {TECHNIQUE_PRESETS[craftCategory].map((tech, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSpecialtyTechnique(tech)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl text-left transition-all cursor-pointer ${
                        specialtyTechnique === tech
                          ? 'bg-secondary text-on-secondary font-semibold'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
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
              onClick={handleNextStep}
              className="flex-1 min-h-[50px] py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Artisan Story</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: ARTISAN STORY */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Buyer Trust Banner */}
          <div className="p-3.5 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
              favorite
            </span>
            <div className="text-xs text-on-surface leading-relaxed">
              <span className="font-bold text-primary">Why buyers cherish your story:</span>{' '}
              Patrons on KalaConnect love knowing the human hands, village lineage, and natural materials behind each creation. Authentic stories build deep emotional trust and command fair, premium prices.
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  record_voice_over
                </span>
                <span>Tell Your Craft Journey</span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium">
                Voice OR Text
              </span>
            </div>

            {/* OPTION 1: Voice Recording */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">mic</span>
                    <span>Speak Your Story (Mother Tongue)</span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">
                    Speak naturally in Hindi, Tamil, or English.
                  </div>
                </div>

                <button
                  id="btn-artisan-voice-record"
                  type="button"
                  onClick={handleToggleStoryRecording}
                  className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isRecordingStory
                      ? 'bg-red-600 text-white animate-pulse'
                      : storyRecorded
                      ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                      : 'bg-secondary text-on-secondary hover:bg-secondary/90'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isRecordingStory ? 'stop' : storyRecorded ? 'refresh' : 'mic'}
                  </span>
                  <span>{isRecordingStory ? `Stop (${recordedSeconds}s)` : storyRecorded ? 'Re-Record' : 'Start Voice Recording'}</span>
                </button>
              </div>

              {/* Live Waveform Indicator if Recording */}
              {isRecordingStory && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                    <span className="text-xs font-bold text-red-700">Recording live audio...</span>
                  </div>
                  {/* Waveform bars */}
                  <div className="flex items-center gap-1">
                    {[16, 28, 12, 32, 20, 36, 14, 24].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-500 rounded-full animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recorded Audio Playback Bar if completed */}
              {storyRecorded && !isRecordingStory && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTogglePlayAudio}
                      className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isPlayingAudio ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div>
                      <div className="text-xs font-bold text-green-900">
                        {isPlayingAudio ? 'Playing audio clip...' : 'Voice story recorded'}
                      </div>
                      <div className="text-[10px] text-green-700">
                        {recordedSeconds || 18} seconds • Ready for buyers
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-green-800 bg-green-200/60 px-2 py-0.5 rounded-md">
                    ✓ Attached
                  </span>
                </div>
              )}
            </div>

            {/* Divider OR */}
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              <div className="flex-1 h-px bg-outline-variant/40" />
              <span>OR WRITE YOUR STORY</span>
              <div className="flex-1 h-px bg-outline-variant/40" />
            </div>

            {/* OPTION 2: Simple Text Input */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Story Text (Displayed on your shop & products)
              </label>
              <textarea
                id="textarea-heritage-story"
                rows={4}
                value={heritageStory}
                onChange={(e) => setHeritageStory(e.target.value)}
                placeholder="Share who taught you, what materials you source, and the pride in your work..."
                className="w-full p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 leading-relaxed font-normal"
              />
              <div className="flex items-center justify-between mt-1 text-[11px] text-on-surface-variant">
                <span>Prompts: Ancestral roots, natural ingredients, daily passion</span>
                <span>{heritageStory.length} characters</span>
              </div>
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
              id="btn-step3-next"
              type="button"
              onClick={handleNextStep}
              className="flex-1 min-h-[50px] py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Business Information</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: BUSINESS INFORMATION */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-[20px] text-secondary">store</span>
              <span>Order Terms & Fulfillment</span>
            </div>

            {/* Made to order available? */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Made to Order Available? <span className="text-secondary">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMadeToOrder(true)}
                  className={`min-h-[54px] p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    madeToOrder
                      ? 'bg-secondary/15 border-secondary text-primary font-bold shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <div className="text-xs font-bold">Yes, Made to Order</div>
                    <div className="text-[10px] text-on-surface-variant font-normal leading-tight">
                      Custom sizes, engravings & bespoke requests
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMadeToOrder(false)}
                  className={`min-h-[54px] p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    !madeToOrder
                      ? 'bg-secondary/15 border-secondary text-primary font-bold shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mt-0.5">
                    inventory
                  </span>
                  <div>
                    <div className="text-xs font-bold">Ready Stock Only</div>
                    <div className="text-[10px] text-on-surface-variant font-normal leading-tight">
                      Only sell already finished items
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bulk orders accepted? */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Bulk Orders Accepted? <span className="text-secondary">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setBulkOrdersAccepted(true)}
                  className={`min-h-[54px] p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    bulkOrdersAccepted
                      ? 'bg-secondary/15 border-secondary text-primary font-bold shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                    corporate_fare
                  </span>
                  <div>
                    <div className="text-xs font-bold">Yes, Accept Bulk</div>
                    <div className="text-[10px] text-on-surface-variant font-normal leading-tight">
                      B2B wholesale, corporate & export
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBulkOrdersAccepted(false)}
                  className={`min-h-[54px] p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    !bulkOrdersAccepted
                      ? 'bg-secondary/15 border-secondary text-primary font-bold shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mt-0.5">
                    block
                  </span>
                  <div>
                    <div className="text-xs font-bold">Single Piece Only</div>
                    <div className="text-[10px] text-on-surface-variant font-normal leading-tight">
                      Retail individual sales only
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Minimum bulk quantity (only if bulk is accepted) */}
            {bulkOrdersAccepted && (
              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2 animate-fadeIn">
                <label className="block text-xs font-bold text-on-surface">
                  Minimum Bulk Order Quantity (MOQ)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-outline-variant/40 rounded-xl overflow-hidden bg-surface-container-low">
                    <button
                      type="button"
                      onClick={() => setMinBulkQuantity((q) => Math.max(5, q - 5))}
                      className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-container cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="w-14 text-center text-sm font-bold text-primary">
                      {minBulkQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMinBulkQuantity((q) => q + 5)}
                      className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-container cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">units</span>

                  {/* Preset MOQ chips */}
                  <div className="flex gap-1.5 ml-auto">
                    {[10, 25, 50, 100].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setMinBulkQuantity(q)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          minBulkQuantity === q
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Typical Production Time */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Typical Production Time <span className="text-secondary">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '3-5 Days', sub: 'Fast craft turnaround' },
                  { id: '1-2 Weeks', sub: 'Standard handmade pace' },
                  { id: '2-4 Weeks', sub: 'Intricate detail handwork' },
                  { id: '1+ Month', sub: 'Masterpiece commission' }
                ].map((time) => (
                  <button
                    key={time.id}
                    type="button"
                    onClick={() => setProductionTime(time.id)}
                    className={`min-h-[48px] p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      productionTime === time.id
                        ? 'bg-secondary/15 border-secondary text-primary font-bold shadow-xs'
                        : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <div className="text-xs font-bold">{time.id}</div>
                    <div className="text-[10px] text-on-surface-variant">{time.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="min-h-[50px] px-5 rounded-2xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              id="btn-step4-next"
              type="button"
              onClick={handleNextStep}
              className="flex-1 min-h-[50px] py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Review & Preview</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: REVIEW PROFILE PREVIEW */}
      {/* ========================================================================= */}
      {step === 5 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Review Card Header */}
          <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  preview
                </span>
                <span>Profile Preview (As Seen by Buyers)</span>
              </div>
              <span className="text-[11px] font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">
                Step 5 of 5
              </span>
            </div>

            {/* ARTISAN SHOWCASE PREVIEW CARD */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3.5 shadow-sm">
              {/* Profile Header Row */}
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-secondary/40 shadow-xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-serif text-lg font-bold text-primary truncate leading-tight">
                      {fullName || 'Master Craftsman'}
                    </h2>
                    <span className="material-symbols-outlined text-secondary text-[18px]" title="Verified Artisan">
                      verified
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5 truncate">
                    {craftCategory} • {location}
                  </p>
                  <p className="text-[11px] text-secondary font-semibold">
                    {yearsOfExperience}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-2 rounded-xl text-secondary hover:bg-secondary/10 transition-all cursor-pointer"
                  title="Edit Personal Information"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>

              {/* Craft Heritage & Technique Box */}
              <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    Craft Lineage
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[10px] text-secondary font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs font-bold text-on-surface">
                  {craftSpecialization}
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  <span className="font-semibold text-primary">Technique:</span> {specialtyTechnique}
                </div>
              </div>

              {/* Artisan Story Box */}
              <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">menu_book</span>
                    <span>Artisan Story</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-[10px] text-secondary font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 italic">
                  "{heritageStory}"
                </p>

                {storyRecorded && (
                  <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20 text-xs text-secondary font-semibold">
                    <span className="material-symbols-outlined text-[16px]">volume_up</span>
                    <span>Voice introduction attached ({recordedSeconds || 18}s)</span>
                  </div>
                )}
              </div>

              {/* Business Terms Badges */}
              <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    Fulfillment Terms
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="text-[10px] text-secondary font-bold hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container font-semibold text-primary">
                    {madeToOrder ? '✓ Made-to-Order' : '• Ready Stock Only'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container font-semibold text-primary">
                    {bulkOrdersAccepted ? `✓ Bulk MOQ: ${minBulkQuantity} pcs` : '• Retail Only'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container font-semibold text-primary">
                    ⏱ Turnaround: {productionTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="min-h-[50px] px-5 rounded-2xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              id="btn-complete-onboarding"
              type="button"
              onClick={handleFinishOnboarding}
              disabled={loading}
              className="flex-1 min-h-[50px] py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Setting Up Your Shop...</span>
                </>
              ) : (
                <>
                  <span>Complete & Launch My Shop</span>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Skip option */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={() => {
            onShowToast(
              language === 'ta'
                ? 'அரங்கத்திற்குச் செல்கிறது. சுயவிவரத்தை எப்போது வேண்டுமானாலும் புதுப்பிக்கலாம்.'
                : language === 'hi'
                ? 'स्टूडियो में जा रहे हैं। आप इसे कभी भी अपडेट कर सकते हैं।'
                : 'Entering Studio. You can edit your artisan profile anytime.'
            );
            if (user) {
              onComplete({ ...user, hasCompletedOnboarding: true });
            }
            onNavigate('studio');
          }}
          className="text-xs text-on-surface-variant hover:text-primary underline cursor-pointer"
        >
          Skip and explore Studio first →
        </button>
      </div>
    </div>
  );
};
