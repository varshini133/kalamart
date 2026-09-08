/**
 * KalaConnect Notification System Service
 * 
 * Manages real-time and durable notification events for Artisans and Buyers:
 * 
 * NOTIFY ARTISANS ABOUT:
 * - New order
 * - New inquiry
 * - Product approved
 * - Product rejected
 * - Sync completed
 * 
 * NOTIFY BUYERS ABOUT:
 * - Order confirmed
 * - Order shipped
 * - Order delivered
 * - Inquiry response
 * 
 * Real-time pub/sub listeners + clean polling/fallback architecture.
 */

import {
  AppNotification,
  AppNotificationType,
  NotificationCategory,
  BuyerOrder,
  BuyerInquiry,
  B2BBulkInquiry,
  ScreenType
} from '../types';

const STORAGE_KEY = 'kalaconnect_notifications_v2';
const POLLING_INTERVAL_MS = 30000; // 30s background check interval

// Pre-seeded realistic notifications so the user immediately has full visibility into all events
const INITIAL_SEED_NOTIFICATIONS: AppNotification[] = [
  // ARTISAN NOTIFICATIONS
  {
    id: 'notif-art-order-01',
    category: 'artisan',
    type: 'artisan_new_order',
    title: 'New Order Received',
    message: 'Ananya Sharma placed an order for 1x Kutch Embossed Clay Water Carafe (₹1,850). Order #KM-91024.',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    read: false,
    icon: 'shopping_cart_checkout',
    iconColorClass: 'bg-amber-100 text-amber-800 border-amber-200',
    targetScreen: 'orders',
    targetId: 'ord-101',
    actionLabel: 'View Order',
    metadata: { orderNumber: '#KM-91024', amount: 1850 }
  },
  {
    id: 'notif-art-inq-02',
    category: 'artisan',
    type: 'artisan_new_inquiry',
    title: 'New Customization Inquiry',
    message: 'Arjun Nambiar sent an inquiry for 6x oversized Terracotta Urlis with custom brass-wash inner finish.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    icon: 'chat',
    iconColorClass: 'bg-blue-100 text-blue-800 border-blue-200',
    targetScreen: 'orders',
    targetId: 'inq-202',
    actionLabel: 'Review Inquiry',
    metadata: { inquiryNumber: '#INQ-7822' }
  },
  {
    id: 'notif-art-appr-03',
    category: 'artisan',
    type: 'artisan_product_approved',
    title: 'Product Approved & Published',
    message: 'Your craft "Kutch Embossed Clay Water Carafe" passed authenticity review and is live in the global catalog.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14 hours ago
    read: true,
    icon: 'verified',
    iconColorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    targetScreen: 'my-products',
    targetId: 'kutch-kalash',
    actionLabel: 'View in Products',
    metadata: { productId: 'kutch-kalash' }
  },
  {
    id: 'notif-art-rej-04',
    category: 'artisan',
    type: 'artisan_product_rejected',
    title: 'Refinement Requested',
    message: 'Review curator requested additional workshop photos for "Terracotta Bell Chime" to verify clay provenance.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 1 day ago
    read: true,
    icon: 'edit_note',
    iconColorClass: 'bg-rose-100 text-rose-800 border-rose-200',
    targetScreen: 'studio',
    actionLabel: 'Update Details',
    metadata: { productId: 'rev-01' }
  },
  {
    id: 'notif-art-sync-05',
    category: 'artisan',
    type: 'artisan_sync_completed',
    title: 'Offline Sync Completed',
    message: 'All 3 pending offline craft drafts and inventory adjustments have been synchronized to cloud registry.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(), // ~2 days ago
    read: true,
    icon: 'cloud_done',
    iconColorClass: 'bg-teal-100 text-teal-800 border-teal-200',
    targetScreen: 'studio',
    actionLabel: 'Open Studio'
  },

  // BUYER NOTIFICATIONS
  {
    id: 'notif-buy-conf-01',
    category: 'buyer',
    type: 'buyer_order_confirmed',
    title: 'Order Confirmed',
    message: 'Master Craftsman Ramdev Kumbhar accepted your order #KM-91024. Handcrafting & packaging in progress.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    read: false,
    icon: 'check_circle',
    iconColorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    targetScreen: 'orders',
    targetId: 'ord-101',
    actionLabel: 'Track Order',
    metadata: { orderNumber: '#KM-91024' }
  },
  {
    id: 'notif-buy-ship-02',
    category: 'buyer',
    type: 'buyer_order_shipped',
    title: 'Order Shipped with Blue Dart',
    message: 'Your artisanal package #KM-88219 has dispatched via Blue Dart Climate-Neutral. AWB #BLUEDART-8821092.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    read: false,
    icon: 'local_shipping',
    iconColorClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    targetScreen: 'orders',
    targetId: 'ord-101',
    actionLabel: 'View Tracking',
    metadata: { trackingId: 'BLUEDART-8821092' }
  },
  {
    id: 'notif-buy-del-03',
    category: 'buyer',
    type: 'buyer_order_delivered',
    title: 'Order Safely Delivered',
    message: 'Your order #KM-74120 of Kutch Claycraft has arrived at Indiranagar, Bangalore. Enjoy your authentic craft!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), // 2 days ago
    read: true,
    icon: 'package_2',
    iconColorClass: 'bg-stone-100 text-stone-800 border-stone-200',
    targetScreen: 'orders',
    actionLabel: 'Write a Review',
    metadata: { orderNumber: '#KM-74120' }
  },
  {
    id: 'notif-buy-inq-04',
    category: 'buyer',
    type: 'buyer_inquiry_response',
    title: 'Artisan Response to Inquiry',
    message: 'Ramdev Kumbhar accepted your custom request for 4x 2.5L Peacock motifs with a quote of ₹8,800.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    read: false,
    icon: 'rate_review',
    iconColorClass: 'bg-purple-100 text-purple-800 border-purple-200',
    targetScreen: 'orders',
    targetId: 'inq-201',
    actionLabel: 'View Quotation',
    metadata: { inquiryNumber: '#INQ-7821', quote: 8800 }
  }
];

