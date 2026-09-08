/**
 * KalaConnect - Scalable Backend Data Architecture & Repository Service
 * 
 * Implements the core entity relational data model, validation rules,
 * ownership enforcement, and scalable service layer decoupling:
 * - USERS, ARTISAN_PROFILES
 * - PRODUCTS, PRODUCT_IMAGES, VOICE_RECORDS, PRODUCT_AI_CONTENT, PRICING_DATA
 * - ORDERS, ORDER_ITEMS
 * - INQUIRIES, B2B_REQUESTS
 * - NOTIFICATIONS, VERIFICATIONS, OFFLINE_SYNC_QUEUE
 */

import {
  UserEntity,
  ArtisanProfileEntity,
  ProductEntity,
  ProductImageEntity,
  VoiceRecordEntity,
  ProductAIContentEntity,
  PricingDataEntity,
  OrderEntity,
  OrderItemEntity,
  InquiryEntity,
  B2BRequestEntity,
  NotificationEntity,
  VerificationEntity,
  OfflineSyncQueueEntity,
  UserRole,
  AccountStatus,
  ProductStatus,
  OrderStatus,
  VerificationLevel
} from '../types';
import { PRODUCTS, RAMDEV_PORTRAIT } from '../data/mockData';
import { notificationService } from './notificationService';

// Storage Keys
const DB_PREFIX = 'kalaconnect_db_';
const KEY_USERS = DB_PREFIX + 'users';
const KEY_ARTISAN_PROFILES = DB_PREFIX + 'artisan_profiles';
const KEY_PRODUCTS = DB_PREFIX + 'products';
const KEY_PRODUCT_IMAGES = DB_PREFIX + 'product_images';
const KEY_VOICE_RECORDS = DB_PREFIX + 'voice_records';
const KEY_AI_CONTENT = DB_PREFIX + 'ai_content';
const KEY_PRICING_DATA = DB_PREFIX + 'pricing_data';
const KEY_ORDERS = DB_PREFIX + 'orders';
const KEY_ORDER_ITEMS = DB_PREFIX + 'order_items';
const KEY_INQUIRIES = DB_PREFIX + 'inquiries';
const KEY_B2B_REQUESTS = DB_PREFIX + 'b2b_requests';
const KEY_VERIFICATIONS = DB_PREFIX + 'verifications';
const KEY_SYNC_QUEUE = DB_PREFIX + 'sync_queue';

// Structured Domain Errors
export class DataArchitectureError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'OWNERSHIP_VIOLATION',
    public details?: any
  ) {
    super(message);
    this.name = 'DataArchitectureError';
  }
}

