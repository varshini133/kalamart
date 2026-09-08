export type ScreenType = 
  | 'welcome'
  | 'auth'
  | 'artisan-auth'
  | 'buyer-auth'
  | 'artisan-onboarding'
  | 'discover'
  | 'guilds'
  | 'product-detail'
  | 'studio'
  | 'voice-cataloging'
  | 'orders'
  | 'profile'
  | 'b2b-portal'
  | 'admin-portal'
  | 'my-products'
  | 'product-manage'
  | 'artisan-profile';

export type ProductStatus = 'draft' | 'pending_review' | 'published' | 'rejected';

export type Language = 'en' | 'hi' | 'ta';

export type UserRole = 'buyer' | 'artisan' | 'b2b' | 'admin';

export type SyncStatus = 
  | 'synced' 
  | 'pending_sync' 
  | 'saved_local' 
  | 'waiting_to_sync' 
  | 'syncing' 
  | 'sync_failed';

export type OfflineOperationStatus = 
  | 'saved_local' 
  | 'waiting_to_sync' 
  | 'syncing' 
  | 'synced' 
  | 'sync_failed';

export interface OfflineSyncItem {
  id: string;
  entityId: string;
  entityType: 'product' | 'draft' | 'profile';
  operationType: 'create' | 'update' | 'delete' | 'draft';
  title: string;
  payload: any;
  status: OfflineOperationStatus;
  timestamp: number;
  updatedAt: number;
  lastAttemptAt?: number;
  retryCount: number;
  errorMessage?: string;
  conflictStrategy?: 'last-write-wins';
}

export interface ProductDraft {
  id: string;
  artisanId?: string;
  title: string;
  price: number;
  category: string;
  craftTechnique?: string;
  material?: string;
  dimensions?: string;
  productionTime?: string;
  stockCount?: number;
  description?: string;
  storyBehindProduct?: string;
  images: string[];
  audioMetadata?: {
    durationSeconds: number;
    recordedAt: number;
    audioDataUrl?: string;
    transcript?: string;
    language?: Language;
  };
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  syncStatus: OfflineOperationStatus;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  avatar?: string;
  preferredLanguage?: Language;
  guildName?: string;
  giCertified?: boolean;
  businessName?: string;
  gstNumber?: string;
  adminRole?: string;
  buyerType?: 'individual' | 'bulk_buyer' | 'interior_designer' | 'corporate';
  hasCompletedOnboarding?: boolean;
  isNewUser?: boolean;
  craftCategory?: string;
  craftSpecialization?: string;
  yearsOfExperience?: string;
  specialtyTechnique?: string;
  bio?: string;
  storyAudioUrl?: string;
  storyVoiceDuration?: string;
  madeToOrder?: boolean;
  bulkOrdersAccepted?: boolean;
  minBulkQuantity?: number;
  productionTime?: string;
}

export interface Product {
  id: string;
  title: string;
  hindiTitle?: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  artisanName: string;
  artisanId?: string;
  artisanLocation: string;
  artisanRole?: string;
  artisanExperience?: string;
  artisanQuote?: string;
  artisanImage?: string;
  category: string;
  hindiCategory?: string;
  craftType?: string;
  giTag: string;
  giCertified: boolean;
  material: string;
  technique: string;
  craftOrigin: string;
  capacity?: string;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  images: string[];
  description: string;
  storyBehindProduct?: string;
  specialFeatures?: string[];
  suggestedTags?: string[];
  moq?: number;
  bulkPrice?: number;
  bulkOrderAvailable?: boolean;
  productionCapacity?: string;
  approxLeadTime?: string;
  isApprovedByAdmin?: boolean;
  syncStatus?: SyncStatus;
  inStock?: boolean;
  stockCount?: number;
  status?: ProductStatus;
  productionTime?: string;
  materialsList?: string[];
  rejectionReason?: string;
  reviewFeedback?: string;
  performance?: {
    views: number;
    inquiries: number;
    orders: number;
    revenue: number;
    rating?: number;
    reviewsCount?: number;
  };
  aiPreservedData?: {
    originalTitle?: string;
    originalDescription?: string;
    culturalStory?: string;
    autoTags?: string[];
    voiceTranscript?: string;
    suggestedFairPrice?: number;
    detectedMaterials?: string[];
    suggestedCategory?: string;
  };
  marketplaceTranslations?: {
    en?: { title: string; description: string; story: string };
    hi?: { title: string; description: string; story: string };
    ta?: { title: string; description: string; story: string };
  };
  howItsMade?: {
    step: number;
    title: string;
    description: string;
  }[];
  specifications?: {
    label: string;
    value: string;
  }[];
}

