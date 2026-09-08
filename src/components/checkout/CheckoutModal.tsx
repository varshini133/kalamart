import React, { useState } from 'react';
import { CartItem, Language, User, OrderAddress, OrderPaymentInfo, BuyerOrder } from '../../types';
import { paymentService, PaymentMethodType } from '../../services/paymentService';
import { orderService } from '../../services/orderService';
import { getTranslations } from '../../services/localizationService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user?: User | null;
  language?: Language;
  onOrderSuccess: (order: BuyerOrder) => void;
  onShowToast: (msg: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  user,
  language = 'en',
  onOrderSuccess,
  onShowToast
}) => {
  const t = getTranslations(language);

  // Contact State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Address State
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState(user?.location?.split(',')[0] || 'New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110001');
  const [customNotes, setCustomNotes] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiId, setUpiId] = useState('artisanpatron@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('889');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Payment Architecture Mode: Demo Sandbox vs Real Production
  const [paymentMode, setPaymentMode] = useState<'demo_simulation' | 'production_gateway'>('demo_simulation');
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Processing UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStepText, setProcessingStepText] = useState('');

  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const artisanRoyalty = Math.round(totalAmount * 0.87);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
      onShowToast('Please fill in required contact and delivery address fields.');
      return;
    }

    setIsProcessing(true);
    setProcessingStepText('Verifying GI inventory with artisan guild...');

    // Step 1: Prepare Address
    const deliveryAddress: OrderAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || `${phone.replace(/\D/g, '')}@kalamart.user`,
      street: street.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim()
    };

    // Step 2: Payment Gateway Invocation (Modular Architecture)
    setTimeout(() => {
      setProcessingStepText(
        paymentMode === 'demo_simulation'
          ? 'Contacting Sandbox Simulator & Authorizing mock bank token...'
          : 'Connecting to Production Merchant Gateway...'
      );
    }, 400);

    paymentService.setSimulateFailure(simulateFailure);

    try {
      const paymentResponse = await paymentService.processPayment(
        {
          orderId: `temp-${Date.now()}`,
          orderNumber: `#KM-${Math.floor(10000 + Math.random() * 90000)}`,
          amount: totalAmount,
          currency: 'INR',
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          method: {
            type: paymentMethod,
            upiId: paymentMethod === 'upi' ? upiId : undefined,
            cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
            bankName: paymentMethod === 'netbanking' ? selectedBank : undefined
          },
          notes: customNotes
        },
        paymentMode
      );

      if (!paymentResponse.success) {
        setIsProcessing(false);
        onShowToast(paymentResponse.message || 'Payment was declined. Please try again.');
        return;
      }

      setProcessingStepText('Allocating direct 87% artisan royalty & generating tracking ID...');

      const paymentInfo: OrderPaymentInfo = {
        method: paymentMethod,
        methodLabel:
          paymentMethod === 'upi'
            ? `UPI (${upiId || 'Direct VPA'})`
            : paymentMethod === 'card'
            ? 'Credit/Debit Card'
            : paymentMethod === 'netbanking'
            ? `Net Banking (${selectedBank})`
            : 'Cash on Delivery (GI Verified)',
        transactionId: paymentResponse.transactionId,
        isSimulated: paymentMode === 'demo_simulation',
        status: paymentMethod === 'cod' ? 'cod_verified' : 'completed',
        paidAt: paymentResponse.timestamp,
        gatewayProvider: paymentResponse.gatewayName
      };

      // Step 3: Create durable order via orderService
      const createdOrder = orderService.createOrder({
        items,
        deliveryAddress,
        payment: paymentInfo,
        customNotes: customNotes.trim()
      });

      setTimeout(() => {
        setIsProcessing(false);
        onOrderSuccess(createdOrder);
      }, 500);
    } catch (err: any) {
      setIsProcessing(false);
      onShowToast('Payment processing error. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/65 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl bg-surface rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-high/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">local_mall</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-primary leading-tight">
                Secure GI Checkout
              </h2>
              <p className="text-[11px] text-on-surface-variant">
                Direct artisan remittance & climate-neutral packaging
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-highest transition-colors active:scale-95 disabled:opacity-50"
            aria-label="Close checkout"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar text-xs">
          {/* Order Summary Strip */}
          <div className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/25 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3 overflow-hidden">
                {items.slice(0, 3).map(({ product }, i) => (
                  <img
                    key={i}
                    src={product.images[0]}
                    alt={product.title}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-surface flex-shrink-0"
                  />
                ))}
              </div>
              <div>
                <p className="font-bold text-primary text-xs">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in order
                </p>
                <p className="text-[10px] text-secondary font-semibold">
                  87% (₹{artisanRoyalty.toLocaleString('en-IN')}) directly to artisan
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-outline">Total Payable</span>
              <p className="font-display font-bold text-base text-primary">
                ₹{totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Section 1: Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
              <span className="material-symbols-outlined text-secondary text-[18px]">contact_mail</span>
              <span>1. Contact Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikramaditya Sen"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                  Phone / WhatsApp (for delivery updates) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                  Email Address (for invoice & GI certificate)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
              <span className="material-symbols-outlined text-secondary text-[18px]">home_pin</span>
              <span>2. Delivery Address</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                  Flat, House No., Building, Street <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 14 Palm Avenue, 3rd Floor"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near City Park"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560001"
                    maxLength={6}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                  Delivery & Packaging Notes (Optional)
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Fragile ceramic, gift packaging, deliver before weekend"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Modular Payment Architecture (Demo Simulation vs Production Gateway) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                <span className="material-symbols-outlined text-secondary text-[18px]">account_balance_wallet</span>
                <span>3. Payment Architecture</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-bold">
                Modular Architecture
              </span>
            </div>

            {/* Architecture Mode Selector: Clearly distinguishing Demo Simulation from Real Production */}
            <div className="p-3 bg-surface-container-lowest rounded-2xl border border-secondary/30 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-primary">Execution Environment:</span>
                <div className="flex rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container p-0.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('demo_simulation')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                      paymentMode === 'demo_simulation'
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'text-on-surface hover:text-primary'
                    }`}
                  >
                    Demo Simulation (Hackathon)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('production_gateway')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                      paymentMode === 'production_gateway'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface hover:text-primary'
                    }`}
                  >
                    Real Production Gateway
                  </button>
                </div>
              </div>

              {paymentMode === 'demo_simulation' ? (
                <div className="p-2.5 bg-secondary/10 rounded-xl text-[11px] space-y-1.5 border border-secondary/20">
                  <div className="flex items-center gap-1.5 font-bold text-secondary">
                    <span className="material-symbols-outlined text-[16px]">science</span>
                    <span>Demo Payment Simulation Mode (Active)</span>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">
                    Emulates real-world bank authorization, 3DS tokenization, and direct 87% artisan royalty allocation without charging real funds.
                  </p>
                  <div className="flex items-center gap-2 pt-1 border-t border-secondary/20">
                    <label className="flex items-center gap-1.5 text-[10px] text-outline cursor-pointer">
                      <input
                        type="checkbox"
                        checked={simulateFailure}
                        onChange={(e) => setSimulateFailure(e.target.checked)}
                        className="rounded border-outline-variant accent-secondary"
                      />
                      <span>Test Edge-Case: Simulate Bank Decline</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-surface-container-high rounded-xl text-[11px] space-y-1 border border-outline-variant/30">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Real Production Gateway Interface (Razorpay / Stripe)</span>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">
                    Designed for production deployment with secure server-side webhook endpoints. In this local hackathon preview, select <strong>Demo Simulation</strong> to test end-to-end order placement.
                  </p>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-on-surface-variant">
                Select Payment Rail:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: 'qr_code_2', sub: 'Instant Zero Fee' },
                  { id: 'card', label: 'Cards', icon: 'credit_card', sub: 'Visa, MC, RuPay' },
                  { id: 'netbanking', label: 'Net Banking', icon: 'account_balance', sub: '50+ Banks' },
                  { id: 'cod', label: 'Cash on Delivery', icon: 'payments', sub: 'GI Seal Check' }
                ].map((meth) => (
                  <button
                    key={meth.id}
                    type="button"
                    onClick={() => setPaymentMethod(meth.id as PaymentMethodType)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === meth.id
                        ? 'border-secondary bg-surface-container-high shadow-xs ring-1 ring-secondary'
                        : 'border-outline-variant/30 bg-surface-container hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-secondary text-[20px] mb-1">
                      {meth.icon}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-primary">{meth.label}</p>
                      <p className="text-[9px] text-outline">{meth.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Method Specific Fields */}
              {paymentMethod === 'upi' && (
                <div className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 space-y-2">
                  <label className="block font-bold text-[11px] text-primary">
                    Enter UPI ID / VPA
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. user@okhdfcbank"
                      className="flex-1 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none font-mono"
                    />
                    <div className="px-3 py-2 rounded-xl bg-secondary/10 text-secondary text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified_user</span>
                      <span>Verified VPA</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 space-y-2">
                  <div>
                    <label className="block font-bold text-[11px] text-primary mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[11px] text-primary mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[11px] text-primary mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 space-y-2">
                  <label className="block font-bold text-[11px] text-primary">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs focus:border-secondary focus:outline-none"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20 text-[11px] space-y-1">
                  <p className="font-bold text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>GI Certified Physical Verification on Delivery</span>
                  </p>
                  <p className="text-on-surface-variant">
                    Pay upon arrival via Cash or QR. You can verify the authentic Geographical Indication seal before handover.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="pt-3 border-t border-outline-variant/20 space-y-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full h-12 bg-secondary text-on-secondary rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-75 hover:bg-secondary-container"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  <span>{processingStepText || 'Authorizing payment...'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Place Order</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-outline">
              🔒 256-bit Encrypted • Direct Artisan Escrow • Instant Invoice
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
