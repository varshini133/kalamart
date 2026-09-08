import { B2BBulkInquiry, Product } from '../types';
import { notificationService } from './notificationService';

const STORAGE_KEY_MODE = 'kalaconnect_b2b_mode';
const STORAGE_KEY_INQUIRIES = 'kalaconnect_b2b_inquiries';

const INITIAL_INQUIRIES: B2BBulkInquiry[] = [
  {
    id: 'rfq-taj-01',
    rfqNumber: 'RFQ-2026-8841',
    productId: 'kutch-kalash-pitcher',
    productTitle: 'Handcrafted Kutch Kalash Terracotta Pitcher',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3',
    artisanName: 'Ramdev Kumbhar',
    artisanId: 'artisan-ramdev-01',
    buyerName: 'Vikramaditya Rathore',
    buyerCompany: 'Taj Heritage Palaces & Resorts',
    buyerEmail: 'procurement.heritage@tajhotels.com',
    buyerPhone: '+91 98290 44122',
    requiredQuantity: 75,
    deliveryRegion: 'West India (Rajasthan & Gujarat)',
    requiredDeliveryDate: '2026-04-15',
    customizationRequirements: 'Subtle hotel crest stamped on vessel shoulder with non-toxic ochre seal; food-safe certified testing documentation required.',
    message: 'Seeking 75 authentic handcrafted earthen water pitchers for guest suites in our heritage property. Need export-grade wooden crate packing.',
    status: 'active_inquiry',
    createdAt: '2026-03-05T10:30:00Z',
    unitPriceEstimate: 650
  },
  {
    id: 'rfq-fab-02',
    rfqNumber: 'RFQ-2026-7910',
    productId: 'dhokra-diya',
    productTitle: 'Dhokra Lost-Wax Diya',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACm8mIi0Uyd4aTu3HnJ_njyfA5deLeGBjHglHu4RT1zznER-m6K9CUbLm__DLya3sM8b6ucBwaC0mVzVGAEFYNNMXn2IHkf7l8UdP7_9lds9qCX118Q-bpd83giI20RZeoF-AQvrEaS88gXZVJ30aShJ9Uhk08G0vnpGhK3hfGavN9pNwuACAVAXARX1Fb2aZsdA6Txybiks9y3E28jsY3xY576qs3b-kR7ShzjSI35FSZ_vMtfLZ0',
    artisanName: 'Budhram Baghel',
    artisanId: 'artisan-budhram-02',
    buyerName: 'Ananya Deshmukh',
    buyerCompany: 'Artisan Retail Global / FabIndia Partner',
    buyerEmail: 'ananya.sourcing@fabind-partners.com',
    buyerPhone: '+91 99301 88204',
    requiredQuantity: 120,
    deliveryRegion: 'North India (Delhi NCR)',
    requiredDeliveryDate: '2026-05-01',
    customizationRequirements: 'Individual eco-friendly corrugated craft boxes with GI heritage certificate card insert inside each package.',
    message: 'We are curating a national festival collection for 14 flagship stores. Ready to place advance purchase order upon quote acceptance.',
    status: 'quotation_provided',
    createdAt: '2026-03-02T14:15:00Z',
    unitPriceEstimate: 2600,
    quoteDetails: {
      quotedUnitPrice: 2450,
      totalAmount: 294000,
      productionLeadDays: 18,
      validUntil: '2026-03-25',
      artisanNotes: 'Includes 120 lost-wax cast bell metal lamps, raw linseed buffing, custom individual kraft boxes, and GI provenance seals.',
      shippingEstimate: 4500
    }
  },
  {
    id: 'rfq-oberoi-03',
    rfqNumber: 'RFQ-2026-6523',
    productId: 'jaipur-blue-urn',
    productTitle: 'Jaipur Blue Floral Urn',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxSQE-UUyb2zjyQ_mLIxTS1gdHc-7o8HUrFtH03mYQeJ84ex5YEvP5fUeOS-bLH1v2FyaaQiW-ciQtljymHXvXtulgL59gk0zE1_2yg5u26gccHIkF5R8f7JS_Ss_nVH-ZrTxjUEdC-Dl-doCf9QRWP42oitUjrk19ROcyvPZjfVsgs3fDzk9FDuNOMs4_SVh4GQuTJKix2f1KIxeGQgU0mmhPThV1-dkOZnGfCUlcEJQjP7pFZvMo',
    artisanName: 'Giriraj Kripal',
    artisanId: 'artisan-giriraj-03',
    buyerName: 'Sameer Mehra',
    buyerCompany: 'The Oberoi Udaivilas Hospitality',
    buyerEmail: 'sourcing@oberoihotels.com',
    buyerPhone: '+91 98110 57721',
    requiredQuantity: 40,
    deliveryRegion: 'West India (Udaipur)',
    requiredDeliveryDate: '2026-03-30',
    customizationRequirements: 'High gloss cobalt turquoise glaze finish with anti-scratch felt base padding on bottom rim.',
    message: 'Luxury boutique installation for courtyard colonnades. Repeat commercial client.',
    status: 'bulk_order_confirmed',
    createdAt: '2026-02-24T09:00:00Z',
    unitPriceEstimate: 2100,
    quoteDetails: {
      quotedUnitPrice: 1950,
      totalAmount: 78000,
      productionLeadDays: 14,
      validUntil: '2026-03-10',
      artisanNotes: 'Production initiated at master studio in Sanganer; kiln firing scheduled in batch of 20.',
      shippingEstimate: 3200
    },
    bulkOrderDetails: {
      orderId: 'B2B-ORD-9082',
      batchStatus: 'In Batch Production',
      trackingNumber: 'V-TRANS-IND-882194',
      courierPartner: 'V-Trans Logistics Cargo',
      advancePaid: 39000,
      balanceDue: 42200
    }
  }
];

