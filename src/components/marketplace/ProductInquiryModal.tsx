import React, { useState } from 'react';
import { Product, Artisan, Language } from '../../types';

interface ProductInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  artisan: Artisan;
  onSubmitInquiry: (inquiry: ProductInquiryData) => void;
  language?: Language;
}

export interface ProductInquiryData {
  productId: string;
  productTitle: string;
  productImage: string;
  artisanName: string;
  artisanId?: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  quantity: number;
  customizationRequirements: string;
  message: string;
  neededByDate?: string;
  inquiryType: string;
}

export const ProductInquiryModal: React.FC<ProductInquiryModalProps> = ({
  isOpen,
  onClose,
  product,
  artisan,
  onSubmitInquiry,
  language = 'en'
}) => {
  const [formData, setFormData] = useState<ProductInquiryData>({
    productId: product.id,
    productTitle: product.title,
    productImage: product.images[0] || '',
    artisanName: artisan.name,
    artisanId: artisan.id,
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    quantity: 1,
    customizationRequirements: '',
    message: '',
    neededByDate: '',
    inquiryType: 'Customization & Sizing'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitInquiry(formData);
    onClose();
  };

  const presetTopics = [
    'Customization & Sizing',
    'Custom Color / Motif Engraving',
    'Care & Seasoning Guidance',
    'Gift Note & Special Packaging',
    'Bulk / Corporate Craft Order'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/60 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-secondary/30 flex-shrink-0">
              <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h2 className="font-bold text-sm text-primary">
                  {language === 'ta'
                    ? `${artisan.name} அவர்களிடம் கேட்கவும்`
                    : language === 'hi'
                    ? `${artisan.name} से सीधा संवाद`
                    : `Inquire with ${artisan.name}`}
                </h2>
                <span className="material-symbols-outlined text-secondary text-[14px]">verified</span>
              </div>
              <p className="text-[10px] text-outline truncate max-w-[220px]">
                {language === 'ta' ? 'நேரடி கைவினைஞர் தொடர்பு' : language === 'hi' ? 'सीधे कारीगर को संदेश' : 'Direct Artisan Connection • Guaranteed Reply in 24h'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Product preview strip */}
        <div className="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/15 flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-outline-variant/20"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-primary truncate">{product.title}</h3>
            <p className="text-[11px] text-secondary font-semibold">
              ₹{product.price.toLocaleString('en-IN')}{' '}
              <span className="text-[10px] text-outline font-normal">• {product.category}</span>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
          {/* Preset Topics */}
          <div>
            <label className="font-bold text-primary block mb-1 text-[11px] uppercase tracking-wider">
              {language === 'ta' ? 'கேள்வி வகை' : language === 'hi' ? 'पूछताछ का विषय' : 'Topic of Inquiry'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presetTopics.map((topic) => (
                <button
                  type="button"
                  key={topic}
                  onClick={() => setFormData({ ...formData, inquiryType: topic })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    formData.inquiryType === topic
                      ? 'bg-secondary text-on-secondary shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Sender Info */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="font-bold text-primary block mb-1">
                {language === 'ta' ? 'உங்கள் பெயர் *' : language === 'hi' ? 'आपका नाम *' : 'Your Name *'}
              </label>
              <input
                required
                type="text"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                placeholder="e.g. Anita Roy"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-primary block mb-1">
                {language === 'ta' ? 'வாட்ஸ்அப் எண் *' : language === 'hi' ? 'व्हाट्सएप / फोन *' : 'WhatsApp / Phone *'}
              </label>
              <input
                required
                type="tel"
                value={formData.senderPhone}
                onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-primary block mb-1">
              {language === 'ta' ? 'மின்னஞ்சல்' : language === 'hi' ? 'ईमेल' : 'Email Address (Optional)'}
            </label>
            <input
              type="email"
              value={formData.senderEmail}
              onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
              placeholder="e.g. anita.roy@example.com"
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs"
            />
          </div>

          {/* Quantity & Needed By Date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-primary block mb-1">
                {language === 'ta' ? 'தேவைப்படும் எண்ணிக்கை *' : language === 'hi' ? 'मात्रा (संख्या) *' : 'Quantity Needed *'}
              </label>
              <div className="flex items-center bg-surface-container rounded-xl border border-outline-variant/30 px-2 py-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                  className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary active:scale-95"
                >
                  -
                </button>
                <input
                  required
                  type="number"
                  min={1}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full text-center bg-transparent border-none text-xs font-bold text-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                  className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-primary block mb-1">
                {language === 'ta' ? 'தேவைப்படும் தேதி' : language === 'hi' ? 'आवश्यकता की तिथि' : 'Needed By Date'}
              </label>
              <input
                type="date"
                value={formData.neededByDate}
                onChange={(e) => setFormData({ ...formData, neededByDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs text-on-surface"
              />
            </div>
          </div>

          {/* Customization Requirements */}
          <div>
            <label className="font-bold text-primary block mb-1">
              {language === 'ta' ? 'தனிப்பயனாக்க விவரங்கள் *' : language === 'hi' ? 'अनुकूलन आवश्यकताएँ *' : 'Customization Requirements *'}
            </label>
            <input
              type="text"
              required
              value={formData.customizationRequirements}
              onChange={(e) => setFormData({ ...formData, customizationRequirements: e.target.value })}
              placeholder="e.g. Dimensions, custom engraving, colors, unglazed base, or gift packaging"
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs"
            />
          </div>

          {/* Message */}
          <div>
            <label className="font-bold text-primary block mb-1">
              {language === 'ta' ? 'உங்கள் செய்தி *' : language === 'hi' ? 'आपका संदेश *' : 'Message to Artisan *'}
            </label>
            <textarea
              required
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={
                language === 'ta'
                  ? 'எ.கா. எனக்கு 3 லிட்டர் கொள்ளளவில் வேண்டும், அடுத்த வாரத்திற்குள் அனுப்ப முடியுமா?'
                  : language === 'hi'
                  ? 'उदा. क्या आप इसे थोड़े गहरे रंग में बना सकते हैं? मुझे 15 तारीख तक आवश्यकता है।'
                  : 'Describe your vision, timeline, questions about craft materials or request a personalized quote...'
              }
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs resize-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors"
            >
              {language === 'ta' ? 'ரத்து' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-secondary text-on-secondary font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>{language === 'ta' ? 'கேள்வியை அனுப்புக' : language === 'hi' ? 'पूछताछ भेजें' : 'Send to Artisan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
