import React, { useState, useEffect } from 'react';
import { Language, ScreenType, User, BuyerOrder, BuyerInquiry, OrderStatus, InquiryStatus } from '../types';
import { orderService } from '../services/orderService';
import { getTranslations } from '../services/localizationService';
import { OrderTrackingModal } from '../components/checkout/OrderTrackingModal';

interface OrdersScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (msg: string) => void;
  user?: User | null;
  language?: Language;
}

const ORDER_STAGES: {
  status: OrderStatus;
  label: string;
  icon: string;
}[] = [
  { status: 'Order Placed', label: 'Order Placed', icon: 'receipt_long' },
  { status: 'Confirmed', label: 'Confirmed', icon: 'task_alt' },
  { status: 'Processing', label: 'Processing', icon: 'palette' },
  { status: 'Ready for Pickup', label: 'Ready for Pickup', icon: 'inventory_2' },
  { status: 'Shipped', label: 'Shipped', icon: 'local_shipping' },
  { status: 'Delivered', label: 'Delivered', icon: 'home' }
];

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  onNavigate: _onNavigate,
  onShowToast,
  user,
  language = 'en'
}) => {
  const t = getTranslations(language);

  // Subscribed live data from orderService
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>([]);

  // UI state
  const [mainTab, setMainTab] = useState<'orders' | 'inquiries'>('orders');
  const [activeRoleView, setActiveRoleView] = useState<'artisan' | 'buyer'>(
    user?.role === 'buyer' ? 'buyer' : 'artisan'
  );
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [inquiryFilter, setInquiryFilter] = useState<string>('all');

  // Tracking modal state
  const [trackingOrder, setTrackingOrder] = useState<BuyerOrder | null>(null);

  // Inquiry quote dialog state
  const [quotingInquiry, setQuotingInquiry] = useState<BuyerInquiry | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [artisanNote, setArtisanNote] = useState<string>('');

  // Subscribe to real-time order and inquiry updates
  useEffect(() => {
    const unsubOrders = orderService.subscribeOrders((liveOrders) => {
      setOrders(liveOrders);
    });
    const unsubInquiries = orderService.subscribeInquiries((liveInquiries) => {
      setInquiries(liveInquiries);
    });

    return () => {
      unsubOrders();
      unsubInquiries();
    };
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'all') return true;
    return ord.status === orderFilter;
  });

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryFilter === 'all') return true;
    return inq.status === inquiryFilter;
  });

  // Artisan Actions for Orders
  const handleAcceptOrder = (orderId: string) => {
    orderService.updateOrderStatus(orderId, 'Confirmed');
    onShowToast(language === 'ta' ? 'ஆர்டர் உறுதிப்படுத்தப்பட்டது!' : language === 'hi' ? 'ऑर्डर की पुष्टि हो गई!' : 'Order confirmed! Scheduled for production.');
  };

  const handleRejectOrder = (orderId: string) => {
    orderService.updateOrderStatus(orderId, 'Cancelled');
    onShowToast(language === 'ta' ? 'ஆர்டர் நிராகரிக்கப்பட்டது' : language === 'hi' ? 'ऑर्डर अस्वीकृत किया गया' : 'Order declined and refunded to customer.');
  };

  const handleAdvanceStatus = (orderId: string) => {
    const updated = orderService.advanceOrderStatus(orderId);
    if (updated) {
      onShowToast(`Status updated to ${updated.status}! Buyer notified.`);
    }
  };

  // Artisan Actions for Inquiries
  const handleOpenQuoteModal = (inq: BuyerInquiry) => {
    setQuotingInquiry(inq);
    setQuoteAmount(inq.estimatedQuote ? inq.estimatedQuote.toString() : '');
    setArtisanNote(inq.artisanNotes || '');
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotingInquiry) return;

    const parsedQuote = parseFloat(quoteAmount);
    orderService.updateInquiryStatus(
      quotingInquiry.id,
      'Quotation Provided',
      isNaN(parsedQuote) ? undefined : parsedQuote,
      artisanNote.trim() || 'Custom production timeline reviewed and accepted.'
    );

    onShowToast(`Customization quotation of ₹${parsedQuote.toLocaleString('en-IN')} sent to ${quotingInquiry.buyerName}!`);
    setQuotingInquiry(null);
  };

  const handleAcceptInquiry = (inquiryId: string) => {
    orderService.updateInquiryStatus(inquiryId, 'Accepted & In Production');
    onShowToast('Custom inquiry accepted! Production slot allocated.');
  };

  const handleDeclineInquiry = (inquiryId: string) => {
    orderService.updateInquiryStatus(inquiryId, 'Declined', undefined, 'Artisan currently at full kiln capacity.');
    onShowToast('Inquiry declined.');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-28 pb-32 px-4 max-w-xl mx-auto space-y-5 animate-fadeIn bg-surface">
      {/* Header & Title */}
      <div>
        <div className="flex items-center gap-1.5 text-secondary mb-1">
          <span className="material-symbols-outlined text-[18px]">hub</span>
          <span className="text-xs font-bold uppercase tracking-wider">
            Fulfillment & Inquiries
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-primary leading-tight">
          {activeRoleView === 'artisan' ? 'Artisan Order & Inquiry Management' : 'My Orders & Custom Inquiries'}
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Real-time GI craft tracking with direct 87% artisan remittance
        </p>
      </div>

      {/* Role Toggle: Artisan View vs Buyer View */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-container rounded-2xl border border-outline-variant/30 text-xs font-bold">
        <button
          onClick={() => setActiveRoleView('artisan')}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeRoleView === 'artisan'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          <span>Artisan Management</span>
        </button>
        <button
          onClick={() => setActiveRoleView('buyer')}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeRoleView === 'buyer'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
          <span>Buyer Orders & Tracking</span>
        </button>
      </div>

      {/* Main Tab: Orders vs Customization Inquiries */}
      <div className="flex border-b border-outline-variant/25 text-xs font-bold">
        <button
          onClick={() => setMainTab('orders')}
          className={`pb-2.5 px-4 flex items-center gap-2 border-b-2 transition-all ${
            mainTab === 'orders'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-outline hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setMainTab('inquiries')}
          className={`pb-2.5 px-4 flex items-center gap-2 border-b-2 transition-all ${
            mainTab === 'inquiries'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-outline hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">contact_support</span>
          <span>Customization Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* ======================= TAB 1: ORDERS ======================= */}
      {mainTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Status Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
            {['all', 'Order Placed', 'Confirmed', 'Processing', 'Ready for Pickup', 'Shipped', 'Delivered'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    orderFilter === st
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {st === 'all' ? 'All Stages' : st}
                </button>
              )
            )}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">inventory_2</span>
              <h4 className="font-bold text-sm text-primary">No orders found in this filter</h4>
              <p className="text-xs text-on-surface-variant">
                Place a purchase from the marketplace to test the live tracking pipeline.
              </p>
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const currentStepIndex = ORDER_STAGES.findIndex((s) => s.status === ord.status);
              const stepNum = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

              return (
                <div
                  key={ord.id}
                  className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm space-y-4 transition-all hover:border-secondary/40"
                >
                  {/* Order Top Bar */}
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-secondary uppercase">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-on-surface-variant ml-2">
                        {ord.timeAgo || 'Recent'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {ord.payment?.isSimulated && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold">
                          Sandbox
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-secondary-fixed text-on-secondary-fixed'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2">
                    {ord.items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-14 h-14 rounded-2xl object-cover bg-surface-container flex-shrink-0 border border-outline-variant/20"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-primary truncate">{product.title}</h4>
                          <p className="text-[11px] text-on-surface-variant truncate">
                            {activeRoleView === 'artisan'
                              ? `Buyer: ${ord.deliveryAddress.fullName}`
                              : `Artisan: ${product.artisanName || ord.artisanName}`}
                          </p>
                          <p className="text-[11px] text-secondary font-semibold">
                            Qty: {quantity} • ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Address & Note */}
                  <div className="p-3 bg-surface-container-low rounded-2xl text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Shipping To:</span>
                      <span className="font-bold text-primary">
                        {ord.deliveryAddress.city}, {ord.deliveryAddress.state} ({ord.deliveryAddress.pincode})
                      </span>
                    </div>
                    {ord.customNotes && (
                      <div className="pt-1 border-t border-outline-variant/20 flex gap-1 text-secondary">
                        <span className="material-symbols-outlined text-[14px]">edit_note</span>
                        <span>Buyer note: {ord.customNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* 6-Stage Visual Timeline Progress */}
                  <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-primary">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-secondary">timeline</span>
                        <span>Stage {stepNum} of 6: {ord.status}</span>
                      </span>
                      <span className="text-outline font-mono text-[10px]">
                        {ord.courierPartner}
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-1 pt-1">
                      {ORDER_STAGES.map((st, idx) => {
                        const isCompleted = idx < stepNum;
                        const isCurrent = idx === stepNum - 1;

                        return (
                          <div key={st.status} className="flex flex-col items-center space-y-1">
                            <div
                              className={`w-full h-1.5 rounded-full transition-all ${
                                isCompleted
                                  ? isCurrent
                                    ? 'bg-secondary ring-2 ring-secondary/30'
                                    : 'bg-secondary'
                                  : 'bg-surface-container-high'
                              }`}
                            />
                            <span
                              className={`text-[7.5px] text-center leading-tight truncate w-full ${
                                isCurrent
                                  ? 'font-bold text-secondary'
                                  : isCompleted
                                  ? 'font-semibold text-primary'
                                  : 'text-outline'
                              }`}
                            >
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Artisan Order Management Controls */}
                  {activeRoleView === 'artisan' && (
                    <div className="pt-1 space-y-2">
                      {ord.status === 'Order Placed' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptOrder(ord.id)}
                            className="flex-1 py-2.5 rounded-full bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all hover:bg-secondary-container"
                          >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>Accept Order</span>
                          </button>

                          <button
                            onClick={() => handleRejectOrder(ord.id)}
                            className="px-4 py-2.5 rounded-full bg-surface-container text-outline hover:text-red-600 font-bold text-xs"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {ord.status !== 'Order Placed' && ord.status !== 'Delivered' && ord.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleAdvanceStatus(ord.id)}
                          className="w-full py-2.5 rounded-full bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-secondary hover:text-on-secondary transition-all active:scale-95 border border-outline-variant/30"
                        >
                          <span className="material-symbols-outlined text-[16px]">fast_forward</span>
                          <span>Advance Production Status → {ORDER_STAGES[stepNum]?.label || 'Next Stage'}</span>
                        </button>
                      )}

                      {ord.status === 'Delivered' && (
                        <div className="w-full py-2 rounded-xl bg-secondary/10 text-secondary text-center text-xs font-bold flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">done_all</span>
                          <span>Order Delivered • Direct Royalty Remitted (₹{ord.artisanRoyalty})</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Buyer View Controls: Live Tracking Button */}
                  {activeRoleView === 'buyer' && (
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => setTrackingOrder(ord)}
                        className="flex-1 py-2.5 rounded-full bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-secondary-container"
                      >
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                        <span>Track Live Order Journey</span>
                      </button>

                      <button
                        onClick={() => onShowToast(`Tracking details sent to ${ord.deliveryAddress.phone} via WhatsApp.`)}
                        className="px-3.5 py-2.5 rounded-full bg-surface-container text-primary font-bold text-xs flex items-center gap-1 hover:bg-surface-container-high transition-colors"
                        title="Share on WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[16px]">share</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ======================= TAB 2: INQUIRIES ======================= */}
      {mainTab === 'inquiries' && (
        <div className="space-y-4">
          {/* Inquiry Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
            {['all', 'New Inquiry', 'Under Artisan Review', 'Quotation Provided', 'Accepted & In Production', 'Declined'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setInquiryFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    inquiryFilter === st
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {st === 'all' ? 'All Inquiries' : st}
                </button>
              )
            )}
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">contact_support</span>
              <h4 className="font-bold text-sm text-primary">No inquiries in this filter</h4>
              <p className="text-xs text-on-surface-variant">
                Buyers can send custom inquiries directly from any Product Detail page.
              </p>
            </div>
          ) : (
            filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm space-y-3.5 transition-all hover:border-secondary/40"
              >
                {/* Top header */}
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-secondary uppercase">
                      {inq.inquiryNumber}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {new Date(inq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inq.status === 'Accepted & In Production'
                        ? 'bg-green-100 text-green-800'
                        : inq.status === 'Quotation Provided'
                        ? 'bg-blue-100 text-blue-800'
                        : inq.status === 'Declined'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-secondary-fixed text-on-secondary-fixed'
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>

                {/* Product preview */}
                <div className="flex items-start gap-3">
                  <img
                    src={inq.productImage}
                    alt={inq.productTitle}
                    className="w-14 h-14 rounded-2xl object-cover bg-surface-container flex-shrink-0 border border-outline-variant/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-primary truncate leading-tight">
                      {inq.productTitle}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      {activeRoleView === 'artisan'
                        ? `Buyer: ${inq.buyerName} (${inq.buyerPhone})`
                        : `Artisan: ${inq.artisanName}`}
                    </p>
                    <p className="text-[11px] font-bold text-secondary mt-0.5">
                      Quantity Requested: {inq.quantity} {inq.neededByDate && `• Needed by: ${inq.neededByDate}`}
                    </p>
                  </div>
                </div>

                {/* Customization Details Box */}
                <div className="p-3.5 bg-surface-container-low rounded-2xl space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline tracking-wider block">
                      Customization Requirements:
                    </span>
                    <p className="text-primary font-medium mt-0.5 leading-relaxed">
                      {inq.customizationRequirements}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/20">
                    <span className="text-[10px] uppercase font-bold text-outline tracking-wider block">
                      Buyer Message:
                    </span>
                    <p className="text-on-surface-variant mt-0.5 italic">
                      &ldquo;{inq.message}&rdquo;
                    </p>
                  </div>

                  {inq.estimatedQuote && (
                    <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-center text-xs">
                      <span className="font-bold text-secondary">Artisan Quotation:</span>
                      <span className="font-bold text-base text-primary font-display">
                        ₹{inq.estimatedQuote.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {inq.artisanNotes && (
                    <div className="p-2 bg-secondary/10 rounded-xl text-[11px] text-secondary flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[15px] mt-0.5">verified</span>
                      <span><strong>Artisan note:</strong> {inq.artisanNotes}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons for Artisan */}
                {activeRoleView === 'artisan' && (
                  <div className="pt-1 flex gap-2">
                    {inq.status === 'New Inquiry' || inq.status === 'Under Artisan Review' ? (
                      <>
                        <button
                          onClick={() => handleOpenQuoteModal(inq)}
                          className="flex-1 py-2.5 rounded-full bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-secondary-container"
                        >
                          <span className="material-symbols-outlined text-[16px]">price_change</span>
                          <span>Provide Quote & Schedule</span>
                        </button>

                        <button
                          onClick={() => handleDeclineInquiry(inq.id)}
                          className="px-4 py-2.5 rounded-full bg-surface-container text-outline hover:text-red-600 font-bold text-xs"
                        >
                          Decline
                        </button>
                      </>
                    ) : inq.status === 'Quotation Provided' ? (
                      <button
                        onClick={() => handleAcceptInquiry(inq.id)}
                        className="w-full py-2.5 rounded-full bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-secondary hover:text-on-secondary transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">build</span>
                        <span>Lock Quote & Begin Crafting</span>
                      </button>
                    ) : (
                      <div className="w-full py-2 rounded-xl bg-surface-container-high text-secondary text-center text-xs font-bold">
                        Status: {inq.status}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons for Buyer */}
                {activeRoleView === 'buyer' && (
                  <div className="pt-1 flex gap-2">
                    {inq.status === 'Quotation Provided' ? (
                      <button
                        onClick={() => {
                          orderService.updateInquiryStatus(inq.id, 'Accepted & In Production');
                          onShowToast('Quotation accepted! Artisan has reserved raw materials for your piece.');
                        }}
                        className="flex-1 py-2.5 rounded-full bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 hover:bg-secondary-container"
                      >
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Accept Quote of ₹{inq.estimatedQuote?.toLocaleString('en-IN')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onShowToast(`Direct messaging channel open with ${inq.artisanName}.`)}
                        className="flex-1 py-2 rounded-xl bg-surface-container text-primary font-bold text-xs flex items-center justify-center gap-1 hover:bg-surface-container-high"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>Chat with {inq.artisanName}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Quote Dialog Modal for Artisans */}
      {quotingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/65 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-surface rounded-3xl p-5 shadow-2xl border border-outline-variant/30 space-y-4 animate-scaleUp text-xs">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-bold text-base text-primary">Provide Custom Quote</h3>
              <button
                onClick={() => setQuotingInquiry(null)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-3">
              <div>
                <label className="font-bold text-primary block mb-1">
                  Quotation Amount (₹) for {quotingInquiry.quantity} unit(s) *
                </label>
                <input
                  required
                  type="number"
                  min={100}
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-primary block mb-1">
                  Production Schedule & Craft Note
                </label>
                <textarea
                  rows={3}
                  value={artisanNote}
                  onChange={(e) => setArtisanNote(e.target.value)}
                  placeholder="e.g. Can be fired in our wood-kiln next Thursday. Special unglazed base included."
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuotingInquiry(null)}
                  className="flex-1 py-2.5 rounded-full bg-surface-container text-primary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-secondary text-on-secondary font-bold shadow-md hover:bg-secondary-container"
                >
                  Send Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={Boolean(trackingOrder)}
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
        onShowToast={onShowToast}
        language={language}
      />
    </div>
  );
};