// Initial Seed Data
const SEED_USERS: UserEntity[] = [
  {
    id: 'artisan-seed-1',
    name: 'Ramdev Kumbhar',
    email: 'ramdev@kalaconnect.com',
    phone: '+91 98765 43210',
    role: 'artisan',
    profile_image: RAMDEV_PORTRAIT,
    created_at: '2025-01-10T10:00:00.000Z',
    status: 'active',
    location: 'Bhuj, Kutch, Gujarat'
  },
  {
    id: 'artisan-seed-2',
    name: 'Ismail Khatri',
    email: 'ismail@kalaconnect.com',
    phone: '+91 98221 54321',
    role: 'artisan',
    profile_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    created_at: '2025-02-14T09:30:00.000Z',
    status: 'active',
    location: 'Ajrakhpur, Kutch, Gujarat'
  },
  {
    id: 'artisan-seed-3',
    name: 'Devi Meenakshi',
    email: 'meenakshi@kalaconnect.com',
    phone: '+91 94440 12389',
    role: 'artisan',
    profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    created_at: '2025-03-01T14:20:00.000Z',
    status: 'pending_verification',
    location: 'Kanchipuram, Tamil Nadu'
  },
  {
    id: 'buyer-seed-1',
    name: 'Priya Sharma',
    email: 'buyer@kalaconnect.com',
    phone: '+91 91234 56780',
    role: 'buyer',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    created_at: '2025-01-15T11:00:00.000Z',
    status: 'active',
    location: 'Bangalore, Karnataka'
  },
  {
    id: 'buyer-seed-2',
    name: 'Ananya Sharma',
    email: 'ananya.s@example.com',
    phone: '+91 98450 12345',
    role: 'buyer',
    profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    created_at: '2025-02-18T16:45:00.000Z',
    status: 'active',
    location: 'Indiranagar, Bangalore'
  },
  {
    id: 'b2b-seed-1',
    name: 'Vikram Malhotra',
    email: 'b2b@kalaconnect.com',
    phone: '+91 98112 23344',
    role: 'b2b',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    created_at: '2025-02-01T08:15:00.000Z',
    status: 'active',
    location: 'Nariman Point, Mumbai, Maharashtra'
  },
  {
    id: 'admin-seed-1',
    name: 'Platform Custodian',
    email: 'admin@kalaconnect.com',
    phone: '+91 99001 12233',
    role: 'admin',
    profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    created_at: '2025-01-01T00:00:00.000Z',
    status: 'active',
    location: 'KalaConnect Trust HQ, New Delhi'
  }
];

const SEED_ARTISAN_PROFILES: ArtisanProfileEntity[] = [
  {
    user_id: 'artisan-seed-1',
    craft_category: 'Pottery & Ceramics',
    specialization: 'Kutch Living Terracotta & Indus Pitchers',
    location: 'Bhuj, Kutch, Gujarat',
    experience_years: '34 yrs',
    story: 'Fifth generation potter working with native alluvial riverbed clays and open-pit wood firing.',
    bulk_available: true,
    verification_status: 'approved',
    guild_name: 'Kumbhar Terracotta Guild • Bhuj',
    gi_certified: true,
    min_bulk_quantity: 25
  },
  {
    user_id: 'artisan-seed-2',
    craft_category: 'Handloom & Textiles',
    specialization: 'Natural Indigo & Madder Ajrakh Block Printing',
    location: 'Ajrakhpur, Kutch, Gujarat',
    experience_years: '28 yrs',
    story: 'Carrying forward 16-step authentic resistive vegetable dyeing on organic unbleached cotton.',
    bulk_available: true,
    verification_status: 'approved',
    guild_name: 'Ajrakhpur Textile Guild',
    gi_certified: true,
    min_bulk_quantity: 15
  },
  {
    user_id: 'artisan-seed-3',
    craft_category: 'Handloom & Textiles',
    specialization: 'Pure Mulberry Silk & Korvai Temple Borders',
    location: 'Kanchipuram, Tamil Nadu',
    experience_years: '19 yrs',
    story: 'Specializes in double-shuttle Korvai interlock weaving preserving ancient temple chariot motifs.',
    bulk_available: false,
    verification_status: 'pending',
    guild_name: 'Kanchi Handloom Weavers Cooperative',
    gi_certified: true,
    min_bulk_quantity: 5
  }
];

