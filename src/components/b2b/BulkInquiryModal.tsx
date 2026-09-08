import React, { useState, useEffect } from 'react';
import { Product, Language, User } from '../../types';
import { b2bService } from '../../services/b2bService';

interface BulkInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  productsList?: Product[];
  onShowToast: (msg: string) => void;
  language?: Language;
  user?: User | null;
  onInquirySubmitted?: () => void;
}

const DELIVERY_REGIONS = [
  'North India (Delhi NCR, Punjab, UP)',
  'West India (Mumbai, Pune, Gujarat, Rajasthan)',
  'South India (Bengaluru, Chennai, Hyderabad, Kerala)',
  'East India (Kolkata, Odisha, Assam)',
  'International: North America (USA & Canada)',
  'International: Europe (UK, Germany, France)',
  'International: Middle East (UAE, Saudi Arabia)',
  'International: Asia Pacific (Singapore, Australia, Japan)'
];

const CUSTOMIZATION_PRESETS = [
  'Custom Artisan Logo / Crest Stamping',
  'Eco-friendly Corrugated Kraft Gift Boxes',
  'Hotel Room Suite Packaging & Tagging',
  'Food-Safe Certified Lab Testing Documentation',
  'GI Provenance Certificate Card Insert',
  'Custom Dimensions & Volume Sizing'
];

