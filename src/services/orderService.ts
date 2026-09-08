/**
 * KalaConnect Order & Customization Inquiry Persistence Service
 * 
 * Provides real-time reactive updates and durable local storage for:
 * 1. Buyer & Artisan Order Life-cycle Management (6 status stages)
 * 2. Buyer Customization Inquiries
 */

import { BuyerOrder, BuyerInquiry, OrderStatus, InquiryStatus, CartItem, OrderAddress, OrderPaymentInfo } from '../types';
import { notificationService } from './notificationService';

const ORDERS_STORAGE_KEY = 'kalamart_orders';
const INQUIRIES_STORAGE_KEY = 'kalamart_inquiries';

// Pre-seeded initial orders to ensure the app is immediately rich and testable
const INITIAL_SEED_ORDERS: BuyerOrder[] = [
  {
    id: 'ord-101',
    orderNumber: '#KM-91024',
    items: [
      {
        product: {
          id: 'kutch-kalash',
          title: 'Kutch Embossed Clay Water Carafe',
          hindiTitle: 'कच्छ नक्काशीदार सुराही',
          price: 1850,
          originalPrice: 2200,
          artisanName: 'Ramdev Kumbhar',
          artisanLocation: 'Bhuj, Gujarat',
          category: 'Pottery',
          giTag: 'Kutch Claycraft • GI Certified',
          giCertified: true,
          material: 'Terracotta Red River Clay',
          technique: 'Wheel-thrown & White Clay Painted',
          craftOrigin: 'Bhuj, Gujarat',
          rating: 4.9,
          reviewsCount: 124,
          images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBKEAtJLOEouP5Y0uc7qMue7vytttMtsmVEonY-GknldiMwk00xakpLEkflGB7uQBFcyV6tSPwTd-4wF-t1UzcGUBLWeky-OlcOphIrBQ1kmkhvWWefpeGPlzGEL_x9fYhb-RdNZ6QRxr-EBz0J7GZ1dCcy7iHICxpNvo84-zHgaSR9CZBsZlrjXv2hj1MabLJDD72MN7QROk4JUZ4y9CNUeJsXd-y403oOL7arcpXNzmNNY-JwqSJH'
          ],
          description: 'Handcrafted porous terracotta water carafe featuring natural white clay hand painting.'
        },
        quantity: 1
      }
    ],
    totalAmount: 1850,
    artisanRoyalty: 1610,
    status: 'Processing',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    timeAgo: '5 hours ago',
    deliveryAddress: {
      fullName: 'Ananya Sharma',
      phone: '+91 98450 12345',
      email: 'ananya.s@example.com',
      street: '42 Lotus Boulevard, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    payment: {
      method: 'upi',
      methodLabel: 'UPI (Google Pay)',
      transactionId: 'TXN_DEMO_910245',
      isSimulated: true,
      status: 'completed',
      paidAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      gatewayProvider: 'KalaConnect Sandbox Simulator'
    },
    trackingId: 'BLUEDART-8821092',
    courierPartner: 'Blue Dart Express Eco-Crate',
    estimatedDelivery: 'Estimated by Sep 11, 2026',
    artisanName: 'Ramdev Kumbhar',
    artisanId: 'art-1',
    customNotes: 'Please include the GI authenticity certificate inside.'
  },
  {
    id: 'ord-102',
    orderNumber: '#KM-91025',
    items: [
      {
        product: {
          id: 'terracotta-urli',
          title: 'Terracotta Urli with Floral Diyas',
          hindiTitle: 'नक्काशीदार सजावटी उरली',
          price: 1200,
          originalPrice: 1500,
          artisanName: 'Ramdev Kumbhar',
          artisanLocation: 'Bhuj, Gujarat',
          category: 'Home Decor',
          giTag: 'Kutch Claycraft • GI Certified',
          giCertified: true,
          material: 'Terracotta Red River Clay',
          technique: 'Hand-molded & Carved',
          craftOrigin: 'Bhuj, Gujarat',
          images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBMs7hPE8gmakn2V2_N8cnPD0J5QggMsDR9pKTMgTgRDaolDLDnSArBJcEosxmFA3HIfISh066i474V4q1BGhL_oFC1PEP1lWpKxLJNNcoDdalP8Cdum0mlAsnCDVMtQK7XGYopZ5AwcVKikSuiMsZxAoUNd_s2oPF6GhWdrdzkvJv2kV7HJI7j8IVw84S1gPS-BwmKtSLVaFnPIQ3dVy4S2-PUQEZko9WyOcALkVMl5gl0hL9PNti-'
          ],
          description: 'Festive terracotta urli bowl with hand-pinched lotus diyas.'
        },
        quantity: 2
      }
    ],
    totalAmount: 2400,
    artisanRoyalty: 2088,
    status: 'Order Placed',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    timeAgo: '1 hour ago',
    deliveryAddress: {
      fullName: 'Vikramaditya Sen',
      phone: '+91 97110 54321',
      email: 'vikram.sen@example.com',
      street: 'Flat 3B, Lake View Gardens',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700029'
    },
    payment: {
      method: 'card',
      methodLabel: 'Credit Card (Visa)',
      transactionId: 'TXN_DEMO_910246',
      isSimulated: true,
      status: 'completed',
      paidAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      gatewayProvider: 'KalaConnect Sandbox Simulator'
    },
    trackingId: 'DELHIVERY-774011',
    courierPartner: 'Delhivery Surface GI Hub',
    estimatedDelivery: 'Estimated by Sep 13, 2026',
    artisanName: 'Ramdev Kumbhar',
    artisanId: 'art-1'
  },
  {
    id: 'ord-103',
    orderNumber: '#KM-89104',
    items: [
      {
        product: {
          id: 'blue-pottery-vase',
          title: 'Jaipur Persian Cobalt Blue Pottery Vase',
          price: 1650,
          artisanName: 'Giriraj Kripal',
          artisanLocation: 'Jaipur, Rajasthan',
          category: 'Pottery',
          giTag: 'Jaipur Blue Pottery • GI Certified',
          giCertified: true,
          material: 'Quartz, Glass Powder & Natural Oxides',
          technique: 'Hand-painted Cobalt & Copper Glaze',
          craftOrigin: 'Jaipur, Rajasthan',
          images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCxSQE-UUyb2zjyQ_mLIxTS1gdHc-7o8HUrFtH03mYQeJ84ex5YEvP5fUeOS-bLH1v2FyaaQiW-ciQtljymHXvXtulgL59gk0zE1_2yg5u26gccHIkF5R8f7JS_Ss_nVH-ZrTxjUEdC-Dl-doCf9QRWP42oitUjrk19ROcyvPZjfVsgs3fDzk9FDuNOMs4_SVh4GQuTJKix2f1KIxeGQgU0mmhPThV1-dkOZnGfCUlcEJQjP7pFZvMo'
          ],
          description: 'Exquisite Egyptian quartz faience glazed with natural cobalt and copper oxides.'
        },
        quantity: 1
      }
    ],
    totalAmount: 1650,
    artisanRoyalty: 1435,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    timeAgo: '4 days ago',
    deliveryAddress: {
      fullName: 'Rohan Mehra',
      phone: '+91 99201 88392',
      email: 'rohan.m@example.com',
      street: '12 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400020'
    },
    payment: {
      method: 'upi',
      methodLabel: 'UPI (PhonePe)',
      transactionId: 'TXN_DEMO_891041',
      isSimulated: true,
      status: 'completed',
      paidAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      gatewayProvider: 'KalaConnect Sandbox Simulator'
    },
    trackingId: 'SPEEDPOST-88192',
    courierPartner: 'India Post Speed Post',
    estimatedDelivery: 'Delivered on Sep 6, 2026',
    artisanName: 'Giriraj Kripal',
    artisanId: 'art-2'
  }
];