const SEED_PRODUCTS: ProductEntity[] = [
  {
    id: 'kutch-kalash',
    artisan_id: 'artisan-seed-1',
    name: 'Handcrafted Kutch Kalash Terracotta Pitcher',
    description: 'Micro-porous terracotta naturally chills drinking water by 5°C without electricity while imparting essential alkaline earthen minerals.',
    category: 'Pottery',
    materials: 'Natural Riverbed Clay, Rice Husk Ash',
    craft_technique: 'Wheel-thrown & River Pebble Burnished',
    price: 850,
    stock: 12,
    production_time: 'Ready to ship',
    status: 'published',
    created_at: '2025-01-20T10:00:00.000Z'
  },
  {
    id: 'rev-01',
    artisan_id: 'artisan-seed-1',
    name: 'Terracotta Bell Chime with Natural Ochre Glaze',
    description: 'Hand-tuned earthen temple wind chime hand-carved with traditional sun motifs and finished with mineral red ochre wash.',
    category: 'Pottery',
    materials: 'Kutch white river clay, natural red ochre wash',
    craft_technique: 'Hand-carved clay reduction firing',
    price: 1850,
    stock: 5,
    production_time: '3–5 Days',
    status: 'pending_review',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'rev-02',
    artisan_id: 'artisan-seed-2',
    name: 'Ajrakh Natural Indigo Block Printed Shawl',
    description: '16-step natural vegetable dye resistive block printed shawl using riverbed washing and teakwood carved printing stamps.',
    category: 'Handloom & Textiles',
    materials: 'Pure handspun organic cotton, natural indigo & madder',
    craft_technique: '16-stage resist block printing',
    price: 4200,
    stock: 8,
    production_time: '7–10 Days',
    status: 'pending_review',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'prod-rejected-sample',
    artisan_id: 'artisan-seed-3',
    name: 'Silk Brocade Stole with Zari Trim',
    description: 'Artisan handloom sample awaiting full loom provenance documentation.',
    category: 'Handloom & Textiles',
    materials: 'Mulberry silk, metallic yarn',
    craft_technique: 'Handloom weave',
    price: 2900,
    stock: 4,
    production_time: '12 Days',
    status: 'rejected',
    rejection_reason: 'Please provide high-resolution photos of the pit loom setup and raw silk dye provenance.',
    created_at: '2025-02-10T14:00:00.000Z'
  }
];

const SEED_PRODUCT_IMAGES: ProductImageEntity[] = [
  {
    id: 'img-1',
    product_id: 'kutch-kalash',
    original_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    enhanced_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=85',
    display_order: 1
  },
  {
    id: 'img-2',
    product_id: 'rev-01',
    original_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    display_order: 1
  },
  {
    id: 'img-3',
    product_id: 'rev-02',
    original_url: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=600&q=80',
    display_order: 1
  }
];

const SEED_VOICE_RECORDS: VoiceRecordEntity[] = [
  {
    id: 'voice-1',
    product_id: 'kutch-kalash',
    audio_url: 'https://example.com/audio/kutch-pot-desc.webm',
    transcription: 'ये कच्छ की नदी की मिट्टी से बना ठंडा पानी का कलश है। चाक पर हाथ से बनाया गया है।',
    detected_language: 'hi',
    recorded_at: '2025-01-20T09:45:00.000Z'
  }
];

const SEED_AI_CONTENT: ProductAIContentEntity[] = [
  {
    product_id: 'kutch-kalash',
    generated_title: 'Handcrafted Kutch Kalash Terracotta Pitcher',
    english_description: 'Wheel-thrown porous terracotta naturally chills water through evaporative respiration.',
    hindi_description: 'प्राकृतिक नदी की मिट्टी से चाक पर हस्तनिर्मित पारंपरिक कलश, जो बिना बिजली के पानी को शीतल रखता है।',
    metadata: {
      tags: ['Terracotta', 'Kutch', 'GI Tagged', 'Natural Cooling'],
      suggested_price: 850,
      detected_materials: ['Alluvial Riverbed Clay', 'Rice Husk Ash'],
      cultural_lineage: '5-generation Kumbhar lineage from Kutch, Gujarat'
    }
  }
];

const SEED_PRICING_DATA: PricingDataEntity[] = [
  {
    product_id: 'kutch-kalash',
    material_cost: 160,
    labor_cost: 380,
    additional_cost: 80,
    suggested_price: 850,
    final_artisan_price: 850
  }
];