export interface Artisan {
  id: string;
  name: string;
  hindiName?: string;
  role: string;
  location: string;
  specialty: string;
  image: string;
  coverImage?: string;
  verified: boolean;
  giCertified: boolean;
  creationsCount: number;
  miniProducts: string[];
  bio?: string;
  storyQuote?: string;
  yearsOfExperience?: string;
  guildName?: string;
  trustRating?: number;
  craftLineage?: string;
  awards?: string[];
  bulkDetails?: {
    acceptsBulk: boolean;
    moq: number;
    leadTime: string;
    acceptsCustom: boolean;
    packagingNotes: string;
  };
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  hindiName?: string;
  tamilName?: string;
  image: string;
  count: string;
  subtitle: string;
}

export interface CraftCollection {
  id: string;
  title: string;
  hindiTitle?: string;
  tamilTitle?: string;
  subtitle: string;
  region: string;
  badge: string;
  image: string;
  craftQuery: string;
  artisanName: string;
}

export interface GuildRegion {
  id: string;
  state: string;
  region: 'north' | 'west' | 'south' | 'east' | 'central';
  zoneLabel: string;
  location: string;
  craftName: string;
  description: string;
  history?: string;
  image: string;
  giTag: string;
  artisanCount: number;
  productCount: number;
}

export type OrderStatus = 
  | 'Order Placed' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Ready for Pickup' 
  | 'Shipped' 
  | 'Delivered'
  | 'Cancelled'
  | 'new'
  | 'accepted'
  | 'packing'
  | 'shipped'
  | 'delivered';

export interface OrderAddress {
  fullName: string;
  phone: string;
  email?: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderPaymentInfo {
  method: 'upi' | 'card' | 'netbanking' | 'cod';
  methodLabel: string;
  transactionId: string;
  isSimulated: boolean;
  status: 'completed' | 'pending' | 'cod_verified';
  paidAt: string;
  gatewayProvider?: string;
}

export interface BuyerOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  artisanRoyalty: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  timeAgo?: string;
  deliveryAddress: OrderAddress;
  payment: OrderPaymentInfo;
  trackingId?: string;
  courierPartner?: string;
  estimatedDelivery: string;
  customNotes?: string;
  artisanId?: string;
  artisanName: string;
}

export type InquiryStatus = 
  | 'New Inquiry' 
  | 'Under Artisan Review' 
  | 'Quotation Provided' 
  | 'Accepted & In Production' 
  | 'Declined';

export interface BuyerInquiry {
  id: string;
  inquiryNumber: string;
  productId: string;
  productTitle: string;
  productImage: string;
  artisanId?: string;
  artisanName: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  message: string;
  quantity: number;
  customizationRequirements: string;
  neededByDate?: string;
  status: InquiryStatus;
  artisanNotes?: string;
  estimatedQuote?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  productName: string;
  hindiProductName?: string;
  quantity: string;
  price: number;
  prepaid: boolean;
  status: OrderStatus;
  currentStep: number;
  timeAgo: string;
  buyerName: string;
  buyerLocation: string;
  image: string;
  pickupInfo?: string;
  urgent?: boolean;
  isB2B?: boolean;
  payout?: string;
  artisanName?: string;
}

export interface B2BQuoteRequest {
  id: string;
  productId: string;
  productName: string;
  artisanName: string;
  buyerCompanyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  quantityRequested: number;
  targetPricePerUnit: number;
  deadlineDate: string;
  status: 'pending' | 'quoted' | 'accepted' | 'declined';
  notes?: string;
  createdAt: string;
}

export type B2BInquiryStatus =
  | 'active_inquiry'
  | 'quotation_provided'
  | 'bulk_order_confirmed'
  | 'in_production'
  | 'declined';

export interface B2BBulkInquiry {
  id: string;
  rfqNumber: string;
  productId: string;
  productTitle: string;
  productImage: string;
  artisanName: string;
  artisanId?: string;
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  buyerPhone: string;
  requiredQuantity: number;
  deliveryRegion: string;
  requiredDeliveryDate: string;
  customizationRequirements: string;
  message: string;
  status: B2BInquiryStatus;
  createdAt: string;
  unitPriceEstimate?: number;
  quoteDetails?: {
    quotedUnitPrice: number;
    totalAmount: number;
    productionLeadDays: number;
    validUntil: string;
    artisanNotes: string;
    shippingEstimate?: number;
  };
  bulkOrderDetails?: {
    orderId: string;
    batchStatus: 'In Batch Production' | 'Quality Inspection' | 'Export Crating' | 'Dispatched';
    trackingNumber: string;
    courierPartner: string;
    advancePaid: number;
    balanceDue: number;
    dispatchedAt?: string;
  };
}

