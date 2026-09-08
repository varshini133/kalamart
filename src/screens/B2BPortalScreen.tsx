import React, { useState, useEffect } from 'react';
import { B2BBulkInquiry, Language, Product, ScreenType, User } from '../types';
import { PRODUCTS } from '../data/mockData';
import { b2bService } from '../services/b2bService';
import { BulkInquiryModal } from '../components/b2b/BulkInquiryModal';
import { ExportCatalogModal } from '../components/b2b/ExportCatalogModal';

interface B2BPortalScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectProduct: (product: Product) => void;
  onShowToast: (msg: string) => void;
  language: Language;
  user?: User | null;
}

export const B2BPortalScreen: React.FC<B2BPortalScreenProps> = ({
  onNavigate,
  onSelectProduct,
  onShowToast,
  language,
  user
}) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'quotations' | 'bulk_orders' | 'catalog'>('inquiries');
  const [inquiries, setInquiries] = useState<B2BBulkInquiry[]>([]);
  const [viewRole, setViewRole] = useState<'artisan' | 'buyer'>(user?.role === 'artisan' ? 'artisan' : 'buyer');
  
  // Modals state
  const [isBulkInquiryModalOpen, setIsBulkInquiryModalOpen] = useState<boolean>(false);
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState<Product | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);

  // Provide Quotation Modal state
  const [quotingInquiry, setQuotingInquiry] = useState<B2BBulkInquiry | null>(null);
  const [quotedPrice, setQuotedPrice] = useState<number>(0);
  const [quotedLeadDays, setQuotedLeadDays] = useState<number>(15);
  const [quotedNotes, setQuotedNotes] = useState<string>('');
  const [quotedShipping, setQuotedShipping] = useState<number>(3500);

  // Subscribe to b2bService updates
  useEffect(() => {
    const unsub = b2bService.subscribeInquiries((updated) => {
      setInquiries(updated);
    });
    return unsub;
  }, []);

  // Filter inquiry counts
  const activeInquiries = inquiries.filter((i) => i.status === 'active_inquiry');
  const activeQuotations = inquiries.filter((i) => i.status === 'quotation_provided');
  const bulkOrders = inquiries.filter((i) => i.status === 'bulk_order_confirmed');

  // Quoting handler
  const handleOpenQuotation = (inquiry: B2BBulkInquiry) => {
    setQuotingInquiry(inquiry);
    setQuotedPrice(inquiry.unitPriceEstimate || 1200);
    setQuotedLeadDays(15);
    setQuotedNotes('Includes master artisan hand-crafting, GI wax seal, and export-ready protective packaging.');
    setQuotedShipping(3500);
  };

  const handleSendQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotingInquiry) return;

    const total = quotedPrice * quotingInquiry.requiredQuantity;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 20);

    b2bService.provideQuotation(quotingInquiry.id, {
      quotedUnitPrice: quotedPrice,
      totalAmount: total,
      productionLeadDays: quotedLeadDays,
      validUntil: validUntil.toISOString().split('T')[0],
      artisanNotes: quotedNotes,
      shippingEstimate: quotedShipping
    });

    onShowToast(`Official quotation sent to ${quotingInquiry.buyerCompany}!`);
    setQuotingInquiry(null);
    setActiveTab('quotations');
  };

  const handleAcceptQuote = (inquiryId: string) => {
    b2bService.acceptQuoteAndCreateBulkOrder(inquiryId);
    onShowToast('Quote accepted! 50% milestone authorized. Bulk order created.');
    setActiveTab('bulk_orders');
  };

  const handleAdvanceBatchStatus = (inquiry: B2BBulkInquiry) => {
    if (!inquiry.bulkOrderDetails) return;
    const currentStatus = inquiry.bulkOrderDetails.batchStatus;
    let nextStatus: 'In Batch Production' | 'Quality Inspection' | 'Export Crating' | 'Dispatched' = 'Quality Inspection';

    if (currentStatus === 'In Batch Production') nextStatus = 'Quality Inspection';
    else if (currentStatus === 'Quality Inspection') nextStatus = 'Export Crating';
    else if (currentStatus === 'Export Crating') nextStatus = 'Dispatched';
    else nextStatus = 'Dispatched';

    b2bService.updateBulkOrderStatus(inquiry.id, nextStatus);
    onShowToast(`Batch production updated to: ${nextStatus}`);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 space-y-6 animate-fadeIn pb-28">
      {/* Top B2B Header Card */}
      <section className="p-5 sm:p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[17px]">corporate_fare</span>
            <span>B2B Wholesale & Institutional Sourcing Hub</span>
          </div>

          {/* Perspective Toggle: Artisan Guild vs Institutional Buyer */}
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-2xl text-xs font-semibold">
            <span className="text-[10px] text-outline px-1.5 hidden sm:inline">Viewing as:</span>
            <button
              onClick={() => setViewRole('buyer')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                viewRole === 'buyer'
                  ? 'bg-primary text-on-primary font-bold shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Wholesale Buyer
            </button>
            <button
              onClick={() => setViewRole('artisan')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                viewRole === 'artisan'
                  ? 'bg-primary text-on-primary font-bold shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Artisan Guild
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary">
            Direct Artisan Sourcing & Bulk Trade
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-2xl mt-1">
            Connecting master craft communities with wholesalers, luxury hotels, corporate gift programs, and international institutional buyers. Zero broker commissions with verified GI provenance.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          <button
            onClick={() => setIsCatalogModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1.5 border border-outline-variant/30 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">menu_book</span>
            <span>Export-Ready Catalog Preview</span>
          </button>

          <button
            onClick={() => b2bService.exportCatalogCSV(PRODUCTS)}
            className="px-3.5 py-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1.5 border border-outline-variant/30 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">download</span>
            <span>Download Catalog (CSV)</span>
          </button>

          <button
            onClick={() => {
              setSelectedProductForInquiry(PRODUCTS[0]);
              setIsBulkInquiryModalOpen(true);
            }}
            className="px-4 py-2 rounded-2xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer ml-auto"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">add</span>
            <span>Request New Bulk Quote</span>
          </button>
        </div>

        {/* Primary Dashboard Tabs */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-outline-variant/20 overflow-x-auto">
          {/* Tab 1: Active Inquiries */}
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>Active Inquiries</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'inquiries' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface'
            }`}>
              {activeInquiries.length}
            </span>
          </button>

          {/* Tab 2: Quotations */}
          <button
            onClick={() => setActiveTab('quotations')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quotations'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">request_quote</span>
            <span>Quotations (RFQ)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'quotations' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface'
            }`}>
              {activeQuotations.length}
            </span>
          </button>

          {/* Tab 3: Bulk Orders */}
          <button
            onClick={() => setActiveTab('bulk_orders')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bulk_orders'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">inventory</span>
            <span>Bulk Orders</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'bulk_orders' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface'
            }`}>
              {bulkOrders.length}
            </span>
          </button>

          {/* Tab 4: Export-Ready Catalog */}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Export Catalog Grid</span>
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TAB 1: ACTIVE INQUIRIES */}
      {/* ============================================================ */}
      {activeTab === 'inquiries' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <span>Pending Inquiries</span>
              <span className="text-xs text-outline font-normal">({activeInquiries.length} requests awaiting quotation)</span>
            </h2>
            <span className="text-[11px] text-secondary font-bold">
              {viewRole === 'artisan' ? 'Artisan Review Queue' : 'Buyer Submitted RFQs'}
            </span>
          </div>

          {activeInquiries.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">inbox</span>
              <h3 className="text-sm font-bold text-primary">No active bulk inquiries</h3>
              <p className="text-xs text-on-surface-variant">All bulk RFQs have either been quoted or fulfilled.</p>
              <button
                onClick={() => {
                  setSelectedProductForInquiry(PRODUCTS[0]);
                  setIsBulkInquiryModalOpen(true);
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold"
              >
                Submit New RFQ
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {activeInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-xs space-y-3.5 hover:border-secondary/40 transition-all"
                >
                  {/* Top Bar: RFQ Number & Date */}
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-outline-variant/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary font-mono bg-surface-container px-2 py-0.5 rounded-lg">
                        {inq.rfqNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Awaiting Artisan Quote
                      </span>
                    </div>
                    <span className="text-[11px] text-outline">
                      Received: {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Main Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    {/* Product Preview */}
                    <div className="md:col-span-4 flex gap-3">
                      <img
                        src={inq.productImage}
                        alt={inq.productTitle}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-surface-container border border-outline-variant/20"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-outline block">Product Requested</span>
                        <h4 className="font-bold text-primary truncate text-xs">{inq.productTitle}</h4>
                        <p className="text-[11px] text-on-surface-variant truncate">Artisan: {inq.artisanName}</p>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="font-bold text-secondary text-sm">{inq.requiredQuantity} units</span>
                          <span className="text-[10px] text-outline">(~₹{inq.unitPriceEstimate}/unit)</span>
                        </div>
                      </div>
                    </div>

                    {/* Buyer Organization Information */}
                    <div className="md:col-span-4 space-y-1 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/15">
                      <span className="text-[10px] text-outline uppercase font-bold tracking-wider block">
                        Buyer Details
                      </span>
                      <div className="font-bold text-primary text-xs">{inq.buyerCompany}</div>
                      <div className="text-[11px] text-on-surface-variant">Rep: {inq.buyerName}</div>
                      <div className="text-[11px] text-outline truncate">✉ {inq.buyerEmail}</div>
                      <div className="text-[11px] text-outline">📞 {inq.buyerPhone}</div>
                    </div>

                    {/* Sourcing Specifications */}
                    <div className="md:col-span-4 space-y-1.5">
                      <div>
                        <span className="text-[10px] text-outline block">Delivery Region:</span>
                        <span className="font-semibold text-primary">{inq.deliveryRegion}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-outline block">Required By Date:</span>
                        <span className="font-semibold text-primary">{inq.requiredDeliveryDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-outline block">Estimated Bulk Value:</span>
                        <span className="font-bold text-secondary text-sm">
                          ₹{((inq.unitPriceEstimate || 1000) * inq.requiredQuantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customization Requirements & Message */}
                  <div className="p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/20 space-y-1 text-xs">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-primary">
                      <span className="material-symbols-outlined text-[15px] text-secondary">tune</span>
                      <span>Customization Requirements:</span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">
                      {inq.customizationRequirements}
                    </p>
                    {inq.message && (
                      <div className="pt-1 text-[11px] text-outline italic">
                        "{inq.message}"
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-1 flex items-center justify-between gap-2 flex-wrap border-t border-outline-variant/15">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${inq.buyerPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                        <span>Contact Buyer Directly</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          b2bService.declineInquiry(inq.id);
                          onShowToast('Inquiry declined');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-medium cursor-pointer"
                      >
                        Decline
                      </button>

                      <button
                        onClick={() => handleOpenQuotation(inq)}
                        className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-secondary">send</span>
                        <span>Provide Official Quotation</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* TAB 2: QUOTATIONS */}
      {/* ============================================================ */}
      {activeTab === 'quotations' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <span>Active Quotations</span>
              <span className="text-xs text-outline font-normal">({activeQuotations.length} quotes issued)</span>
            </h2>
            <span className="text-[11px] text-secondary font-bold">
              Formal Commercial Proforma Offers
            </span>
          </div>

          {activeQuotations.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">description</span>
              <h3 className="text-sm font-bold text-primary">No active quotations</h3>
              <p className="text-xs text-on-surface-variant">
                Quoted proposals will appear here for institutional review and purchase contract award.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {activeQuotations.map((q) => {
                const quote = q.quoteDetails!;
                return (
                  <div
                    key={q.id}
                    className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-xs space-y-4 hover:border-secondary/40 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 flex-wrap border-b border-outline-variant/15 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary font-mono bg-surface-container px-2 py-0.5 rounded-lg">
                          {q.rfqNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          <span>Quotation Provided</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-outline">
                        Valid until: <strong className="text-primary">{quote.validUntil}</strong>
                      </span>
                    </div>

                    {/* Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      <div className="md:col-span-4 flex gap-3">
                        <img
                          src={q.productImage}
                          alt={q.productTitle}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-surface-container border border-outline-variant/20"
                        />
                        <div>
                          <h4 className="font-bold text-primary text-xs">{q.productTitle}</h4>
                          <p className="text-[11px] text-on-surface-variant">Master Artisan: {q.artisanName}</p>
                          <p className="text-[11px] text-outline font-semibold">Buyer: {q.buyerCompany}</p>
                        </div>
                      </div>

                      {/* Quoted Pricing Metrics */}
                      <div className="md:col-span-8 p-3 rounded-2xl bg-secondary/10 border border-secondary/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-outline block">Quoted Unit Price</span>
                          <span className="text-base font-bold text-secondary font-serif">
                            ₹{quote.quotedUnitPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-outline block">Total Contract Value</span>
                          <span className="text-base font-bold text-primary font-serif">
                            ₹{quote.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-outline block">Production Lead Time</span>
                          <span className="text-xs font-bold text-primary mt-1 block">
                            {quote.productionLeadDays} business days
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-outline block">Shipping Estimate</span>
                          <span className="text-xs font-bold text-primary mt-1 block">
                            ₹{(quote.shippingEstimate || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Artisan Notes */}
                    {quote.artisanNotes && (
                      <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/15 text-xs text-on-surface-variant">
                        <span className="font-bold text-primary block text-[11px] mb-0.5">Guild Terms & Production Notes:</span>
                        <p className="text-[11px] italic">"{quote.artisanNotes}"</p>
                      </div>
                    )}

                    {/* Bottom Action */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-outline-variant/15 flex-wrap">
                      <div className="text-xs text-outline">
                        Payment terms: 50% milestone advance, 50% upon export crate dispatch.
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            window.print();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                          <span>Proforma PDF</span>
                        </button>

                        <button
                          onClick={() => handleAcceptQuote(q.id)}
                          className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer hover:bg-secondary-container"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Accept Quote & Place Bulk Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* TAB 3: BULK ORDERS */}
      {/* ============================================================ */}
      {activeTab === 'bulk_orders' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <span>Confirmed Bulk Orders</span>
              <span className="text-xs text-outline font-normal">({bulkOrders.length} active production runs)</span>
            </h2>
            <span className="text-[11px] text-secondary font-bold">
              Multi-Stage Batch Fulfillment
            </span>
          </div>

          {bulkOrders.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">local_shipping</span>
              <h3 className="text-sm font-bold text-primary">No confirmed bulk orders</h3>
              <p className="text-xs text-on-surface-variant">
                Accepted quotations convert directly into batch production runs here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bulkOrders.map((order) => {
                const bDetails = order.bulkOrderDetails!;
                const quote = order.quoteDetails;
                const stages: Array<'In Batch Production' | 'Quality Inspection' | 'Export Crating' | 'Dispatched'> = [
                  'In Batch Production',
                  'Quality Inspection',
                  'Export Crating',
                  'Dispatched'
                ];
                const currentStageIdx = stages.indexOf(bDetails.batchStatus);

                return (
                  <div
                    key={order.id}
                    className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-xs space-y-4 hover:border-secondary/40 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 flex-wrap border-b border-outline-variant/15 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary font-mono bg-surface-container px-2.5 py-0.5 rounded-lg">
                          {bDetails.orderId}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary">
                          {bDetails.batchStatus}
                        </span>
                      </div>
                      <span className="text-[11px] text-outline font-mono">
                        Tracking: {bDetails.trackingNumber}
                      </span>
                    </div>

                    {/* Progress Bar for Production Lifecycle */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-outline font-semibold">
                        <span>Production & Logistics Pipeline</span>
                        <span className="text-secondary font-bold">Stage {currentStageIdx + 1} of 4</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {stages.map((stg, idx) => {
                          const isDone = idx <= currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div key={stg} className="space-y-1">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isDone
                                    ? isCurrent
                                      ? 'bg-secondary animate-pulse'
                                      : 'bg-secondary'
                                    : 'bg-surface-container'
                                }`}
                              />
                              <span
                                className={`text-[10px] block leading-tight truncate ${
                                  isCurrent ? 'font-bold text-secondary' : isDone ? 'text-primary' : 'text-outline'
                                }`}
                              >
                                {stg}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Details Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/15 text-xs">
                      <div>
                        <span className="text-[10px] text-outline block">Consignee Buyer</span>
                        <span className="font-bold text-primary block">{order.buyerCompany}</span>
                        <span className="text-[11px] text-on-surface-variant block">{order.deliveryRegion}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-outline block">Batch Quantity & Artisan</span>
                        <span className="font-bold text-primary block">{order.requiredQuantity} units</span>
                        <span className="text-[11px] text-on-surface-variant block">Artisan: {order.artisanName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-outline block">Logistics Courier Partner</span>
                        <span className="font-bold text-primary block">{bDetails.courierPartner}</span>
                        <span className="text-[11px] text-emerald-700 font-bold block">
                          50% Advance Paid (₹{bDetails.advancePaid.toLocaleString('en-IN')})
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex items-center justify-between gap-2 flex-wrap border-t border-outline-variant/15">
                      <div className="text-xs text-outline">
                        Balance due upon delivery: ₹{bDetails.balanceDue.toLocaleString('en-IN')}
                      </div>

                      <div className="flex items-center gap-2">
                        {currentStageIdx < stages.length - 1 ? (
                          <button
                            onClick={() => handleAdvanceBatchStatus(order)}
                            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-secondary">fast_forward</span>
                            <span>Advance to {stages[currentStageIdx + 1]}</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">verified</span>
                            <span>Dispatched & In Transit</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* TAB 4: EXPORT-READY CATALOG (GRID VIEW) */}
      {/* ============================================================ */}
      {activeTab === 'catalog' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
                Wholesale Product Catalog ({PRODUCTS.length} Items)
              </h2>
              <p className="text-xs text-on-surface-variant">
                Showing bulk availability, minimum order quantities (MOQ), production capacity & approximate lead times.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCatalogModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">fullscreen</span>
                <span>Full Screen Lookbook</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRODUCTS.map((prod) => {
              const moq = prod.moq || 10;
              const wholesalePrice = prod.bulkPrice || Math.round(prod.price * 0.75);
              const capacity = prod.productionCapacity || '100 units / month';
              const leadTime = prod.approxLeadTime || '14–21 days';
              const savings = Math.round(((prod.price - wholesalePrice) / prod.price) * 100);

              return (
                <div
                  key={prod.id}
                  className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-4 shadow-xs flex flex-col justify-between hover:border-secondary transition-all"
                >
                  <div className="flex gap-3.5">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-24 h-24 rounded-2xl object-cover shrink-0 bg-surface-container"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          ✓ Bulk Order Available
                        </span>
                        {prod.giCertified && (
                          <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[10px] font-bold">
                            GI Certified
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-primary mt-1 truncate">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant truncate">
                        {prod.artisanName} · {prod.craftOrigin}
                      </p>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-base font-bold text-secondary font-serif">
                          ₹{wholesalePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-outline line-through">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          -{savings}% Tier
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Sourcing Metrics Matrix */}
                  <div className="mt-3 grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-surface-container-low text-center text-xs">
                    <div>
                      <span className="text-[10px] text-outline block">MOQ</span>
                      <span className="font-bold text-primary">{moq} units</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-outline block">Capacity</span>
                      <span className="font-bold text-primary truncate block">{capacity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-outline block">Lead Time</span>
                      <span className="font-bold text-primary truncate block">{leadTime}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onSelectProduct(prod);
                        onNavigate('product-detail');
                      }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View Specs
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProductForInquiry(prod);
                        setIsBulkInquiryModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-secondary">request_quote</span>
                      <span>Request a Quote</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* MODAL: PROVIDE OFFICIAL QUOTATION (ARTISAN ACTION) */}
      {/* ============================================================ */}
      {quotingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Artisan Quotation Proposal
                </span>
                <h3 className="text-base font-bold font-serif text-primary">
                  Quote for {quotingInquiry.buyerCompany}
                </h3>
              </div>
              <button
                onClick={() => setQuotingInquiry(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSendQuotation} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Product and Qty Reference */}
              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
                <img
                  src={quotingInquiry.productImage}
                  alt={quotingInquiry.productTitle}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-primary truncate">{quotingInquiry.productTitle}</h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Quantity: <strong className="text-secondary">{quotingInquiry.requiredQuantity} units</strong> · Destination: {quotingInquiry.deliveryRegion}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-primary mb-1">
                    Quoted Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs font-bold text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-primary mb-1">
                    Production Lead Days *
                  </label>
                  <input
                    type="number"
                    required
                    value={quotedLeadDays}
                    onChange={(e) => setQuotedLeadDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-primary mb-1">
                  Estimated Regional / Export Shipping (₹)
                </label>
                <input
                  type="number"
                  value={quotedShipping}
                  onChange={(e) => setQuotedShipping(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-primary mb-1">
                  Production Notes & Quality Guarantees
                </label>
                <textarea
                  rows={3}
                  value={quotedNotes}
                  onChange={(e) => setQuotedNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface resize-none"
                />
              </div>

              {/* Total Calculation */}
              <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-outline block">Total Contract Quote</span>
                  <span className="text-base font-bold text-secondary font-serif">
                    ₹{(quotedPrice * quotingInquiry.requiredQuantity + quotedShipping).toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-primary">
                  Valid for 20 days
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">send</span>
                <span>Issue & Send Official Quotation</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Inquiry Request Modal */}
      <BulkInquiryModal
        isOpen={isBulkInquiryModalOpen}
        onClose={() => setIsBulkInquiryModalOpen(false)}
        product={selectedProductForInquiry}
        productsList={PRODUCTS}
        onShowToast={onShowToast}
        language={language}
        user={user}
        onInquirySubmitted={() => setActiveTab('inquiries')}
      />

      {/* Export-Ready Catalog Full Screen Modal */}
      <ExportCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        products={PRODUCTS}
        onShowToast={onShowToast}
        language={language}
      />
    </div>
  );
};
