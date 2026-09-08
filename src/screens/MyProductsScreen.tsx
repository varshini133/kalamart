import React, { useState, useMemo } from 'react';
import { Product, Language, ScreenType, ProductStatus } from '../types';
import { getTranslations } from '../services/localizationService';
import { ProductEditorModal } from '../components/ProductEditorModal';

interface MyProductsScreenProps {
  products: Product[];
  onNavigate: (screen: ScreenType) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct: (product: Product) => void;
  onSelectProductForManage: (product: Product) => void;
  onSelectProductForBuyer: (product: Product) => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

type FilterTab = 'all' | 'published' | 'pending_review' | 'draft' | 'rejected';

export const MyProductsScreen: React.FC<MyProductsScreenProps> = ({
  products,
  onNavigate,
  onUpdateProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onSelectProductForManage,
  onSelectProductForBuyer,
  onShowToast,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filter tabs count calculations
  const counts = useMemo(() => {
    return {
      all: products.length,
      published: products.filter((p) => (p.status || 'published') === 'published').length,
      pending_review: products.filter((p) => p.status === 'pending_review').length,
      draft: products.filter((p) => p.status === 'draft').length,
      rejected: products.filter((p) => p.status === 'rejected').length
    };
  }, [products]);

  // Filtered and searched products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pStatus = p.status || 'published';
      const matchesTab = activeTab === 'all' || pStatus === activeTab;
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [products, activeTab, searchQuery]);

  // Status-switching helpers
  const handleSaveAsDraft = (prod: Product) => {
    const updated: Product = { ...prod, status: 'draft' };
    onUpdateProduct(updated);
    onShowToast(`"${prod.title}" moved to Drafts.`);
  };

  const handleSubmitForReview = (prod: Product) => {
    const updated: Product = {
      ...prod,
      status: 'pending_review',
      reviewFeedback: 'Submitted to Artisan Guild. Authentication in progress.'
    };
    onUpdateProduct(updated);
    onShowToast(`"${prod.title}" submitted for Guild Review!`);
  };

  const handleDuplicate = (prod: Product) => {
    onDuplicateProduct(prod);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      onShowToast(`"${productToDelete.title}" removed from inventory.`);
      setProductToDelete(null);
    }
  };

  const handleOpenBuyerPreview = (prod: Product) => {
    onSelectProductForBuyer(prod);
    onNavigate('product-detail');
  };

  const handleOpenManage = (prod: Product) => {
    onSelectProductForManage(prod);
    onNavigate('product-manage');
  };

