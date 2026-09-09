/**
 * KalaConnect - Strict Single-Language Localization Service
 * Supported Languages: English (en), Tamil (ta), Hindi (hi)
 * 
 * Strict Single-Language Rule:
 * When a language is selected, EVERY UI element, notification, button,
 * instruction, and status message appears exclusively in that language.
 * No bilingual slashes or dual-language combinations.
 */

import { Language } from '../types';

export interface Translations {
  // Common & Branding
  brandName: string;
  tagline: string;
  back: string;
  cancel: string;
  continue: string;
  save: string;
  edit: string;
  delete: string;
  confirm: string;
  loading: string;
  giCertified: string;
  handmade: string;
  directRoyalty: string;
  zeroPlastic: string;
  rupeeSymbol: string;
  chooseLanguage: string;
  selectLanguageTitle: string;
  english: string;
  tamil: string;
  hindi: string;
  securePortal: string;
  toastCopied: string;

  // Welcome Screen
  welcomeHeroTag: string;
  welcomeHeroTitle: string;
  welcomeWhoAreYou: string;
  welcomeChooseExperience: string;
  welcomeChooseSubtitle: string;
  artisanRoleTitle: string;
  artisanRoleDesc: string;
  artisanBadge: string;
  artisanAction: string;
  buyerRoleTitle: string;
  buyerRoleDesc: string;
  buyerBadge: string;
  buyerAction: string;
  featureZeroCommission: string;
  featureZeroCommissionDesc: string;
  featureVoiceCataloging: string;
  featureVoiceCatalogingDesc: string;
  featureAuthenticGi: string;
  featureAuthenticGiDesc: string;

  // Authentication Screens
  artisanPortal: string;
  buyerPortal: string;
  loginTab: string;
  signupTab: string;
  emailOrPhone: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  location: string;
  craftSpecialization: string;
  artisanGuild: string;
  forgotPassword: string;
  resetPassword: string;
  resetInstructions: string;
  sendResetLink: string;
  quickDemoArtisan: string;
  quickDemoBuyer: string;
  testArtisanName: string;
  testArtisanRole: string;
  testBuyerName: string;
  testBuyerRole: string;
  loginAsArtisan: string;
  loginAsBuyer: string;
  registerAsArtisan: string;
  registerAsBuyer: string;
  switchToBuyer: string;
  switchToArtisan: string;
  backToRoles: string;
  enterEmailOrPhoneError: string;
  enterPasswordError: string;
  passwordMinError: string;
  fullNameError: string;
  emailError: string;
  phoneError: string;
  passwordMatchError: string;
  locationError: string;
  oneClickLogin: string;
  newArtisanSignup: string;
  newBuyerSignup: string;
  alreadyRegisteredLogin: string;
  ecoCrateDelivery: string;
  termsAccepted: string;

  // Navigation
  navDiscover: string;
  navArtisans: string;
  navStudio: string;
  navOrders: string;
  navProfile: string;
  navCart: string;
  screenMarketplaceHome: string;
  screenLivingHeritageGuilds: string;
  screenProductDetail: string;
  screenVoiceSmartStudio: string;
  screenVoiceCataloging: string;
  screenOrdersShipments: string;
  screenProfileAnalytics: string;

  // Studio / Artisan Dashboard
  masterArtisanVerified: string;
  takeHomePayout: string;
  activeShipments: string;
  patronViews: string;
  quickActions: string;
  addProduct: string;
  voiceCatalog: string;
  scanProduct: string;
  myEarnings: string;
  ecoPackaging: string;
  myCreations: string;
  viewAll: string;
  shareCraft: string;
  removeCraft: string;
  fairPriceAssistantTitle: string;
  fairPriceAssistantDesc: string;
  calculateFairPriceBtn: string;
  noProductsYet: string;
  addFirstProductHint: string;
  shipmentsCount: string;
  viewsCount: string;

  // New Guided Artisan Product Creation Flow
  step1Title: string;
  step1Subtitle: string;
  takePhoto: string;
  takePhotoDesc: string;
  chooseGallery: string;
  chooseGalleryDesc: string;

  step2Title: string;
  step2Subtitle: string;
  retakePhoto: string;
  continueBtn: string;
  preparingPhoto: string;
  originalPhoto: string;
  enhancedPhoto: string;
  useThisPhoto: string;
  photoReadyTitle: string;

  step3Title: string;
  step3Subtitle: string;
  tapToSpeak: string;
  listening: string;
  stopRecording: string;
  thingsYouCanTalkAbout: string;
  guideWhatIsProduct: string;
  guideMaterialsUsed: string;
  guideHowMade: string;
  guideTimeTaken: string;
  guideTraditionalTechnique: string;
  guideSpecialFeatures: string;
  guideCulturalStory: string;
  orTrySampleVoice: string;
  sampleVoicePrompt1: string;
  sampleVoicePrompt2: string;
  sampleVoicePrompt3: string;
  manualTextPrompt: string;
  typeStoryFallback: string;

  step4Understanding: string;
  step4IdentifyingMaterials: string;
  step4CreatingCatalog: string;
  step4ProcessingTitle: string;

  step5Title: string;
  step5Subtitle: string;
  productImageLabel: string;
  productNameLabel: string;
  categoryLabel: string;
  materialsUsedLabel: string;
  craftTypeLabel: string;
  descriptionLabel: string;
  howItsMadeLabel: string;
  storyBehindProductTitle: string;
  storyBehindProductSubtitle: string;
  specialFeaturesLabel: string;
  suggestedTagsLabel: string;
  translateForMarketplaceBtn: string;
  translateNotice: string;
  marketplaceTranslationsReady: string;

  step7EditTitle: string;
  editCatalogBtn: string;
  regenerateBtn: string;
  confirmAndPriceBtn: string;
  saveChangesBtn: string;

  step8Title: string;
  step8Subtitle: string;
  materialCostInputLabel: string;
  productionHoursInputLabel: string;
  suggestedPriceRange: string;
  recommendedPrice: string;
  yourDirectRoyalty: string;
  platformLogistics: string;
  pricingExplanationTitle: string;
  publishProductBtn: string;
  publishingProduct: string;
  publishSuccessTitle: string;
  publishSuccessSubtitle: string;
  viewInMarketplaceBtn: string;
  backToStudioBtn: string;

  // Discover & Marketplace
  searchPlaceholder: string;
  allCraftsCategory: string;
  potteryCategory: string;
  textilesCategory: string;
  metalCategory: string;
  woodCategory: string;
  paintingCategory: string;
  jewelryCategory: string;
  featuredGuildsTitle: string;
  livingHeritageTitle: string;
  verifiedArtisanBadge: string;
  addToCartBtn: string;
  buyNowBtn: string;
  viewDetailsBtn: string;
  exploreByRegion: string;
  namasteGreeting: string;
  verifiedPatron: string;

  // Product Detail
  provenanceTitle: string;
  artisanStoryTitle: string;
  masteryYears: string;
  craftTechnique: string;
  craftOrigin: string;
  capacityLabel: string;
  specificationsTitle: string;
  creationProcessTitle: string;
  patronReviewsTitle: string;
  directArtisanPact: string;
  directArtisanPactDesc: string;
  shareWithFriends: string;

  // Orders
  ordersTitle: string;
  ordersSubtitle: string;
  allOrdersTab: string;
  inProgressTab: string;
  deliveredTab: string;
  orderPlacedStatus: string;
  packingStatus: string;
  inTransitStatus: string;
  deliveredStatus: string;
  trackShipmentBtn: string;
  contactArtisanBtn: string;
  prepaidBadge: string;
  orderIdLabel: string;
  dispatchAddressLabel: string;
  noOrdersYet: string;

  // Profile
  profileTitle: string;
  userRoleLabel: string;
  artisanProfileBadge: string;
  buyerProfileBadge: string;
  preferredLanguageSetting: string;
  changeLanguagePrompt: string;
  helpSupport: string;
  directHelpline: string;
  shippingAddresses: string;
  paymentMethods: string;
  signOutBtn: string;
  wishlistLabel: string;

  // Cart
  cartTitle: string;
  cartEmpty: string;
  cartSubtotal: string;
  directRoyaltyNote: string;
  freeEcoDelivery: string;
  checkoutBtn: string;
  quantityLabel: string;
  itemRemoved: string;

  // Voice Assistant Modal
  voiceAssistantTitle: string;
  voiceAssistantSubtitle: string;
  voiceAssistantPrompt: string;
  trySaying: string;
  sampleCommand1: string;
  sampleCommand2: string;
  sampleCommand3: string;

  // Additional Comprehensive UI Keys
  narratedInNativeTongue: string;
  viewProfile: string;
  exploreCollection: string;
  howItsHandcrafted: string;
  sacredStages: string;
  craftHeritageAndHealing: string;
  masterCraftSpecs: string;
  patronExperiences: string;
  directArtisanRoyalty: string;
  directPill: string;
  toastAddedToBag: string;
  addToBag: string;
  instantCheckout: string;
  buyNow: string;
  estimatedDispatch: string;
  yearsLineage: string;
  govtAwardedMaster: string;
  specialty: string;
  playingAudioStory: string;
  hearArtisanStory: string;
  reviewsCount: string;
  backToMarketplace: string;

  artisan: string;
  totalEarnings: string;
  productsListed: string;
  wishlist: string;
  bankAccount: string;
  activeOrders: string;
  primaryDeliveryAddress: string;
  ecoPackagingNotice: string;
  selectLanguage: string;
  toastLanguageChanged: string;
  supportArtisanGuild: string;
  supportPatronConcierge: string;
  supportArtisanDescription: string;
  supportPatronDescription: string;
  switchToBuyerMarketplace: string;
  switchToArtisanStudio: string;
  logOut: string;

  voiceCatalogCraft: string;
  viewOrders: string;
  performanceEarnings: string;
  weekly: string;
  monthly: string;
  dispatched: string;
  productViews: string;
  aiInsights: string;
  smartAdvisor: string;
  voiceCatalogingTitle: string;
  voiceFirstCatalogHeading: string;
  voiceFirstCatalogSubheading: string;
  recentOrdersDispatch: string;
  trackOrder: string;
  myProductsManagement: string;
  liveInventory: string;
  inStock: string;
  viewDetails: string;

  orderManagement: string;
  artisanDispatchTitle: string;
  buyerOrdersTitle: string;
  artisanOrdersView: string;
  buyerOrdersView: string;
  allOrders: string;
  orderStatusNew: string;
  orderStatusAccepted: string;
  orderStatusPreparing: string;
  orderStatusReadyToShip: string;
  orderStatusShipped: string;
  orderStatusDelivered: string;
  noOrdersFound: string;
  tryResettingFilters: string;
  buyer: string;
  deliveryProgress: string;
  step: string;
  acceptOrder: string;
  declineOrder: string;
  advanceStatus: string;
  orderDeliveredSuccessfully: string;
  liveTrackingMap: string;
  chatWithMaker: string;

  curatedBag: string;
  directGISourced: string;
  directRoyaltyBreakdown: string;
  payoutToMaker: string;
  directRemittance: string;
  directRoyaltySubtext: string;
  totalPayable: string;
  taxShippingIncluded: string;
  securingRoyalty: string;
  proceedToPayment: string;
  cartEmptySubtext: string;

  listeningInNativeTongue: string;
  voiceQueryProcessed: string;
  liveSpeechInput: string;
  tapToSpeakSuggested: string;

  region: string;
  heritageDiscovery: string;
  exploreCraftGuilds: string;
  guildSubtext: string;
  allRegions: string;
  westZone: string;
  northZone: string;
  southZone: string;
  eastZone: string;
  verifiedGuilds: string;
  craftsCount: string;

  navMarketplace: string;
  navGuilds: string;
  artisanStudio: string;
  addedToWishlist: string;
  removedFromWishlist: string;

  deliveringTo: string;
  searchCraftsPlaceholder: string;
  filteringBy: string;
  category: string;
  clearAll: string;
  craftStoryOfDay: string;
  discoverCrafts: string;
  exploreMap: string;
  heritageCategories: string;
  authenticTechniques: string;
  resetFilters: string;
  directFromMasters: string;
  allMasters: string;
  viewCreations: string;
  curatedSelection: string;
  heritageMasterpieces: string;
  featured: string;
  recent: string;
  noCraftsFound: string;
  filterCrafts: string;
  filterByRegion: string;
  maxPrice: string;
  applyFilters: string;
  meetTheArtisan: string;

  // Additional Screen & Navigation Titles
  b2bPortal: string;
  adminTrustPortal: string;
  myProducts: string;
  productManagement: string;
  pitchDemo: string;
  b2b: string;
  notifications: string;
  viewCart: string;
  userProfile: string;
  navHome: string;
  navProducts: string;
  navCreateProduct: string;
  navExplore: string;

  // Marketplace & Discover
  directClusterSourced: string;
  welcomeUser: string;
  verifiedPatronBadge: string;
  curatedSelectionTag: string;
  authenticCraftsCatalog: string;
  craftsLabel: string;
  featuredMasterpieces: string;
  readyToShip: string;
  readyToDispatch: string;
  giCertifiedBadge: string;
  craftDisciplines: string;
  exploreByCraftCategory: string;
  viewAllBtn: string;
  livingHeritageStories: string;
  meetTheArtisansTitle: string;
  meetTheArtisansSubtitle: string;
  giCertifiedMaster: string;
  featuredHandcrafts: string;
  creationsLabel: string;
  viewCrafts: string;
  curatedMasterSeries: string;
  authenticCraftCollections: string;
  craftCollectionsSubtitle: string;
  directArtisanBulkSourcing: string;
  cooperativeDirect: string;
  lookingToSourceInBulk: string;
  bulkSourcingSubtitle: string;
  wholesaleTiers: string;
  wholesaleTiersSub: string;
  giProvenance: string;
  giProvenanceSub: string;
  customBranding: string;
  customBrandingSub: string;
  bulkOrderAvailable: string;
  wholesaleTierLabel: string;
  savePercentage: string;
  requestBulkQuote: string;
  quoteBtn: string;
  capacity: string;
  leadTime: string;

  // Hero Banner
  heroProvenanceTag: string;
  heroLivingHeritage: string;
  heroDirectMasters: string;
  heroTitle: string;
  heroSubtitle: string;
  heroHandcrafted: string;
  heroDirectRoyalties: string;
  heroEcoPackaged: string;
  heroExploreMasterpieces: string;
  heroMeetArtisans: string;

  // Search & Filters
  searchMarketplacePlaceholder: string;
  voiceSearch: string;
  filterOptions: string;
  filtersCleared: string;
  voiceSearchListening: string;

  // Offline & Status
  offlineLabel: string;
  syncingLabel: string;
  onlineLabel: string;
  offlineNotice: string;
  syncingNotice: string;
  syncedNotice: string;
  syncQueue: string;
  demoMode: string;
  simulateOffline: string;
  turnOnlineOn: string;
  savedLocally: string;
  waitingToSync: string;
  syncFailed: string;
  inQueue: string;

  // Product Details & Trust
  whyTrustTitle: string;
  whyTrustSubtitle: string;
  viewAudit: string;
  verified: string;
  inReview: string;
  trustProgramTitle: string;
  trustProgramDesc: string;
  authenticityAuditLog: string;
  artisanVerificationLevel: string;
  closeAudit: string;
  buyerPreviewMode: string;
  backToMyProducts: string;
  cleaningTab: string;
  seasoningTab: string;
  storageTab: string;
  aboutCreation: string;
  sendInquiryTo: string;
  masterCraftDetails: string;
  materialsLabel: string;
  craftTechniqueLabel: string;
  productionTimeLabel: string;
  dimensionsLabel: string;
  careInstructionsLabel: string;
  livingHeritage: string;
  aboutCraft: string;
  viewArtisanProfile: string;
  requestQuoteBulk: string;
  b2bWholesaleTitle: string;
  bulkAvailable: string;
  b2bWholesaleDesc: string;
  orderAvailability: string;
  moqLabel: string;
  productionCapacity: string;
  approxLeadTime: string;
  tieredWholesalePrice: string;
  cleaningCareTip: string;
  seasoningCareTip: string;
  storageCareTip: string;

  // Checkout & Forms
  contactInfo: string;
  deliveryAddress: string;
  streetAddress: string;
  landmarkOptional: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethodLabel: string;
  itemsInOrder: string;
  directlyToArtisan: string;
  payNow: string;
  secureGiCheckout: string;
  checkoutSubtitle: string;
  paymentArchitecture: string;
  demoSimulation: string;
  productionGateway: string;
  selectPaymentRail: string;
  payAndPlaceOrder: string;

  // Offline Sync & Demo
  offlineSyncQueue: string;
  syncNow: string;
  retryFailed: string;
  clearSynced: string;
  runDemoMode: string;
  allChangesSynced: string;
  offlineNoticeDetail: string;
  offlineDemoTitle: string;
  offlineDemoSubtitle: string;
  startInteractiveDemo: string;

  // Greetings & Studio
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  studioEncouraging: string;
  defaultGuildName: string;
  productRemovedToast: string;
  shopLinkCopiedToast: string;

  // Artisan Profile & Story
  artisanStory: string;
  bulkAndCustom: string;
  masterBiography: string;
  honoursAndAwards: string;
  bulkSourcingTitle: string;
  directFromCluster: string;
  addedToBagToast: string;

  // Welcome Screen
  welcomeHeroSubtitle: string;
  b2bCardSubtitle: string;
  adminCardSubtitle: string;

  // Auth Screen Roles
  roleArtisan: string;
  roleArtisanDesc: string;
  roleBuyer: string;
  roleBuyerDesc: string;
  roleB2B: string;
  roleB2BDesc: string;
  roleAdmin: string;
  roleAdminDesc: string;

