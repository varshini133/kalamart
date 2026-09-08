import React, { useState } from 'react';
import { Product, Language } from '../../types';
import { b2bService } from '../../services/b2bService';
import { BRAND_LOGO } from '../../data/mockData';

interface ExportCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onShowToast: (msg: string) => void;
  language?: Language;
}

export const ExportCatalogModal: React.FC<ExportCatalogModalProps> = ({
  isOpen,
  onClose,
  products,
  onShowToast,
  language = 'en'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyGICertified, setOnlyGICertified] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (onlyGICertified && !p.giCertified) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    b2bService.exportCatalogCSV(filteredProducts);
    onShowToast(
      language === 'ta'
        ? 'வணிக பட்டியல் CSV ஆகப் பதிவிறக்கப்பட்டது'
        : language === 'hi'
        ? 'कैटलॉग CSV डाउनलोड हो गया है'
        : 'Wholesale Catalog exported as CSV successfully!'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Container - printable ID */}
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col print:max-h-none print:m-0 print:border-none print:shadow-none print:rounded-none">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="px-5 py-4 bg-surface-container-low border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-primary flex items-center gap-1.5">
                <span>Export-Ready Product Catalog</span>
                <span className="text-[10px] font-mono bg-secondary/15 text-secondary px-2 py-0.5 rounded-full font-bold">
                  v2026.1
                </span>
              </h2>
              <p className="text-[11px] text-on-surface-variant">
                Official specifications, artisan profiles, bulk pricing & GI provenance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Download CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1.5 border border-outline-variant/30 transition-all cursor-pointer active:scale-95"
              title="Download spreadsheet with all specifications"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">table_view</span>
              <span>Export CSV</span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary-container transition-all cursor-pointer active:scale-95"
              title="Print or Save as PDF"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">print</span>
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Filter Bar (Hidden on Print) */}
        <div className="px-5 py-2.5 bg-surface-container/60 border-b border-outline-variant/15 flex items-center justify-between gap-3 text-xs overflow-x-auto print:hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Category:</span>
            <div className="flex gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-on-primary shadow-2xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {cat === 'all' ? 'All Crafts' : cat}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-1.5 shrink-0 cursor-pointer select-none text-[11px] font-semibold text-primary">
            <input
              type="checkbox"
              checked={onlyGICertified}
              onChange={(e) => setOnlyGICertified(e.target.checked)}
              className="rounded text-secondary focus:ring-secondary"
            />
            <span>GI Certified Only</span>
          </label>
        </div>

        {/* Scrollable Catalog Body / Printable Document */}
        <div id="printable-catalog" className="p-6 overflow-y-auto space-y-6 flex-1 bg-surface-container-lowest print:p-0 print:overflow-visible">
          {/* Catalog Cover Header */}
          <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 text-center space-y-2 relative overflow-hidden print:border print:bg-white">
            <div className="flex items-center justify-center gap-2 mb-1">
              <img src={BRAND_LOGO} alt="KalaConnect" className="h-9 w-auto" />
              <span className="text-xl font-bold font-serif text-primary tracking-tight">KalaConnect</span>
            </div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-primary">
              Institutional & Export Craft Sourcing Catalog
            </h1>
            <p className="text-xs text-on-surface-variant max-w-lg mx-auto">
              Authentic Indian artisan clusters certified under Geographical Indication (GI) heritage protection. Direct cooperative trade for hotels, retail chains, and global institutions.
            </p>
            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] font-medium text-outline">
              <span>Published: March 2026</span>
              <span>•</span>
              <span>Zero Intermediaries</span>
              <span>•</span>
              <span>Export Compliant Packing</span>
            </div>
          </div>

          {/* Product Items List */}
          <div className="space-y-6">
            {filteredProducts.map((prod, index) => {
              const wholesalePrice = prod.bulkPrice || Math.round(prod.price * 0.75);
              const moq = prod.moq || 10;
              const capacity = prod.productionCapacity || '100 units / month';
              const leadTime = prod.approxLeadTime || '14–21 business days';
              const savings = Math.round(((prod.price - wholesalePrice) / prod.price) * 100);

              return (
                <div
                  key={prod.id}
                  className="rounded-3xl border border-outline-variant/30 p-5 bg-surface-container-lowest shadow-2xs space-y-4 break-inside-avoid print:border-black/20 print:p-4 print:mb-6"
                >
                  {/* Top Metadata Header */}
                  <div className="flex items-center justify-between border-b border-outline-variant/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-secondary/15 text-secondary text-xs font-bold flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      <span className="text-xs font-mono text-outline uppercase">
                        SKU: {prod.id.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {prod.giCertified && (
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold flex items-center gap-1 border border-secondary/20">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          <span>GI Certified</span>
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        Bulk Available
                      </span>
                    </div>
                  </div>

                  {/* Main Product Info & Specs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Image Column */}
                    <div className="md:col-span-4">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20 relative">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium">
                          {prod.category}
                        </div>
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-primary">
                          {prod.title}
                        </h3>
                        {prod.hindiTitle && (
                          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                            {prod.hindiTitle}
                          </p>
                        )}
                        <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      {/* Artisan Information Box */}
                      <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-outline block">Master Artisan / Guild</span>
                          <span className="font-bold text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-secondary">person</span>
                            {prod.artisanName}
                          </span>
                          <span className="text-[10px] text-on-surface-variant block">{prod.artisanRole || 'Master Artisan'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-outline block">Craft Origin & Cluster</span>
                          <span className="font-bold text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                            {prod.craftOrigin}
                          </span>
                          <span className="text-[10px] text-on-surface-variant block">{prod.artisanExperience || 'Generational Mastery'}</span>
                        </div>
                      </div>

                      {/* Technical Specifications */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-surface-container/50 border border-outline-variant/15">
                          <span className="text-outline text-[10px] block">Material</span>
                          <span className="font-semibold text-primary truncate block">{prod.material || 'Natural Regional Materials'}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-surface-container/50 border border-outline-variant/15">
                          <span className="text-outline text-[10px] block">Technique</span>
                          <span className="font-semibold text-primary truncate block">{prod.technique || 'Handmade Craft'}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-surface-container/50 border border-outline-variant/15">
                          <span className="text-outline text-[10px] block">Quality Heritage</span>
                          <span className="font-semibold text-primary truncate block">{prod.giTag || 'GI Certified'}</span>
                        </div>
                      </div>

                      {/* Pricing & Bulk Availability Matrix */}
                      <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/25 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-outline block font-medium">Standard Retail MSRP</span>
                          <span className="text-sm font-bold text-primary line-through">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-secondary font-bold block">Wholesale Bulk Tier</span>
                          <span className="text-base font-bold text-secondary font-serif">
                            ₹{wholesalePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-700 block">(-{savings}%)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-outline block font-medium">Minimum Order (MOQ)</span>
                          <span className="text-sm font-bold text-primary">
                            {moq} units
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-outline block font-medium">Capacity & Lead Time</span>
                          <span className="text-xs font-bold text-primary block">
                            {capacity}
                          </span>
                          <span className="text-[10px] text-outline block">
                            Lead: {leadTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Catalog Footer */}
          <div className="pt-4 border-t border-outline-variant/20 text-center text-xs text-outline space-y-1">
            <p>© 2026 KalaConnect Guild Trade Network · Authentic GI Certified Indian Handicrafts</p>
            <p>For custom institutional tenders & international shipping inquiries, contact procurement@kalaconnect.org</p>
          </div>
        </div>
      </div>
    </div>
  );
};
