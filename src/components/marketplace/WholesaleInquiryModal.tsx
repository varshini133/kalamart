import React, { useState } from 'react';
import { Language } from '../../types';

interface WholesaleInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WholesaleInquiryData) => void;
  language?: Language;
}

export interface WholesaleInquiryData {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  organizationType: string;
  estimatedQuantity: string;
  craftCategory: string;
  notes: string;
}

export const WholesaleInquiryModal: React.FC<WholesaleInquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  language = 'en'
}) => {
  const [formData, setFormData] = useState<WholesaleInquiryData>({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    organizationType: 'Boutique Hotel & Resorts',
    estimatedQuantity: '25-50 units',
    craftCategory: 'Pottery & Home Decor',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/60 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-secondary">inventory_2</span>
            <div>
              <h2 className="font-bold text-base text-primary">
                {language === 'ta'
                  ? 'மொத்த கொள்முதல் கோரிக்கை'
                  : language === 'hi'
                  ? 'थोक खरीद एवं कैटलॉग अनुरोध'
                  : 'Direct Wholesale & Bulk Sourcing'}
              </h2>
              <p className="text-[11px] text-outline">
                {language === 'ta'
                  ? 'கைவினைஞர் கூட்டுறவுகளிடமிருந்து நேரடி விலைப்பட்டியல்'
                  : language === 'hi'
                  ? 'कारीगर समूहों से सीधे कोटेशन और नमूना सहायता'
                  : 'Direct cluster quotations, samples & custom story cards'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
          <div>
            <label className="font-bold text-primary block mb-1">
              {language === 'ta' ? 'வணிக / நிறுவனத்தின் பெயர் *' : language === 'hi' ? 'संस्था / कंपनी का नाम *' : 'Company / Business Name *'}
            </label>
            <input
              required
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g. Anantara Heritage Resorts"
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-primary block mb-1">
                {language === 'ta' ? 'தொடர்பு நபர் *' : language === 'hi' ? 'संपर्क व्यक्ति *' : 'Contact Person *'}
              </label>
              <input
                required
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-primary block mb-1">
                {language === 'ta' ? 'தொலைபேசி எண் *' : language === 'hi' ? 'फोन नंबर *' : 'Phone / WhatsApp *'}
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-primary block mb-1">
              {language === 'ta' ? 'நிறுவன வகை' : language === 'hi' ? 'व्यापार प्रकार' : 'Organization Type'}
            </label>
            <select
              value={formData.organizationType}
              onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs text-on-surface"
            >
              <option value="Boutique Hotel & Resorts">Boutique Hotel & Resorts</option>
              <option value="Corporate Gifting & Events">Corporate Gifting & Events</option>
              <option value="Interior Architecture & Design">Interior Architecture & Design</option>
              <option value="Ethical Retail & Boutique">Ethical Retail & Boutique</option>
              <option value="International Export">International Export</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-primary block mb-1">
                {language === 'ta' ? 'தேவைப்படும் அளவு' : language === 'hi' ? 'अनुमानित मात्रा' : 'Estimated Volume'}
              </label>
              <select
                value={formData.estimatedQuantity}
                onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs text-on-surface"
              >
                <option value="10-25 units (Sampling)">10-25 units (Sampling)</option>
                <option value="25-50 units">25-50 units</option>
                <option value="50-200 units">50-200 units</option>
                <option value="200+ units (Custom Run)">200+ units (Custom Run)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-primary block mb-1">
                {language === 'ta' ? 'விருப்பமான கலை' : language === 'hi' ? 'शिल्प श्रेणी' : 'Craft Category'}
              </label>
              <select
                value={formData.craftCategory}
                onChange={(e) => setFormData({ ...formData, craftCategory: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs text-on-surface"
              >
                <option value="Pottery & Terracotta">Pottery & Terracotta</option>
                <option value="Handloom & Textiles">Handloom & Textiles</option>
                <option value="Dhokra & Bell Metal">Dhokra & Bell Metal</option>
                <option value="Wood Carving & Decor">Wood Carving & Decor</option>
                <option value="Traditional Folk Art">Traditional Folk Art</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-primary block mb-1">
              {language === 'ta' ? 'கூடுதல் குறிப்புகள் / தனிப்பயனாக்கம்' : language === 'hi' ? 'कस्टम आवश्यकताएं' : 'Custom Branding / Notes (Optional)'}
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Need custom logo emboss on packaging and dispatch by next month..."
              className="w-full px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 focus:border-secondary focus:outline-none text-xs resize-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-surface-container text-primary font-bold text-xs"
            >
              {language === 'ta' ? 'ரத்து' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-secondary text-on-secondary font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              {language === 'ta' ? 'கோரிக்கையை அனுப்புக' : language === 'hi' ? 'पूछताछ भेजें' : 'Send Bulk Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