  // Order Actions Toasts
  orderConfirmedToast: string;
  orderDeclinedToast: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  // ==========================================
  // ENGLISH (en)
  // ==========================================
  en: {
    brandName: 'KalaConnect',
    tagline: 'Connecting Traditional Craftsmanship with Modern Digital Commerce',
    back: 'Back',
    cancel: 'Cancel',
    continue: 'Continue',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    loading: 'Loading...',
    giCertified: 'GI Certified',
    handmade: '100% Handmade',
    directRoyalty: 'Direct Artisan Royalty',
    zeroPlastic: 'Zero Plastic Packaging',
    rupeeSymbol: '₹',
    chooseLanguage: 'Choose your preferred language',
    selectLanguageTitle: 'Language',
    english: 'English',
    tamil: 'தமிழ்',
    hindi: 'हिन्दी',
    securePortal: 'Secure Portal',
    toastCopied: 'Copied to clipboard!',

    welcomeHeroTag: 'Direct Living Heritage',
    welcomeHeroTitle: 'From Hands to Hearts, From Craft to Market.',
    welcomeWhoAreYou: 'Who are you?',
    welcomeChooseExperience: 'Choose your KalaConnect experience',
    welcomeChooseSubtitle: 'Please select your role to proceed to your dedicated authentication portal.',
    artisanRoleTitle: 'I am an Artisan',
    artisanRoleDesc: 'Create voice catalogs, manage craft production, get fair AI pricing, and receive direct bank payments.',
    artisanBadge: 'Makers & Guilds',
    artisanAction: 'Enter Artisan Studio',
    buyerRoleTitle: 'I am a Buyer',
    buyerRoleDesc: 'Discover authentic GI-certified crafts, support traditional masters, and explore cultural origins.',
    buyerBadge: 'Patrons & Collectors',
    buyerAction: 'Explore Marketplace',
    featureZeroCommission: 'Direct Payouts',
    featureZeroCommissionDesc: 'Artisans receive up to 87% direct bank payout with zero middleman deductions.',
    featureVoiceCataloging: 'Voice Cataloging',
    featureVoiceCatalogingDesc: 'Simply speak in your mother tongue to list products effortlessly.',
    featureAuthenticGi: 'Authentic GI Crafts',
    featureAuthenticGiDesc: 'Direct provenance tracking and registered master artisan verification.',

    artisanPortal: 'Artisan Portal',
    buyerPortal: 'Patron & Collector Portal',
    loginTab: 'LOGIN',
    signupTab: 'SIGN UP',
    emailOrPhone: 'Phone Number or Email',
    phone: 'Phone Number',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    location: 'Location (Village or City)',
    craftSpecialization: 'Craft Specialization',
    artisanGuild: 'Guild or Community Name',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    resetInstructions: 'Please enter your registered email or phone. We will send password reset instructions.',
    sendResetLink: 'Send Reset Link',
    quickDemoArtisan: '1-Click Test Artisan',
    quickDemoBuyer: '1-Click Test Buyer',
    testArtisanName: 'Master Potter Ramdev Kumbhar',
    testArtisanRole: 'Terracotta Craftsman • Bhuj, Gujarat',
    testBuyerName: 'Priya Sharma',
    testBuyerRole: 'Heritage Art Collector • Bangalore',
    loginAsArtisan: 'Login as Artisan',
    loginAsBuyer: 'Login as Buyer',
    registerAsArtisan: 'Register as Artisan',
    registerAsBuyer: 'Create Buyer Account',
    switchToBuyer: 'Looking to buy crafts? Go to Buyer Portal',
    switchToArtisan: 'Are you an artisan or maker? Go to Artisan Authentication',
    backToRoles: 'Back to Role Selection',
    enterEmailOrPhoneError: 'Please enter your phone number or email.',
    enterPasswordError: 'Please enter your password.',
    passwordMinError: 'Password must be at least 6 characters.',
    fullNameError: 'Full Name is required.',
    emailError: 'Please enter a valid email address.',
    phoneError: 'Please enter a valid 10-digit mobile number.',
    passwordMatchError: 'Passwords do not match.',
    locationError: 'Location is required.',
    oneClickLogin: '1-Click Login',
    newArtisanSignup: 'New artisan? Register here →',
    newBuyerSignup: 'New customer? Create Buyer Account →',
    alreadyRegisteredLogin: 'Already registered? Login here →',
    ecoCrateDelivery: 'Eco-Crate Delivery',
    termsAccepted: 'By continuing, you agree to KalaConnect Artisan Terms.',

    navDiscover: 'Discover',
    navArtisans: 'Artisans',
    navStudio: 'Studio',
    navOrders: 'Orders',
    navProfile: 'Profile',
    navCart: 'Cart',
    screenMarketplaceHome: 'Marketplace Home',
    screenLivingHeritageGuilds: 'Living Heritage Guilds',
    screenProductDetail: 'Product Detail',
    screenVoiceSmartStudio: 'Voice Smart Studio',
    screenVoiceCataloging: 'Voice Cataloging',
    screenOrdersShipments: 'Orders & Shipments',
    screenProfileAnalytics: 'Profile & Settings',

    masterArtisanVerified: 'Master Artisan Verified',
    takeHomePayout: 'Take-Home Payout',
    activeShipments: 'Active Shipments',
    patronViews: 'Patron Views',
    quickActions: 'Quick Actions',
    addProduct: 'Add Product',
    voiceCatalog: 'Voice Catalog',
    scanProduct: 'Scan Product',
    myEarnings: 'My Earnings',
    ecoPackaging: 'Eco Packaging',
    myCreations: 'My Active Creations',
    viewAll: 'View All',
    shareCraft: 'Share Craft',
    removeCraft: 'Remove',
    fairPriceAssistantTitle: 'Fair Price Assistant',
    fairPriceAssistantDesc: 'Our AI helps calculate material cost, labor hours, and kiln time to guarantee 87% direct profit.',
    calculateFairPriceBtn: 'Calculate Price',
    noProductsYet: 'No products added yet.',
    addFirstProductHint: 'Add your first handcrafted creation using voice or photo.',
    shipmentsCount: 'Shipments',
    viewsCount: 'Views',

    step1Title: 'Add Product',
    step1Subtitle: 'Select how you would like to provide your craft photo',
    takePhoto: 'Take a Photo',
    takePhotoDesc: 'Use your device camera to photograph your craft directly',
    chooseGallery: 'Choose from Gallery',
    chooseGalleryDesc: 'Select an existing photo from your device storage',

    step2Title: 'Product Photo',
    step2Subtitle: 'Review your product photo and optimize studio lighting',
    retakePhoto: 'Retake / Change Photo',
    continueBtn: 'Continue',
    preparingPhoto: 'Preparing your product photo...',
    originalPhoto: 'Original Photo',
    enhancedPhoto: 'AI Enhanced Photo',
    useThisPhoto: 'Use This Photo',
    photoReadyTitle: 'Product Photo Ready',

    step3Title: 'Tell us about your product',
    step3Subtitle: 'Press the microphone and speak naturally about your craft',
    tapToSpeak: 'Tap to Speak',
    listening: 'Listening... speak freely',
    stopRecording: 'Done Speaking',
    thingsYouCanTalkAbout: 'Things you can talk about:',
    guideWhatIsProduct: 'What is this product?',
    guideMaterialsUsed: 'What materials were used?',
    guideHowMade: 'How is it made?',
    guideTimeTaken: 'How long does it take to make?',
    guideTraditionalTechnique: 'Is there a traditional technique involved?',
    guideSpecialFeatures: 'What makes this product special?',
    guideCulturalStory: 'What is the cultural or personal story behind it?',
    orTrySampleVoice: 'Or click a sample voice story to test:',
    sampleVoicePrompt1: 'This is a handcrafted Kutch terracotta water pot made from organic river silt clay. It holds 2.5 litres and cools water naturally without electricity.',
    sampleVoicePrompt2: 'Hand-woven pure mulberry silk saree with zari borders, dyed using natural pomegranate rind extract, taking 14 days of pit loom weaving.',
    sampleVoicePrompt3: 'Lost-wax cast Dhokra bell metal tribal figurine crafted by Bastar artisans using generational brass and beeswax molds.',
    manualTextPrompt: 'Or enter details by typing:',
    typeStoryFallback: 'Type your product description or story here...',

    step4Understanding: 'Understanding your product story...',
    step4IdentifyingMaterials: 'Identifying materials...',
    step4CreatingCatalog: 'Creating your product catalog...',
    step4ProcessingTitle: 'AI Catalog Generation',

    step5Title: 'AI Generated Product Catalog',
    step5Subtitle: 'Review the digital catalog generated from your photo and voice story',
    productImageLabel: 'Product Image',
    productNameLabel: 'Product Name',
    categoryLabel: 'Category',
    materialsUsedLabel: 'Materials Used',
    craftTypeLabel: 'Craft Type',
    descriptionLabel: 'Description',
    howItsMadeLabel: 'How It Is Made',
    storyBehindProductTitle: 'Story Behind This Product',
    storyBehindProductSubtitle: 'Preserving generational wisdom, cultural legacy, and the artisan’s living voice for buyers.',
    specialFeaturesLabel: 'Special Features',
    suggestedTagsLabel: 'Suggested Tags',
    translateForMarketplaceBtn: 'Translate for Marketplace',
    translateNotice: 'Generates English and Hindi marketplace descriptions in the background without changing your active interface.',
    marketplaceTranslationsReady: 'Marketplace translations generated successfully for global buyers!',

    step7EditTitle: 'Edit & Confirm Details',
    editCatalogBtn: 'Edit',
    regenerateBtn: 'Regenerate',
    confirmAndPriceBtn: 'Continue to Pricing',
    saveChangesBtn: 'Save Changes',

    step8Title: 'AI Price Suggestion',
    step8Subtitle: 'Calculate a fair and profitable price for your handcrafted work',
    materialCostInputLabel: 'Material Cost (₹)',
    productionHoursInputLabel: 'Approximate Time Taken (Hours)',
    suggestedPriceRange: 'Suggested Price Range',
    recommendedPrice: 'Recommended Price',
    yourDirectRoyalty: 'Your Direct Take-Home (87%)',
    platformLogistics: 'Logistics & Eco-Packaging (13%)',
    pricingExplanationTitle: 'Price Analysis',
    publishProductBtn: 'Publish Product',
    publishingProduct: 'Publishing to KalaConnect...',
    publishSuccessTitle: 'Product Published Successfully!',
    publishSuccessSubtitle: 'Your craft is now live in the KalaConnect marketplace with your preserved artisan story.',
    viewInMarketplaceBtn: 'View in Marketplace',
    backToStudioBtn: 'Back to Studio',

    searchPlaceholder: 'Search crafts, artisans, or materials...',
    allCraftsCategory: 'All Crafts',
    potteryCategory: 'Pottery & Clay',
    textilesCategory: 'Textiles & Weaves',
    metalCategory: 'Metal Crafts',
    woodCategory: 'Wood & Carvings',
    paintingCategory: 'Folk Paintings',
    jewelryCategory: 'Tribal Jewelry',
    featuredGuildsTitle: 'Featured Artisan Guilds',
    livingHeritageTitle: 'Living Heritage Crafts',
    verifiedArtisanBadge: 'Verified Maker',
    addToCartBtn: 'Add to Cart',
    buyNowBtn: 'Buy Now',
    viewDetailsBtn: 'View Details',
    exploreByRegion: 'Explore by Region',
    namasteGreeting: 'Namaste',
    verifiedPatron: 'Verified Patron',

    provenanceTitle: 'Artisan Provenance',
    artisanStoryTitle: 'Artisan Story & Heritage',
    masteryYears: 'craft mastery',
    craftTechnique: 'Craft Technique',
    craftOrigin: 'Origin',
    capacityLabel: 'Capacity / Dimensions',
    specificationsTitle: 'Craft Specifications',
    creationProcessTitle: 'How It Is Made',
    patronReviewsTitle: 'Patron Reviews & Appreciation',
    directArtisanPact: 'Direct Artisan Guarantee',
    directArtisanPactDesc: 'Zero intermediary deductions. The maker receives 87% of the item price directly into their cooperative account.',
    shareWithFriends: 'Share Craft',

    ordersTitle: 'Orders & Shipments',
    ordersSubtitle: 'Track artisan dispatches and direct deliveries',
    allOrdersTab: 'All Orders',
    inProgressTab: 'In Progress',
    deliveredTab: 'Delivered',
    orderPlacedStatus: 'Order Placed',
    packingStatus: 'Eco-Packing',
    inTransitStatus: 'In Transit',
    deliveredStatus: 'Delivered',
    trackShipmentBtn: 'Track Blue Dart Crate',
    contactArtisanBtn: 'Contact Maker',
    prepaidBadge: 'Prepaid Verified',
    orderIdLabel: 'Order ID',
    dispatchAddressLabel: 'Delivery Destination',
    noOrdersYet: 'No active orders found.',

    profileTitle: 'Profile & Settings',
    userRoleLabel: 'Account Role',
    artisanProfileBadge: 'Artisan Account',
    buyerProfileBadge: 'Buyer Account',
    preferredLanguageSetting: 'Preferred Language',
    changeLanguagePrompt: 'Choose the language for your entire application',
    helpSupport: 'Artisan Helpline & Support',
    directHelpline: 'Direct Helpline: 1800-KALA-MART (Toll-Free)',
    shippingAddresses: 'Saved Addresses',
    paymentMethods: 'Bank & Payout Accounts',
    signOutBtn: 'Sign Out',
    wishlistLabel: 'Saved to Wishlist',

    cartTitle: 'Your Craft Cart',
    cartEmpty: 'Your cart is empty',
    cartSubtotal: 'Subtotal',
    directRoyaltyNote: '87% goes directly to the master artisan',
    freeEcoDelivery: 'Free Climate-Neutral Eco-Delivery',
    checkoutBtn: 'Proceed to Checkout',
    quantityLabel: 'Quantity',
    itemRemoved: 'Item removed from cart',

    voiceAssistantTitle: 'KalaConnect Voice Assistant',
    voiceAssistantSubtitle: 'Speak naturally to search crafts or navigate the app',
    voiceAssistantPrompt: 'How can I assist your heritage journey today?',
    trySaying: 'Try saying:',
    sampleCommand1: '"Show me terracotta pottery from Kutch"',
    sampleCommand2: '"Open my active orders"',
    sampleCommand3: '"Start voice product cataloging"',

    narratedInNativeTongue: 'Narrated in native craft dialect',
    viewProfile: 'View Profile',
    exploreCollection: 'Explore Collection',
    howItsHandcrafted: 'How It’s Handcrafted',
    sacredStages: 'Sacred Stages',
    craftHeritageAndHealing: 'The Craft Heritage & Cultural Story',
    masterCraftSpecs: 'Master Craft Specifications',
    patronExperiences: 'Patron Experiences & Reviews',
    directArtisanRoyalty: 'Direct Artisan Royalty',
    directPill: 'Direct to Maker',
    toastAddedToBag: 'Added to your shopping bag!',
    addToBag: 'Add to Bag',
    instantCheckout: 'Proceeding to express checkout...',
    buyNow: 'Buy Now',
    estimatedDispatch: 'Dispatches in 24 hrs in zero-plastic terracotta crates',
    yearsLineage: 'Years Lineage',
    govtAwardedMaster: 'Government Awarded Master Guild Craftsman',
    specialty: 'Specialty',
    playingAudioStory: 'Playing Artisan Audio Story',
    hearArtisanStory: 'Hear Artisan’s Story',
    reviewsCount: 'Verified Reviews',
    backToMarketplace: 'Back to Marketplace',

    artisan: 'Artisan',
    totalEarnings: 'Total Earnings',
    productsListed: 'Products Listed',
    wishlist: 'Wishlist',
    bankAccount: 'Bank Remittance Account',
    activeOrders: 'Active Orders',
    primaryDeliveryAddress: 'Primary Delivery Address',
    ecoPackagingNotice: '100% Eco-Friendly Biodegradable Packaging',
    selectLanguage: 'Select Application Language',
    toastLanguageChanged: 'Language updated successfully!',
    supportArtisanGuild: 'Artisan Guild Support',
    supportPatronConcierge: 'Patron Heritage Concierge',
    supportArtisanDescription: 'Direct assistance for product photography, pricing, bank payouts, and packaging supplies.',
    supportPatronDescription: 'Direct support for authenticity certificates, artisan provenance queries, and safe transit.',
    switchToBuyerMarketplace: 'Switch to Buyer Marketplace',
    switchToArtisanStudio: 'Switch to Artisan Studio',
    logOut: 'Log Out',

    voiceCatalogCraft: 'Voice Catalog Craft',
    viewOrders: 'View Orders',
    performanceEarnings: 'Performance & Earnings',
    weekly: 'Weekly',
    monthly: 'Monthly',
    dispatched: 'Dispatched',
    productViews: 'Product Views',
    aiInsights: 'Artisan AI Business Insights',
    smartAdvisor: 'Smart Craft Advisor',
    voiceCatalogingTitle: 'AI Voice Cataloging',
    voiceFirstCatalogHeading: 'Voice-First AI Product Cataloging',
    voiceFirstCatalogSubheading: 'Simply photograph your creation and describe it in your native mother tongue. Our smart engine auto-generates marketplace listings and GI certifications.',
    recentOrdersDispatch: 'Recent Orders & Dispatch',
    trackOrder: 'Track Order',
    myProductsManagement: 'My Products & Live Inventory',
    liveInventory: 'Live Inventory',
    inStock: 'In Stock',
    viewDetails: 'View Details',

    orderManagement: 'Order Management',
    artisanDispatchTitle: 'Artisan Orders & Logistics',
    buyerOrdersTitle: 'My Heritage Orders',
    artisanOrdersView: 'Artisan Dispatch View',
    buyerOrdersView: 'Buyer Tracking View',
    allOrders: 'All Orders',
    orderStatusNew: 'New Order',
    orderStatusAccepted: 'Accepted',
    orderStatusPreparing: 'Preparing Craft',
    orderStatusReadyToShip: 'Ready to Ship',
    orderStatusShipped: 'In Transit',
    orderStatusDelivered: 'Delivered',
    noOrdersFound: 'No orders found for this filter.',
    tryResettingFilters: 'Try selecting a different filter above.',
    buyer: 'Buyer',
    deliveryProgress: 'Delivery Progress',
    step: 'Stage',
    acceptOrder: 'Accept Order',
    declineOrder: 'Decline Order',
    advanceStatus: 'Advance Status',
    orderDeliveredSuccessfully: 'Order delivered successfully',
    liveTrackingMap: 'Live Tracking Map',
    chatWithMaker: 'Chat with Maker',

    curatedBag: 'Curated Heritage Bag',
    directGISourced: 'Direct GI Sourced Handicrafts',
    directRoyaltyBreakdown: 'Direct Artisan Royalty Breakdown',
    payoutToMaker: 'Direct payout to master maker',
    directRemittance: 'Direct Bank Remittance',
    directRoyaltySubtext: 'When you purchase through KalaConnect, zero commissions are cut. The funds are remitted straight to the artisan’s verified bank account.',
    totalPayable: 'Total Payable',
    taxShippingIncluded: 'Tax & Climate-Neutral Shipping Included',
    securingRoyalty: 'Securing artisan royalty...',
    proceedToPayment: 'Proceed to 1-Click Pay',
    cartEmptySubtext: 'Discover authentic GI-certified crafts made by master artisans across India.',

    listeningInNativeTongue: 'Listening in your chosen language...',
    voiceQueryProcessed: 'Query processed successfully',
    liveSpeechInput: 'Spoken Speech Input',
    tapToSpeakSuggested: 'Tap any suggestion to speak:',

    region: 'Region',
    heritageDiscovery: 'Heritage Discovery',
    exploreCraftGuilds: 'Living Heritage Craft Guilds',
    guildSubtext: 'Connect directly with certified cluster communities preserving ancient Indian artistic lineages across states.',
    allRegions: 'All Regions',
    westZone: 'West Zone',
    northZone: 'North Zone',
    southZone: 'South Zone',
    eastZone: 'East Zone',
    verifiedGuilds: 'Verified Guild Artisans',
    craftsCount: 'Heritage Crafts',

    navMarketplace: 'Marketplace',
    navGuilds: 'Guilds',
    artisanStudio: 'Studio',
    addedToWishlist: 'Added to your favorites!',
    removedFromWishlist: 'Removed from favorites',

    deliveringTo: 'Delivering to',
    searchCraftsPlaceholder: 'Search authentic GI crafts, master weavers, clay pottery...',
    filteringBy: 'Filtering by',
    category: 'Category',
    clearAll: 'Clear all',
    craftStoryOfDay: 'Living Heritage Craft Spotlight',
    discoverCrafts: 'Authentic Indian GI Crafts',
    exploreMap: 'Explore Heritage Map',
    heritageCategories: 'Sacred Heritage Craft Traditions',
    authenticTechniques: 'Direct GI Geographical Indication Certified Lines',
    resetFilters: 'Reset all filters',
    directFromMasters: 'Direct from Master Craftsmen',
    allMasters: 'All Guild Masters',
    viewCreations: 'View Heritage Catalog',
    curatedSelection: 'Handcrafted Masterpieces',
    heritageMasterpieces: 'Museum-grade authentic handicrafts direct from regional lineages',
    featured: 'Featured Crafts',
    recent: 'Recent Creations',
    noCraftsFound: 'No authentic crafts match your active criteria.',
    filterCrafts: 'Filter Heritage Crafts',
    filterByRegion: 'Filter by Cultural Region',
    maxPrice: 'Maximum Budget Price',
    applyFilters: 'Apply Selection',
    meetTheArtisan: 'Meet the Master Maker',

    // Additional Screen & Navigation Titles
    b2bPortal: 'B2B Wholesale Hub',
    adminTrustPortal: 'Admin Trust Portal',
    myProducts: 'My Products',
    productManagement: 'Product Management',
    pitchDemo: 'Pitch Demo',
    b2b: 'B2B',
    notifications: 'Notifications',
    viewCart: 'View Cart',
    userProfile: 'User Profile',
    navHome: 'Home',
    navProducts: 'Products',
    navCreateProduct: 'Create Product',
    navExplore: 'Explore',

    // Marketplace & Discover
    directClusterSourced: 'Direct Cluster Sourced',
    welcomeUser: 'Welcome',
    verifiedPatronBadge: 'Verified Patron',
    curatedSelectionTag: 'Curated Selection',
    authenticCraftsCatalog: 'Authentic Crafts Catalog',
    craftsLabel: 'crafts',
    featuredMasterpieces: 'Featured Masterpieces',
    readyToShip: 'Ready to Ship',
    readyToDispatch: 'Ready to dispatch',
    giCertifiedBadge: 'GI Certified',
    craftDisciplines: 'Craft Disciplines',
    exploreByCraftCategory: 'Explore by Craft Category',
    viewAllBtn: 'View All',
    livingHeritageStories: 'Living Heritage Stories',
    meetTheArtisansTitle: 'Meet the Artisans',
    meetTheArtisansSubtitle: 'Behind every craft is a master artisan preserving centuries of cultural memory',
    giCertifiedMaster: 'GI Certified Master',
    featuredHandcrafts: 'Featured Handcrafts',
    creationsLabel: 'items',
    viewCrafts: 'View Crafts',
    curatedMasterSeries: 'Curated Master Series',
    authenticCraftCollections: 'Authentic Craft Collections',
    craftCollectionsSubtitle: 'Thematic heritage series hand-curated from registered geographical clusters',
    directArtisanBulkSourcing: 'Direct Artisan Bulk Sourcing',
    cooperativeDirect: 'Cooperative Direct',
    lookingToSourceInBulk: 'Looking to source in bulk?',
    bulkSourcingSubtitle: 'Direct institutional sourcing for boutique hospitality, corporate gifting, interior architects, and ethical retail straight from certified artisan clusters. Zero intermediaries with full provenance paperwork.',
    wholesaleTiers: 'Wholesale Tiers',
    wholesaleTiersSub: '20-35% below retail direct rates',
    giProvenance: 'GI Provenance',
    giProvenanceSub: 'Batch certification & artisan sign-off',
    customBranding: 'Custom Branding',
    customBrandingSub: 'Artisan story cards & eco gift boxes',
    bulkOrderAvailable: 'Bulk Order Available',
    wholesaleTierLabel: 'Wholesale Tier',
    savePercentage: 'Save',
    requestBulkQuote: 'Request Bulk Quote',
    quoteBtn: 'Quote',
    capacity: 'Cap:',
    leadTime: 'Lead:',

    // Hero Banner
    heroProvenanceTag: '100% Certified GI Provenance',
    heroLivingHeritage: 'Living Heritage',
    heroDirectMasters: 'Direct From Living Masters',
    heroTitle: 'Authentic Handmade Craftsmanship',
    heroSubtitle: 'Every single piece carries centuries of sacred craft tradition, shaped with mindful devotion by verified master artisans with zero middlemen.',
    heroHandcrafted: '100% Handcrafted',
    heroDirectRoyalties: 'Direct Artisan Royalties',
    heroEcoPackaged: 'Eco-Packaged',
    heroExploreMasterpieces: 'Explore Masterpieces',
    heroMeetArtisans: 'Meet Artisans',

    // Search & Filters
    searchMarketplacePlaceholder: 'Search by product, craft, artisan, or region...',
    voiceSearch: 'Voice Search',
    filterOptions: 'Filters',
    filtersCleared: 'Filters cleared',
    voiceSearchListening: 'Voice listening...',

    // Offline & Status
    offlineLabel: 'Offline',
    syncingLabel: 'Syncing',
    onlineLabel: 'Online',
    offlineNotice: "You're offline. Your work is safely saved on this device.",
    syncingNotice: 'Syncing changes with cloud...',
    syncedNotice: 'All changes synced successfully.',
    syncQueue: 'Sync Queue',
    demoMode: 'Demo Mode',
    simulateOffline: 'Simulate Offline',
    turnOnlineOn: 'Turn Online ON',
    savedLocally: 'Saved locally',
    waitingToSync: 'Waiting to sync',
    syncFailed: 'Sync failed',
    inQueue: 'in queue',

    // Product Details & Trust
    whyTrustTitle: 'Why trust this product?',
    whyTrustSubtitle: 'Transparent provenance, artisan verification, and curated craft audit',
    viewAudit: 'View Audit',
    verified: 'Verified',
    inReview: 'In Review',
    trustProgramTitle: 'Official Craft Verification Program (Integration Ready)',
    trustProgramDesc: 'KalaConnect is architected for prospective integration with recognized regional and national craft registries. We verify individual artisan declarations, cluster records, and workshop proofs without making false claims.',
    authenticityAuditLog: 'Authenticity Audit Log',
    artisanVerificationLevel: 'Artisan Verification Level',
    closeAudit: 'Close Audit View',
    buyerPreviewMode: 'Buyer Preview Mode',
    backToMyProducts: 'Back to My Products',
    cleaningTab: 'Cleaning & Wash',
    seasoningTab: 'Seasoning / Prep',
    storageTab: 'Longevity & Storage',
    aboutCreation: 'About This Creation',
    sendInquiryTo: 'Send Inquiry to Artisan',
    masterCraftDetails: 'Master Craft Details',
    materialsLabel: 'Materials',
    craftTechniqueLabel: 'Craft Technique',
    productionTimeLabel: 'Production Time',
    dimensionsLabel: 'Dimensions',
    careInstructionsLabel: 'Care & Longevity Instructions',
    livingHeritage: 'Living Heritage & Cultural Lineage',
    aboutCraft: 'About the Craft',
    viewArtisanProfile: 'View Artisan Profile',
    requestQuoteBulk: 'Request a Quote (Bulk RFQ)',
    b2bWholesaleTitle: 'B2B Wholesale & Bulk Sourcing',
    bulkAvailable: 'Bulk Available',
    b2bWholesaleDesc: 'Direct procurement for hotels, corporate gifting, retailers & export buyers',
    orderAvailability: 'Order Availability',
    moqLabel: 'Minimum Order (MOQ)',
    productionCapacity: 'Production Capacity',
    approxLeadTime: 'Approx. Lead Time',
    tieredWholesalePrice: 'Tiered Wholesale Price',
    cleaningCareTip: 'Gently rinse with lukewarm water and a natural coir or soft sponge. Never use synthetic detergents or harsh chemicals.',
    seasoningCareTip: 'Before first use, soak completely in fresh clean water for 8 hours, then rub with a few drops of pure oil and air dry.',
    storageCareTip: 'Store in a well-ventilated, dry shelf away from humid direct steam. Avoid stacking heavy metal items.',

    // Checkout & Forms
    contactInfo: 'Contact Information',
    deliveryAddress: 'Delivery Address',
    streetAddress: 'Street Address, House/Flat No.',
    landmarkOptional: 'Landmark (Optional)',
    city: 'City / Town',
    state: 'State',
    pincode: 'Pincode (6 digits)',
    paymentMethodLabel: 'Payment Method',
    itemsInOrder: 'items in order',
    directlyToArtisan: 'directly to artisan',
    payNow: 'Pay & Place Order',
    secureGiCheckout: 'Secure GI Checkout',
    checkoutSubtitle: 'Direct artisan remittance & climate-neutral packaging',
    paymentArchitecture: 'Payment Architecture',
    demoSimulation: 'Demo Simulation (Hackathon)',
    productionGateway: 'Real Production Gateway',
    selectPaymentRail: 'Select Payment Rail',
    payAndPlaceOrder: 'Pay & Place Order',

    // Offline Sync & Demo
    offlineSyncQueue: 'Offline Sync Queue',
    syncNow: 'Sync Now',
    retryFailed: 'Retry Failed',
    clearSynced: 'Clear Synced',
    runDemoMode: 'Run Demo Mode',
    allChangesSynced: 'All changes synced successfully.',
    offlineNoticeDetail: "You're offline. Your work is safely saved on this device.",
    offlineDemoTitle: 'Offline-First Synchronization Demo',
    offlineDemoSubtitle: 'End-to-End Resilience Verification for Rural Artisan Clusters',
    startInteractiveDemo: 'Start Interactive Simulation',

    // Greetings & Studio
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    studioEncouraging: 'Ready to share your craft with the world?',
    defaultGuildName: 'Terracotta Pottery Guild • Bhuj',
    productRemovedToast: 'Product removed from active listings.',
    shopLinkCopiedToast: 'Shop link copied! Share with your customers.',

    // Artisan Profile & Story
    artisanStory: 'Artisan Story',
    bulkAndCustom: 'Bulk & Custom',
    masterBiography: 'Master Biography',
    honoursAndAwards: 'Honours & Certifications',
    bulkSourcingTitle: 'Bulk & Institutional Sourcing',
    directFromCluster: 'Direct from master cluster workshop',
    addedToBagToast: 'Added to bag',

    // Welcome Screen
    welcomeHeroSubtitle: 'Offline-first, voice-first digital marketplace empowering master artisans and connecting conscious buyers directly.',
    b2bCardSubtitle: 'Bulk orders, RFQ quotations & MOQ',
    adminCardSubtitle: 'Verify crafts, approve listings & badges',

    // Auth Screen Roles
    roleArtisan: 'Artisan',
    roleArtisanDesc: 'Master Maker & Craftsman',
    roleBuyer: 'Buyer',
    roleBuyerDesc: 'Art Patron & Conscious Shopper',
    roleB2B: 'B2B Buyer',
    roleB2BDesc: 'Bulk Wholesale & Retailers',
    roleAdmin: 'Admin',
    roleAdminDesc: 'Trust, GI & Verification',

    // Order Actions Toasts
    orderConfirmedToast: 'Order confirmed! Scheduled for production.',
    orderDeclinedToast: 'Order declined and refunded to customer.'
  },