export interface Review {
  id: string;
  author: string;
  location: string;
  date: string;
  rating: number;
  comment: string;
  initials: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// ============================================================================
// TRUST & AUTHENTICITY SYSTEM TYPES
// ============================================================================

export type VerificationLevel = 1 | 2 | 3 | 4;

export type TrustBadgeId = 'verified_artisan' | 'handmade' | 'authentic_craft' | 'bulk_ready';

export type VerificationStatus = 'approved' | 'pending' | 'rejected' | 'info_requested';

export interface VerificationDocument {
  id: string;
  title: string;
  type: 'workshop_proof' | 'artisan_id' | 'guild_record' | 'craft_provenance' | 'handmade_declaration';
  status: 'verified' | 'pending' | 'rejected';
  verificationDate?: string;
  fileHint?: string;
}

export interface ArtisanTrustProfile {
  artisanId: string;
  artisanName: string;
  location: string;
  craftSpecialty: string;
  avatar: string;
  verificationLevel: VerificationLevel;
  profileCompleted: boolean;
  contactVerified: boolean;
  artisanVerified: boolean;
  craftVerified: boolean;
  handmadeDeclared: boolean;
  bulkReady: boolean;
  badges: TrustBadgeId[];
  verificationStatus: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
  requestedInfoReason?: string;
  submittedDocuments: VerificationDocument[];
  officialProgramIntegrationReady: boolean;
  yearsOfExperience?: string;
}

// ============================================================================
// NOTIFICATION SYSTEM TYPES
// ============================================================================

export type NotificationCategory = 'artisan' | 'buyer' | 'system';

export type ArtisanNotificationType =
  | 'artisan_new_order'
  | 'artisan_new_inquiry'
  | 'artisan_product_approved'
  | 'artisan_product_rejected'
  | 'artisan_sync_completed';

export type BuyerNotificationType =
  | 'buyer_order_confirmed'
  | 'buyer_order_shipped'
  | 'buyer_order_delivered'
  | 'buyer_inquiry_response';

export type AppNotificationType = ArtisanNotificationType | BuyerNotificationType | 'system_alert';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  type: AppNotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  icon: string; // Material Symbol icon name
  iconColorClass: string; // Tailwind color classes for icon chip
  targetScreen?: ScreenType;
  targetId?: string; // e.g. orderId, inquiryId, productId
  actionLabel?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// SCALABLE BACKEND DATA ARCHITECTURE - CORE ENTITIES
// ============================================================================

export type AccountStatus = 'active' | 'pending_verification' | 'suspended';

export interface UserEntity {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  profile_image?: string;
  created_at: string;
  status?: AccountStatus;
  location?: string;
}

export interface ArtisanProfileEntity {
  user_id: string;
  craft_category: string;
  specialization: string;
  location: string;
  experience_years: string | number;
  story: string;
  bulk_available: boolean;
  verification_status: 'pending' | 'approved' | 'rejected' | 'info_requested';
  guild_name?: string;
  gi_certified?: boolean;
  min_bulk_quantity?: number;
}

export interface ProductEntity {
  id: string;
  artisan_id: string;
  name: string;
  description: string;
  category: string;
  materials: string;
  craft_technique: string;
  price: number;
  stock: number;
  production_time: string;
  status: ProductStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProductImageEntity {
  id: string;
  product_id: string;
  original_url: string;
  enhanced_url?: string;
  display_order: number;
}

export interface VoiceRecordEntity {
  id: string;
  product_id: string;
  audio_url?: string;
  transcription: string;
  detected_language: string;
  recorded_at: string;
}

export interface ProductAIContentEntity {
  product_id: string;
  generated_title: string;
  english_description: string;
  hindi_description: string;
  metadata: {
    tags?: string[];
    suggested_price?: number;
    detected_materials?: string[];
    cultural_lineage?: string;
  };
}

export interface PricingDataEntity {
  product_id: string;
  material_cost: number;
  labor_cost: number;
  additional_cost: number;
  suggested_price: number;
  final_artisan_price: number;
}

export interface OrderEntity {
  id: string;
  buyer_id: string;
  artisan_id: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  delivery_city?: string;
  tracking_id?: string;
}

export interface OrderItemEntity {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image?: string;
}

export interface InquiryEntity {
  id: string;
  buyer_id: string;
  artisan_id: string;
  product_id: string;
  quantity: number;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export interface B2BRequestEntity {
  id: string;
  buyer_id: string;
  product_id: string;
  quantity: number;
  customization: string;
  required_date: string;
  status: B2BInquiryStatus;
  created_at: string;
}

export interface NotificationEntity {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface VerificationEntity {
  id: string;
  artisan_id: string;
  reviewer_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'info_requested';
  level: VerificationLevel;
  documents: VerificationDocument[];
  notes?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface OfflineSyncQueueEntity {
  id: string;
  entity_type: 'product' | 'order' | 'inquiry' | 'profile';
  entity_id: string;
  operation: 'create' | 'update' | 'delete';
  payload: any;
  status: OfflineOperationStatus;
  retry_count: number;
  created_at: string;
}


