import React, { useState } from 'react';
import { Product, Language, ProductStatus } from '../types';
import { getTranslations } from '../services/localizationService';

interface ProductEditorModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
  onSubmitForReview?: (updatedProduct: Product) => void;
  onSaveAsDraft?: (updatedProduct: Product) => void;
  onBuyerPreview?: (product: Product) => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

const CRAFT_CATEGORIES = [
  'Pottery & Clay Decor',
  'Metal & Bell Craft',
  'Handloom & Textiles',
  'Wood & Bamboo',
  'Ceramics & Pottery',
  'Jewelry & Adornment',
  'Traditional Painting & Folk Art'
];

const COMMON_MATERIALS = [
  'Natural Terracotta Clay',
  'Riverbed Clay',
  'Solid Brass',
  'Bell Metal',
  'Pure Silk',
  'Natural Cotton',
  'Aromatic Sheesham Wood',
  'Teakwood',
  'Natural Mineral Ochre',
  'Vegetable Dyes'
];

const SAMPLE_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD0VMoMX4HuHFCBWiIJcYfIiucBtcWdgHyIbYWCyMUEkqWr8J83wJGSNbBhIQv_agE9uwzj0epLMWTOq2XE3xWCiG72VZTPBVheJpq5--me4qVA9mvrX8EZAORV74OIgA8HLdQXymeVUoSZC7141glYGs5mkHr_pNPBTMF6VBg9d5LNlPpvjKh6Qni41WSLdovo-rSDm_mJijrF2lUEiTPeyCkRKpfL4h6cjwbyvewgb_Hr5LoU8gB3',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJCaoLPFm8p8Zm08bATiHtOIXOKv1axlgXGv_t3Tn2nU0k4LcfeaAv3ouDn-AGte38MGty-IsgILHgA7ZayKH8R4m9YfOjHrv11V_3RoDzskPbcuLsuvJoMnUTQILpgMMJ_TXH4JeOlVTBw4wg3vhT7N9gbGzi-aLYb8bGlawuPZzljkNn9EtTPNHaaneefYJ0qCR2CQe5z74vhaxg4mVkvGyv_k7lSWifCnIeAfwpcOmVqGcYJA74',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBWVv2dVIh1IjcuSaFKsNW_Oixou2iwnFLbJkJsBwQv-o6n2e-Gzlng0o22UJUcFopkPZgCMS2136pe0JDjrnBlxg_lSJ5FlDf7LfhWUGi7ov5yAKWzy17pnJxHstSQXd9EBAsQUAF6YirQ471gLMLkiM6qDf5wLAd9U24F2JfXgVlD_hT5bSoBpqjUYg_HI5TCjfcBaMJ0XuOfujvQ4wVvjw72K6sZ3fNPXq43kPvCNFE5Edkflfhm',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBMs7hPE8gmakn2V2_N8cnPD0J5QggMsDR9pKTMgTgRDaolDLDnSArBJcEosxmFA3HIfISh066i474V4q1BGhL_oFC1PEP1lWpKxLJNNcoDdalP8Cdum0mlAsnCDVMtQK7XGYopZ5AwcVKikSuiMsZxAoUNd_s2oPF6GhWdrdzkvJv2kV7HJI7j8IVw84S1gPS-BwmKtSLVaFnPIQ3dVy4S2-PUQEZko9WyOcALkVMl5gl0hL9PNti-',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuACm8mIi0Uyd4aTu3HnJ_njyfA5deLeGBjHglHu4RT1zznER-m6K9CUbLm__DLya3sM8b6ucBwaC0mVzVGAEFYNNMXn2IHkf7l8UdP7_9lds9qCX118Q-bpd83giI20RZeoF-AQvrEaS88gXZVJ30aShJ9Uhk08G0vnpGhK3hfGavN9pNwuACAVAXARX1Fb2aZsdA6Txybiks9y3E28jsY3xY576qs3b-kR7ShzjSI35FSZ_vMtfLZ0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCxSQE-UUyb2zjyQ_mLIxTS1gdHc-7o8HUrFtH03mYQeJ84ex5YEvP5fUeOS-bLH1v2FyaaQiW-ciQtljymHXvXtulgL59gk0zE1_2yg5u26gccHIkF5R8f7JS_Ss_nVH-ZrTxjUEdC-Dl-doCf9QRWP42oitUjrk19ROcyvPZjfVsgs3fDzk9FDuNOMs4_SVh4GQuTJKix2f1KIxeGQgU0mmhPThV1-dkOZnGfCUlcEJQjP7pFZvMo'
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  onSubmitForReview,
  onSaveAsDraft,
  onBuyerPreview,
  onShowToast,
  language = 'en'
}) => {
  if (!isOpen) return null;

  // Form State
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [category, setCategory] = useState(product.category || CRAFT_CATEGORIES[0]);
  const [price, setPrice] = useState<number>(product.price || 0);
  const [stockCount, setStockCount] = useState<number>(product.stockCount ?? 10);
  const [productionTime, setProductionTime] = useState<string>(product.productionTime || 'Ready to ship');
  const [material, setMaterial] = useState(product.material || '');
  const [images, setImages] = useState<string[]>(product.images && product.images.length > 0 ? product.images : [SAMPLE_IMAGES[0]]);
  const [status, setStatus] = useState<ProductStatus>(product.status || 'published');

  // AI Preserved Data inspection
  const aiData = product.aiPreservedData || {
    originalTitle: product.title,
    originalDescription: product.description,
    culturalStory: product.storyBehindProduct || 'Handcrafted using traditional lineage techniques passed down through generations.',
    suggestedFairPrice: product.price,
    detectedMaterials: [product.material || 'Terracotta Clay'],
    voiceTranscript: 'A handmade craft shaped with traditional patience, organic natural materials, and authentic GI-heritage.'
  };

  const [showAiPreservedCard, setShowAiPreservedCard] = useState<boolean>(true);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState<boolean>(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');

  // Tracking manual overrides
  const isTitleOverridden = aiData.originalTitle ? title !== aiData.originalTitle : false;
  const isDescOverridden = aiData.originalDescription ? description !== aiData.originalDescription : false;
  const isPriceOverridden = aiData.suggestedFairPrice ? price !== aiData.suggestedFairPrice : false;

  // Revert handlers
  const handleRevertTitle = () => {
    if (aiData.originalTitle) {
      setTitle(aiData.originalTitle);
      onShowToast('Title reverted to AI suggestion');
    }
  };

  const handleRevertDesc = () => {
    if (aiData.originalDescription) {
      setDescription(aiData.originalDescription);
      onShowToast('Description reverted to AI craft narrative');
    }
  };

  const handleApplyAiPrice = () => {
    if (aiData.suggestedFairPrice) {
      setPrice(aiData.suggestedFairPrice);
      onShowToast(`Applied AI recommended fair price: ₹${aiData.suggestedFairPrice}`);
    }
  };

  // Image actions
  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const newImgs = [...images];
    const [selected] = newImgs.splice(index, 1);
    newImgs.unshift(selected);
    setImages(newImgs);
    onShowToast('Cover photo updated');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      onShowToast('At least one product photo is required');
      return;
    }
    const newImgs = images.filter((_, i) => i !== index);
    setImages(newImgs);
    onShowToast('Photo removed');
  };

  const handleAddSampleImage = (imgUrl: string) => {
    if (!images.includes(imgUrl)) {
      setImages([...images, imgUrl]);
      onShowToast('Photo added');
    }
    setIsPhotoPickerOpen(false);
  };

  const handleAddCustomImage = () => {
    if (customPhotoUrl.trim()) {
      setImages([...images, customPhotoUrl.trim()]);
      setCustomPhotoUrl('');
      setIsPhotoPickerOpen(false);
      onShowToast('Custom photo added');
    }
  };

  // Material helpers
  const handleToggleMaterialTag = (matTag: string) => {
    if (!material) {
      setMaterial(matTag);
    } else if (material.includes(matTag)) {
      const parts = material.split(',').map((m) => m.trim()).filter((m) => m !== matTag);
      setMaterial(parts.join(', '));
    } else {
      setMaterial(`${material}, ${matTag}`);
    }
  };

  // Save handler
  const buildUpdatedProduct = (targetStatus?: ProductStatus): Product => {
    return {
      ...product,
      title: title.trim() || product.title,
      description: description.trim() || product.description,
      category,
      price: Number(price) || 100,
      stockCount: Number(stockCount) || 0,
      productionTime,
      material: material.trim() || product.material,
      images,
      status: targetStatus || status,
      inStock: Number(stockCount) > 0,
      // preserve AI metadata permanently
      aiPreservedData: aiData
    };
  };

  const handleSave = () => {
    const updated = buildUpdatedProduct();
    onSave(updated);
    onClose();
  };

  const handleSaveDraftAction = () => {
    const updated = buildUpdatedProduct('draft');
    if (onSaveAsDraft) {
      onSaveAsDraft(updated);
    } else {
      onSave(updated);
    }
    onClose();
  };

  const handleSubmitReviewAction = () => {
    const updated = buildUpdatedProduct('pending_review');
    if (onSubmitForReview) {
      onSubmitForReview(updated);
    } else {
      onSave(updated);
    }
    onClose();
  };

  const handlePreviewAction = () => {
    const updated = buildUpdatedProduct();
    if (onBuyerPreview) {
      onBuyerPreview(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="p-4 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">edit_note</span>
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-primary">
                Product Editor
              </h2>
              <p className="text-[11px] text-on-surface-variant">
                Craft details & intelligent overrides
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-on-surface">
          {/* ================================================================= */}
          {/* 1. IMAGES MANAGEMENT                                              */}
          {/* ================================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">photo_library</span>
                <span>Craft Photos ({images.length})</span>
              </label>
              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(!isPhotoPickerOpen)}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                <span>+ Add Photo</span>
              </button>
            </div>

            {/* Photos Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-2xl overflow-hidden aspect-square border-2 border-outline-variant/30 bg-surface-container shadow-xs"
                >
                  <img
                    src={imgUrl}
                    alt={`Product photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {/* Primary Badge */}
                  {idx === 0 ? (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[9px] font-bold shadow-xs">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 hover:bg-black/80 text-white text-[9px] font-medium backdrop-blur-xs cursor-pointer transition-all opacity-90 group-hover:opacity-100"
                      title="Set as Cover Photo"
                    >
                      Make Cover
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition-all shadow-xs"
                    title="Remove Photo"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}

              {/* Add Tile */}
              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(true)}
                className="rounded-2xl border-2 border-dashed border-outline-variant/60 hover:border-secondary aspect-square flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-secondary bg-surface-container-lowest transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">add</span>
                <span className="text-[10px] font-bold">Add Photo</span>
              </button>
            </div>

            {/* Photo Picker Drawer */}
            {isPhotoPickerOpen && (
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Choose from Curated Craft Shots:</span>
                  <button
                    type="button"
                    onClick={() => setIsPhotoPickerOpen(false)}
                    className="text-[11px] text-on-surface-variant hover:text-on-surface"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_IMAGES.map((sampleUrl, sIdx) => (
                    <img
                      key={sIdx}
                      src={sampleUrl}
                      alt="Sample"
                      onClick={() => handleAddSampleImage(sampleUrl)}
                      className="w-full aspect-square rounded-xl object-cover border border-outline-variant/30 hover:ring-2 hover:ring-secondary cursor-pointer shadow-xs transition-transform active:scale-95"
                    />
                  ))}
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex gap-2">
                  <input
                    type="text"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-surface border border-outline-variant/40 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomImage}
                    className="px-3 py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold cursor-pointer hover:bg-secondary-container"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* 2. PRODUCT NAME (With AI preservation & override)                */}
          {/* ================================================================= */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">label</span>
                <span>Product Name</span>
              </label>
              {isTitleOverridden ? (
                <button
                  type="button"
                  onClick={handleRevertTitle}
                  className="text-[11px] text-amber-800 dark:text-amber-300 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                  title="Revert to AI-generated title"
                >
                  <span className="material-symbols-outlined text-[13px]">history</span>
                  <span>Reset to AI</span>
                </button>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                  <span>AI Voice Generated</span>
                </span>
              )}
            </div>

            <input
              type="text"
              id="edit-product-name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 shadow-xs"
              placeholder="Enter craft piece title"
            />
            {isTitleOverridden && (
              <p className="text-[10px] text-on-surface-variant italic">
                Original AI title: "{aiData.originalTitle}"
              </p>
            )}
          </div>

          {/* ================================================================= */}
          {/* 3. CATEGORY & MATERIALS                                           */}
          {/* ================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">category</span>
                <span>Category</span>
              </label>
              <select
                id="edit-product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 shadow-xs cursor-pointer"
              >
                {CRAFT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Production Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">timer</span>
                <span>Production Time</span>
              </label>
              <select
                id="edit-product-production-time"
                value={productionTime}
                onChange={(e) => setProductionTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 shadow-xs cursor-pointer"
              >
                <option value="Ready to ship">Ready to ship (In stock)</option>
                <option value="1 - 2 days">1 - 2 days</option>
                <option value="3 - 5 days">3 - 5 days</option>
                <option value="Made to order (7 days)">Made to order (7 days)</option>
                <option value="Hand-loomed (14 days)">Hand-loomed (14 days)</option>
              </select>
            </div>
          </div>

          {/* Materials Input & Quick Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">textures</span>
                <span>Materials</span>
              </span>
              <span className="text-[10px] text-on-surface-variant font-normal">Tap chips to add</span>
            </label>

            <input
              type="text"
              id="edit-product-materials"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. Terracotta Red Clay, Natural Ochre, River Sand"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 shadow-xs"
            />

            {/* Suggested Material Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_MATERIALS.slice(0, 6).map((chip) => {
                const isSelected = material.toLowerCase().includes(chip.toLowerCase());
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleToggleMaterialTag(chip)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* 4. PRICING & STOCK                                                */}
          {/* ================================================================= */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">price_change</span>
                <span>Price & Inventory</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                0% Commission Guaranteed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Price */}
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                  Artisan Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-primary font-bold text-sm">₹</span>
                  <input
                    type="number"
                    id="edit-product-price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-surface border border-outline-variant/40 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs"
                    min="50"
                  />
                </div>
              </div>

              {/* Stock Count */}
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
                  Stock Units Available
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setStockCount(Math.max(0, stockCount - 1))}
                    className="w-8 h-8 rounded-xl bg-surface border border-outline-variant/40 flex items-center justify-center text-primary font-bold text-sm hover:bg-surface-container cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="edit-product-stock"
                    value={stockCount}
                    onChange={(e) => setStockCount(Math.max(0, Number(e.target.value)))}
                    className="flex-1 text-center py-2 rounded-xl bg-surface border border-outline-variant/40 text-sm font-bold text-primary focus:outline-none shadow-xs"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => setStockCount(stockCount + 1)}
                    className="w-8 h-8 rounded-xl bg-surface border border-outline-variant/40 flex items-center justify-center text-primary font-bold text-sm hover:bg-surface-container cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* AI Fair Price Helper */}
            {aiData.suggestedFairPrice && (
              <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px]">
                <span className="text-emerald-900 dark:text-emerald-200">
                  AI Fair Suggested Price: <strong>₹{aiData.suggestedFairPrice}</strong> (includes 4 hrs labor)
                </span>
                {isPriceOverridden && (
                  <button
                    type="button"
                    onClick={handleApplyAiPrice}
                    className="text-emerald-800 dark:text-emerald-300 font-bold hover:underline cursor-pointer"
                  >
                    Apply AI Price
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* 5. CRAFT STORY / DESCRIPTION                                      */}
          {/* ================================================================= */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">description</span>
                <span>Craft Description & Narrative</span>
              </label>
              {isDescOverridden ? (
                <button
                  type="button"
                  onClick={handleRevertDesc}
                  className="text-[11px] text-amber-800 dark:text-amber-300 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                  title="Revert to AI crafted narrative"
                >
                  <span className="material-symbols-outlined text-[13px]">history</span>
                  <span>Reset to AI</span>
                </button>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                  <span>AI Story Preserved</span>
                </span>
              )}
            </div>

            <textarea
              id="edit-product-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-primary leading-relaxed focus:outline-none focus:ring-2 focus:ring-secondary/50 shadow-xs resize-none"
              placeholder="Describe your handmade creation, technique, and cultural heritage..."
            />
          </div>

          {/* ================================================================= */}
          {/* 6. PRESERVED AI INTELLIGENCE CARD (IMPORTANT REQUIREMENT)        */}
          {/* ================================================================= */}
          <div className="rounded-2xl border border-secondary/30 bg-secondary/5 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAiPreservedCard(!showAiPreservedCard)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-secondary/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary">neurology</span>
                <div>
                  <h4 className="text-xs font-bold text-primary">
                    Preserved AI Craft Intelligence
                  </h4>
                  <p className="text-[10px] text-on-surface-variant">
                    Voice transcript, cultural origin, and lineage tags
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-secondary">
                {showAiPreservedCard ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showAiPreservedCard && (
              <div className="p-3.5 pt-0 space-y-2.5 text-xs text-on-surface-variant border-t border-secondary/20">
                {/* Voice Transcript */}
                {aiData.voiceTranscript && (
                  <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">mic</span>
                      <span>Cataloging Voice Recording Transcript:</span>
                    </span>
                    <p className="text-[11px] text-primary italic leading-relaxed">
                      "{aiData.voiceTranscript}"
                    </p>
                  </div>
                )}

                {/* Cultural Significance */}
                {aiData.culturalStory && (
                  <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">history_edu</span>
                      <span>Cultural Significance & GI Heritage:</span>
                    </span>
                    <p className="text-[11px] text-primary leading-relaxed">
                      {aiData.culturalStory}
                    </p>
                  </div>
                )}

                {/* Detected AI Tags */}
                {aiData.autoTags && aiData.autoTags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-on-surface-variant">AI Tags:</span>
                    {aiData.autoTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onBuyerPreview && (
              <button
                type="button"
                id="btn-editor-buyer-preview"
                onClick={handlePreviewAction}
                className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Preview how buyers will see this product"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Buyer Preview</span>
              </button>
            )}

            <button
              type="button"
              id="btn-editor-save-draft"
              onClick={handleSaveDraftAction}
              className="py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">draft</span>
              <span>Save as Draft</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              id="btn-editor-submit-review"
              onClick={handleSubmitReviewAction}
              className="py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Submit for Review</span>
            </button>

            <button
              type="button"
              id="btn-editor-save-main"
              onClick={handleSave}
              className="py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-bold flex items-center justify-center gap-1 shadow-md cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
