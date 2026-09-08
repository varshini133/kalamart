/**
 * KalaConnect - Hackathon Demo Data & Presentation Blueprint
 * 
 * Specially curated for a 3 to 5 minute hackathon demonstration.
 * Flow Highlight:
 * "Voice → AI → Professional Catalog → Offline Sync → Premium Marketplace"
 */

import { User, Product, BuyerOrder, Artisan } from '../types';
import { PRODUCTS } from './mockData';

export interface DemoPersona {
  id: string;
  name: string;
  role: 'artisan' | 'buyer' | 'admin';
  buyerType?: 'individual' | 'b2b';
  title: string;
  location: string;
  avatar: string;
  bio: string;
  suggestedStartingScreen: string;
  highlights: string[];
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'artisan-ramdev',
    name: 'Ramdev Kumbhar',
    role: 'artisan',
    title: '5th Generation Master Potter',
    location: 'Bhuj, Kutch (Gujarat)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHgcpedYN9og1OrI5AgUGD21CNvwwr__CfJf8XXhKElzOWy_nzPgbPx3JiqF_px3nJJ_cmpZmerTmbQGpMrVHlnB1w8yB4sLquGnUskzn6YXz3KXN6t6GAJcJVS23tCd-husfCL_6B7QPGvPKN6ggbAK5mQJA6PTnkVvD6jdzcruj-1NFTD6stxcD2Fyg60R0zUuwrvl3EHHy_EQe8r18WlssaXuZ2ZU1GldZ11mwfOaVuEr_Ptol5',
    bio: 'Preserves 4,000-year-old Indus Valley saline river clay pottery without electricity.',
    suggestedStartingScreen: 'voice-cataloging',
    highlights: ['Voice-to-listing in native Hindi/Gujarati', 'Local offline saving', 'AI fair pricing']
  },
  {
    id: 'buyer-ananya',
    name: 'Ananya Sharma',
    role: 'buyer',
    buyerType: 'individual',
    title: 'Connoisseur & Sustainable Living Advocate',
    location: 'Indiranagar, Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Seeks authentic artisanal home goods with verified artisan lineage and direct fair trade payment.',
    suggestedStartingScreen: 'discover',
    highlights: ['Multi-currency pricing', 'Verified GI badges', 'Real-time order tracking']
  },
  {
    id: 'buyer-b2b-rajesh',
    name: 'Rajesh Singhania',
    role: 'buyer',
    buyerType: 'b2b',
    title: 'Head of Procurement, Heritage Resorts India',
    location: 'Bandra Kurla Complex, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Procures authentic handcrafted tableware and artisanal lighting in bulk for 12 boutique resorts.',
    suggestedStartingScreen: 'b2b-portal',
    highlights: ['Bulk MOQ pricing', 'Custom RFQ quotation', 'Production capacity monitoring']
  },
  {
    id: 'admin-custodian',
    name: 'Platform Custodian',
    role: 'admin',
    title: 'Head of Craft Integrity & Artisan Welfare',
    location: 'KalaConnect Trust HQ, New Delhi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'Vets artisan lineages, verifies GI certifications, and approves pending catalog submissions.',
    suggestedStartingScreen: 'admin-portal',
    highlights: ['Product approval workflow', 'Artisan verification', 'Platform analytics']
  }
];

export interface DemoStoryStep {
  stepNumber: number;
  badge: string;
  title: string;
  tagline: string;
  actionText: string;
  targetScreen: string;
  personaId: string;
  talkingPoints: string[];
}

