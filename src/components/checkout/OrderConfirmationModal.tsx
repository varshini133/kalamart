import React from 'react';
import { BuyerOrder, Language } from '../../types';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  order: BuyerOrder | null;
  onClose: () => void;
  onTrackOrder: (order: BuyerOrder) => void;
  language?: Language;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  order,
  onClose,
  onTrackOrder,
  language = 'en'
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[92vh] overflow-hidden animate-scaleUp">
        {/* Celebration Header */}
        <div className="p-6 bg-gradient-to-b from-secondary/15 to-surface-container-low text-center space-y-3 border-b border-outline-variant/20">
          <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary flex items-center justify-center mx-auto shadow-lg ring-8 ring-secondary/20 animate-bounce">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold inline-block mb-1">
              Status: Order Placed
            </span>
            <h2 className="font-display font-bold text-xl text-primary">
              Order Confirmed!
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Thank you for supporting indigenous Indian artisans.
            </p>
          </div>
        </div>

        {/* Details Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar text-xs">
          {/* Order Reference Card */}
          <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/25 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Order Reference:</span>
              <span className="font-mono font-bold text-secondary text-sm">{order.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Estimated Delivery:</span>
              <span className="font-bold text-primary">{order.estimatedDelivery}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Courier Dispatch Partner:</span>
              <span className="font-semibold text-primary">{order.courierPartner || 'Blue Dart Climate-Neutral'}</span>
            </div>
          </div>

          {/* Purchased Items Preview */}
          <div className="space-y-2">
            <span className="font-bold text-[11px] text-on-surface-variant uppercase tracking-wider">
              Items Ordered ({order.items.length})
            </span>
            <div className="space-y-2">
              {order.items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex items-center gap-3"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover bg-surface-container flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-primary truncate">{product.title}</h4>
                    <p className="text-[11px] text-on-surface-variant">
                      Qty: {quantity} • By {product.artisanName}
                    </p>
                  </div>
                  <span className="font-bold text-secondary text-xs">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Remittance Card */}
          <div className="p-3.5 bg-secondary/10 rounded-2xl border border-secondary/20 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-secondary">
              <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
              <span>Direct 87% Remittance Verified</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              <strong>₹{order.artisanRoyalty.toLocaleString('en-IN')}</strong> is allocated directly to {order.artisanName}&apos;s verified bank account upon dispatch.
            </p>
          </div>

          {/* Payment & Address Summary */}
          <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/25 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Payment Mode:</span>
              <span className="font-semibold text-primary">
                {order.payment.methodLabel} {order.payment.isSimulated && <span className="text-[10px] text-secondary font-bold">(Sandbox Demo)</span>}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Transaction ID:</span>
              <span className="font-mono text-[11px] text-outline">{order.payment.transactionId}</span>
            </div>
            <div className="pt-2 border-t border-outline-variant/20">
              <span className="text-on-surface-variant block mb-1">Delivering to:</span>
              <p className="font-bold text-primary">{order.deliveryAddress.fullName}</p>
              <p className="text-on-surface-variant text-[11px]">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </p>
              <p className="text-on-surface-variant text-[11px] mt-0.5">
                Phone: {order.deliveryAddress.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/20 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onTrackOrder(order)}
            className="flex-1 py-3 rounded-full bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all hover:bg-secondary-container"
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span>Track Live Order</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-full bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors text-center"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