export type NotificationListener = (notifications: AppNotification[]) => void;
export type SingleNotificationListener = (notification: AppNotification) => void;

class NotificationService {
  private notifications: AppNotification[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private newNotificationListeners: Set<SingleNotificationListener> = new Set();
  private pollingTimer: any = null;

  constructor() {
    this.loadFromStorage();
    this.startPolling();
  }

  // =========================================================================
  // PERSISTENCE & INITIALIZATION
  // =========================================================================

  private loadFromStorage() {
    if (typeof window === 'undefined') {
      this.notifications = [...INITIAL_SEED_NOTIFICATIONS];
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.notifications = parsed;
          return;
        }
      }
    } catch {
      // ignore parse errors and fallback to seed
    }

    this.notifications = [...INITIAL_SEED_NOTIFICATIONS];
    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
    } catch {
      // storage full or disabled
    }
  }

  private notifyAll() {
    const listCopy = [...this.notifications];
    this.listeners.forEach((listener) => {
      try {
        listener(listCopy);
      } catch (err) {
        console.error('Error in notification listener:', err);
      }
    });
  }

  // =========================================================================
  // REAL-TIME PUBSUB & POLLING ARCHITECTURE
  // =========================================================================

  /**
   * Subscribe to state changes (new notifications, read status updates, clear)
   */
  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    // Emit current state immediately
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subscribe strictly to newly arriving notifications for discreet, non-intrusive toasts
   */
  public subscribeToNew(listener: SingleNotificationListener): () => void {
    this.newNotificationListeners.add(listener);
    return () => {
      this.newNotificationListeners.delete(listener);
    };
  }

  /**
   * Clean polling/fallback loop checking for cross-tab or remote changes
   */
  private startPolling() {
    if (typeof window === 'undefined') return;
    if (this.pollingTimer) clearInterval(this.pollingTimer);

    this.pollingTimer = setInterval(() => {
      this.checkPollingUpdates();
    }, POLLING_INTERVAL_MS);
  }

  public stopPolling() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  private checkPollingUpdates() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length !== this.notifications.length) {
          this.notifications = parsed;
          this.notifyAll();
        }
      }
    } catch {}
  }

  // =========================================================================
  // QUERY & MUTATION APIS
  // =========================================================================

  public getNotifications(category?: NotificationCategory | 'all'): AppNotification[] {
    if (!category || category === 'all') {
      return [...this.notifications];
    }
    return this.notifications.filter((n) => n.category === category);
  }

  public getUnreadCount(category?: NotificationCategory | 'all'): number {
    return this.getNotifications(category).filter((n) => !n.read).length;
  }

  public markAsRead(notificationId: string): void {
    let changed = false;
    this.notifications = this.notifications.map((n) => {
      if (n.id === notificationId && !n.read) {
        changed = true;
        return { ...n, read: true };
      }
      return n;
    });

    if (changed) {
      this.saveToStorage();
      this.notifyAll();
    }
  }

  public markAllAsRead(category?: NotificationCategory | 'all'): void {
    let changed = false;
    this.notifications = this.notifications.map((n) => {
      if ((!category || category === 'all' || n.category === category) && !n.read) {
        changed = true;
        return { ...n, read: true };
      }
      return n;
    });

    if (changed) {
      this.saveToStorage();
      this.notifyAll();
    }
  }

  public deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    this.saveToStorage();
    this.notifyAll();
  }

  public clearAll(category?: NotificationCategory | 'all'): void {
    if (!category || category === 'all') {
      this.notifications = [];
    } else {
      this.notifications = this.notifications.filter((n) => n.category !== category);
    }
    this.saveToStorage();
    this.notifyAll();
  }

  /**
   * Internal push helper
   */
  public addNotification(
    params: Omit<AppNotification, 'id' | 'timestamp' | 'read'> & Partial<AppNotification>
  ): AppNotification {
    const newNotif: AppNotification = {
      id: params.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: params.timestamp || new Date().toISOString(),
      read: params.read ?? false,
      ...params
    };

    // Prepend to top
    this.notifications.unshift(newNotif);
    this.saveToStorage();
    this.notifyAll();

    // Trigger toast listener for gentle popups
    this.newNotificationListeners.forEach((listener) => {
      try {
        listener(newNotif);
      } catch (err) {
        console.error('Error in new notification listener:', err);
      }
    });

    return newNotif;
  }

  // =========================================================================
  // ARTISAN SPECIFIC TRIGGERS
  // =========================================================================

  /**
   * 1. Artisan: New order
   */
  public notifyArtisanNewOrder(order: BuyerOrder): AppNotification {
    const primaryItem = order.items[0];
    const itemTitle = primaryItem ? primaryItem.product.title : 'handcrafted item';
    const buyerName = order.deliveryAddress?.fullName || 'A buyer';

    return this.addNotification({
      category: 'artisan',
      type: 'artisan_new_order',
      title: 'New Order Received',
      message: `${buyerName} placed an order for ${order.items.length} item(s) (${itemTitle}). Total: ₹${order.totalAmount.toLocaleString('en-IN')}.`,
      icon: 'shopping_cart_checkout',
      iconColorClass: 'bg-amber-100 text-amber-800 border-amber-200',
      targetScreen: 'orders',
      targetId: order.id,
      actionLabel: 'View Order',
      metadata: { orderNumber: order.orderNumber, totalAmount: order.totalAmount }
    });
  }

  /**
   * 2. Artisan: New inquiry
   */
  public notifyArtisanNewInquiry(inquiry: BuyerInquiry | B2BBulkInquiry): AppNotification {
    const isB2B = 'rfqNumber' in inquiry;
    const number = isB2B ? inquiry.rfqNumber : inquiry.inquiryNumber;
    const buyer = inquiry.buyerName;
    const craft = inquiry.productTitle;
    const qty = isB2B ? inquiry.requiredQuantity : inquiry.quantity;

    return this.addNotification({
      category: 'artisan',
      type: 'artisan_new_inquiry',
      title: isB2B ? 'New B2B Bulk Sourcing Inquiry' : 'New Customization Inquiry',
      message: `${buyer} requested ${qty} unit(s) of "${craft}". Requirements: ${inquiry.customizationRequirements.slice(0, 75)}...`,
      icon: 'chat',
      iconColorClass: 'bg-blue-100 text-blue-800 border-blue-200',
      targetScreen: isB2B ? 'b2b-portal' : 'orders',
      targetId: inquiry.id,
      actionLabel: 'Review Inquiry',
      metadata: { inquiryNumber: number, isB2B }
    });
  }

  /**
   * 3. Artisan: Product approved
   */
  public notifyArtisanProductApproved(
    productTitle: string,
    artisanName: string,
    productId?: string
  ): AppNotification {
    return this.addNotification({
      category: 'artisan',
      type: 'artisan_product_approved',
      title: 'Craft Approved & Published',
      message: `Great news ${artisanName}! "${productTitle}" has passed curation standards and is now published to the marketplace.`,
      icon: 'verified',
      iconColorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      targetScreen: 'my-products',
      targetId: productId,
      actionLabel: 'View Craft',
      metadata: { productTitle, productId }
    });
  }

  /**
   * 4. Artisan: Product rejected / refinement requested
   */
  public notifyArtisanProductRejected(
    productTitle: string,
    reason: string,
    productId?: string
  ): AppNotification {
    return this.addNotification({
      category: 'artisan',
      type: 'artisan_product_rejected',
      title: 'Refinement Required for Craft',
      message: `Curator notes on "${productTitle}": ${reason}. Please update details to resubmit for approval.`,
      icon: 'edit_note',
      iconColorClass: 'bg-rose-100 text-rose-800 border-rose-200',
      targetScreen: 'studio',
      targetId: productId,
      actionLabel: 'Edit Product',
      metadata: { productTitle, reason, productId }
    });
  }

  /**
   * 5. Artisan: Sync completed
   */
  public notifyArtisanSyncCompleted(syncedCount: number): AppNotification {
    return this.addNotification({
      category: 'artisan',
      type: 'artisan_sync_completed',
      title: 'Offline Sync Completed',
      message: `Successfully synchronized ${syncedCount} offline craft item(s) and updates to cloud registry.`,
      icon: 'cloud_done',
      iconColorClass: 'bg-teal-100 text-teal-800 border-teal-200',
      targetScreen: 'studio',
      actionLabel: 'Open Studio',
      metadata: { syncedCount }
    });
  }

  /**
   * Artisan: Verification approved
   */
  public notifyArtisanVerificationApproved(artisanName: string, levelLabel: string): AppNotification {
    return this.addNotification({
      category: 'artisan',
      type: 'artisan_product_approved',
      title: 'Artisan Verification Approved',
      message: `Congratulations ${artisanName}! Your craft credentials have been verified at ${levelLabel}. Trust badges are now visible on your profile.`,
      icon: 'verified_user',
      iconColorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      targetScreen: 'profile',
      actionLabel: 'View Profile'
    });
  }

  /**
   * Artisan: Verification rejected / clarification
   */
  public notifyArtisanVerificationRejected(artisanName: string, reason: string): AppNotification {
    return this.addNotification({
      category: 'artisan',
      type: 'artisan_product_rejected',
      title: 'Verification Clarification Required',
      message: `Dear ${artisanName}, custodian audit feedback: ${reason}. Please update your workshop documents.`,
      icon: 'info',
      iconColorClass: 'bg-amber-100 text-amber-800 border-amber-200',
      targetScreen: 'profile',
      actionLabel: 'Update Info'
    });
  }

  // =========================================================================
  // BUYER SPECIFIC TRIGGERS
  // =========================================================================

  /**
   * 1. Buyer: Order confirmed
   */
  public notifyBuyerOrderConfirmed(order: BuyerOrder): AppNotification {
    const artisanName = order.artisanName || 'Master Craftsman';
    return this.addNotification({
      category: 'buyer',
      type: 'buyer_order_confirmed',
      title: 'Order Confirmed',
      message: `${artisanName} accepted order ${order.orderNumber}. Preparation and authenticity certificate generation underway.`,
      icon: 'check_circle',
      iconColorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      targetScreen: 'orders',
      targetId: order.id,
      actionLabel: 'Track Order',
      metadata: { orderNumber: order.orderNumber }
    });
  }

  /**
   * 2. Buyer: Order shipped
   */
  public notifyBuyerOrderShipped(order: BuyerOrder): AppNotification {
    const tracking = order.trackingId || 'AWB-PENDING';
    const courier = order.courierPartner || 'Climate-Neutral Express';
    return this.addNotification({
      category: 'buyer',
      type: 'buyer_order_shipped',
      title: 'Artisan Craft Shipped',
      message: `Your package for order ${order.orderNumber} is on the way via ${courier}. Tracking ID: ${tracking}.`,
      icon: 'local_shipping',
      iconColorClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      targetScreen: 'orders',
      targetId: order.id,
      actionLabel: 'View Tracking',
      metadata: { orderNumber: order.orderNumber, trackingId: tracking }
    });
  }

  /**
   * 3. Buyer: Order delivered
   */
  public notifyBuyerOrderDelivered(order: BuyerOrder): AppNotification {
    return this.addNotification({
      category: 'buyer',
      type: 'buyer_order_delivered',
      title: 'Craft Delivered Safely',
      message: `Order ${order.orderNumber} has arrived! Thank you for empowering traditional craft heritage.`,
      icon: 'package_2',
      iconColorClass: 'bg-stone-100 text-stone-800 border-stone-200',
      targetScreen: 'orders',
      targetId: order.id,
      actionLabel: 'View Details',
      metadata: { orderNumber: order.orderNumber }
    });
  }

  /**
   * 4. Buyer: Inquiry response
   */
  public notifyBuyerInquiryResponse(
    inquiry: BuyerInquiry | B2BBulkInquiry,
    artisanNotes?: string
  ): AppNotification {
    const isB2B = 'rfqNumber' in inquiry;
    const num = isB2B ? inquiry.rfqNumber : inquiry.inquiryNumber;
    const note = artisanNotes || ('quoteDetails' in inquiry && inquiry.quoteDetails?.artisanNotes) || 'Quotation and turnaround details have been provided.';

    return this.addNotification({
      category: 'buyer',
      type: 'buyer_inquiry_response',
      title: 'Artisan Responded to Inquiry',
      message: `${inquiry.artisanName} provided an update for inquiry ${num}: "${note.slice(0, 80)}..."`,
      icon: 'rate_review',
      iconColorClass: 'bg-purple-100 text-purple-800 border-purple-200',
      targetScreen: isB2B ? 'b2b-portal' : 'orders',
      targetId: inquiry.id,
      actionLabel: 'Review Quotation',
      metadata: { inquiryNumber: num, isB2B }
    });
  }

  // =========================================================================
  // DEMO SIMULATION HELPER
  // =========================================================================

  /**
   * Helper for prototype testing to trigger any of the 9 required events with realistic payload
   */
  public simulateEvent(type: AppNotificationType): AppNotification {
    switch (type) {
      case 'artisan_new_order':
        return this.addNotification({
          category: 'artisan',
          type: 'artisan_new_order',
          title: 'New Order Received',
          message: 'Sneha Patel ordered 2x Madhubani Handpainted Festive Coasters (₹1,200). Order #KM-92144.',
          icon: 'shopping_cart_checkout',
          iconColorClass: 'bg-amber-100 text-amber-800 border-amber-200',
          targetScreen: 'orders',
          actionLabel: 'View Order'
        });
      case 'artisan_new_inquiry':
        return this.addNotification({
          category: 'artisan',
          type: 'artisan_new_inquiry',
          title: 'New Customization Inquiry',
          message: 'Meera Deshpande requested 5x custom terracotta tea cups engraved with traditional leaves.',
          icon: 'chat',
          iconColorClass: 'bg-blue-100 text-blue-800 border-blue-200',
          targetScreen: 'orders',
          actionLabel: 'Review Inquiry'
        });
      case 'artisan_product_approved':
        return this.addNotification({
          category: 'artisan',
          type: 'artisan_product_approved',
          title: 'Craft Approved & Published',
          message: 'Curator verified handmade claims and published "Jaipur Blue Ceramic Planter" to the global store.',
          icon: 'verified',
          iconColorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          targetScreen: 'my-products',
          actionLabel: 'View Craft'
        });
      case 'artisan_product_rejected':
        return this.addNotification({
          category: 'artisan',
          type: 'artisan_product_rejected',
          title: 'Refinement Required for Craft',
          message: 'Curator requested clearer photos of the wheel-throwing stage for "Terracotta Urli".',
          icon: 'edit_note',
          iconColorClass: 'bg-rose-100 text-rose-800 border-rose-200',
          targetScreen: 'studio',
          actionLabel: 'Edit Product'
        });
      case 'artisan_sync_completed':
        return this.addNotification({
          category: 'artisan',
          type: 'artisan_sync_completed',
          title: 'Offline Sync Completed',
          message: 'All 4 offline product changes and price adjustments were safely synced to the cloud.',
          icon: 'cloud_done',
          iconColorClass: 'bg-teal-100 text-teal-800 border-teal-200',
          targetScreen: 'studio',
          actionLabel: 'Open Studio'
        });
      case 'buyer_order_confirmed':
        return this.addNotification({
          category: 'buyer',
          type: 'buyer_order_confirmed',
          title: 'Order Confirmed',
          message: 'Ramdev Kumbhar has confirmed order #KM-91024 and scheduled kiln finishing.',
          icon: 'check_circle',
          iconColorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          targetScreen: 'orders',
          actionLabel: 'Track Order'
        });
      case 'buyer_order_shipped':
        return this.addNotification({
          category: 'buyer',
          type: 'buyer_order_shipped',
          title: 'Craft Shipped with Blue Dart',
          message: 'Your parcel #KM-91024 has been picked up by Blue Dart Courier. Tracking: BLUEDART-8821092.',
          icon: 'local_shipping',
          iconColorClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          targetScreen: 'orders',
          actionLabel: 'View Tracking'
        });
      case 'buyer_order_delivered':
        return this.addNotification({
          category: 'buyer',
          type: 'buyer_order_delivered',
          title: 'Craft Delivered Safely',
          message: 'Your order #KM-91024 has been delivered. Thank you for celebrating Indian heritage crafts!',
          icon: 'package_2',
          iconColorClass: 'bg-stone-100 text-stone-800 border-stone-200',
          targetScreen: 'orders',
          actionLabel: 'View Order'
        });
      case 'buyer_inquiry_response':
        return this.addNotification({
          category: 'buyer',
          type: 'buyer_inquiry_response',
          title: 'Artisan Responded to Inquiry',
          message: 'Ramdev Kumbhar accepted your custom request: "Will prepare custom 2.5L capacity with peacock seal."',
          icon: 'rate_review',
          iconColorClass: 'bg-purple-100 text-purple-800 border-purple-200',
          targetScreen: 'orders',
          actionLabel: 'Review Quotation'
        });
      default:
        return this.addNotification({
          category: 'system',
          type: 'system_alert',
          title: 'System Notice',
          message: 'Platform update completed successfully.',
          icon: 'info',
          iconColorClass: 'bg-gray-100 text-gray-800 border-gray-200'
        });
    }
  }
}

export const notificationService = new NotificationService();