  // ==========================================
  // TAMIL (ta) - 100% STRICT SINGLE LANGUAGE
  // ==========================================
  ta: {
    brandName: 'கலாகனெக்ட்',
    tagline: 'பாரம்பரிய கைவினைத் திறனை நவீன டிஜிட்டல் வர்த்தகத்துடன் இணைக்கிறது',
    back: 'பின்செல்க',
    cancel: 'ரத்து செய்',
    continue: 'தொடர்க',
    save: 'சேமி',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    confirm: 'உறுதி செய்',
    loading: 'ஏற்றுகிறது...',
    giCertified: 'புவிசார் குறியீடு பெற்றது',
    handmade: '100% கைவினைப் பொருள்',
    directRoyalty: 'கைவினைஞருக்கு நேரடி ஊதியம்',
    zeroPlastic: 'நெகிழியற்ற சூழல் பாதுகாப்பு பேக்கிங்',
    rupeeSymbol: '₹',
    chooseLanguage: 'உங்கள் விருப்ப மொழியைத் தேர்வுசெய்யவும்',
    selectLanguageTitle: 'மொழி',
    english: 'English',
    tamil: 'தமிழ்',
    hindi: 'हिन्दी',
    securePortal: 'பாதுகாப்பான தளம்',
    toastCopied: 'நகலெடுக்கப்பட்டது!',

    welcomeHeroTag: 'இந்தியாவின் வாழும் பாரம்பரியம்',
    welcomeHeroTitle: 'கைவினைஞரின் கரங்களிலிருந்து உங்கள் இல்லத்திற்கு.',
    welcomeWhoAreYou: 'நீங்கள் யார்?',
    welcomeChooseExperience: 'உங்கள் கலாகனெக்ட் தளப் பிரிவைத் தேர்ந்தெடுக்கவும்',
    welcomeChooseSubtitle: 'உங்கள் பிரத்தியேக தளத்திற்குச் செல்ல உங்கள் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்.',
    artisanRoleTitle: 'நான் ஒரு கைவினைஞர்',
    artisanRoleDesc: 'குரல் மூலம் தயாரிப்பு பட்டியல் உருவாக்கவும், உற்பத்தியை நிர்வகிக்கவும், நியாயமான விலையுடன் நேரடி வங்கி ஊதியம் பெறவும்.',
    artisanBadge: 'கைவினைஞர்கள் மற்றும் சங்கங்கள்',
    artisanAction: 'கைவினைஞர் அரங்கத்திற்குள் செல்க',
    buyerRoleTitle: 'நான் ஒரு வாங்குபவர்',
    buyerRoleDesc: 'பாரம்பரிய கைவினைப் பொருட்களைக் கண்டறியவும், கைவினை வல்லுநர்களை ஆதரிக்கவும், கலைப் பண்பாட்டை அறியவும்.',
    buyerBadge: 'கலை ஆர்வலர்கள் மற்றும் சேகரிப்பாளர்கள்',
    buyerAction: 'சந்தைக்குள் செல்க',
    featureZeroCommission: 'நேரடி வங்கிப் பணம்',
    featureZeroCommissionDesc: 'இடைத்தரகர்கள் இன்றி விற்பனைத் தொகையில் 87% நேரடியாக கைவினைஞரின் வங்கிக்குச் செல்கிறது.',
    featureVoiceCataloging: 'குரல் வழி பட்டியல் தயாரிப்பு',
    featureVoiceCatalogingDesc: 'உங்கள் தாய்மொழியில் பேசி எளிதாக புதிய பொருட்களை விற்பனைக்குச் சேர்க்கலாம்.',
    featureAuthenticGi: 'உண்மையான கைவினைப் பொருட்கள்',
    featureAuthenticGiDesc: 'பாரம்பரிய கைவினைஞர்களின் நேரடி அங்கீகாரம் மற்றும் வரலாற்றுப் பின்னணி உறுதிப்படுத்தப்படுகிறது.',

    artisanPortal: 'கைவினைஞர் தளம்',
    buyerPortal: 'வாங்குபவர் தளம்',
    loginTab: 'உள்நுழைக',
    signupTab: 'பதிவு செய்க',
    emailOrPhone: 'தொலைபேசி எண் அல்லது மின்னஞ்சல்',
    phone: 'தொலைபேசி எண்',
    email: 'மின்னஞ்சல் முகவரி',
    password: 'கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல்லை உறுதி செய்க',
    fullName: 'முழுப் பெயர்',
    location: 'இடம் (ஊர் அல்லது நகரம்)',
    craftSpecialization: 'கைவினைப் பிரிவு',
    artisanGuild: 'கைவினைச் சங்கம் அல்லது சமூகம்',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    resetPassword: 'கடவுச்சொல்லை மீட்டமை',
    resetInstructions: 'உங்கள் பதிவுசெய்த விவரங்களை உள்ளிடவும். கடவுச்சொல் மாற்றும் குறிப்பு அனுப்பப்படும்.',
    sendResetLink: 'மீட்டமைப்பு இணைப்பை அனுப்புக',
    quickDemoArtisan: 'மாதிரி கைவினைஞர் உள்நுழைவு',
    quickDemoBuyer: 'மாதிரி வாங்குபவர் உள்நுழைவு',
    testArtisanName: 'ராம்தேவ் கும்பார் (மண்பாண்டக் கலைஞர்)',
    testArtisanRole: 'மண்பாண்டக் கலைஞர் • புஜ், குஜராத்',
    testBuyerName: 'பிரியா சர்மா',
    testBuyerRole: 'கலை சேகரிப்பாளர் • பெங்களூரு',
    loginAsArtisan: 'கைவினைஞராக உள்நுழைக',
    loginAsBuyer: 'வாங்குபவராக உள்நுழைக',
    registerAsArtisan: 'கைவினைஞராகப் பதிவு செய்க',
    registerAsBuyer: 'வாங்குபவர் கணக்கு உருவாக்குக',
    switchToBuyer: 'பொருட்களை வாங்க விரும்புகிறீர்களா? வாங்குபவர் தளத்திற்குச் செல்லவும்',
    switchToArtisan: 'நீங்கள் ஒரு கைவினைஞரா? கைவினைஞர் தளத்திற்குச் செல்லவும்',
    backToRoles: 'தேர்வுப் பக்கத்திற்குத் திரும்புக',
    enterEmailOrPhoneError: 'தொலைபேசி எண் அல்லது மின்னஞ்சலை உள்ளிடவும்.',
    enterPasswordError: 'கடவுச்சொல்லை உள்ளிடவும்.',
    passwordMinError: 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.',
    fullNameError: 'முழுப் பெயர் அவசியமானது.',
    emailError: 'சரியான மின்னஞ்சலை உள்ளிடவும்.',
    phoneError: 'சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.',
    passwordMatchError: 'கடவுச்சொற்கள் பொருந்தவில்லை.',
    locationError: 'ஊர் அல்லது நகரம் அவசியமானது.',
    oneClickLogin: 'நேரடி உள்நுழைவு',
    newArtisanSignup: 'புதிய கைவினைஞரா? இங்கே பதிவு செய்க →',
    newBuyerSignup: 'புதிய வாடிக்கையாளரா? கணக்கு உருவாக்குக →',
    alreadyRegisteredLogin: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக →',
    ecoCrateDelivery: 'இயற்கை பெட்டி விநியோகம்',
    termsAccepted: 'தொடர்வதன் மூலம், கலாகனெக்ட் கைவினைஞர் விதிமுறைகளை ஏற்கிறீர்கள்.',

    navDiscover: 'கண்டுபிடி',
    navArtisans: 'கைவினைஞர்கள்',
    navStudio: 'அரங்கம்',
    navOrders: 'ஆர்டர்கள்',
    navProfile: 'சுயவிவரம்',
    navCart: 'கூடை',
    screenMarketplaceHome: 'சந்தை முகப்பு',
    screenLivingHeritageGuilds: 'கைவினைஞர் சங்கங்கள்',
    screenProductDetail: 'தயாரிப்பு விவரம்',
    screenVoiceSmartStudio: 'கைவினைஞர் அரங்கம்',
    screenVoiceCataloging: 'குரல் வழி பட்டியல்',
    screenOrdersShipments: 'ஆர்டர்கள் மற்றும் விநியோகம்',
    screenProfileAnalytics: 'சுயவிவரம் மற்றும் அமைப்புகள்',

    masterArtisanVerified: 'சான்றளிக்கப்பட்ட கைவினைஞர்',
    takeHomePayout: 'மொத்த வருமானம்',
    activeShipments: 'செயலில் உள்ள ஆர்டர்கள்',
    patronViews: 'பார்வையாளர்கள்',
    quickActions: 'விரைவுச் செயல்கள்',
    addProduct: 'பொருளைச் சேர்',
    voiceCatalog: 'குரல் பட்டியல்',
    scanProduct: 'பொருளை ஸ்கேன் செய்',
    myEarnings: 'எனது வருவாய்',
    ecoPackaging: 'இயற்கை பேக்கிங்',
    myCreations: 'எனது தயாரிப்புகள்',
    viewAll: 'அனைத்தையும் பார்',
    shareCraft: 'பகிரவும்',
    removeCraft: 'நீக்குக',
    fairPriceAssistantTitle: 'நியாய விலை வழிகாட்டி',
    fairPriceAssistantDesc: 'பொருட்களின் செலவு, உழைக்கும் நேரம் ஆகியவற்றைக் கணக்கிட்டு 87% நேரடி லாபம் கிடைக்க ஏஐ உதவுகிறது.',
    calculateFairPriceBtn: 'விலையைக் கணக்கிடு',
    noProductsYet: 'தயாரிப்புகள் ஏதும் சேர்க்கப்படவில்லை.',
    addFirstProductHint: 'புகைப்படம் அல்லது குரல் மூலம் உங்கள் முதல் கைவினைப் பொருளைச் சேர்க்கவும்.',
    shipmentsCount: 'ஆர்டர்கள்',
    viewsCount: 'பார்வைகள்',

    step1Title: 'பொருளைச் சேர்',
    step1Subtitle: 'உங்கள் கைவினைப் பொருளின் புகைப்படத்தை எவ்வாறு வழங்க விரும்புகிறீர்கள் என்பதைத் தேர்வுசெய்க',
    takePhoto: 'புகைப்படம் எடு',
    takePhotoDesc: 'உங்கள் தொலைபேசி கேமராவைப் பயன்படுத்தி நேரடியாக புகைப்படம் எடுக்கவும்',
    chooseGallery: 'கேலரியில் இருந்து தேர்வு செய்',
    chooseGalleryDesc: 'உங்கள் தொலைபேசியில் ஏற்கனவே உள்ள புகைப்படத்தைத் தேர்ந்தெடுக்கவும்',

    step2Title: 'தயாரிப்பு புகைப்படம்',
    step2Subtitle: 'புகைப்படத்தை சரிபார்த்து சிறந்த ஒளியமைப்பை உறுதி செய்க',
    retakePhoto: 'மீண்டும் எடு / மாற்றுக',
    continueBtn: 'தொடர்க',
    preparingPhoto: 'உங்கள் தயாரிப்பு புகைப்படத்தை தயார் செய்கிறது...',
    originalPhoto: 'அசல் புகைப்படம்',
    enhancedPhoto: 'ஏஐ மேம்படுத்திய புகைப்படம்',
    useThisPhoto: 'இப்புகைப்படத்தைப் பயன்படுத்து',
    photoReadyTitle: 'தயாரிப்பு புகைப்படம் தயார்',

    step3Title: 'உங்கள் தயாரிப்பு பற்றி எங்களிடம் கூறுங்கள்',
    step3Subtitle: 'மைக்ரோஃபோன் பொத்தானை அழுத்தி உங்கள் கலைப்பொருள் பற்றி இயல்பாகப் பேசுங்கள்',
    tapToSpeak: 'பேச அழுத்தவும்',
    listening: 'கேட்கிறது... தொடர்ந்து பேசுங்கள்',
    stopRecording: 'பேசி முடித்தேன்',
    thingsYouCanTalkAbout: 'நீங்கள் பேசக்கூடிய தகவல்கள்:',
    guideWhatIsProduct: 'இது என்ன தயாரிப்பு?',
    guideMaterialsUsed: 'என்ன பொருட்கள் பயன்படுத்தப்பட்டன?',
    guideHowMade: 'இது எவ்வாறு உருவாக்கப்பட்டது?',
    guideTimeTaken: 'இதைச் செய்ய எவ்வளவு நேரம் ஆனது?',
    guideTraditionalTechnique: 'பாரம்பரிய உத்தி ஏதேனும் உள்ளதா?',
    guideSpecialFeatures: 'இப்பொருளின் தனிச்சிறப்பு என்ன?',
    guideCulturalStory: 'இதன் பின்னணியில் உள்ள பண்பாட்டு அல்லது குடும்பக் கதை என்ன?',
    orTrySampleVoice: 'அல்லது மாதிரி குரல் கதையைத் தேர்ந்தெடுக்கவும்:',
    sampleVoicePrompt1: 'இது கச்சின் ஆற்று வண்டல் களிமண்ணால் செய்யப்பட்ட பாரம்பரிய மண்பாண்டக் குடம். இதில் மின்சாரம் இன்றி இரண்டரை லிட்டர் தண்ணீர் இயற்கையாகக் குளிர்ந்து இருக்கும்.',
    sampleVoicePrompt2: 'தூய பட்டு நூல்களால் பாரம்பரிய தறியில் 14 நாட்கள் நெய்யப்பட்ட கைத்தறிப் பட்டுச் சேலை. மாதுளைத் தோலின் இயற்கை சாயம் பூசப்பட்டது.',
    sampleVoicePrompt3: 'பஸ்தார் பழங்குடி கைவினைஞர்களால் மெழுகு மற்றும் பித்தளை உலோகத்தால் வார்க்கப்பட்ட பாரம்பரிய டோக்ரா கலைச் சிற்பம்.',
    manualTextPrompt: 'அல்லது தட்டச்சு செய்து உள்ளிடவும்:',
    typeStoryFallback: 'தயாரிப்பு விவரம் அல்லது கதையை இங்கே எழுதவும்...',

    step4Understanding: 'உங்கள் தயாரிப்பு கதையைப் புரிந்து கொள்கிறது...',
    step4IdentifyingMaterials: 'பயன்படுத்திய பொருட்களை அடையாளம் காண்கிறது...',
    step4CreatingCatalog: 'உங்கள் தயாரிப்பு பட்டியலை உருவாக்குகிறது...',
    step4ProcessingTitle: 'ஏஐ தயாரிப்பு பட்டியல் உருவாக்கம்',

    step5Title: 'ஏஐ உருவாக்கிய தயாரிப்பு பட்டியல்',
    step5Subtitle: 'புகைப்படம் மற்றும் உங்கள் குரல் கதையிலிருந்து உருவான விவரங்களைச் சரிபார்க்கவும்',
    productImageLabel: 'தயாரிப்பு புகைப்படம்',
    productNameLabel: 'பொருளின் பெயர்',
    categoryLabel: 'பிரிவு',
    materialsUsedLabel: 'பயன்படுத்திய பொருட்கள்',
    craftTypeLabel: 'கைவினை முறை',
    descriptionLabel: 'விளக்கம்',
    howItsMadeLabel: 'உருவாக்கும் விதம்',
    storyBehindProductTitle: 'இப்பொருளின் பின்னணிக் கதை',
    storyBehindProductSubtitle: 'தலைமுறை ஞானம், கலாச்சார மரபு மற்றும் கைவினைஞரின் சொந்தக் குரலை வாங்குபவர்களுக்கு எடுத்துரைக்கிறது.',
    specialFeaturesLabel: 'சிறப்பம்சங்கள்',
    suggestedTagsLabel: 'பரிந்துரைக்கப்பட்ட குறிச்சொற்கள்',
    translateForMarketplaceBtn: 'சந்தைக்காக மொழிபெயர்க்கவும்',
    translateNotice: 'உங்கள் தள மொழியை மாற்றாமல் ஆங்கிலம் மற்றும் இந்தி மொழிபெயர்ப்புகளைப் பின்னணியில் உருவாக்குகிறது.',
    marketplaceTranslationsReady: 'வாங்குபவர்களுக்கான மொழிபெயர்ப்பு வெற்றிகரமாக உருவாக்கப்பட்டது!',

    step7EditTitle: 'விவரங்களைத் திருத்தி உறுதிப்படுத்துக',
    editCatalogBtn: 'திருத்து',
    regenerateBtn: 'மீண்டும் உருவாக்கு',
    confirmAndPriceBtn: 'விலை நிர்ணயத்திற்குச் செல்க',
    saveChangesBtn: 'மாற்றங்களைச் சேமிக்கவும்',

    step8Title: 'ஏஐ விலை வழிகாட்டி',
    step8Subtitle: 'உங்கள் கைவினை உழைப்புக்கு நியாயமான மற்றும் லாபகரமான விலையைக் கணக்கிடுங்கள்',
    materialCostInputLabel: 'பொருட்களின் செலவு (₹)',
    productionHoursInputLabel: 'உழைத்த நேரம் (மணிகள்)',
    suggestedPriceRange: 'பரிந்துரைக்கப்படும் விலை வரம்பு',
    recommendedPrice: 'பரிந்துரைக்கப்பட்ட விலை',
    yourDirectRoyalty: 'உங்கள் நேரடி வருமானம் (87%)',
    platformLogistics: 'தள விநியோகம் மற்றும் பேக்கிங் (13%)',
    pricingExplanationTitle: 'விலை ஆய்வு விளக்கம்',
    publishProductBtn: 'பொருளை வெளியிடவும்',
    publishingProduct: 'கலாகனெக்ட்டில் வெளியிடுகிறது...',
    publishSuccessTitle: 'பொருள் வெற்றிகரமாக வெளியிடப்பட்டது!',
    publishSuccessSubtitle: 'உங்கள் கைவினைப் பொருள் உங்கள் பாரம்பரியக் கதையுடன் சந்தையில் நேரலையாக உள்ளது.',
    viewInMarketplaceBtn: 'சந்தையில் பார்க்கவும்',
    backToStudioBtn: 'அரங்கத்திற்குத் திரும்புக',

    searchPlaceholder: 'கைவினைப் பொருட்கள், கலைஞர்களைத் தேடுக...',
    allCraftsCategory: 'அனைத்துக் கலைகள்',
    potteryCategory: 'மண்பாண்டங்கள்',
    textilesCategory: 'கைத்தறி நெசவுகள்',
    metalCategory: 'உலோகக் கலைகள்',
    woodCategory: 'மரச் சிற்பங்கள்',
    paintingCategory: 'பாரம்பரிய ஓவியங்கள்',
    jewelryCategory: 'பழங்குடி நகைகள்',
    featuredGuildsTitle: 'முக்கிய கைவினைச் சங்கங்கள்',
    livingHeritageTitle: 'வாழும் பாரம்பரியக் கலைகள்',
    verifiedArtisanBadge: 'சான்றளிக்கப்பட்ட கலைஞர்',
    addToCartBtn: 'கூடையில் சேர்',
    buyNowBtn: 'உடனே வாங்கு',
    viewDetailsBtn: 'விவரம் பார்க்க',
    exploreByRegion: 'மண்டல வாரியாகப் பார்க்க',
    namasteGreeting: 'வணக்கம்',
    verifiedPatron: 'சரிபார்க்கப்பட்ட ஆதரவாளர்',

    provenanceTitle: 'கைவினைப் பூர்வீகம்',
    artisanStoryTitle: 'கைவினைஞரின் கதை மற்றும் பாரம்பரியம்',
    masteryYears: 'ஆண்டுகள் கலை அனுபவம்',
    craftTechnique: 'கைவினை உத்தி',
    craftOrigin: 'உற்பத்தி இடம்',
    capacityLabel: 'அளவு / பரிமாணங்கள்',
    specificationsTitle: 'தயாரிப்பு விவரக்குறிப்புகள்',
    creationProcessTitle: 'உருவாக்கும் விதம்',
    patronReviewsTitle: 'வாடிக்கையாளர் மதிப்புரைகள்',
    directArtisanPact: 'நேரடி கைவினைஞர் உத்தரவாதம்',
    directArtisanPactDesc: 'இடைத்தரகர்கள் இன்றி விற்பனைத் தொகையில் 87% நேரடியாக கைவினைஞரின் வங்கிக் கணக்கில் சேருகிறது.',
    shareWithFriends: 'பகிரவும்',

    ordersTitle: 'ஆர்டர்கள் மற்றும் விநியோகம்',
    ordersSubtitle: 'கைவினைப் பொருட்களின் விநியோகத்தைக் கண்காணிக்கவும்',
    allOrdersTab: 'அனைத்து ஆர்டர்கள்',
    inProgressTab: 'செயலில் உள்ளவை',
    deliveredTab: 'விநியோகிக்கப்பட்டவை',
    orderPlacedStatus: 'ஆர்டர் பெறப்பட்டது',
    packingStatus: 'இயற்கை பேக்கிங்',
    inTransitStatus: 'வழியில் உள்ளது',
    deliveredStatus: 'விநியோகிக்கப்பட்டது',
    trackShipmentBtn: 'விநியோக நிலையைக் காண்க',
    contactArtisanBtn: 'கைவினைஞரைத் தொடர்பு கொள்க',
    prepaidBadge: 'முன்பணம் செலுத்தப்பட்டது',
    orderIdLabel: 'ஆர்டர் எண்',
    dispatchAddressLabel: 'விநியோக முகவரி',
    noOrdersYet: 'செயலில் உள்ள ஆர்டர்கள் ஏதுமில்லை.',

    profileTitle: 'சுயவிவரம் மற்றும் அமைப்புகள்',
    userRoleLabel: 'கணக்கு வகை',
    artisanProfileBadge: 'கைவினைஞர் கணக்கு',
    buyerProfileBadge: 'வாங்குபவர் கணக்கு',
    preferredLanguageSetting: 'விருப்ப மொழி',
    changeLanguagePrompt: 'முழு பயன்பாட்டிற்கும் உங்கள் விருப்ப மொழியைத் தேர்வுசெய்யவும்',
    helpSupport: 'கைவினைஞர் உதவி மையம்',
    directHelpline: 'உதவி எண்: 1800-KALA-MART (கட்டணமில்லா எண்)',
    shippingAddresses: 'சேமிக்கப்பட்ட முகவரிகள்',
    paymentMethods: 'வங்கி மற்றும் கட்டண முறை',
    signOutBtn: 'வெளியேறுக',
    wishlistLabel: 'விருப்பப் பட்டியல்',

    cartTitle: 'உங்கள் கூடை',
    cartEmpty: 'கூடை காலியாக உள்ளது',
    cartSubtotal: 'மொத்தத் தொகை',
    directRoyaltyNote: '87% நேரடியாக கைவினைஞருக்குச் செல்கிறது',
    freeEcoDelivery: 'இலவச இயற்கை விநியோகம்',
    checkoutBtn: 'பணம் செலுத்தத் தொடர்க',
    quantityLabel: 'எண்ணிக்கை',
    itemRemoved: 'கூடையிலிருந்து நீக்கப்பட்டது',

    voiceAssistantTitle: 'கலாகனெக்ட் குரல் உதவியாளர்',
    voiceAssistantSubtitle: 'பொருட்களைத் தேட இயல்பாகப் பேசுங்கள்',
    voiceAssistantPrompt: 'நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    trySaying: 'இப்படிப் பேசலாம்:',
    sampleCommand1: '"கச் மண்பாண்டங்களைக் காட்டு"',
    sampleCommand2: '"எனது ஆர்டர்களைத் திற"',
    sampleCommand3: '"குரல் வழி புதிய பொருளைச் சேர்"',

    narratedInNativeTongue: 'பாரம்பரிய வட்டார வழக்கில் விவரிக்கப்பட்டுள்ளது',
    viewProfile: 'சுயவிவரம் காண்க',
    exploreCollection: 'தொகுப்பை ஆராய்க',
    howItsHandcrafted: 'கைவினை உருவாக்க முறை',
    sacredStages: 'புனித படிநிலைகள்',
    craftHeritageAndHealing: 'பாரம்பரிய கைவினைப் பெருமை & வரலாறு',
    masterCraftSpecs: 'கைவினைப் பொருள் விவரக்குறிப்பு',
    patronExperiences: 'வாடிக்கையாளர் மதிப்புரைகள்',
    directArtisanRoyalty: 'நேரடி கைவினைஞர் உரிமைத்தொகை',
    directPill: 'நேரடியாக படைப்பாளருக்கு',
    toastAddedToBag: 'உங்கள் கூடையில் சேர்க்கப்பட்டது!',
    addToBag: 'கூடையில் சேர்',
    instantCheckout: 'பணம் செலுத்தத் தயாராகிறது...',
    buyNow: 'உடனே வாங்கு',
    estimatedDispatch: '24 மணி நேரத்தில் பிளாஸ்டிக்கற்ற சூழல் பாதுகாப்புப் பெட்டியில் அனுப்பப்படும்',
    yearsLineage: 'ஆண்டுகள் பாரம்பரியம்',
    govtAwardedMaster: 'அரசு விருது பெற்ற தலைமை கைவினைஞர்',
    specialty: 'சிறப்புத் தேர்ச்சி',
    playingAudioStory: 'கைவினைஞரின் குரல் கதை ஒலிக்கிறது',
    hearArtisanStory: 'கைவினைஞரின் கதையைக் கேட்க',
    reviewsCount: 'மதிப்புரைகள்',
    backToMarketplace: 'சந்தை முகப்பிற்குத் திரும்பு',

    artisan: 'கைவினைஞர்',
    totalEarnings: 'மொத்த வருவாய்',
    productsListed: 'பட்டியலிடப்பட்ட பொருட்கள்',
    wishlist: 'விருப்பப் பட்டியல்',
    bankAccount: 'வங்கி பரிவர்த்தனை கணக்கு',
    activeOrders: 'நடப்பு ஆர்டர்கள்',
    primaryDeliveryAddress: 'முதன்மை விநியோக முகவரி',
    ecoPackagingNotice: '100% மக்கும் இயற்கை பாதுகாப்பான பேக்கேஜிங்',
    selectLanguage: 'பயன்பாட்டு மொழியைத் தேர்ந்தெடுக்கவும்',
    toastLanguageChanged: 'மொழி வெற்றிகரமாக மாற்றப்பட்டது!',
    supportArtisanGuild: 'கைவினைஞர் சங்க ஆதரவு',
    supportPatronConcierge: 'வாடிக்கையாளர் பாரம்பரிய சேவை',
    supportArtisanDescription: 'புகைப்படம் எடுத்தல், விலை நிர்ணயம், வங்கிப் பரிவர்த்தனைகள் குறித்த நேரடி வழிகாட்டல்.',
    supportPatronDescription: 'சான்றிதழ் சரிபார்ப்பு மற்றும் பாதுகாப்பான விநியோகத்திற்கான உடனடி உதவி.',
    switchToBuyerMarketplace: 'வாங்குபவர் சந்தைக்கு மாறு',
    switchToArtisanStudio: 'கைவினைஞர் ஸ்டுடியோவிற்கு மாறு',
    logOut: 'வெளியேறு',

    voiceCatalogCraft: 'குரல் வழி பட்டியலிடல்',
    viewOrders: 'ஆர்டர்களைக் காண்க',
    performanceEarnings: 'செயல்திறன் & வருமானம்',
    weekly: 'வாராந்திர',
    monthly: 'மாதாந்திர',
    dispatched: 'அனுப்பப்பட்டது',
    productViews: 'பார்வைகள்',
    aiInsights: 'கைவினைஞர் செயற்கை நுண்ணறிவு பகுப்பாய்வு',
    smartAdvisor: 'ஸ்மார்ட் கைவினை ஆலோசகர்',
    voiceCatalogingTitle: 'செயற்கை நுண்ணறிவு குரல் பட்டியலிடல்',
    voiceFirstCatalogHeading: 'குரல் வழி கைவினைப் பொருள் சேர்த்தல்',
    voiceFirstCatalogSubheading: 'உங்கள் கைவினைப் பொருளைப் புகைப்படம் எடுத்து உங்கள் தாய்மொழியில் பேசுங்கள். தானாகவே விவரங்கள் உருவாகும்.',
    recentOrdersDispatch: 'சமீபத்திய ஆர்டர்கள் & விநியோகம்',
    trackOrder: 'ஆர்டரைக் கண்காணிக்க',
    myProductsManagement: 'எனது தயாரிப்புகள் & இருப்பு விவரம்',
    liveInventory: 'நேரடி இருப்பு',
    inStock: 'இருப்பில் உள்ளது',
    viewDetails: 'விவரங்களை காண்க',

    orderManagement: 'ஆர்டர் மேலாண்மை',
    artisanDispatchTitle: 'கைவினைஞர் ஆர்டர்கள் & விநியோகம்',
    buyerOrdersTitle: 'எனது கைவினை ஆர்டர்கள்',
    artisanOrdersView: 'கைவினைஞர் பார்வை',
    buyerOrdersView: 'வாங்குபவர் கண்காணிப்பு',
    allOrders: 'அனைத்து ஆர்டர்கள்',
    orderStatusNew: 'புதிய ஆர்டர்',
    orderStatusAccepted: 'ஏற்கப்பட்டது',
    orderStatusPreparing: 'தயாராகிறது',
    orderStatusReadyToShip: 'அனுப்பத் தயார்',
    orderStatusShipped: 'பயணத்தில் உள்ளது',
    orderStatusDelivered: 'வழங்கப்பட்டது',
    noOrdersFound: 'இந்த பிரிவில் ஆர்டர்கள் எதுவும் இல்லை.',
    tryResettingFilters: 'மேலே உள்ள வேறு வடிகட்டியைத் தேர்ந்தெடுக்கவும்.',
    buyer: 'வாங்குபவர்',
    deliveryProgress: 'டெலிவரி நிலை',
    step: 'படி',
    acceptOrder: 'ஆர்டரை ஏற்றுக்கொள்',
    declineOrder: 'ஆர்டரை நிராகரி',
    advanceStatus: 'நிலையை முன்னேற்று',
    orderDeliveredSuccessfully: 'ஆர்டர் வெற்றிகரமாக வழங்கப்பட்டது',
    liveTrackingMap: 'நேரடி கண்காணிப்பு வரைபடம்',
    chatWithMaker: 'கைவினைஞருடன் உரையாட',

    curatedBag: 'தேர்ந்தெடுக்கப்பட்ட பாரம்பரியப் பொருட்கள்',
    directGISourced: 'நேரடி புவிசார் குறியீடு பெற்ற கைவினைப் பொருட்கள்',
    directRoyaltyBreakdown: 'கைவினைஞர் உரிமைத்தொகை விவரம்',
    payoutToMaker: 'படைப்பாளருக்கு நேரடி கட்டணம்',
    directRemittance: 'நேரடி வங்கி செலுத்துகை',
    directRoyaltySubtext: 'கலாகனெக்ட் மூலம் நீங்கள் வாங்கும்போது தரகு எதுவும் பிடித்தம் செய்யப்படுவதில்லை. முழுத் தொகையும் கைவினைஞரின் வங்கிக்கு நேரடியாகச் சேர்கிறது.',
    totalPayable: 'செலுத்த வேண்டிய மொத்தத் தொகை',
    taxShippingIncluded: 'வரி மற்றும் சூழல் விநியோகம் சேர்க்கப்பட்டுள்ளது',
    securingRoyalty: 'உரிமைத்தொகை பாதுகாக்கப்படுகிறது...',
    proceedToPayment: 'பணம் செலுத்தத் தொடர்க',
    cartEmptySubtext: 'இந்தியா முழுவதும் உள்ள கைவினைஞர்களால் உருவாக்கப்பட்ட அசல் தயாரிப்புகளைக் கண்டறியவும்.',

    listeningInNativeTongue: 'உங்கள் மொழியைக் கவனிக்கிறது...',
    voiceQueryProcessed: 'கோரிக்கை வெற்றிகரமாக செயலாக்கப்பட்டது',
    liveSpeechInput: 'குரல் பதிவு உள்ளீடு',
    tapToSpeakSuggested: 'பேச பரிந்துரைகளில் ஒன்றைத் தொடவும்:',

    region: 'மண்டலம்',
    heritageDiscovery: 'பாரம்பரியக் கண்டுபிடிப்பு',
    exploreCraftGuilds: 'பாரம்பரிய கைவினைச் சங்கங்கள்',
    guildSubtext: 'தலைமுறை தலைமுறையாகப் பாரம்பரியத்தைக் காக்கும் சங்கங்களுடன் நேரடியாக இணையுங்கள்.',
    allRegions: 'அனைத்து மண்டலங்கள்',
    westZone: 'மேற்கு மண்டலம்',
    northZone: 'வடக்கு மண்டலம்',
    southZone: 'தெற்கு மண்டலம்',
    eastZone: 'கிழக்கு மண்டலம்',
    verifiedGuilds: 'சான்றளிக்கப்பட்ட சங்கக் கலைஞர்கள்',
    craftsCount: 'பாரம்பரிய கைவினைப் பொருட்கள்',

    navMarketplace: 'சந்தை',
    navGuilds: 'சங்கங்கள்',
    artisanStudio: 'ஸ்டுடியோ',
    addedToWishlist: 'விருப்பப் பட்டியலில் சேர்க்கப்பட்டது!',
    removedFromWishlist: 'விருப்பப் பட்டியலிலிருந்து நீக்கப்பட்டது',

    deliveringTo: 'டெலிவரி முகவரி',
    searchCraftsPlaceholder: 'அசல் புவிசார் கைவினைப் பொருட்கள், நெசவுகள், பானைகளைத் தேடுங்கள்...',
    filteringBy: 'வடிகட்டப்பட்டது',
    category: 'வகை',
    clearAll: 'அனைத்தையும் நீக்கு',
    craftStoryOfDay: 'சிறப்புப் பாரம்பரியக் கைவினை',
    discoverCrafts: 'அசல் இந்திய கைவினைப் பொருட்கள்',
    exploreMap: 'பாரம்பரிய வரைபடம்',
    heritageCategories: 'பாரம்பரிய கைவினைத் துறைகள்',
    authenticTechniques: 'நேரடி புவிசார் குறியீடு பெற்ற பாரம்பரியங்கள்',
    resetFilters: 'வடிகட்டிகளை மீட்டமை',
    directFromMasters: 'தலைமை கைவினைஞர்களிடமிருந்து நேரடியாக',
    allMasters: 'அனைத்து சங்க மாஸ்டர்கள்',
    viewCreations: 'கைவினைப் பட்டியலைக் காண்க',
    curatedSelection: 'கைவினைப் படைப்புகள்',
    heritageMasterpieces: 'பிராந்திய பாரம்பரியத்திலிருந்து நேரடியாக வரும் அசல் படைப்புகள்',
    featured: 'சிறப்புப் பொருட்கள்',
    recent: 'சமீபத்திய படைப்புகள்',
    noCraftsFound: 'உங்கள் வடிகட்டலுக்குப் பொருத்தமான பொருட்கள் எதுவும் இல்லை.',
    filterCrafts: 'கைவினைகளை வடிகட்டு',
    filterByRegion: 'மண்டலம் வாரியாக வடிகட்டு',
    maxPrice: 'அதிகபட்ச விலை வரம்பு',
    applyFilters: 'தேர்வை உறுதிசெய்',
    meetTheArtisan: 'தலைமை கைவினைஞரை சந்திக்கவும்',

    // Additional Screen & Navigation Titles
    b2bPortal: 'மொத்த வர்த்தக மையம்',
    adminTrustPortal: 'சரிபார்ப்பு & நம்பிக்கை மையம்',
    myProducts: 'என் கைவினைப் பொருட்கள்',
    productManagement: 'பொருள் மேலாண்மை',
    pitchDemo: 'செயல்முறை வழிகாட்டி',
    b2b: 'மொத்த வணிகம்',
    notifications: 'அறிவிப்புகள்',
    viewCart: 'கூடை',
    userProfile: 'சுயவிவரம்',
    navHome: 'முகப்பு',
    navProducts: 'பொருட்கள்',
    navCreateProduct: 'புதிய பொருள்',
    navExplore: 'ஆராய்க',

    // Marketplace & Discover
    directClusterSourced: 'நேரடி புவிசார் சரக்கு',
    welcomeUser: 'வணக்கம்',
    verifiedPatronBadge: 'சரிபார்க்கப்பட்ட வாங்குபவர்',
    curatedSelectionTag: 'தேர்ந்தெடுக்கப்பட்டவை',
    authenticCraftsCatalog: 'கைவினைப் படைப்புகள்',
    craftsLabel: 'பொருட்கள்',
    featuredMasterpieces: 'சிறப்பானவை',
    readyToShip: 'உடனடி அனுப்பல்',
    readyToDispatch: 'அனுப்பத் தயார்',
    giCertifiedBadge: 'புவிசார் சான்றிதழ்',
    craftDisciplines: 'பாரம்பரிய துறைகள்',
    exploreByCraftCategory: 'கைவினைப் பிரிவுகள்',
    viewAllBtn: 'அனைத்தும் காண்க',
    livingHeritageStories: 'வாழும் பாரம்பரியங்கள்',
    meetTheArtisansTitle: 'தலைசிறந்த கைவினைஞர்கள்',
    meetTheArtisansSubtitle: 'ஒவ்வொரு படைப்பிற்கும் பின்னால் ஒரு கைவினைஞரின் வாழ்நாள் அர்ப்பணிப்பு',
    giCertifiedMaster: 'புவிசார் சான்றளிக்கப்பட்ட கலைஞர்',
    featuredHandcrafts: 'கைவினைத் தயாரிப்புகள்',
    creationsLabel: 'படைப்புகள்',
    viewCrafts: 'படைப்புகள்',
    curatedMasterSeries: 'சிறப்புக் களஞ்சியம்',
    authenticCraftCollections: 'பாரம்பரிய கைவினைத் தொகுப்புகள்',
    craftCollectionsSubtitle: 'வரலாற்றுப் பின்னணியும் புவிசார் அங்கீகாரமும் கொண்ட பிரத்யேகத் தொகுப்புகள்',
    directArtisanBulkSourcing: 'மொத்த வணிகச் சந்தை (B2B)',
    cooperativeDirect: 'அங்கீகரிக்கப்பட்ட கூட்டுறவு',
    lookingToSourceInBulk: 'மொத்தமாக வாங்க விரும்புகிறீர்களா?',
    bulkSourcingSubtitle: 'ஹோட்டல்கள், கார்ப்பரேட் பரிசுகள் மற்றும் உள்துறை வடிவமைப்பாளர்களுக்காக நேரடியாக கைவினைஞர்களிடமிருந்து மொத்த கொள்முதல்.',
    wholesaleTiers: 'நேரடி மொத்த விலை',
    wholesaleTiersSub: '20-35% சில்லறை விலையை விடக் குறைவு',
    giProvenance: 'புவிசார் சான்றிதழ்',
    giProvenanceSub: 'அங்கீகரிக்கப்பட்ட கைவினைச் சான்றிதழ்',
    customBranding: 'பிரத்யேக பேக்கிங்',
    customBrandingSub: 'கார்ப்பரேட் கதை அட்டை மற்றும் பேக்கிங்',
    bulkOrderAvailable: 'மொத்த ஆர்டர் கிடைக்கும்',
    wholesaleTierLabel: 'மொத்த விற்பனை அடுக்கு',
    savePercentage: 'சேமிப்பு',
    requestBulkQuote: 'மொத்த விலை கேட்க',
    quoteBtn: 'விலைக் குறிப்பு',
    capacity: 'அளவு:',
    leadTime: 'நேரம்:',

    // Hero Banner
    heroProvenanceTag: 'நேரடி புவிசார் குறியீடு',
    heroLivingHeritage: 'பாரம்பரிய கைவினை',
    heroDirectMasters: 'நேரடி கைவினைஞர் சந்தை',
    heroTitle: 'பாரம்பரியக் கலைகளின் தூய கைவண்ணம்',
    heroSubtitle: 'தலைமுறை தலைமுறையாக போற்றி வளர்க்கப்படும் பாரம்பரிய கைவினைப் பொருட்கள். இடைத்தரகர்கள் இன்றி கைவினைஞர்களிடமிருந்து நேரடியாக.',
    heroHandcrafted: '100% கைவினை',
    heroDirectRoyalties: 'முழு ஊதியம்',
    heroEcoPackaged: 'பிளாஸ்டிக் அற்றது',
    heroExploreMasterpieces: 'சிறப்புப் படைப்புகள்',
    heroMeetArtisans: 'கைவினைஞர்களைச் சந்திக்கவும்',

    // Search & Filters
    searchMarketplacePlaceholder: 'பொருள், கலை, கைவினைஞர், பகுதி தேடவும்...',
    voiceSearch: 'குரல் தேடல்',
    filterOptions: 'வடிப்பான்கள்',
    filtersCleared: 'வடிப்பான்கள் நீக்கப்பட்டன',
    voiceSearchListening: 'குரல் கேட்கிறது...',

    // Offline & Status
    offlineLabel: 'ஆஃப்லைன்',
    syncingLabel: 'ஒத்திசைக்கிறது',
    onlineLabel: 'ஆன்லைன்',
    offlineNotice: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். உங்கள் பணி இந்த சாதனத்தில் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளது.',
    syncingNotice: 'மேகக்கணியுடன் ஒத்திசைக்கிறது...',
    syncedNotice: 'அனைத்து மாற்றங்களும் வெற்றிகரமாக ஒத்திசைக்கப்பட்டன.',
    syncQueue: 'ஒத்திசைவு வரிசை',
    demoMode: 'மாதிரி முறை',
    simulateOffline: 'ஆஃப்லைன் சோதனை',
    turnOnlineOn: 'இணைக்க',
    savedLocally: 'சாதனத்தில் சேமிக்கப்பட்டது',
    waitingToSync: 'ஒத்திசைக்கக் காத்திருக்கிறது',
    syncFailed: 'ஒத்திசைவு தோல்வி',
    inQueue: 'வரிசையில்',

    // Product Details & Trust
    whyTrustTitle: 'இந்த தயாரிப்பை ஏன் நம்ப வேண்டும்?',
    whyTrustSubtitle: 'சரிபார்க்கப்பட்ட கைவினைஞர் சான்றுகள் மற்றும் கைமுறை உற்பத்தி உத்தரவாதம்',
    viewAudit: 'ஆய்வு விவரம்',
    verified: 'சரிபார்க்கப்பட்டது',
    inReview: 'மதிப்பாய்வில்',
    trustProgramTitle: 'அதிகாரப்பூர்வ கைவினை சரிபார்ப்புத் திட்டம்',
    trustProgramDesc: 'கைவினைஞர்களின் அறிவிப்புகள், பட்டறை சான்றுகள் மற்றும் புவிசார் தரவுகளை நேர்மையாக சரிபார்க்கிறோம்.',
    authenticityAuditLog: 'நம்பகத்தன்மை ஆய்வுப் பதிவு',
    artisanVerificationLevel: 'கைவினைஞர் சரிபார்ப்பு நிலை',
    closeAudit: 'மூடுக',
    buyerPreviewMode: 'வாங்குபவர் மாதிரிப் பார்வை',
    backToMyProducts: 'என் தயாரிப்புகளுக்குத் திரும்பு',
    cleaningTab: 'சுத்தம் செய்தல்',
    seasoningTab: 'பக்குவப்படுத்துதல்',
    storageTab: 'பாதுகாத்தல்',
    aboutCreation: 'படைப்பு விளக்கம்',
    sendInquiryTo: 'கைவினைஞரிடம் கேள்வி கேட்கவும்',
    masterCraftDetails: 'கைவினை நுணுக்க விவரங்கள்',
    materialsLabel: 'பொருட்கள்',
    craftTechniqueLabel: 'கைவினை உத்தி',
    productionTimeLabel: 'உற்பத்தி நேரம்',
    dimensionsLabel: 'அளவுகள்',
    careInstructionsLabel: 'பராமரிப்பு மற்றும் ஆயுள் வழிகாட்டுதல்',
    livingHeritage: 'வரலாற்றுப் பாரம்பரியம்',
    aboutCraft: 'இந்தக் கைவினையைப் பற்றி',
    viewArtisanProfile: 'கைவினைஞர் விவரக்குறிப்பு',
    requestQuoteBulk: 'மொத்த கொள்முதல் விலை கோரிக்கை',
    b2bWholesaleTitle: 'மொத்த கொள்முதல் மற்றும் நிறுவன ஆதரவு',
    bulkAvailable: 'மொத்தமாக கிடைக்கும்',
    b2bWholesaleDesc: 'ஹோட்டல்கள், கார்ப்பரேட் பரிசுகள், சில்லறை விற்பனையாளர்களுக்கான நேரடி கொள்முதல்',
    orderAvailability: 'ஆர்டர் கிடைக்கும் தன்மை',
    moqLabel: 'குறைந்தபட்ச ஆர்டர் (MOQ)',
    productionCapacity: 'உற்பத்தி திறன்',
    approxLeadTime: 'தோராயமான தயாரிப்பு நேரம்',
    tieredWholesalePrice: 'அடுக்கு மொத்த விலை',
    cleaningCareTip: 'மிதமான வெதுவெதுப்பான நீரில் மென்மையான இயற்கை நார் கொண்டு மெதுவாக சுத்தம் செய்யவும். செயற்கை ரசாயனங்களைத் தவிர்க்கவும்.',
    seasoningCareTip: 'முதல் முறை பயன்படுத்தும் முன், 8 மணி நேரம் சுத்தமான தண்ணீரில் ஊறவைத்து, பின் நல்லெண்ணெய் தடவி உலர்த்தவும்.',
    storageCareTip: 'ஈரப்பதமில்லாத, நல்ல காற்றோட்டமுள்ள உலர்ந்த இடத்தில் வைக்கவும். கனமான உலோகப் பொருட்களை அடுக்க வேண்டாம்.',

    // Checkout & Forms
    contactInfo: 'தொடர்பு தகவல்',
    deliveryAddress: 'டெலிவரி முகவரி',
    streetAddress: 'தெரு முகவரி, வீடு/பிளாட் எண்',
    landmarkOptional: 'அடையாளக் குறி (விருப்பமானது)',
    city: 'நகரம் / ஊர்',
    state: 'மாநிலம்',
    pincode: 'அஞ்சல் குறியீடு (6 இலக்கங்கள்)',
    paymentMethodLabel: 'பணம் செலுத்தும் முறை',
    itemsInOrder: 'ஆர்டரில் உள்ள பொருட்கள்',
    directlyToArtisan: 'நேரடியாக கைவினைஞருக்கு',
    payNow: 'பணம் செலுத்தி ஆர்டர் செய்க',
    secureGiCheckout: 'பாதுகாப்பான ஜிஐ பணம் செலுத்துதல்',
    checkoutSubtitle: 'நேரடி கைவினைஞர் நிதி & சூழல் பாதுகாப்பு பொதி',
    paymentArchitecture: 'பணப்பரிவர்த்தனை அமைப்பு',
    demoSimulation: 'டெமோ உருவகப்படுத்துதல்',
    productionGateway: 'உண்மையான உற்பத்தி நுழைவாயில்',
    selectPaymentRail: 'கட்டண முறையைத் தேர்ந்தெடுக்கவும்',
    payAndPlaceOrder: 'பணம் செலுத்தி ஆர்டர் செய்க',

    // Offline Sync & Demo
    offlineSyncQueue: 'ஆஃப்லைன் ஒத்திசைவு வரிசை',
    syncNow: 'இப்போது ஒத்திசைக்க',
    retryFailed: 'தோல்வியுற்றதை மீண்டும் முயற்சிக்கவும்',
    clearSynced: 'ஒத்திசைக்கப்பட்டதை அழிக்கவும்',
    runDemoMode: 'டெமோ பயன்முறையை இயக்கவும்',
    allChangesSynced: 'அனைத்து மாற்றங்களும் வெற்றிகரமாக ஒத்திசைக்கப்பட்டன.',
    offlineNoticeDetail: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். உங்கள் வேலை இந்த சாதனத்தில் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளது.',
    offlineDemoTitle: 'ஆஃப்லைன் ஒத்திசைவு நேரடி மாதிரி',
    offlineDemoSubtitle: 'கிராமப்புற கைவினைஞர்களுக்கான நேரடி முழுமையான செயல்விளக்கம்',
    startInteractiveDemo: 'ஊடாடும் உருவகப்படுத்துதலைத் தொடங்குக',

    // Greetings & Studio
    goodMorning: 'காலை வணக்கம்',
    goodAfternoon: 'மதிய வணக்கம்',
    goodEvening: 'மாலை வணக்கம்',
    studioEncouraging: 'உங்கள் கைவினைப் பொருளை உலகத்துடன் பகிரத் தயாரா?',
    defaultGuildName: 'பாரம்பரிய கைவினைஞர் சங்கம்',
    productRemovedToast: 'பொருள் நீக்கப்பட்டது.',
    shopLinkCopiedToast: 'பொருளின் இணைப்பு நகலெடுக்கப்பட்டது!',

    // Artisan Profile & Story
    artisanStory: 'கதை & பரம்பரை',
    bulkAndCustom: 'மொத்த சப்ளை',
    masterBiography: 'வாழ்க்கைக் குறிப்பு',
    honoursAndAwards: 'விருதுகள் மற்றும் கௌரவங்கள்',
    bulkSourcingTitle: 'நேரடி மொத்த ஆர்டர்கள்',
    directFromCluster: 'கூட்டுறவு பட்டறையிலிருந்து நேரடியாக',
    addedToBagToast: 'பையில் சேர்க்கப்பட்டது',

    // Welcome Screen
    welcomeHeroSubtitle: 'பாரம்பரிய கைவினைஞர்களை நவீன டிஜிட்டல் வாங்குபவர்களுடன் குரல் வழியில் நேரடியாக இணைக்கும் தளம்.',
    b2bCardSubtitle: 'மொத்த ஆர்டர்கள் மற்றும் ஏற்றுமதி விலைப்புள்ளி',
    adminCardSubtitle: 'தயாரிப்பு ஒப்புதல் மற்றும் கைவினைஞர் சரிபார்ப்பு',

    // Auth Screen Roles
    roleArtisan: 'கைவினைஞர்',
    roleArtisanDesc: 'பாரம்பரிய கைவினைத் திறனாளர்',
    roleBuyer: 'வாங்குபவர்',
    roleBuyerDesc: 'கலை ஆர்வலர் & சேகரிப்பாளர்',
    roleB2B: 'மொத்த வாங்குபவர்',
    roleB2BDesc: 'மொத்த வர்த்தகம் & கார்ப்பரேட்',
    roleAdmin: 'நிர்வாகி',
    roleAdminDesc: 'சரிபார்ப்பு & தணிக்கை',

    // Order Actions Toasts
    orderConfirmedToast: 'ஆர்டர் உறுதிப்படுத்தப்பட்டது!',
    orderDeclinedToast: 'ஆர்டர் நிராகரிக்கப்பட்டது'
  },

