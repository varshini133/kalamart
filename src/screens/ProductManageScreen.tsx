import React, { useState } from 'react';
import { Product, Language, ScreenType, ProductStatus } from '../types';
import { getTranslations } from '../services/localizationService';
import { ProductEditorModal } from '../components/ProductEditorModal';

interface ProductManageScreenProps {
  product: Product;
  onNavigate: (screen: ScreenType) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct: (product: Product) => void;
  onSelectProductForBuyer: (product: Product) => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

export const ProductManageScreen: React.FC<ProductManageScreenProps> = ({
  product,
  onNavigate,
  onUpdateProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onSelectProductForBuyer,
  onShowToast,
  language = 'en'
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isInquiriesModalOpen, setIsInquiriesModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);

  // Performance metrics with safe defaults
  const performance = product.performance || {
    views: 1240,
    inquiries: 14,
    orders: 18,
    revenue: product.price * 18,
    rating: product.rating || 4.9,
    reviewsCount: product.reviewsCount || 36
  };

  const status = product.status || 'published';

  // Toggle stock availability
  const handleToggleStock = () => {
    const newStockState = !product.inStock;
    const updated = {
      ...product,
      inStock: newStockState,
      stockCount: newStockState ? Math.max(product.stockCount || 5, 1) : 0
    };
    onUpdateProduct(updated);
    onShowToast(newStockState ? 'Product marked as In Stock' : 'Product marked as Out of Stock');
  };

  // Change status
  const handleChangeStatus = (newStatus: ProductStatus) => {
    const updated = {
      ...product,
      status: newStatus
    };
    onUpdateProduct(updated);
    if (newStatus === 'pending_review') {
      onShowToast('Submitted to GI Artisan Guild for verification!');
    } else if (newStatus === 'draft') {
      onShowToast('Product moved to Drafts.');
    } else if (newStatus === 'published') {
      onShowToast('Product is now LIVE on the marketplace!');
    }
  };

  const handleDuplicate = () => {
    onDuplicateProduct(product);
  };

  const handleDelete = () => {
    onDeleteProduct(product.id);
    onShowToast('Product deleted from inventory.');
    onNavigate('my-products');
  };

  const handleOpenBuyerPreview = () => {
    onSelectProductForBuyer(product);
    onNavigate('product-detail');
  };

  // Status visual badge styling
  const getStatusBadge = () => {
    switch (status) {
      case 'published':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Live in Marketplace</span>
          </span>
        );
      case 'pending_review':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-800 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
            <span>GI Verification Pending</span>
          </span>
        );
      case 'draft':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="material-symbols-outlined text-[14px]">edit_note</span>
            <span>Saved as Draft</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>Revision Required</span>
          </span>
        );
    }
  };

  const primaryImage = product.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3';

  return (
    <div className="flex-1 flex flex-col relative w-full pt-28 pb-32 px-4 max-w-md mx-auto space-y-5 animate-fadeIn bg-surface">
      {/* Top Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('my-products')}
          className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>My Products</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenBuyerPreview}
            className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
            title="Preview how buyers experience this listing"
          >
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            <span>Buyer Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* REJECTION / ACTION BANNER (IF REJECTED)                              */}
      {/* ===================================================================== */}
      {status === 'rejected' && (
        <div className="p-4 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 space-y-2.5 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">info</span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-rose-950 dark:text-rose-200">
                Guild Feedback — Action Required
              </h4>
              <p className="text-xs text-rose-900/90 dark:text-rose-200/90 leading-relaxed mt-0.5">
                {product.rejectionReason || 'Please review craft photo quality and verify GI origin details.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              Fix Details in Editor
            </button>
            <button
              type="button"
              onClick={() => handleChangeStatus('pending_review')}
              className="py-2 px-3 rounded-xl bg-surface border border-rose-500/40 text-rose-900 dark:text-rose-200 text-xs font-bold cursor-pointer hover:bg-surface-container"
            >
              Resubmit
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PENDING REVIEW BANNER (IF UNDER REVIEW)                              */}
      {/* ===================================================================== */}
      {status === 'pending_review' && (
        <div className="p-4 rounded-3xl bg-blue-500/10 border-2 border-blue-500/30 space-y-2 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-blue-950 dark:text-blue-200">
                Under Guild Review
              </h4>
              <p className="text-xs text-blue-900/90 dark:text-blue-200/90 leading-relaxed mt-0.5">
                {product.reviewFeedback || 'This craft is being authenticated by the Artisan Guild for genuine GI lineage. Usually approved within 24 hours.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. PRODUCT HERO CARD                                                 */}
      {/* ===================================================================== */}
      <div className="p-4 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex gap-3.5 items-start">
          <div className="relative shrink-0">
            <img
              src={primaryImage}
              alt={product.title}
              className="w-24 h-24 rounded-2xl object-cover border border-outline-variant/20 shadow-xs"
            />
            {product.images && product.images.length > 1 && (
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold backdrop-blur-xs">
                +{product.images.length - 1}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-1">{getStatusBadge()}</div>
            <h1 className="font-serif text-base font-bold text-primary leading-snug line-clamp-2">
              {product.title}
            </h1>
            <p className="text-xs text-on-surface-variant truncate mt-0.5">
              {product.category}
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif text-lg font-bold text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-secondary font-bold">
                0% Commission
              </span>
            </div>
          </div>
        </div>

        {/* Quick Inventory Controls */}
        <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">inventory</span>
            <span className="text-on-surface-variant">
              Stock: <strong className="text-primary">{product.stockCount ?? 10} units</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleStock}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              product.inStock !== false
                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-500/15 text-rose-800 dark:text-rose-300'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {product.inStock !== false ? 'check_circle' : 'cancel'}
            </span>
            <span>{product.inStock !== false ? 'In Stock' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. PRODUCT PERFORMANCE (REQUIRED SECTION)                            */}
      {/* Views, Inquiries, Orders (Clean, Not Overloaded)                     */}
      {/* ===================================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">analytics</span>
            <span>Product Performance</span>
          </h2>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
            All-Time Activity
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Performance Card 1: Views */}
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-secondary">visibility</span>
              <span className="text-[10px] font-bold text-secondary">+18%</span>
            </div>
            <div className="font-serif text-xl font-bold text-primary">
              {performance.views.toLocaleString('en-IN')}
            </div>
            <span className="block text-[10px] text-on-surface-variant font-medium">
              Buyer Views
            </span>
          </div>

          {/* Performance Card 2: Inquiries */}
          <button
            type="button"
            onClick={() => setIsInquiriesModalOpen(true)}
            className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-blue-500/50 shadow-xs space-y-1 text-left cursor-pointer transition-all active:scale-95"
          >
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-blue-600">chat</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-700 text-[9px] font-bold">
                Open
              </span>
            </div>
            <div className="font-serif text-xl font-bold text-primary">
              {performance.inquiries}
            </div>
            <span className="block text-[10px] text-on-surface-variant font-medium">
              Inquiries
            </span>
          </button>

          {/* Performance Card 3: Orders */}
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">shopping_bag</span>
              <span className="text-[10px] font-bold text-emerald-700">Units</span>
            </div>
            <div className="font-serif text-xl font-bold text-primary">
              {performance.orders}
            </div>
            <span className="block text-[10px] text-on-surface-variant font-medium">
              Orders Placed
            </span>
          </div>
        </div>

        {/* Financial Earnings Card */}
        <div className="p-3.5 rounded-2xl bg-linear-to-r from-emerald-500/10 via-surface-container-lowest to-emerald-500/5 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">
                Total Revenue from this Craft
              </span>
              <span className="font-serif text-lg font-bold text-primary">
                ₹{(performance.orders * product.price).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold block">
              100% Payout
            </span>
            <span className="text-[10px] text-on-surface-variant">
              ₹0 Platform Cut
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. PRODUCT SPECIFICATIONS & PRESERVED AI SUMMARY                     */}
      {/* ===================================================================== */}
      <div className="p-4 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
          <span>Craft Details</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-surface-container-low">
            <span className="text-[10px] text-on-surface-variant block">Materials:</span>
            <span className="font-bold text-primary">{product.material || 'Natural Clay'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low">
            <span className="text-[10px] text-on-surface-variant block">Technique:</span>
            <span className="font-bold text-primary">{product.technique || 'Handmade'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low">
            <span className="text-[10px] text-on-surface-variant block">Lead Time:</span>
            <span className="font-bold text-primary">{product.productionTime || 'Ready to ship'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-container-low">
            <span className="text-[10px] text-on-surface-variant block">GI Lineage:</span>
            <span className="font-bold text-primary">{product.giTag ? 'GI Certified' : 'Heritage Craft'}</span>
          </div>
        </div>

        {/* Narrative */}
        <div className="pt-2 border-t border-outline-variant/20">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase block mb-1">
            Craft Story
          </span>
          <p className="text-xs text-on-surface leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. ACTIONS LIST (EDIT, DUPLICATE, DELETE, DRAFT, SUBMIT)             */}
      {/* ===================================================================== */}
      <div className="space-y-2 pt-1">
        <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant px-1">
          Quick Management Actions
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {/* Edit */}
          <button
            type="button"
            id="manage-btn-edit"
            onClick={() => setIsEditorOpen(true)}
            className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Edit Details</span>
          </button>

          {/* Duplicate */}
          <button
            type="button"
            id="manage-btn-duplicate"
            onClick={handleDuplicate}
            className="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Duplicate Craft</span>
          </button>

          {/* Status-specific action: Submit review or unpublish */}
          {status !== 'published' ? (
            <button
              type="button"
              id="manage-btn-submit-review"
              onClick={() => handleChangeStatus('pending_review')}
              className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Submit for Review</span>
            </button>
          ) : (
            <button
              type="button"
              id="manage-btn-save-draft"
              onClick={() => handleChangeStatus('draft')}
              className="p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">archive</span>
              <span>Unpublish to Draft</span>
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            id="manage-btn-delete"
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Delete Craft</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* INQUIRIES MODAL                                                      */}
      {/* ===================================================================== */}
      {isInquiriesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[22px]">chat</span>
                <div>
                  <h3 className="font-bold text-sm text-primary">Customer Inquiries</h3>
                  <p className="text-[10px] text-on-surface-variant">Questions about {product.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInquiriesModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">Ananya Roy (Kolkata)</span>
                  <span className="text-[10px] text-on-surface-variant">2 hours ago</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  "Hello! Can this terracotta piece be used for hot liquids or just cooling water? Love the traditional carving!"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onShowToast('Direct WhatsApp message opened with Ananya.');
                    setIsInquiriesModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">send</span>
                  <span>Reply to Ananya</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">Vikram Singhania (Delhi)</span>
                  <span className="text-[10px] text-on-surface-variant">Yesterday</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  "Would you be able to craft 25 pieces for our Diwali corporate gift hampers by next month?"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onShowToast('Corporate bulk quote initiated.');
                    setIsInquiriesModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">store</span>
                  <span>Offer B2B Bulk Price</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex justify-end">
              <button
                type="button"
                onClick={() => setIsInquiriesModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                            */}
      {/* ===================================================================== */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl p-5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[26px]">warning</span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-primary">Delete this craft?</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Are you sure you want to remove <strong>"{product.title}"</strong> from your store? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container text-xs font-bold cursor-pointer hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Editor Modal */}
      <ProductEditorModal
        product={product}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={(updated) => {
          onUpdateProduct(updated);
          onShowToast('Product details saved successfully!');
        }}
        onSubmitForReview={(updated) => {
          onUpdateProduct(updated);
          onShowToast('Product submitted for GI Guild review!');
        }}
        onSaveAsDraft={(updated) => {
          onUpdateProduct(updated);
          onShowToast('Product saved as draft.');
        }}
        onBuyerPreview={(updated) => {
          onUpdateProduct(updated);
          handleOpenBuyerPreview();
        }}
        onShowToast={onShowToast}
        language={language}
      />
    </div>
  );
};