  const renderStatusChip = (prodStatus: ProductStatus = 'published') => {
    switch (prodStatus) {
      case 'published':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Published</span>
          </span>
        );
      case 'pending_review':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-800 dark:text-blue-300 text-[10px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">schedule</span>
            <span>Pending Review</span>
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">edit_note</span>
            <span>Draft</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-800 dark:text-rose-300 text-[10px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">error</span>
            <span>Rejected</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-28 pb-32 px-4 max-w-md mx-auto space-y-4 animate-fadeIn bg-surface">
      {/* Top Header & Back */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('studio')}
          className="flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Studio Dashboard</span>
        </button>

        <span className="text-[11px] text-on-surface-variant font-medium">
          {products.length} total items
        </span>
      </div>

      {/* Screen Title & Primary Action */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary">
            My Products
          </h1>
          <p className="text-xs text-on-surface-variant">
            Manage your craft listings & track performance
          </p>
        </div>

        <button
          type="button"
          id="btn-create-product-myproducts"
          onClick={() => onNavigate('voice-cataloging')}
          className="h-11 px-3.5 rounded-2xl bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Create New</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-[18px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, material, category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-primary placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/50 shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Filter Tabs (Horizontal Scrollable Pills) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
          }`}
        >
          <span>All</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('published')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'published'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
          }`}
        >
          <span>Published</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[10px]">
            {counts.published}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending_review')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pending_review'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
          }`}
        >
          <span>Pending Review</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-[10px]">
            {counts.pending_review}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('draft')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'draft'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
          }`}
        >
          <span>Draft</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[10px]">
            {counts.draft}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rejected')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'rejected'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
          }`}
        >
          <span>Rejected</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-[10px]">
            {counts.rejected}
          </span>
        </button>
      </div>

      {/* Product Cards List */}
      <div className="space-y-3 pt-1">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto text-on-surface-variant">
              <span className="material-symbols-outlined text-[28px]">inventory_2</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-primary">No products found</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {searchQuery
                  ? 'No craft pieces match your search keywords.'
                  : `No products currently in "${activeTab}" status.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('voice-cataloging')}
              className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-secondary-container"
            >
              <span className="material-symbols-outlined text-[16px]">mic</span>
              <span>Catalog New Craft</span>
            </button>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const prodStatus = prod.status || 'published';
            const primaryImg = prod.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3';
            const performance = prod.performance || { views: 420, inquiries: 5, orders: 8 };

            return (
              <div
                key={prod.id}
                id={`product-card-${prod.id}`}
                className="p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-outline-variant transition-all space-y-3"
              >
                {/* Product Card Top: Image, Details & Status */}
                <div className="flex gap-3 items-start">
                  <div className="relative shrink-0">
                    <img
                      src={primaryImg}
                      alt={prod.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-outline-variant/20 shadow-xs"
                    />
                    <div className="absolute top-1 left-1">
                      {prod.inStock === false && (
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[8px] font-bold">
                          OOS
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div>{renderStatusChip(prodStatus)}</div>
                      <span className="text-[10px] text-on-surface-variant font-medium">
                        Stock: {prod.stockCount ?? 10}
                      </span>
                    </div>

                    <h2
                      onClick={() => handleOpenManage(prod)}
                      className="font-serif text-sm font-bold text-primary line-clamp-1 hover:text-secondary cursor-pointer"
                    >
                      {prod.title}
                    </h2>

                    <p className="text-[11px] text-on-surface-variant truncate">
                      {prod.category} {prod.material ? `• ${prod.material}` : ''}
                    </p>

                    <div className="flex items-baseline justify-between mt-1.5">
                      <span className="font-serif text-base font-bold text-primary">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>

                      {/* Performance Mini Snippet */}
                      <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                        <span className="flex items-center gap-0.5" title="Buyer Views">
                          <span className="material-symbols-outlined text-[13px] text-secondary">visibility</span>
                          <span>{performance.views}</span>
                        </span>
                        <span className="flex items-center gap-0.5" title="Orders">
                          <span className="material-symbols-outlined text-[13px] text-emerald-600">shopping_bag</span>
                          <span>{performance.orders}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rejection Alert Banner (If Rejected) */}
                {prodStatus === 'rejected' && (
                  <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-900 dark:text-rose-200 space-y-1.5">
                    <div className="flex items-center gap-1 font-bold text-[11px]">
                      <span className="material-symbols-outlined text-[15px] text-rose-600">report_problem</span>
                      <span>Correction Needed:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-rose-800 dark:text-rose-300">
                      {prod.rejectionReason || 'Please improve photo lighting and check craft description.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(prod)}
                      className="py-1 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold cursor-pointer"
                    >
                      Fix in Editor & Resubmit
                    </button>
                  </div>
                )}

                {/* Quick Actions Strip */}
                <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => setEditingProduct(prod)}
                      className="px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit craft details"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      <span>Edit</span>
                    </button>

                    {/* Manage / Performance */}
                    <button
                      type="button"
                      onClick={() => handleOpenManage(prod)}
                      className="px-2.5 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="View product performance & inquiries"
                    >
                      <span className="material-symbols-outlined text-[14px]">analytics</span>
                      <span>Manage</span>
                    </button>

                    {/* Buyer Preview */}
                    <button
                      type="button"
                      onClick={() => handleOpenBuyerPreview(prod)}
                      className="px-2 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-medium text-[11px] flex items-center gap-0.5 cursor-pointer transition-colors"
                      title="View Buyer Preview"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span className="hidden sm:inline">Preview</span>
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => handleDuplicate(prod)}
                      className="px-2 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-medium text-[11px] flex items-center gap-0.5 cursor-pointer transition-colors"
                      title="Duplicate this listing"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    </button>
                  </div>

                  {/* Status toggle & delete */}
                  <div className="flex items-center gap-1">
                    {prodStatus === 'draft' || prodStatus === 'rejected' ? (
                      <button
                        type="button"
                        onClick={() => handleSubmitForReview(prod)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-0.5 cursor-pointer shadow-xs transition-colors"
                        title="Submit for Guild Review"
                      >
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        <span>Submit</span>
                      </button>
                    ) : prodStatus === 'published' ? (
                      <button
                        type="button"
                        onClick={() => handleSaveAsDraft(prod)}
                        className="px-2 py-1.5 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-amber-600 text-[11px] font-medium cursor-pointer transition-colors"
                        title="Unpublish and save as draft"
                      >
                        To Draft
                      </button>
                    ) : null}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setProductToDelete(prod)}
                      className="w-8 h-8 rounded-xl hover:bg-rose-500/15 text-on-surface-variant hover:text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
                      title="Delete craft"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl p-5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[26px]">delete_forever</span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-primary">Delete Product?</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Are you sure you want to permanently delete <strong>"{productToDelete.title}"</strong>?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container text-xs font-bold cursor-pointer hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Editor Modal */}
      {editingProduct && (
        <ProductEditorModal
          product={editingProduct}
          isOpen={true}
          onClose={() => setEditingProduct(null)}
          onSave={(updated) => {
            onUpdateProduct(updated);
            onShowToast('Product updated successfully!');
            setEditingProduct(null);
          }}
          onSubmitForReview={(updated) => {
            onUpdateProduct(updated);
            onShowToast('Product submitted for review!');
            setEditingProduct(null);
          }}
          onSaveAsDraft={(updated) => {
            onUpdateProduct(updated);
            onShowToast('Product saved as draft.');
            setEditingProduct(null);
          }}
          onBuyerPreview={(updated) => {
            onUpdateProduct(updated);
            setEditingProduct(null);
            handleOpenBuyerPreview(updated);
          }}
          onShowToast={onShowToast}
          language={language}
        />
      )}
    </div>
  );
};