const SEED_ORDERS: OrderEntity[] = [
  {
    id: 'ord-101',
    buyer_id: 'buyer-seed-2',
    artisan_id: 'artisan-seed-1',
    total: 1850,
    status: 'Processing',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    delivery_city: 'Bangalore, Karnataka',
    tracking_id: 'KC-BLR-91024'
  },
  {
    id: 'ord-102',
    buyer_id: 'buyer-seed-1',
    artisan_id: 'artisan-seed-2',
    total: 4200,
    status: 'Shipped',
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    delivery_city: 'Mumbai, Maharashtra',
    tracking_id: 'KC-MUM-83192'
  },
  {
    id: 'ord-103',
    buyer_id: 'b2b-seed-1',
    artisan_id: 'artisan-seed-1',
    total: 16250,
    status: 'Confirmed',
    created_at: new Date(Date.now() - 3600000 * 50).toISOString(),
    delivery_city: 'Delhi NCR',
    tracking_id: 'KC-DEL-10294'
  }
];

const SEED_ORDER_ITEMS: OrderItemEntity[] = [
  {
    id: 'item-101',
    order_id: 'ord-101',
    product_id: 'kutch-kalash',
    product_name: 'Kutch Embossed Clay Water Carafe',
    quantity: 1,
    unit_price: 1850,
    total_price: 1850,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'item-102',
    order_id: 'ord-102',
    product_id: 'rev-02',
    product_name: 'Ajrakh Natural Indigo Block Printed Shawl',
    quantity: 1,
    unit_price: 4200,
    total_price: 4200,
    image: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'item-103',
    order_id: 'ord-103',
    product_id: 'kutch-kalash',
    product_name: 'Handcrafted Kutch Kalash (Bulk Batch of 25)',
    quantity: 25,
    unit_price: 650,
    total_price: 16250,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80'
  }
];

type DatabaseListener = () => void;