  // ==========================================
  // HINDI (hi) - 100% STRICT SINGLE LANGUAGE
  // ==========================================
  hi: {
    brandName: 'कलाकनेक्ट',
    tagline: 'पारंपरिक शिल्प कौशल को आधुनिक डिजिटल वाणिज्य से जोड़ना',
    back: 'वापस',
    cancel: 'रद्द करें',
    continue: 'आगे बढ़ें',
    save: 'सहेजें',
    edit: 'संशोधित करें',
    delete: 'हटाएं',
    confirm: 'पुष्टि करें',
    loading: 'लोड हो रहा है...',
    giCertified: 'जीआई प्रमाणित',
    handmade: '100% हस्तनिर्मित',
    directRoyalty: 'कारीगर को सीधा भुगतान',
    zeroPlastic: 'प्लास्टिक मुक्त पर्यावरण अनुकूल पैकेजिंग',
    rupeeSymbol: '₹',
    chooseLanguage: 'अपनी पसंदीदा भाषा चुनें',
    selectLanguageTitle: 'भाषा',
    english: 'English',
    tamil: 'தமிழ்',
    hindi: 'हिन्दी',
    securePortal: 'सुरक्षित पोर्टल',
    toastCopied: 'कॉपी किया गया!',

    welcomeHeroTag: 'भारत की जीवंत धरोहर',
    welcomeHeroTitle: 'कारीगर के हाथों से आपके दिल तक, सीधे बाज़ार तक।',
    welcomeWhoAreYou: 'आप कौन हैं?',
    welcomeChooseExperience: 'अपना कलाकनेक्ट अनुभव चुनें',
    welcomeChooseSubtitle: 'कृपया अपने समर्पित पोर्टल पर जाने के लिए अपनी भूमिका चुनें।',
    artisanRoleTitle: 'मैं एक कारीगर हूँ',
    artisanRoleDesc: 'आवाज़ से उत्पाद सूची बनाएं, उत्पादन संभालें, उचित एआई मूल्य निर्धारण पाएं और सीधा बैंक भुगतान प्राप्त करें।',
    artisanBadge: 'कारीगर और शिल्प संघ',
    artisanAction: 'कारीगर स्टूडियो में प्रवेश करें',
    buyerRoleTitle: 'मैं एक खरीदार हूँ',
    buyerRoleDesc: 'प्रमाणित जीआई हस्तशिल्प खोजें, पारंपरिक उस्ताद कारीगरों का समर्थन करें और सांस्कृतिक विरासत से जुड़ें।',
    buyerBadge: 'कला संरक्षक और संग्राहक',
    buyerAction: 'बाज़ार में प्रवेश करें',
    featureZeroCommission: 'सीधा बैंक भुगतान',
    featureZeroCommissionDesc: 'बिना किसी बिचौलिए के 87% तक की राशि सीधे कारीगर के बैंक खाते में जाती है।',
    featureVoiceCataloging: 'आवाज़ से कैटलॉग बनाएं',
    featureVoiceCatalogingDesc: 'अपनी मातृभाषा में बोलकर आसानी से नए उत्पाद सूचीबद्ध करें।',
    featureAuthenticGi: 'असली जीआई शिल्प',
    featureAuthenticGiDesc: 'सीधी प्रामाणिकता ट्रैकिंग और सत्यापित उस्ताद कारीगरों की कला।',

    artisanPortal: 'कारीगर पोर्टल',
    buyerPortal: 'खरीदार पोर्टल',
    loginTab: 'लॉग इन',
    signupTab: 'साइन अप',
    emailOrPhone: 'फ़ोन नंबर या ईमेल',
    phone: 'फ़ोन नंबर',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    fullName: 'पूरा नाम',
    location: 'स्थान (गाँव या शहर)',
    craftSpecialization: 'शिल्प विशेषता',
    artisanGuild: 'कारीगर संघ या समुदाय',
    forgotPassword: 'पासवर्ड भूल गए?',
    resetPassword: 'पासवर्ड रीसेट करें',
    resetInstructions: 'कृपया अपना पंजीकृत फ़ोन या ईमेल दर्ज करें। पासवर्ड रीसेट निर्देश भेजे जाएंगे।',
    sendResetLink: 'रीसेट लिंक भेजें',
    quickDemoArtisan: 'कारीगर डेमो लॉग इन',
    quickDemoBuyer: 'खरीदार डेमो लॉग इन',
    testArtisanName: 'मास्टर कुम्हार रामदेव',
    testArtisanRole: 'कच्छ मिट्टी शिल्पकार • भुज, गुजरात',
    testBuyerName: 'प्रिया शर्मा',
    testBuyerRole: 'विरासत कला संग्राहक • बेंगलुरु',
    loginAsArtisan: 'कारीगर के रूप में लॉग इन करें',
    loginAsBuyer: 'खरीदार के रूप में लॉग इन करें',
    registerAsArtisan: 'कारीगर के रूप में पंजीकरण करें',
    registerAsBuyer: 'खरीदार खाता बनाएं',
    switchToBuyer: 'हस्तशिल्प खरीदना चाहते हैं? खरीदार पोर्टल पर जाएं',
    switchToArtisan: 'क्या आप एक कारीगर हैं? कारीगर प्रमाणीकरण पर जाएं',
    backToRoles: 'भूमिका चयन पर वापस जाएं',
    enterEmailOrPhoneError: 'कृपया अपना फ़ोन नंबर या ईमेल दर्ज करें।',
    enterPasswordError: 'कृपया अपना पासवर्ड दर्ज करें।',
    passwordMinError: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
    fullNameError: 'पूरा नाम आवश्यक है।',
    emailError: 'कृपया एक वैध ईमेल दर्ज करें।',
    phoneError: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।',
    passwordMatchError: 'पासवर्ड मेल नहीं खाते।',
    locationError: 'स्थान आवश्यक है।',
    oneClickLogin: '1-क्लिक लॉग इन',
    newArtisanSignup: 'नए कारीगर? यहाँ पंजीकरण करें →',
    newBuyerSignup: 'नए ग्राहक? खरीदार खाता बनाएं →',
    alreadyRegisteredLogin: 'पहले से पंजीकृत हैं? लॉग इन करें →',
    ecoCrateDelivery: 'इको-क्रेट डिलीवरी',
    termsAccepted: 'आगे बढ़कर, आप कलाकनेक्ट कारीगर नियमों को स्वीकार करते हैं।',

    navDiscover: 'खोजें',
    navArtisans: 'कारीगर',
    navStudio: 'स्टूडियो',
    navOrders: 'ऑर्डर',
    navProfile: 'प्रोफ़ाइल',
    navCart: 'कार्ट',
    screenMarketplaceHome: 'बाज़ार मुख्य पृष्ठ',
    screenLivingHeritageGuilds: 'जीवंत शिल्प संघ',
    screenProductDetail: 'उत्पाद विवरण',
    screenVoiceSmartStudio: 'कारीगर स्टूडियो',
    screenVoiceCataloging: 'आवाज़ से कैटलॉग',
    screenOrdersShipments: 'ऑर्डर और प्रेषण',
    screenProfileAnalytics: 'प्रोफ़ाइल और सेटिंग्स',

    masterArtisanVerified: 'प्रमाणित उस्ताद कारीगर',
    takeHomePayout: 'कुल भुगतान कमाई',
    activeShipments: 'सक्रिय ऑर्डर',
    patronViews: 'ग्राहक दृश्य',
    quickActions: 'त्वरित कार्य',
    addProduct: 'उत्पाद जोड़ें',
    voiceCatalog: 'आवाज़ कैटलॉग',
    scanProduct: 'उत्पाद स्कैन करें',
    myEarnings: 'मेरी कमाई',
    ecoPackaging: 'इको पैकेजिंग',
    myCreations: 'मेरी सक्रिय कृतियाँ',
    viewAll: 'सभी देखें',
    shareCraft: 'शिल्प साझा करें',
    removeCraft: 'हटाएं',
    fairPriceAssistantTitle: 'उचित मूल्य सहायक',
    fairPriceAssistantDesc: 'हमारा एआई सामग्री लागत और श्रम घंटों का विश्लेषण करके 87% प्रत्यक्ष लाभ सुनिश्चित करता है।',
    calculateFairPriceBtn: 'मूल्य गणना करें',
    noProductsYet: 'अभी तक कोई उत्पाद नहीं जोड़ा गया है।',
    addFirstProductHint: 'फ़ोटो या आवाज़ का उपयोग करके अपनी पहली हस्तनिर्मित रचना जोड़ें।',
    shipmentsCount: 'ऑर्डर',
    viewsCount: 'दृश्य',

    step1Title: 'उत्पाद जोड़ें',
    step1Subtitle: 'चुनें कि आप अपने शिल्प की तस्वीर कैसे देना चाहते हैं',
    takePhoto: 'फ़ोटो खींचें',
    takePhotoDesc: 'सीधे अपने कैमरे से शिल्प की तस्वीर लें',
    chooseGallery: 'गैलरी से चुनें',
    chooseGalleryDesc: 'अपने डिवाइस में सहेजी गई तस्वीर चुनें',

    step2Title: 'उत्पाद तस्वीर',
    step2Subtitle: 'तस्वीर की समीक्षा करें और स्टूडियो लाइटिंग अनुकूलित करें',
    retakePhoto: 'दोबारा लें / तस्वीर बदलें',
    continueBtn: 'आगे बढ़ें',
    preparingPhoto: 'आपकी उत्पाद तस्वीर तैयार हो रही है...',
    originalPhoto: 'मूल तस्वीर',
    enhancedPhoto: 'एआई संवर्धित तस्वीर',
    useThisPhoto: 'यह तस्वीर उपयोग करें',
    photoReadyTitle: 'उत्पाद तस्वीर तैयार है',

    step3Title: 'अपने उत्पाद के बारे में हमें बताएं',
    step3Subtitle: 'माइक दबाएं और अपने शिल्प के बारे में खुलकर स्वाभाविक रूप से बोलें',
    tapToSpeak: 'बोलने के लिए दबाएं',
    listening: 'सुन रहा हूँ... खुलकर बोलें',
    stopRecording: 'बोलना समाप्त हुआ',
    thingsYouCanTalkAbout: 'आप इन बातों के बारे में बता सकते हैं:',
    guideWhatIsProduct: 'यह क्या उत्पाद है?',
    guideMaterialsUsed: 'किन सामग्रियों का उपयोग किया गया है?',
    guideHowMade: 'इसे कैसे बनाया गया है?',
    guideTimeTaken: 'इसे बनाने में कितना समय लगता है?',
    guideTraditionalTechnique: 'क्या इसमें कोई पारंपरिक तकनीक शामिल है?',
    guideSpecialFeatures: 'इस उत्पाद को क्या खास बनाता है?',
    guideCulturalStory: 'इसके पीछे की सांस्कृतिक या पारिवारिक कहानी क्या है?',
    orTrySampleVoice: 'या नमूना आवाज़ कहानी चुनकर देखें:',
    sampleVoicePrompt1: 'यह कच्छ की नदी की चिकनी मिट्टी से बना पारंपरिक शीतल मटका है। इसमें ढाई लीटर पानी बिना फ्रिज के ठंडा रहता है और प्राकृतिक खनिज प्रदान करता है।',
    sampleVoicePrompt2: 'शुद्ध रेशम से पारंपरिक हथकरघे पर 14 दिनों में बुनी गई साड़ी, जिसमें अनार के छिलके से तैयार प्राकृतिक रंगों का प्रयोग हुआ है।',
    sampleVoicePrompt3: 'बस्तर के आदिवासी कारीगरों द्वारा मोम और पीतल धातु से ढलाई करके बनाई गई पारंपरिक ढोकरा शिल्प कलाकृति।',
    manualTextPrompt: 'या लिखकर विवरण दर्ज करें:',
    typeStoryFallback: 'यहाँ उत्पाद का विवरण या अपनी कहानी लिखें...',

    step4Understanding: 'आपकी उत्पाद कहानी को समझा जा रहा है...',
    step4IdentifyingMaterials: 'सामग्रियों की पहचान की जा रही है...',
    step4CreatingCatalog: 'आपका उत्पाद कैटलॉग बनाया जा रहा है...',
    step4ProcessingTitle: 'एआई कैटलॉग निर्माण',

    step5Title: 'एआई निर्मित उत्पाद कैटलॉग',
    step5Subtitle: 'अपनी तस्वीर और आवाज़ की कहानी से बने विवरण की समीक्षा करें',
    productImageLabel: 'उत्पाद तस्वीर',
    productNameLabel: 'उत्पाद का नाम',
    categoryLabel: 'श्रेणी',
    materialsUsedLabel: 'प्रयुक्त सामग्री',
    craftTypeLabel: 'शिल्प विधि',
    descriptionLabel: 'विवरण',
    howItsMadeLabel: 'बनाने की प्रक्रिया',
    storyBehindProductTitle: 'इस उत्पाद के पीछे की कहानी',
    storyBehindProductSubtitle: 'पीढ़ियों का ज्ञान, सांस्कृतिक विरासत और कारीगर की वास्तविक आवाज़ खरीदारों के लिए सहेजी गई है।',
    specialFeaturesLabel: 'विशेषताएं',
    suggestedTagsLabel: 'सुझाए गए टैग',
    translateForMarketplaceBtn: 'बाज़ार के लिए अनुवाद करें',
    translateNotice: 'आपकी सक्रिय भाषा बदले बिना वैश्विक खरीदारों के लिए अंग्रेज़ी और तमिल अनुवाद तैयार करता है।',
    marketplaceTranslationsReady: 'खरीदारों के लिए अनुवाद सफलतापूर्वक तैयार किए गए!',

    step7EditTitle: 'विवरण संपादित करें और पुष्टि करें',
    editCatalogBtn: 'संपादित करें',
    regenerateBtn: 'पुनः उत्पन्न करें',
    confirmAndPriceBtn: 'मूल्य निर्धारण पर जाएं',
    saveChangesBtn: 'परिवर्तन सहेजें',

    step8Title: 'एआई मूल्य निर्धारण सुझाव',
    step8Subtitle: 'अपने हस्तनिर्मित कार्य के लिए उचित और लाभकारी मूल्य निर्धारित करें',
    materialCostInputLabel: 'सामग्री लागत (₹)',
    productionHoursInputLabel: 'लगा हुआ अनुमानित समय (घंटे)',
    suggestedPriceRange: 'सुझाई गई मूल्य सीमा',
    recommendedPrice: 'अनुशंसित मूल्य',
    yourDirectRoyalty: 'आपकी प्रत्यक्ष कमाई (87%)',
    platformLogistics: 'लॉजिस्टिक्स और पर्यावरण पैकेजिंग (13%)',
    pricingExplanationTitle: 'मूल्य विश्लेषण',
    publishProductBtn: 'उत्पाद प्रकाशित करें',
    publishingProduct: 'कलाकनेक्ट पर प्रकाशित हो रहा है...',
    publishSuccessTitle: 'उत्पाद सफलतापूर्वक प्रकाशित हुआ!',
    publishSuccessSubtitle: 'आपका हस्तशिल्प आपकी प्रामाणिक कारीगर कहानी के साथ बाज़ार में लाइव है।',
    viewInMarketplaceBtn: 'बाज़ार में देखें',
    backToStudioBtn: 'स्टूडियो पर वापस जाएं',

    searchPlaceholder: 'शिल्प, कारीगर या सामग्री खोजें...',
    allCraftsCategory: 'सभी शिल्प',
    potteryCategory: 'मिट्टी शिल्प',
    textilesCategory: 'हथकरघा वस्त्र',
    metalCategory: 'धातु शिल्प',
    woodCategory: 'काष्ठ नक्काशी',
    paintingCategory: 'पारंपरिक चित्रकला',
    jewelryCategory: 'जनजातीय आभूषण',
    featuredGuildsTitle: 'प्रमुख शिल्प संघ',
    livingHeritageTitle: 'जीवंत धरोहर शिल्प',
    verifiedArtisanBadge: 'सत्यापित कारीगर',
    addToCartBtn: 'कार्ट में जोड़ें',
    buyNowBtn: 'अभी खरीदें',
    viewDetailsBtn: 'विवरण देखें',
    exploreByRegion: 'क्षेत्र अनुसार खोजें',
    namasteGreeting: 'नमस्ते',
    verifiedPatron: 'सत्यापित संरक्षक',

    provenanceTitle: 'कारीगर प्रामाणिकता',
    artisanStoryTitle: 'कारीगर कहानी और विरासत',
    masteryYears: 'वर्षों का शिल्प अनुभव',
    craftTechnique: 'शिल्प तकनीक',
    craftOrigin: 'उत्पत्ति स्थान',
    capacityLabel: 'क्षमता / माप',
    specificationsTitle: 'शिल्प विनिर्देश',
    creationProcessTitle: 'बनाने की प्रक्रिया',
    patronReviewsTitle: 'ग्राहकों की समीक्षाएं',
    directArtisanPact: 'सीधी कारीगर गारंटी',
    directArtisanPactDesc: 'शून्य बिचौलिया कटौती। उत्पाद मूल्य का 87% सीधे कारीगर के बैंक खाते में जमा होता है।',
    shareWithFriends: 'शिल्प साझा करें',

    ordersTitle: 'ऑर्डर और प्रेषण',
    ordersSubtitle: 'कारीगर प्रेषण और डिलीवरी की स्थिति देखें',
    allOrdersTab: 'सभी ऑर्डर',
    inProgressTab: 'प्रगति में',
    deliveredTab: 'वितरित',
    orderPlacedStatus: 'ऑर्डर प्राप्त हुआ',
    packingStatus: 'इको पैकेजिंग',
    inTransitStatus: 'मार्ग में है',
    deliveredStatus: 'वितरित',
    trackShipmentBtn: 'डिलीवरी ट्रैक करें',
    contactArtisanBtn: 'कारीगर से संपर्क करें',
    prepaidBadge: 'प्रीपेड सत्यापित',
    orderIdLabel: 'ऑर्डर संख्या',
    dispatchAddressLabel: 'डिलीवरी पता',
    noOrdersYet: 'कोई सक्रिय ऑर्डर नहीं मिला।',

    profileTitle: 'प्रोफ़ाइल और सेटिंग्स',
    userRoleLabel: 'खाता भूमिका',
    artisanProfileBadge: 'कारीगर खाता',
    buyerProfileBadge: 'खरीदार खाता',
    preferredLanguageSetting: 'पसंदीदा भाषा',
    changeLanguagePrompt: 'पूरे ऐप के लिए अपनी पसंदीदा भाषा चुनें',
    helpSupport: 'कारीगर सहायता केंद्र',
    directHelpline: 'हेल्पलाइन: 1800-KALA-MART (टोल-फ्री)',
    shippingAddresses: 'सहेजे गए पते',
    paymentMethods: 'बैंक और भुगतान खाते',
    signOutBtn: 'लॉग आउट',
    wishlistLabel: 'पसंदीदा सूची',

    cartTitle: 'आपकी कार्ट',
    cartEmpty: 'आपकी कार्ट खाली है',
    cartSubtotal: 'उप-योग',
    directRoyaltyNote: '87% राशि सीधे उस्ताद कारीगर को जाती है',
    freeEcoDelivery: 'मुफ़्त पर्यावरण अनुकूल डिलीवरी',
    checkoutBtn: 'भुगतान के लिए आगे बढ़ें',
    quantityLabel: 'मात्रा',
    itemRemoved: 'कार्ट से हटाया गया',

    voiceAssistantTitle: 'कलाकनेक्ट आवाज़ सहायक',
    voiceAssistantSubtitle: 'शिल्प खोजने के लिए स्वाभाविक रूप से बोलें',
    voiceAssistantPrompt: 'आज मैं आपकी विरासत यात्रा में कैसे सहायता कर सकता हूँ?',
    trySaying: 'ऐसे बोलें:',
    sampleCommand1: '"मुझे कच्छ की मिट्टी के बर्तन दिखाएं"',
    sampleCommand2: '"मेरे सक्रिय ऑर्डर खोलें"',
    sampleCommand3: '"आवाज़ से नया उत्पाद जोड़ें"',

    narratedInNativeTongue: 'पारंपरिक आंचलिक बोली में वर्णित',
    viewProfile: 'प्रोफ़ाइल देखें',
    exploreCollection: 'संग्रह देखें',
    howItsHandcrafted: 'हस्तशिल्प निर्माण प्रक्रिया',
    sacredStages: 'पवित्र चरण',
    craftHeritageAndHealing: 'शिल्प विरासत और सांस्कृतिक कथा',
    masterCraftSpecs: 'मास्टर शिल्प विनिर्देश',
    patronExperiences: 'ग्राहकों के अनुभव और समीक्षाएं',
    directArtisanRoyalty: 'सीधी कारीगर रॉयल्टी',
    directPill: 'सीधे निर्माता को',
    toastAddedToBag: 'आपकी शॉपिंग थैली में जोड़ा गया!',
    addToBag: 'थैली में जोड़ें',
    instantCheckout: 'त्वरित भुगतान की ओर बढ़ रहे हैं...',
    buyNow: 'अभी खरीदें',
    estimatedDispatch: '24 घंटे में प्लास्टिक-मुक्त टेराकोटा क्रेट में प्रेषित',
    yearsLineage: 'वर्षों की परंपरा',
    govtAwardedMaster: 'सरकार द्वारा सम्मानित उस्ताद शिल्पकार',
    specialty: 'विशेषज्ञता',
    playingAudioStory: 'कारीगर ऑडियो कथा चल रही है',
    hearArtisanStory: 'कारीगर की कहानी सुनें',
    reviewsCount: 'सत्यापित समीक्षाएं',
    backToMarketplace: 'बाज़ार पर वापस जाएं',

    artisan: 'कारीगर',
    totalEarnings: 'कुल कमाई',
    productsListed: 'सूचीबद्ध उत्पाद',
    wishlist: 'पसंदीदा सूची',
    bankAccount: 'बैंक भुगतान खाता',
    activeOrders: 'सक्रिय ऑर्डर',
    primaryDeliveryAddress: 'प्राथमिक डिलीवरी पता',
    ecoPackagingNotice: '100% पर्यावरण अनुकूल जैव-अपघटनीय पैकेजिंग',
    selectLanguage: 'ऐप की भाषा चुनें',
    toastLanguageChanged: 'भाषा सफलतापूर्वक बदल दी गई!',
    supportArtisanGuild: 'कारीगर गिल्ड सहायता',
    supportPatronConcierge: 'ग्राहक विरासत सेवा',
    supportArtisanDescription: 'उत्पाद फोटोग्राफी, मूल्य निर्धारण, बैंक भुगतान और पैकेजिंग सामग्री के लिए सीधी सहायता।',
    supportPatronDescription: 'प्रामाणिकता प्रमाण पत्र, कारीगर मूल विवरण और सुरक्षित डिलीवरी के लिए सीधा संपर्क।',
    switchToBuyerMarketplace: 'खरीदार बाज़ार पर जाएं',
    switchToArtisanStudio: 'कारीगर स्टूडियो पर जाएं',
    logOut: 'लॉग आउट',

    voiceCatalogCraft: 'आवाज़ से शिल्प सूची बनाएं',
    viewOrders: 'ऑर्डर देखें',
    performanceEarnings: 'प्रदर्शन और कमाई',
    weekly: 'साप्ताहिक',
    monthly: 'मासिक',
    dispatched: 'प्रेषित किया गया',
    productViews: 'उत्पाद दृश्य',
    aiInsights: 'कारीगर एआई व्यावसायिक सुझाव',
    smartAdvisor: 'स्मार्ट शिल्प सलाहकार',
    voiceCatalogingTitle: 'एआई वॉयस कैटलॉगिंग',
    voiceFirstCatalogHeading: 'आवाज़ से नया उत्पाद जोड़ें',
    voiceFirstCatalogSubheading: 'बस अपने उत्पाद की फोटो खींचें और अपनी मातृभाषा में बोलें। हमारी प्रणाली स्वचालित रूप से बाज़ार विवरण और जीआई प्रमाणन तैयार करती है।',
    recentOrdersDispatch: 'हाल के ऑर्डर और प्रेषण',
    trackOrder: 'ऑर्डर ट्रैक करें',
    myProductsManagement: 'मेरे उत्पाद और लाइव इन्वेंटरी',
    liveInventory: 'उपलब्ध स्टॉक',
    inStock: 'स्टॉक में उपलब्ध',
    viewDetails: 'विवरण देखें',

    orderManagement: 'ऑर्डर प्रबंधन',
    artisanDispatchTitle: 'कारीगर ऑर्डर और रसद',
    buyerOrdersTitle: 'मेरे विरासत ऑर्डर',
    artisanOrdersView: 'कारीगर दृश्य',
    buyerOrdersView: 'खरीदार ट्रैकिंग दृश्य',
    allOrders: 'सभी ऑर्डर',
    orderStatusNew: 'नया ऑर्डर',
    orderStatusAccepted: 'स्वीकृत',
    orderStatusPreparing: 'शिल्प तैयार हो रहा है',
    orderStatusReadyToShip: 'भेजने के लिए तैयार',
    orderStatusShipped: 'रास्ते में है',
    orderStatusDelivered: 'डिलीवर किया गया',
    noOrdersFound: 'इस फ़िल्टर के लिए कोई ऑर्डर नहीं मिला।',
    tryResettingFilters: 'कृपया ऊपर से कोई अन्य फ़िल्टर चुनें।',
    buyer: 'खरीदार',
    deliveryProgress: 'डिलीवरी प्रगति',
    step: 'चरण',
    acceptOrder: 'ऑर्डर स्वीकार करें',
    declineOrder: 'ऑर्डर अस्वीकार करें',
    advanceStatus: 'स्थिति आगे बढ़ाएं',
    orderDeliveredSuccessfully: 'ऑर्डर सफलतापूर्वक डिलीवर किया गया',
    liveTrackingMap: 'लाइव ट्रैकिंग मैप',
    chatWithMaker: 'कारीगर से बात करें',

    curatedBag: 'चयनित विरासत थैली',
    directGISourced: 'सीधे जीआई प्रमाणित हस्तशिल्प',
    directRoyaltyBreakdown: 'सीधी कारीगर रॉयल्टी विवरण',
    payoutToMaker: 'उस्ताद निर्माता को सीधा भुगतान',
    directRemittance: 'सीधा बैंक अंतरण',
    directRoyaltySubtext: 'कलाकनेक्ट से खरीदारी करने पर कोई कमीशन नहीं कटता। पूरी राशि सीधे कारीगर के बैंक खाते में जाती है।',
    totalPayable: 'कुल देय राशि',
    taxShippingIncluded: 'कर और पर्यावरण अनुकूल डिलीवरी शामिल',
    securingRoyalty: 'कारीगर रॉयल्टी सुरक्षित की जा रही है...',
    proceedToPayment: 'भुगतान के लिए आगे बढ़ें',
    cartEmptySubtext: 'भारत भर के कुशल कारीगरों द्वारा बनाए गए प्रामाणिक जीआई प्रमाणित शिल्प खोजें।',

    listeningInNativeTongue: 'आपकी चुनी हुई भाषा में सुन रहा है...',
    voiceQueryProcessed: 'अनुरोध सफलतापूर्वक संसाधित हुआ',
    liveSpeechInput: 'बोली गई आवाज़ इनपुट',
    tapToSpeakSuggested: 'बोलने के लिए किसी भी सुझाव पर टैप करें:',

    region: 'क्षेत्र',
    heritageDiscovery: 'विरासत खोज',
    exploreCraftGuilds: 'जीवंत धरोहर शिल्प संघ',
    guildSubtext: 'राज्यों भर में प्राचीन भारतीय कला परंपराओं को संरक्षित रखने वाले प्रमाणित समुदायों से सीधे जुड़ें।',
    allRegions: 'सभी क्षेत्र',
    westZone: 'पश्चिम क्षेत्र',
    northZone: 'उत्तर क्षेत्र',
    southZone: 'दक्षिण क्षेत्र',
    eastZone: 'पूर्व क्षेत्र',
    verifiedGuilds: 'सत्यापित संघ कारीगर',
    craftsCount: 'विरासत शिल्प',

    navMarketplace: 'बाज़ार',
    navGuilds: 'शिल्प संघ',
    artisanStudio: 'स्टूडियो',
    addedToWishlist: 'पसंदीदा में जोड़ा गया!',
    removedFromWishlist: 'पसंदीदा से हटाया गया',

    deliveringTo: 'डिलीवरी का पता',
    searchCraftsPlaceholder: 'प्रामाणिक जीआई शिल्प, कुशल बुनकर, मिट्टी के बर्तन खोजें...',
    filteringBy: 'फ़िल्टर लागू',
    category: 'श्रेणी',
    clearAll: 'सभी हटाएं',
    craftStoryOfDay: 'जीवंत शिल्प धरोहर मुख्य आकर्षण',
    discoverCrafts: 'प्रामाणिक भारतीय जीआई शिल्प',
    exploreMap: 'विरासत मानचित्र देखें',
    heritageCategories: 'पारंपरिक शिल्प विधाएं',
    authenticTechniques: 'सीधे जीआई भौगोलिक संकेत प्रमाणित वस्तुएं',
    resetFilters: 'फ़िल्टर रीसेट करें',
    directFromMasters: 'उस्ताद शिल्पकारों से सीधे',
    allMasters: 'सभी गिल्ड मास्टर्स',
    viewCreations: 'विरासत सूची देखें',
    curatedSelection: 'हस्तनिर्मित कृतियां',
    heritageMasterpieces: 'क्षेत्रीय परंपराओं से सीधे आने वाली संग्रहालय-स्तरीय कलाकृतियां',
    featured: 'विशेष शिल्प',
    recent: 'हाल के उत्पाद',
    noCraftsFound: 'आपके फ़िल्टर के अनुसार कोई शिल्प नहीं मिला।',
    filterCrafts: 'शिल्प फ़िल्टर करें',
    filterByRegion: 'सांस्कृतिक क्षेत्र अनुसार चुनें',
    maxPrice: 'अधिकतम बजट मूल्य',
    applyFilters: 'चयन लागू करें',
    meetTheArtisan: 'उस्ताद निर्माता से मिलें',

    // Additional Screen & Navigation Titles
    b2bPortal: 'थोक एवं निर्यात केंद्र',
    adminTrustPortal: 'सत्यापन एवं ट्रस्ट पोर्टल',
    myProducts: 'मेरे उत्पाद',
    productManagement: 'उत्पाद प्रबंधन',
    pitchDemo: 'पिच डेमो',
    b2b: 'थोक',
    notifications: 'सूचनाएं',
    viewCart: 'कार्ट देखें',
    userProfile: 'उपयोगकर्ता प्रोफ़ाइल',
    navHome: 'होम',
    navProducts: 'उत्पाद',
    navCreateProduct: 'नया उत्पाद',
    navExplore: 'खोजें',

    // Marketplace & Discover
    directClusterSourced: 'सीधे क्लस्टर से',
    welcomeUser: 'नमस्ते',
    verifiedPatronBadge: 'सत्यापित खरीदार',
    curatedSelectionTag: 'विशेष संग्रह',
    authenticCraftsCatalog: 'प्रमाणित हस्तशिल्प',
    craftsLabel: 'शिल्प',
    featuredMasterpieces: 'फीचर्ड',
    readyToShip: 'तुरंत उपलब्ध',
    readyToDispatch: 'भेजने के लिए तैयार',
    giCertifiedBadge: 'जीआई प्रमाणित',
    craftDisciplines: 'प्रामाणिक श्रेणियां',
    exploreByCraftCategory: 'प्रमुख शिल्प श्रेणियां',
    viewAllBtn: 'सभी देखें',
    livingHeritageStories: 'कारीगरों की कहानियां',
    meetTheArtisansTitle: 'कारीगरों से मिलें',
    meetTheArtisansSubtitle: 'हर उत्पाद के पीछे है एक गुरु की पीढ़ियों की साधना और कहानी',
    giCertifiedMaster: 'जीआई प्रमाणित उस्ताद',
    featuredHandcrafts: 'हस्तशिल्प संग्रह',
    creationsLabel: 'कृतियां',
    viewCrafts: 'शिल्प देखें',
    curatedMasterSeries: 'विशेष संग्रह',
    authenticCraftCollections: 'प्रामाणिक शिल्प संग्रह',
    craftCollectionsSubtitle: 'हजारों साल की ऐतिहासिक निरंतरता और भौगोलिक संकेत से प्रमाणित विशेष कृतियां',
    directArtisanBulkSourcing: 'थोक खरीद एवं संस्थागत ऑर्डर (B2B)',
    cooperativeDirect: 'प्रमाणित सहकारी',
    lookingToSourceInBulk: 'थोक या बड़े पैमाने पर सोर्सिंग की तलाश है?',
    bulkSourcingSubtitle: 'बुटीक होटल, कॉर्पोरेट उपहार, इंटीरियर डिजाइन और निर्यात के लिए सीधे जीआई प्रमाणित कारीगर समूहों से थोक खरीद।',
    wholesaleTiers: 'थोक कारीगर दर',
    wholesaleTiersSub: '20-35% खुदरा से कम',
    giProvenance: 'जीआई प्रामाणिकता',
    giProvenanceSub: 'प्रत्येक बैच का आधिकारिक प्रमाण',
    customBranding: 'कस्टम पैकेजिंग',
    customBrandingSub: 'कारीगर कहानी कार्ड के साथ',
    bulkOrderAvailable: 'थोक ऑर्डर उपलब्ध',
    wholesaleTierLabel: 'थोक दर',
    savePercentage: 'बचत',
    requestBulkQuote: 'थोक दर पूछें',
    quoteBtn: 'कोट',
    capacity: 'क्षमता:',
    leadTime: 'अवधि:',

    // Hero Banner
    heroProvenanceTag: 'प्रमाणित जीआई शिल्प',
    heroLivingHeritage: 'जीवंत धरोहर',
    heroDirectMasters: 'कारीगरों से सीधे आपके घर',
    heroTitle: 'प्रामाणिक हस्तकला एवं पारंपरिक शिल्प',
    heroSubtitle: 'हर शिल्प में बसी है सदियों की पवित्र परंपरा और पीढ़ियों की साधना। बिना किसी बिचौलिए के सीधे कारीगर परिवारों से।',
    heroHandcrafted: '100% हस्तनिर्मित',
    heroDirectRoyalties: 'सीधा पारिश्रमिक',
    heroEcoPackaged: 'प्लास्टिक मुक्त पैकेजिंग',
    heroExploreMasterpieces: 'मास्टरपीस देखें',
    heroMeetArtisans: 'कारीगरों से मिलें',

    // Search & Filters
    searchMarketplacePlaceholder: 'उत्पाद, शिल्प, कारीगर या क्षेत्र खोजें...',
    voiceSearch: 'आवाज से खोजें',
    filterOptions: 'फ़िल्टर',
    filtersCleared: 'फ़िल्टर साफ़ कर दिए गए',
    voiceSearchListening: 'आवाज सुन रहे हैं...',

    // Offline & Status
    offlineLabel: 'ऑफ़लाइन',
    syncingLabel: 'सिंक हो रहा है',
    onlineLabel: 'ऑनलाइन',
    offlineNotice: 'आप ऑफ़लाइन हैं। आपका काम इस डिवाइस पर सुरक्षित रूप से सहेजा गया है।',
    syncingNotice: 'क्लाउड के साथ सिंक हो रहा है...',
    syncedNotice: 'सभी बदलाव सफलतापूर्वक सिंक हो गए।',
    syncQueue: 'सिंक कतार',
    demoMode: 'डेमो मोड',
    simulateOffline: 'ऑफ़लाइन टेस्ट',
    turnOnlineOn: 'ऑनलाइन करें',
    savedLocally: 'स्थानीय रूप से सहेजा गया',
    waitingToSync: 'सिंक की प्रतीक्षा',
    syncFailed: 'सिंक विफल',
    inQueue: 'कतार में',

    // Product Details & Trust
    whyTrustTitle: 'इस उत्पाद पर भरोसा क्यों करें?',
    whyTrustSubtitle: 'सत्यापित कारीगर साख एवं हस्तनिर्मित उत्पादन गारंटी',
    viewAudit: 'ऑडिट देखें',
    verified: 'सत्यापित',
    inReview: 'समीक्षाधीन',
    trustProgramTitle: 'आधिकारिक शिल्प सत्यापन कार्यक्रम',
    trustProgramDesc: 'हम कारीगर घोषणाओं, क्लस्टर रिकॉर्ड और कार्यशाला प्रमाणों की निष्पक्ष जांच करते हैं।',
    authenticityAuditLog: 'प्रामाणिकता ऑडिट लॉग',
    artisanVerificationLevel: 'कारीगर सत्यापन स्तर',
    closeAudit: 'ऑडिट बंद करें',
    buyerPreviewMode: 'खरीदार पूर्वावलोकन मोड',
    backToMyProducts: 'मेरे उत्पादों पर वापस',
    cleaningTab: 'सफाई और धुलाई',
    seasoningTab: 'तैयारी व सीज़निंग',
    storageTab: 'रखरखाव व भंडारण',
    aboutCreation: 'उत्पाद विवरण',
    sendInquiryTo: 'कारीगर से सीधा प्रश्न पूछें',
    masterCraftDetails: 'शिल्प विनिर्देश एवं विवरण',
    materialsLabel: 'सामग्री',
    craftTechniqueLabel: 'शिल्प तकनीक',
    productionTimeLabel: 'निर्माण समय',
    dimensionsLabel: 'आयाम व माप',
    careInstructionsLabel: 'देखभाल एवं दीर्घायु निर्देश',
    livingHeritage: 'शिल्प की ऐतिहासिक यात्रा',
    aboutCraft: 'इस प्रामाणिक शिल्प के बारे में',
    viewArtisanProfile: 'कारीगर प्रोफ़ाइल देखें',
    requestQuoteBulk: 'थोक दर हेतु कोटेशन मांगें',
    b2bWholesaleTitle: 'थोक खरीद एवं कॉर्पोरेट सोर्सिंग',
    bulkAvailable: 'थोक उपलब्ध',
    b2bWholesaleDesc: 'होटलों, कॉर्पोरेट उपहारों और खुदरा विक्रेताओं के लिए प्रत्यक्ष खरीद',
    orderAvailability: 'ऑर्डर उपलब्धता',
    moqLabel: 'न्यूनतम ऑर्डर मात्रा (MOQ)',
    productionCapacity: 'उत्पादन क्षमता',
    approxLeadTime: 'अनुमानित निर्माण समय',
    tieredWholesalePrice: 'थोक रियायती मूल्य',
    cleaningCareTip: 'हल्के गुनगुने पानी और प्राकृतिक स्पंज से धोएं। रासायनिक डिटर्जेंट का उपयोग न करें।',
    seasoningCareTip: 'पहले उपयोग से पहले 8 घंटे साफ पानी में भिगोएं, फिर कुछ बूंदें शुद्ध तेल लगाकर सुखाएं।',
    storageCareTip: 'सीलन मुक्त, हवादार स्थान पर रखें। नाजुक शिल्पों पर भारी वस्तुएं रखने से बचें।',

    // Checkout & Forms
    contactInfo: 'संपर्क जानकारी',
    deliveryAddress: 'वितरण का पता',
    streetAddress: 'सड़क का पता, मकान/फ्लैट संख्या',
    landmarkOptional: 'लैंडमार्क (वैकल्पिक)',
    city: 'शहर / कस्बा',
    state: 'राज्य',
    pincode: 'पिनकोड (6 अंक)',
    paymentMethodLabel: 'भुगतान का तरीका',
    itemsInOrder: 'ऑर्डर में आइटम',
    directlyToArtisan: 'सीधे कारीगर को',
    payNow: 'भुगतान करें और ऑर्डर दें',
    secureGiCheckout: 'सुरक्षित जीआई चेकआउट',
    checkoutSubtitle: 'कारीगर को सीधा भुगतान एवं पर्यावरण-अनुकूल पैकेजिंग',
    paymentArchitecture: 'भुगतान प्रणाली',
    demoSimulation: 'डेमो सिमुलेशन',
    productionGateway: 'वास्तविक उत्पादन गेटवे',
    selectPaymentRail: 'भुगतान विधि चुनें',
    payAndPlaceOrder: 'भुगतान करें और ऑर्डर दें',

    // Offline Sync & Demo
    offlineSyncQueue: 'ऑफ़लाइन सिंक कतार',
    syncNow: 'अभी सिंक करें',
    retryFailed: 'विफल आइटम पुनः प्रयास करें',
    clearSynced: 'सिंक किए गए साफ़ करें',
    runDemoMode: 'डेमो मोड चलाएं',
    allChangesSynced: 'सभी बदलाव सफलतापूर्वक सिंक हो गए हैं।',
    offlineNoticeDetail: 'आप ऑफ़लाइन हैं। आपका काम इस डिवाइस पर सुरक्षित रूप से सहेजा गया है।',
    offlineDemoTitle: 'ऑफ़लाइन-फर्स्ट सिंक डेमो',
    offlineDemoSubtitle: 'ग्रामीण कारीगरों के लिए संपूर्ण ऑफ़लाइन कार्यप्रणाली',
    startInteractiveDemo: 'इंटरैक्टिव सिमुलेशन प्रारंभ करें',

    // Greetings & Studio
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'शुभ दोपहर',
    goodEvening: 'शुभ संध्या',
    studioEncouraging: 'क्या आप अपनी कला को दुनिया के साथ साझा करने के लिए तैयार हैं?',
    defaultGuildName: 'पारंपरिक शिल्पकार गिल्ड',
    productRemovedToast: 'उत्पाद सूची से हटा दिया गया।',
    shopLinkCopiedToast: 'उत्पाद लिंक कॉपी हो गया!',

    // Artisan Profile & Story
    artisanStory: 'साधना कथा',
    bulkAndCustom: 'थोक सोर्सिंग',
    masterBiography: 'जीवन वृत्त एवं शिल्प यात्रा',
    honoursAndAwards: 'पुरस्कार एवं सम्मान',
    bulkSourcingTitle: 'थोक व कस्टमाइज़ेशन',
    directFromCluster: 'सीधे क्लस्टर कार्यशाला से',
    addedToBagToast: 'बैग में जोड़ा गया',

    // Welcome Screen
    welcomeHeroSubtitle: 'आवाज-आधारित डिजिटल कैटलॉग से पारंपरिक कारीगरों को सीधे बाज़ार से जोड़ने वाला मंच।',
    b2bCardSubtitle: 'थोक ऑर्डर एवं न्यूनतम मात्रा (MOQ)',
    adminCardSubtitle: 'उत्पाद समीक्षा एवं जीआई प्रमाणन',

    // Auth Screen Roles
    roleArtisan: 'कारीगर',
    roleArtisanDesc: 'पारंपरिक शिल्पकार',
    roleBuyer: 'खरीदार',
    roleBuyerDesc: 'कला संरक्षक व उपभोक्ता',
    roleB2B: 'थोक खरीदार',
    roleB2BDesc: 'थोक व कॉर्पोरेट ऑर्डर',
    roleAdmin: 'प्रशासक',
    roleAdminDesc: 'प्रमाणीकरण व ट्रस्ट',

    // Order Actions Toasts
    orderConfirmedToast: 'ऑर्डर की पुष्टि हो गई!',
    orderDeclinedToast: 'ऑर्डर अस्वीकृत किया गया'
  }
};

/**
 * Helper to fetch localized string
 */
export const t = (key: keyof Translations, lang: Language | string = 'en'): string => {
  const normalized = (lang === 'ta' || lang === 'hi' ? lang : 'en') as Language;
  const languageTranslations = TRANSLATIONS[normalized] || TRANSLATIONS['en'];
  return languageTranslations[key] || TRANSLATIONS['en'][key] || '';
};

/**
 * React hook-like helper to get all translations for a given language
 */
export const getTranslations = (lang?: Language | string): Translations => {
  const normalized = (lang === 'ta' || lang === 'hi' ? lang : 'en') as Language;
  return TRANSLATIONS[normalized] || TRANSLATIONS['en'];
};