export const DEMO_FLOW_STEPS: DemoStoryStep[] = [
  {
    stepNumber: 1,
    badge: 'Step 1 • Voice',
    title: 'Speak Your Craft',
    tagline: 'Artisans talk naturally in their native mother tongue instead of typing complex e-commerce forms.',
    actionText: 'Launch Voice Studio',
    targetScreen: 'voice-cataloging',
    personaId: 'artisan-ramdev',
    talkingPoints: [
      'Zero literacy barrier: Artisans simply record workshop audio in Hindi, Tamil, or English.',
      'Auto-detects spoken dialect and native script without manual configuration.'
    ]
  },
  {
    stepNumber: 2,
    badge: 'Step 2 • AI',
    title: 'Intelligent Structuring',
    tagline: 'Multi-modal AI extracts materials, technique, dimensions, care, and estimated labor.',
    actionText: 'Inspect AI Attributes',
    targetScreen: 'voice-cataloging',
    personaId: 'artisan-ramdev',
    talkingPoints: [
      'Strict guardrails: No invented certifications or false cultural heritage claims.',
      'Artisan can review, edit, and adjust every single extracted attribute.'
    ]
  },
  {
    stepNumber: 3,
    badge: 'Step 3 • Catalog',
    title: 'Professional Multilingual Catalog & Fair Pricing',
    tagline: 'Generates SEO-rich buyer titles, highlights, care instructions, and explainable fair wages.',
    actionText: 'View Pricing & Descriptions',
    targetScreen: 'voice-cataloging',
    personaId: 'artisan-ramdev',
    talkingPoints: [
      'Generates titles & highlights in English, Hindi, and regional languages.',
      'Explainable pricing calculates exact material costs + living hourly wages + 30% margin.'
    ]
  },
  {
    stepNumber: 4,
    badge: 'Step 4 • Offline Sync',
    title: 'Offline-First Resilience',
    tagline: 'Rural craft clusters often lose internet. Local IndexedDB saves drafts & auto-syncs upon reconnection.',
    actionText: 'Test Offline Synchronization',
    targetScreen: 'studio',
    personaId: 'artisan-ramdev',
    talkingPoints: [
      'Works completely disconnected without network failure spinners.',
      'Background sync queue pushes pending listings as soon as connectivity resumes.'
    ]
  },
  {
    stepNumber: 5,
    badge: 'Step 5 • Marketplace',
    title: 'Direct-to-Consumer & B2B Discovery',
    tagline: 'Published crafts instantly reach individual connoisseurs and bulk hospitality buyers worldwide.',
    actionText: 'Open Marketplace',
    targetScreen: 'discover',
    personaId: 'buyer-ananya',
    talkingPoints: [
      'Verified GI trust tags, maker video snippets, and direct artisan bank payouts.',
      'B2B Wholesale Portal with MOQ tier pricing, production capacity, and custom RFQs.'
    ]
  }
];

export const DEMO_SAMPLE_ORDERS: BuyerOrder[] = [
  {
    id: 'ORD-DEMO-901',
    orderNumber: 'KC-2026-901',
    artisanName: 'Ramdev Kumbhar',
    artisanId: 'artisan-ramdev',
    createdAt: '2026-03-05T10:30:00Z',
    updatedAt: '2026-03-05T10:30:00Z',
    status: 'Processing',
    trackingId: 'KC-TRK-774921',
    estimatedDelivery: '2026-03-14',
    totalAmount: 1850,
    artisanRoyalty: 1572,
    courierPartner: 'BlueDart Express',
    payment: {
      method: 'upi',
      methodLabel: 'UPI • Google Pay',
      transactionId: 'UPI-DEMO-889921',
      isSimulated: true,
      status: 'completed',
      paidAt: '2026-03-05T10:31:00Z'
    },
    deliveryAddress: {
      fullName: 'Aarav Mehta',
      phone: '+91 98450 12345',
      street: '42, 12th Main Road, HAL 2nd Stage',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    items: [
      {
        product: PRODUCTS[0],
        quantity: 2
      }
    ]
  },
  {
    id: 'ORD-DEMO-902',
    orderNumber: 'KC-2026-902',
    artisanName: 'Budhram Baghel',
    artisanId: 'artisan-budhram',
    createdAt: '2026-03-01T14:15:00Z',
    updatedAt: '2026-03-01T14:15:00Z',
    status: 'Shipped',
    trackingId: 'KC-TRK-882103',
    estimatedDelivery: '2026-03-09',
    totalAmount: 3450,
    artisanRoyalty: 2932,
    courierPartner: 'Delhivery Surface',
    payment: {
      method: 'card',
      methodLabel: 'Credit Card • HDFC Bank',
      transactionId: 'CC-DEMO-112233',
      isSimulated: true,
      status: 'completed',
      paidAt: '2026-03-01T14:16:00Z'
    },
    deliveryAddress: {
      fullName: 'Sunita Narayanan',
      phone: '+91 98200 98765',
      street: 'Flat 402, Sea Green Apartments, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    items: [
      {
        product: PRODUCTS[1] || PRODUCTS[0],
        quantity: 1
      }
    ]
  }
];
