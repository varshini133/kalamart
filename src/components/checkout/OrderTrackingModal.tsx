import React, { useEffect, useState } from 'react';
import { BuyerOrder, OrderStatus, Language } from '../../types';
import { orderService } from '../../services/orderService';

interface OrderTrackingModalProps {
  isOpen: boolean;
  order: BuyerOrder | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

const TRACKING_STEPS: {
  status: OrderStatus;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    status: 'Order Placed',
    label: 'Order Placed',
    desc: 'Order received & payment authorized in escrow',
    icon: 'receipt_long'
  },
  {
    status: 'Confirmed',
    label: 'Confirmed',
    desc: 'Artisan acknowledged & scheduled production schedule',
    icon: 'task_alt'
  },
  {
    status: 'Processing',
    label: 'Processing',
    desc: 'Handcrafting & applying authentic GI seal badge',
    icon: 'palette'
  },
  {
    status: 'Ready for Pickup',
    label: 'Ready for Pickup',
    desc: 'Packaged in biodegradable eco-crate at rural hub',
    icon: 'inventory_2'
  },
  {
    status: 'Shipped',
    label: 'Shipped',
    desc: 'Dispatched via climate-neutral courier partner',
    icon: 'local_shipping'
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    desc: 'Safely arrived with unboxing certificate',
    icon: 'home'
  }
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  order: initialOrder,
  onClose,
  onShowToast,
  language = 'en'
}) => {
  const [currentOrder, setCurrentOrder] = useState<BuyerOrder | null>(initialOrder);

  // Subscribe to real-time order updates so status changes by artisan reflect instantly!
  useEffect(() => {
    if (!initialOrder) return;
    setCurrentOrder(initialOrder);

    const unsubscribe = orderService.subscribeOrders((allOrders) => {
      const updated = allOrders.find((o) => o.id === initialOrder.id || o.orderNumber === initialOrder.orderNumber);
      if (updated) {
        setCurrentOrder(updated);
      }
    });

    return () => unsubscribe();
  }, [initialOrder?.id, initialOrder?.orderNumber]);

  if (!isOpen || !currentOrder) return null;

  const currentStatus = currentOrder.status;
  const currentStepIndex = TRACKING_STEPS.findIndex((s) => s.status === currentStatus);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/65 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-surface rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[92vh] overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-high/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-secondary uppercase">
                {currentOrder.orderNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                {currentOrder.status}
              </span>
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg text-primary leading-tight mt-0.5">
              Live Order Journey
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-highest transition-colors active:scale-95"
            aria-label="Close tracking"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar text-xs">
          {/* Tracking Summary Strip */}
          <div className="p-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-on-surface-variant block">Estimated Delivery</span>
              <span className="font-bold text-primary text-sm">{currentOrder.estimatedDelivery}</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant block">Courier Partner & Waybill</span>
              <span className="font-mono text-secondary font-bold text-xs">
                {currentOrder.courierPartner} ({currentOrder.trackingId || 'TRK-PENDING'})
              </span>
            </div>
          </div>

          {/* 6-Stage Timeline */}
          <div className="space-y-4">
            <h4 className="font-bold text-primary text-xs uppercase tracking-wider">
              Production & Delivery Progress (Stage {activeStep + 1} of 6)
            </h4>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/30">
              {TRACKING_STEPS.map((step, idx) => {
                const isCompleted = idx < activeStep;
                const isCurrent = idx === activeStep;
                const isUpcoming = idx > activeStep;

                return (
                  <div key={step.status} className="relative flex items-start gap-3.5 group">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-secondary text-on-secondary ring-4 ring-secondary/30 scale-110 shadow-sm'
                          : isCompleted
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container text-outline border border-outline-variant/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isCompleted ? 'check' : step.icon}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <p
                          className={`font-bold text-xs ${
                            isCurrent
                              ? 'text-secondary'
                              : isCompleted
                              ? 'text-primary'
                              : 'text-outline'
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-bold animate-pulse">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ordered Products Preview */}
          <div className="p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/25 space-y-2">
            <span className="font-bold text-primary text-[11px] block">Items in this Consignment:</span>
            {currentOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3 py-1">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-10 h-10 rounded-lg object-cover bg-surface-container flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-primary truncate">{product.title}</p>
                  <p className="text-[10px] text-outline">
                    Qty: {quantity} • Artisan: {product.artisanName}
                  </p>
                </div>
                <span className="font-bold text-secondary text-xs">
                  ₹{(product.price * quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery Address & Contact Artisan */}
          <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-outline block">Delivery Destination:</span>
              <p className="font-bold text-primary">{currentOrder.deliveryAddress.fullName}</p>
              <p className="text-[11px] text-on-surface-variant">
                {currentOrder.deliveryAddress.street}, {currentOrder.deliveryAddress.city} - {currentOrder.deliveryAddress.pincode}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onShowToast(`Connected with artisan ${currentOrder.artisanName} via secure messaging.`)}
              className="px-3.5 py-2 rounded-xl bg-surface-container-highest text-primary font-bold text-xs flex items-center gap-1.5 hover:bg-secondary hover:text-on-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Message Artisan</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