// Pre-seeded customization inquiries
const INITIAL_SEED_INQUIRIES: BuyerInquiry[] = [
  {
    id: 'inq-201',
    inquiryNumber: '#INQ-7821',
    productId: 'kutch-kalash',
    productTitle: 'Kutch Embossed Clay Water Carafe',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKEAtJLOEouP5Y0uc7qMue7vytttMtsmVEonY-GknldiMwk00xakpLEkflGB7uQBFcyV6tSPwTd-4wF-t1UzcGUBLWeky-OlcOphIrBQ1kmkhvWWefpeGPlzGEL_x9fYhb-RdNZ6QRxr-EBz0J7GZ1dCcy7iHICxpNvo84-zHgaSR9CZBsZlrjXv2hj1MabLJDD72MN7QROk4JUZ4y9CNUeJsXd-y403oOL7arcpXNzmNNY-JwqSJH',
    artisanId: 'art-1',
    artisanName: 'Ramdev Kumbhar',
    buyerName: 'Sneha Patel',
    buyerPhone: '+91 98200 44556',
    buyerEmail: 'sneha.patel@designstudio.in',
    quantity: 4,
    customizationRequirements: 'Need 4 matching carafes engraved with subtle traditional peacock motifs on the neck and unglazed raw terracotta handles for our eco-resort dining tables.',
    message: 'Can this be crafted in 2.5 Litre capacity instead of standard 1.5L? Need delivery before Diwali festive season.',
    neededByDate: '2026-10-15',
    status: 'Quotation Provided',
    artisanNotes: 'Artisan Ramdev Kumbhar accepted custom 2.5L dimensions. Special kiln firing scheduled for Oct 2.',
    estimatedQuote: 8800,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'inq-202',
    inquiryNumber: '#INQ-7822',
    productId: 'terracotta-urli',
    productTitle: 'Terracotta Urli with Floral Diyas',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMs7hPE8gmakn2V2_N8cnPD0J5QggMsDR9pKTMgTgRDaolDLDnSArBJcEosxmFA3HIfISh066i474V4q1BGhL_oFC1PEP1lWpKxLJNNcoDdalP8Cdum0mlAsnCDVMtQK7XGYopZ5AwcVKikSuiMsZxAoUNd_s2oPF6GhWdrdzkvJv2kV7HJI7j8IVw84S1gPS-BwmKtSLVaFnPIQ3dVy4S2-PUQEZko9WyOcALkVMl5gl0hL9PNti-',
    artisanId: 'art-1',
    artisanName: 'Ramdev Kumbhar',
    buyerName: 'Arjun Nambiar',
    buyerPhone: '+91 97401 22334',
    buyerEmail: 'arjun@keralaspa.com',
    quantity: 6,
    customizationRequirements: 'Urli bowls with 16-inch diameter and polished brass-leaf inner wash.',
    message: 'We want 6 oversized urlis for our entrance fountain walkway.',
    neededByDate: '2026-09-28',
    status: 'New Inquiry',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

export type OrderListener = (orders: BuyerOrder[]) => void;
export type InquiryListener = (inquiries: BuyerInquiry[]) => void;

class OrderService {
  private orders: BuyerOrder[] = [];
  private inquiries: BuyerInquiry[] = [];
  private orderListeners: Set<OrderListener> = new Set();
  private inquiryListeners: Set<InquiryListener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        this.orders = JSON.parse(storedOrders);
      } else {
        this.orders = [...INITIAL_SEED_ORDERS];
        this.saveOrders();
      }
    } catch {
      this.orders = [...INITIAL_SEED_ORDERS];
    }

    try {
      const storedInquiries = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (storedInquiries) {
        this.inquiries = JSON.parse(storedInquiries);
      } else {
        this.inquiries = [...INITIAL_SEED_INQUIRIES];
        this.saveInquiries();
      }
    } catch {
      this.inquiries = [...INITIAL_SEED_INQUIRIES];
    }
  }

  private saveOrders() {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
    } catch {}
    this.notifyOrderListeners();
  }

  private saveInquiries() {
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(this.inquiries));
    } catch {}
    this.notifyInquiryListeners();
  }

  private notifyOrderListeners() {
    this.orderListeners.forEach((fn) => fn([...this.orders]));
  }

  private notifyInquiryListeners() {
    this.inquiryListeners.forEach((fn) => fn([...this.inquiries]));
  }

  // Subscriptions for real-time reactivity
  public subscribeOrders(fn: OrderListener): () => void {
    this.orderListeners.add(fn);
    fn([...this.orders]);
    return () => this.orderListeners.delete(fn);
  }

  public subscribeInquiries(fn: InquiryListener): () => void {
    this.inquiryListeners.add(fn);
    fn([...this.inquiries]);
    return () => this.inquiryListeners.delete(fn);
  }

  // --- Orders API ---
  public getOrders(): BuyerOrder[] {
    return [...this.orders];
  }

  public getOrderById(id: string): BuyerOrder | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(params: {
    items: CartItem[];
    deliveryAddress: OrderAddress;
    payment: OrderPaymentInfo;
    customNotes?: string;
  }): BuyerOrder {
    const totalAmount = params.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const artisanRoyalty = Math.round(totalAmount * 0.87);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `#KM-${Math.floor(80000 + Math.random() * 20000)}`;
    const id = `ord-${Date.now()}-${randomSuffix}`;
    const primaryArtisan = params.items[0]?.product.artisanName || 'Master Craftsman';
    const primaryArtisanId = params.items[0]?.product.artisanId || 'art-1';

    // Estimated delivery 4-6 days out
    const deliveryDate = new Date(Date.now() + 86400000 * 5);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const estimatedDelivery = `Estimated by ${deliveryDate.toLocaleDateString('en-US', options)}`;

    const newOrder: BuyerOrder = {
      id,
      orderNumber,
      items: params.items,
      totalAmount,
      artisanRoyalty,
      status: 'Order Placed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeAgo: 'Just now',
      deliveryAddress: params.deliveryAddress,
      payment: params.payment,
      trackingId: `BLUEDART-${Math.floor(1000000 + Math.random() * 9000000)}`,
      courierPartner: 'Blue Dart Climate-Neutral Courier',
      estimatedDelivery,
      customNotes: params.customNotes,
      artisanName: primaryArtisan,
      artisanId: primaryArtisanId
    };

    this.orders.unshift(newOrder);
    this.saveOrders();

    // Trigger real-time notifications for both Artisan and Buyer
    try {
      notificationService.notifyArtisanNewOrder(newOrder);
      notificationService.notifyBuyerOrderConfirmed(newOrder);
    } catch {}

    return newOrder;
  }

  /**
   * Updates an order's status through the 6 stages:
   * Order Placed -> Confirmed -> Processing -> Ready for Pickup -> Shipped -> Delivered
   * or Cancelled
   */
  public updateOrderStatus(orderId: string, newStatus: OrderStatus, customNotes?: string): BuyerOrder | null {
    const index = this.orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;

    const existing = this.orders[index];
    const updated: BuyerOrder = {
      ...existing,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      customNotes: customNotes || existing.customNotes
    };

    this.orders[index] = updated;
    this.saveOrders();

    // Trigger buyer notifications based on status progression
    try {
      if (newStatus === 'Confirmed') {
        notificationService.notifyBuyerOrderConfirmed(updated);
      } else if (newStatus === 'Shipped') {
        notificationService.notifyBuyerOrderShipped(updated);
      } else if (newStatus === 'Delivered') {
        notificationService.notifyBuyerOrderDelivered(updated);
      }
    } catch {}

    return updated;
  }

  public advanceOrderStatus(orderId: string): BuyerOrder | null {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    const sequence: OrderStatus[] = [
      'Order Placed',
      'Confirmed',
      'Processing',
      'Ready for Pickup',
      'Shipped',
      'Delivered'
    ];

    const currentIdx = sequence.indexOf(order.status as any);
    if (currentIdx === -1 || currentIdx >= sequence.length - 1) {
      return order;
    }

    const nextStatus = sequence[currentIdx + 1];
    return this.updateOrderStatus(orderId, nextStatus);
  }

  // --- Inquiries API ---
  public getInquiries(): BuyerInquiry[] {
    return [...this.inquiries];
  }

  public createInquiry(params: {
    productId: string;
    productTitle: string;
    productImage: string;
    artisanName: string;
    artisanId?: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail?: string;
    message: string;
    quantity: number;
    customizationRequirements: string;
    neededByDate?: string;
  }): BuyerInquiry {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const inquiryNumber = `#INQ-${randomSuffix}`;
    const id = `inq-${Date.now()}`;

    const newInquiry: BuyerInquiry = {
      id,
      inquiryNumber,
      productId: params.productId,
      productTitle: params.productTitle,
      productImage: params.productImage,
      artisanName: params.artisanName,
      artisanId: params.artisanId,
      buyerName: params.buyerName,
      buyerPhone: params.buyerPhone,
      buyerEmail: params.buyerEmail,
      message: params.message,
      quantity: params.quantity || 1,
      customizationRequirements: params.customizationRequirements,
      neededByDate: params.neededByDate,
      status: 'New Inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.inquiries.unshift(newInquiry);
    this.saveInquiries();

    // Trigger artisan notification for new inquiry
    try {
      notificationService.notifyArtisanNewInquiry(newInquiry);
    } catch {}

    return newInquiry;
  }

  public updateInquiryStatus(
    inquiryId: string,
    status: InquiryStatus,
    estimatedQuote?: number,
    artisanNotes?: string
  ): BuyerInquiry | null {
    const index = this.inquiries.findIndex((i) => i.id === inquiryId || i.inquiryNumber === inquiryId);
    if (index === -1) return null;

    const existing = this.inquiries[index];
    const updated: BuyerInquiry = {
      ...existing,
      status,
      estimatedQuote: estimatedQuote !== undefined ? estimatedQuote : existing.estimatedQuote,
      artisanNotes: artisanNotes || existing.artisanNotes,
      updatedAt: new Date().toISOString()
    };

    this.inquiries[index] = updated;
    this.saveInquiries();

    // Trigger buyer notification if artisan provided quote or notes response
    if (status === 'Quotation Provided' || status === 'Accepted & In Production' || artisanNotes) {
      try {
        notificationService.notifyBuyerInquiryResponse(updated, artisanNotes);
      } catch {}
    }

    return updated;
  }
}

export const orderService = new OrderService();