export const BulkInquiryModal: React.FC<BulkInquiryModalProps> = ({
  isOpen,
  onClose,
  product,
  productsList = [],
  onShowToast,
  language = 'en',
  user,
  onInquirySubmitted
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(product || productsList[0] || null);
  const [quantity, setQuantity] = useState<number>(product?.moq || 20);
  const [deliveryRegion, setDeliveryRegion] = useState<string>(DELIVERY_REGIONS[0]);
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [customizationRequirements, setCustomizationRequirements] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  // Buyer contact details
  const [buyerName, setBuyerName] = useState<string>(user?.name || '');
  const [buyerCompany, setBuyerCompany] = useState<string>(user?.guildName || 'Taj Hospitality & Resorts');
  const [buyerEmail, setBuyerEmail] = useState<string>(user?.email || 'procurement@tajhotels-mock.com');
  const [buyerPhone, setBuyerPhone] = useState<string>(user?.phone ? `+91 ${user.phone}` : '+91 98200 88412');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
      setQuantity(product.moq || 20);
    } else if (productsList.length > 0 && !selectedProduct) {
      setSelectedProduct(productsList[0]);
      setQuantity(productsList[0].moq || 20);
    }
  }, [product, productsList]);

  if (!isOpen) return null;

  const currentMoq = selectedProduct?.moq || 10;
  const currentBulkPrice = selectedProduct?.bulkPrice || Math.round((selectedProduct?.price || 1000) * 0.75);
  const currentRetailPrice = selectedProduct?.price || 1200;
  const estimatedTotal = quantity * currentBulkPrice;
  const approxLeadTime = selectedProduct?.approxLeadTime || '14–21 days';
  const productionCapacity = selectedProduct?.productionCapacity || '100 units / month';

  const handlePresetToggle = (preset: string) => {
    if (customizationRequirements.includes(preset)) {
      setCustomizationRequirements(
        customizationRequirements
          .split(', ')
          .filter((p) => p !== preset)
          .join(', ')
      );
    } else {
      setCustomizationRequirements(
        customizationRequirements ? `${customizationRequirements}, ${preset}` : preset
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (quantity < currentMoq) {
      onShowToast(
        language === 'ta'
          ? `குறைந்தபட்ச அளவு ${currentMoq} அலகுகள்.`
          : language === 'hi'
          ? `न्यूनतम ऑर्डर मात्रा ${currentMoq} इकाइयां है।`
          : `Minimum order quantity is ${currentMoq} units.`
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdInquiry = b2bService.createInquiry({
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        productImage: selectedProduct.images[0],
        artisanName: selectedProduct.artisanName,
        artisanId: selectedProduct.id,
        buyerName: buyerName || 'Authorized Procurement Lead',
        buyerCompany: buyerCompany || 'Institutional Buyer',
        buyerEmail: buyerEmail || 'buyer@procurement.org',
        buyerPhone: buyerPhone || '+91 98765 43210',
        requiredQuantity: quantity,
        deliveryRegion,
        requiredDeliveryDate,
        customizationRequirements: customizationRequirements || 'Standard bulk packaging with GI documentation.',
        message: message || 'Please provide quotation with shipping timelines and volume discounts.',
        unitPriceEstimate: currentBulkPrice
      });

      setIsSubmitting(false);
      onShowToast(
        language === 'ta'
          ? `மொத்த விலைப்புள்ளி கோரிக்கை ${selectedProduct.artisanName} க்கு அனுப்பப்பட்டது!`
          : language === 'hi'
          ? `थोक कोटेशन अनुरोध ${selectedProduct.artisanName} को भेजा गया!`
          : `Wholesale quote request (${createdInquiry.rfqNumber}) sent to ${selectedProduct.artisanName}!`
      );
      if (onInquirySubmitted) onInquirySubmitted();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                  B2B Wholesale RFQ
                </span>
                <span className="text-[11px] text-outline font-mono">Direct Sourcing</span>
              </div>
              <h2 className="text-base font-bold font-serif text-primary">
                Request a Bulk Quotation
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Selected Product Summary Box */}
          <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/25 flex items-center gap-3">
            {selectedProduct && (
              <>
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-outline-variant/20 bg-surface-container"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-primary truncate text-xs sm:text-sm">
                      {selectedProduct.title}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                      Bulk Available
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    Master Artisan: <span className="font-semibold text-primary">{selectedProduct.artisanName}</span> ({selectedProduct.craftOrigin})
                  </p>
                  <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs font-bold text-secondary">
                      ₹{currentBulkPrice.toLocaleString('en-IN')} / unit bulk
                    </span>
                    <span className="text-[10px] text-outline line-through">
                      ₹{currentRetailPrice.toLocaleString('en-IN')} retail
                    </span>
                    <span className="text-[10px] text-primary font-medium">
                      MOQ: <strong className="font-bold">{currentMoq} units</strong>
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Product selector if not locked */}
          {productsList.length > 1 && !product && (
            <div>
              <label className="block text-[11px] font-bold text-primary mb-1">
                Select Craft Product
              </label>
              <select
                value={selectedProduct?.id}
                onChange={(e) => {
                  const p = productsList.find((item) => item.id === e.target.value);
                  if (p) {
                    setSelectedProduct(p);
                    setQuantity(p.moq || 20);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-secondary"
              >
                {productsList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (Artisan: {p.artisanName}) — MOQ {p.moq || 10}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Capacity and Lead Time Indicators */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/20">
              <span className="text-outline text-[10px] block">Production Capacity</span>
              <span className="font-bold text-primary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-secondary">factory</span>
                {productionCapacity}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/20">
              <span className="text-outline text-[10px] block">Approximate Lead Time</span>
              <span className="font-bold text-primary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                {approxLeadTime}
              </span>
            </div>
          </div>

          {/* Quantity and Delivery Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-primary">
                  Required Quantity *
                </label>
                <span className="text-[10px] text-outline">MOQ: {currentMoq}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(currentMoq, quantity - 5))}
                  className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold flex items-center justify-center active:scale-95 transition-all"
                >
                  -
                </button>
                <input
                  type="number"
                  min={currentMoq}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="flex-1 px-3 py-2 text-center rounded-xl bg-surface-container border border-outline-variant/40 font-bold text-primary text-xs focus:outline-none focus:border-secondary"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 5)}
                  className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold flex items-center justify-center active:scale-95 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-primary mb-1">
                Required Delivery Date *
              </label>
              <input
                type="date"
                required
                value={requiredDeliveryDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setRequiredDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          {/* Delivery Region Selection */}
          <div>
            <label className="block text-[11px] font-bold text-primary mb-1">
              Delivery Region / Country *
            </label>
            <select
              value={deliveryRegion}
              onChange={(e) => setDeliveryRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:border-secondary"
            >
              {DELIVERY_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Customization Requirements */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-primary">
                Customization Requirements
              </label>
              <span className="text-[10px] text-outline">Optional presets below</span>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1 mb-2">
              {CUSTOMIZATION_PRESETS.map((preset) => {
                const active = customizationRequirements.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetToggle(preset)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                      active
                        ? 'bg-secondary text-on-secondary shadow-2xs font-bold'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {preset}
                  </button>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={customizationRequirements}
              onChange={(e) => setCustomizationRequirements(e.target.value)}
              placeholder="e.g. Custom laser emblem on base, corporate gift sleeves, specialized export packing..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-secondary resize-none"
            />
          </div>

          {/* Message to Artisan */}
          <div>
            <label className="block text-[11px] font-bold text-primary mb-1">
              Message to Artisan
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your organization, project purpose, or specific batch inquiries..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-secondary resize-none"
            />
          </div>

          {/* Buyer Organization Details Section */}
          <div className="pt-2 border-t border-outline-variant/20 space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Buyer / Organization Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-outline mb-0.5">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-outline mb-0.5">
                  Company / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  placeholder="e.g. FabIndia / Oberoi Hotels"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-outline mb-0.5">
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-outline mb-0.5">
                  WhatsApp / Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>

          {/* Price Projection Card */}
          <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/25 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-outline font-medium block">
                Estimated Order Value ({quantity} units)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-secondary font-serif">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-outline">
                  (~₹{currentBulkPrice}/unit + tax/shipping per quote)
                </span>
              </div>
            </div>
            <span className="text-[10px] text-secondary font-bold bg-surface-container-lowest px-2 py-1 rounded-full border border-secondary/20 shadow-2xs">
              Zero Commission
            </span>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">request_quote</span>
              <span>{isSubmitting ? 'Transmitting Request to Artisan...' : 'Request a Quote'}</span>
            </button>
            <p className="text-[10px] text-outline text-center mt-2">
              Artisan receives instant WhatsApp & dashboard notification with your specifications.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