class DatabaseService {
  private listeners: Set<DatabaseListener> = new Set();

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEY_USERS)) {
      localStorage.setItem(KEY_USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(KEY_ARTISAN_PROFILES)) {
      localStorage.setItem(KEY_ARTISAN_PROFILES, JSON.stringify(SEED_ARTISAN_PROFILES));
    }
    if (!localStorage.getItem(KEY_PRODUCTS)) {
      localStorage.setItem(KEY_PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    }
    if (!localStorage.getItem(KEY_PRODUCT_IMAGES)) {
      localStorage.setItem(KEY_PRODUCT_IMAGES, JSON.stringify(SEED_PRODUCT_IMAGES));
    }
    if (!localStorage.getItem(KEY_VOICE_RECORDS)) {
      localStorage.setItem(KEY_VOICE_RECORDS, JSON.stringify(SEED_VOICE_RECORDS));
    }
    if (!localStorage.getItem(KEY_AI_CONTENT)) {
      localStorage.setItem(KEY_AI_CONTENT, JSON.stringify(SEED_AI_CONTENT));
    }
    if (!localStorage.getItem(KEY_PRICING_DATA)) {
      localStorage.setItem(KEY_PRICING_DATA, JSON.stringify(SEED_PRICING_DATA));
    }
    if (!localStorage.getItem(KEY_ORDERS)) {
      localStorage.setItem(KEY_ORDERS, JSON.stringify(SEED_ORDERS));
    }
    if (!localStorage.getItem(KEY_ORDER_ITEMS)) {
      localStorage.setItem(KEY_ORDER_ITEMS, JSON.stringify(SEED_ORDER_ITEMS));
    }
  }

  public subscribe(listener: DatabaseListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
  }

  // ==========================================================================
  // USERS REPOSITORY
  // ==========================================================================

  public getUsers(filterRole?: UserRole | 'all', search?: string): UserEntity[] {
    try {
      const raw = localStorage.getItem(KEY_USERS);
      let users: UserEntity[] = raw ? JSON.parse(raw) : SEED_USERS;

      if (filterRole && filterRole !== 'all') {
        users = users.filter((u) => u.role === filterRole);
      }

      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        users = users.filter((u) => {
          return (
            u.name.toLowerCase().includes(q) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.phone && u.phone.includes(q)) ||
            (u.location && u.location.toLowerCase().includes(q))
          );
        });
      }

      return users;
    } catch {
      return SEED_USERS;
    }
  }

  public getUserById(userId: string): UserEntity | null {
    const users = this.getUsers('all');
    return users.find((u) => u.id === userId) || null;
  }

  public updateUserStatus(userId: string, newStatus: AccountStatus): UserEntity {
    const users = this.getUsers('all');
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new DataArchitectureError(`User ${userId} not found`, 'NOT_FOUND');
    }

    users[index] = {
      ...users[index],
      status: newStatus
    };

    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    this.notify();
    return users[index];
  }

  // ==========================================================================
  // ARTISAN PROFILES REPOSITORY
  // ==========================================================================

  public getArtisanProfiles(): ArtisanProfileEntity[] {
    try {
      const raw = localStorage.getItem(KEY_ARTISAN_PROFILES);
      return raw ? JSON.parse(raw) : SEED_ARTISAN_PROFILES;
    } catch {
      return SEED_ARTISAN_PROFILES;
    }
  }

  public getArtisanProfileByUserId(userId: string): ArtisanProfileEntity | null {
    const profiles = this.getArtisanProfiles();
    return profiles.find((p) => p.user_id === userId) || null;
  }

  public updateArtisanVerification(
    userId: string,
    status: 'approved' | 'rejected' | 'info_requested',
    _notes?: string
  ): ArtisanProfileEntity {
    const profiles = this.getArtisanProfiles();
    const index = profiles.findIndex((p) => p.user_id === userId);

    if (index === -1) {
      throw new DataArchitectureError(`Artisan profile for ${userId} not found`, 'NOT_FOUND');
    }

    profiles[index] = {
      ...profiles[index],
      verification_status: status
    };

    localStorage.setItem(KEY_ARTISAN_PROFILES, JSON.stringify(profiles));

    // Also sync with User account status if approved
    if (status === 'approved') {
      try {
        this.updateUserStatus(userId, 'active');
      } catch {}
    }

    this.notify();
    return profiles[index];
  }

  // ==========================================================================
  // PRODUCTS & DETAIL REPOSITORY
  // ==========================================================================

  public getProducts(statusFilter?: ProductStatus | 'all'): ProductEntity[] {
    try {
      const raw = localStorage.getItem(KEY_PRODUCTS);
      let products: ProductEntity[] = raw ? JSON.parse(raw) : SEED_PRODUCTS;

      if (statusFilter && statusFilter !== 'all') {
        products = products.filter((p) => p.status === statusFilter);
      }
      return products;
    } catch {
      return SEED_PRODUCTS;
    }
  }

  public getProductById(productId: string): ProductEntity | null {
    const products = this.getProducts('all');
    return products.find((p) => p.id === productId) || null;
  }

  public getProductWithDetails(productId: string) {
    const product = this.getProductById(productId);
    if (!product) return null;

    const rawImages = localStorage.getItem(KEY_PRODUCT_IMAGES);
    const images: ProductImageEntity[] = rawImages ? JSON.parse(rawImages) : SEED_PRODUCT_IMAGES;
    const productImages = images.filter((img) => img.product_id === productId);

    const rawVoice = localStorage.getItem(KEY_VOICE_RECORDS);
    const voiceRecords: VoiceRecordEntity[] = rawVoice ? JSON.parse(rawVoice) : SEED_VOICE_RECORDS;
    const voiceRecord = voiceRecords.find((vr) => vr.product_id === productId) || null;

    const rawAI = localStorage.getItem(KEY_AI_CONTENT);
    const aiContents: ProductAIContentEntity[] = rawAI ? JSON.parse(rawAI) : SEED_AI_CONTENT;
    const aiContent = aiContents.find((ai) => ai.product_id === productId) || null;

    const rawPricing = localStorage.getItem(KEY_PRICING_DATA);
    const pricings: PricingDataEntity[] = rawPricing ? JSON.parse(rawPricing) : SEED_PRICING_DATA;
    const pricing = pricings.find((pr) => pr.product_id === productId) || null;

    const artisan = this.getUserById(product.artisan_id);
    const artisanProfile = this.getArtisanProfileByUserId(product.artisan_id);

    return {
      product,
      images: productImages,
      voiceRecord,
      aiContent,
      pricing,
      artisan,
      artisanProfile
    };
  }

  // Ownership validation rule
  public validateProductOwnership(productId: string, requestingArtisanId: string): boolean {
    const product = this.getProductById(productId);
    if (!product) {
      throw new DataArchitectureError(`Product ${productId} not found`, 'NOT_FOUND');
    }
    if (product.artisan_id !== requestingArtisanId) {
      throw new DataArchitectureError(
        `Ownership validation failed: artisan ${requestingArtisanId} does not own product ${productId}`,
        'OWNERSHIP_VIOLATION'
      );
    }
    return true;
  }

  // Input validation rule
  public validateProductInput(data: Partial<ProductEntity>): void {
    if (!data.name || !data.name.trim()) {
      throw new DataArchitectureError('Product name is required', 'VALIDATION_ERROR');
    }
    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new DataArchitectureError('Price must be a positive number', 'VALIDATION_ERROR');
    }
    if (typeof data.stock === 'number' && data.stock < 0) {
      throw new DataArchitectureError('Stock cannot be negative', 'VALIDATION_ERROR');
    }
    if (!data.category || !data.category.trim()) {
      throw new DataArchitectureError('Category is required', 'VALIDATION_ERROR');
    }
  }

  // Product Review: Approve
  public approveProduct(productId: string): ProductEntity {
    const products = this.getProducts('all');
    const index = products.findIndex((p) => p.id === productId);

    if (index === -1) {
      throw new DataArchitectureError(`Product ${productId} not found`, 'NOT_FOUND');
    }

    products[index] = {
      ...products[index],
      status: 'published',
      rejection_reason: undefined,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));

    // Notify artisan
    try {
      const prod = products[index];
      const artisan = this.getUserById(prod.artisan_id);
      notificationService.notifyArtisanProductApproved(
        prod.name,
        artisan?.name || 'Artisan',
        prod.id
      );
    } catch {}

    this.notify();
    return products[index];
  }

  // Product Review: Reject with Reason
  public rejectProduct(productId: string, rejectionReason: string): ProductEntity {
    if (!rejectionReason || !rejectionReason.trim()) {
      throw new DataArchitectureError('Rejection reason is mandatory', 'VALIDATION_ERROR');
    }

    const products = this.getProducts('all');
    const index = products.findIndex((p) => p.id === productId);

    if (index === -1) {
      throw new DataArchitectureError(`Product ${productId} not found`, 'NOT_FOUND');
    }

    products[index] = {
      ...products[index],
      status: 'rejected',
      rejection_reason: rejectionReason.trim(),
      updated_at: new Date().toISOString()
    };

    localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));

    // Notify artisan
    try {
      notificationService.notifyArtisanProductRejected(
        products[index].name,
        rejectionReason.trim(),
        productId
      );
    } catch {}

    this.notify();
    return products[index];
  }

  // ==========================================================================
  // ORDERS REPOSITORY
  // ==========================================================================

  public getOrders(statusFilter?: OrderStatus | 'all'): OrderEntity[] {
    try {
      const raw = localStorage.getItem(KEY_ORDERS);
      let orders: OrderEntity[] = raw ? JSON.parse(raw) : SEED_ORDERS;

      if (statusFilter && statusFilter !== 'all') {
        orders = orders.filter((o) => o.status === statusFilter);
      }
      return orders;
    } catch {
      return SEED_ORDERS;
    }
  }

  public getOrderWithItems(orderId: string) {
    const orders = this.getOrders('all');
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    const rawItems = localStorage.getItem(KEY_ORDER_ITEMS);
    const items: OrderItemEntity[] = rawItems ? JSON.parse(rawItems) : SEED_ORDER_ITEMS;
    const orderItems = items.filter((it) => it.order_id === orderId);

    const buyer = this.getUserById(order.buyer_id);
    const artisan = this.getUserById(order.artisan_id);

    return {
      order,
      items: orderItems,
      buyer,
      artisan
    };
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus): OrderEntity {
    const orders = this.getOrders('all');
    const index = orders.findIndex((o) => o.id === orderId);

    if (index === -1) {
      throw new DataArchitectureError(`Order ${orderId} not found`, 'NOT_FOUND');
    }

    orders[index] = {
      ...orders[index],
      status: newStatus
    };

    localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));

    // Trigger buyer notifications for tracking transitions
    try {
      if (newStatus === 'Shipped') {
        notificationService.addNotification({
          category: 'buyer',
          type: 'buyer_order_shipped',
          title: 'Artisan Craft Shipped',
          message: `Your package for order #${orderId} is on the way. Tracking ID: ${orders[index].tracking_id || 'KC-EXP-912'}.`,
          icon: 'local_shipping',
          iconColorClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          targetScreen: 'orders',
          targetId: orderId,
          actionLabel: 'View Tracking'
        });
      } else if (newStatus === 'Delivered') {
        notificationService.addNotification({
          category: 'buyer',
          type: 'buyer_order_delivered',
          title: 'Craft Delivered Safely',
          message: `Order #${orderId} has arrived! Thank you for empowering traditional craft heritage.`,
          icon: 'package_2',
          iconColorClass: 'bg-stone-100 text-stone-800 border-stone-200',
          targetScreen: 'orders',
          targetId: orderId,
          actionLabel: 'View Details'
        });
      }
    } catch {}

    this.notify();
    return orders[index];
  }

  // ==========================================================================
  // DASHBOARD OVERVIEW & ANALYTICS
  // ==========================================================================

  public getDashboardOverviewMetrics() {
    const users = this.getUsers('all');
    const artisans = users.filter((u) => u.role === 'artisan');
    const buyers = users.filter((u) => u.role === 'buyer' || u.role === 'b2b');
    const products = this.getProducts('all');
    const pendingProducts = products.filter((p) => p.status === 'pending_review');
    const artisanProfiles = this.getArtisanProfiles();
    const pendingArtisans = artisanProfiles.filter((ap) => ap.verification_status === 'pending');
    const orders = this.getOrders('all');

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingApprovalsCount = pendingProducts.length + pendingArtisans.length;

    // Simple, clean analytics
    // 1. New artisan registrations (by recent period)
    const now = Date.now();
    const recentArtisans = artisans.filter((a) => {
      const created = new Date(a.created_at).getTime();
      return now - created <= 86400000 * 60; // last 60 days
    }).length;

    // 2. Published products count
    const publishedProductsCount = products.filter((p) => p.status === 'published').length;

    // 3. Category breakdown
    const categoryCount: Record<string, number> = {};
    products.forEach((p) => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });

    return {
      totalUsers: users.length,
      artisansCount: artisans.length,
      buyersCount: buyers.length,
      productsCount: products.length,
      publishedProductsCount,
      pendingApprovalsCount,
      pendingProductsCount: pendingProducts.length,
      pendingArtisansCount: pendingArtisans.length,
      ordersCount: orders.length,
      totalRevenue,
      analytics: {
        newArtisansCount: recentArtisans || artisans.length,
        categoryBreakdown: categoryCount,
        publishedCount: publishedProductsCount,
        ordersVolume: orders.length
      }
    };
  }
}

export const databaseService = new DatabaseService();