class B2BService {
  private isB2BMode: boolean = false;
  private inquiries: B2BBulkInquiry[] = [];
  private modeListeners: Set<(active: boolean) => void> = new Set();
  private inquiryListeners: Set<(inquiries: B2BBulkInquiry[]) => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedMode = localStorage.getItem(STORAGE_KEY_MODE);
      this.isB2BMode = storedMode ? JSON.parse(storedMode) : false;

      const storedInquiries = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (storedInquiries) {
        this.inquiries = JSON.parse(storedInquiries);
      } else {
        this.inquiries = INITIAL_INQUIRIES;
        this.saveInquiries();
      }
    } catch {
      this.isB2BMode = false;
      this.inquiries = INITIAL_INQUIRIES;
    }
  }

  private saveInquiries() {
    try {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(this.inquiries));
    } catch (e) {
      console.warn('Failed to persist B2B inquiries', e);
    }
    this.notifyInquiryListeners();
  }

  private notifyModeListeners() {
    this.modeListeners.forEach((cb) => cb(this.isB2BMode));
  }

  private notifyInquiryListeners() {
    this.inquiryListeners.forEach((cb) => cb([...this.inquiries]));
  }

  public isB2BModeActive(): boolean {
    return this.isB2BMode;
  }

  public setB2BMode(active: boolean) {
    this.isB2BMode = active;
    try {
      localStorage.setItem(STORAGE_KEY_MODE, JSON.stringify(active));
    } catch (e) {
      console.warn('Failed to persist B2B mode', e);
    }
    this.notifyModeListeners();
  }

  public toggleB2BMode(): boolean {
    const next = !this.isB2BMode;
    this.setB2BMode(next);
    return next;
  }

  public subscribeB2BMode(callback: (active: boolean) => void): () => void {
    this.modeListeners.add(callback);
    callback(this.isB2BMode);
    return () => {
      this.modeListeners.delete(callback);
    };
  }

  public subscribeInquiries(callback: (inquiries: B2BBulkInquiry[]) => void): () => void {
    this.inquiryListeners.add(callback);
    callback([...this.inquiries]);
    return () => {
      this.inquiryListeners.delete(callback);
    };
  }

  public getInquiries(): B2BBulkInquiry[] {
    return [...this.inquiries];
  }

  public getInquiryById(id: string): B2BBulkInquiry | undefined {
    return this.inquiries.find((i) => i.id === id);
  }

  public createInquiry(
    data: Omit<B2BBulkInquiry, 'id' | 'rfqNumber' | 'createdAt' | 'status'>
  ): B2BBulkInquiry {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newInquiry: B2BBulkInquiry = {
      ...data,
      id: `rfq-${Date.now()}`,
      rfqNumber: `RFQ-2026-${randomSuffix}`,
      status: 'active_inquiry',
      createdAt: new Date().toISOString()
    };

    this.inquiries = [newInquiry, ...this.inquiries];
    this.saveInquiries();
    try {
      notificationService.notifyArtisanNewInquiry(newInquiry);
    } catch {}
    return newInquiry;
  }

  public provideQuotation(
    inquiryId: string,
    quote: NonNullable<B2BBulkInquiry['quoteDetails']>
  ): B2BBulkInquiry {
    this.inquiries = this.inquiries.map((inq) => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: 'quotation_provided',
          quoteDetails: quote
        };
      }
      return inq;
    });
    this.saveInquiries();
    const updated = this.getInquiryById(inquiryId);
    if (!updated) throw new Error('Inquiry not found');
    try {
      notificationService.notifyBuyerInquiryResponse(updated, quote.artisanNotes);
    } catch {}
    return updated;
  }

  public acceptQuoteAndCreateBulkOrder(
    inquiryId: string,
    bulkOrderData?: Partial<NonNullable<B2BBulkInquiry['bulkOrderDetails']>>
  ): B2BBulkInquiry {
    const inq = this.getInquiryById(inquiryId);
    if (!inq) throw new Error('Inquiry not found');

    const total = inq.quoteDetails?.totalAmount || (inq.unitPriceEstimate || 1000) * inq.requiredQuantity;
    const advance = Math.round(total * 0.5);
    const balance = total - advance + (inq.quoteDetails?.shippingEstimate || 0);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const bulkOrderDetails: NonNullable<B2BBulkInquiry['bulkOrderDetails']> = {
      orderId: `B2B-ORD-${randomSuffix}`,
      batchStatus: 'In Batch Production',
      trackingNumber: `EXP-CARGO-IND-${randomSuffix}`,
      courierPartner: 'SafeXpress Regional B2B Logistics',
      advancePaid: advance,
      balanceDue: balance,
      ...bulkOrderData
    };

    this.inquiries = this.inquiries.map((item) => {
      if (item.id === inquiryId) {
        return {
          ...item,
          status: 'bulk_order_confirmed',
          bulkOrderDetails
        };
      }
      return item;
    });

    this.saveInquiries();
    return this.getInquiryById(inquiryId)!;
  }

  public updateBulkOrderStatus(
    inquiryId: string,
    batchStatus: 'In Batch Production' | 'Quality Inspection' | 'Export Crating' | 'Dispatched',
    trackingNumber?: string
  ): B2BBulkInquiry {
    this.inquiries = this.inquiries.map((item) => {
      if (item.id === inquiryId && item.bulkOrderDetails) {
        return {
          ...item,
          bulkOrderDetails: {
            ...item.bulkOrderDetails,
            batchStatus,
            trackingNumber: trackingNumber || item.bulkOrderDetails.trackingNumber,
            dispatchedAt: batchStatus === 'Dispatched' ? new Date().toISOString() : item.bulkOrderDetails.dispatchedAt
          }
        };
      }
      return item;
    });

    this.saveInquiries();
    return this.getInquiryById(inquiryId)!;
  }

  public declineInquiry(inquiryId: string): B2BBulkInquiry {
    this.inquiries = this.inquiries.map((item) => {
      if (item.id === inquiryId) {
        return {
          ...item,
          status: 'declined'
        };
      }
      return item;
    });
    this.saveInquiries();
    return this.getInquiryById(inquiryId)!;
  }

  /**
   * Export catalog as downloadable CSV for institutional buyers & export procurement
   */
  public exportCatalogCSV(products: Product[]) {
    const headers = [
      'Product ID',
      'Product Name',
      'Category',
      'Artisan Name',
      'Craft Origin',
      'GI Certified',
      'Material',
      'Technique',
      'Retail Price (INR)',
      'Wholesale Bulk Price (INR)',
      'Minimum Order Quantity (MOQ)',
      'Monthly Production Capacity',
      'Approximate Lead Time',
      'Bulk Available'
    ];

    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.artisanName}"`,
      `"${p.craftOrigin || 'India'}"`,
      `"${p.giCertified ? 'Yes (GI Tagged)' : 'Authentic Heritage'}"`,
      `"${p.material || 'Natural Materials'}"`,
      `"${p.technique || 'Handmade'}"`,
      p.price,
      p.bulkPrice || Math.round(p.price * 0.75),
      p.moq || 10,
      `"${p.productionCapacity || '100 units / month'}"`,
      `"${p.approxLeadTime || '14–21 days'}"`,
      p.bulkOrderAvailable !== false ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KalaConnect_B2B_Wholesale_Catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const b2bService = new B2BService();
