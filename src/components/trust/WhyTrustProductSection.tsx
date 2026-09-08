import React, { useState } from 'react';
import { Product } from '../../types';
import { trustService } from '../../services/trustService';
import { TrustBadgesRow } from './TrustBadgesRow';

interface WhyTrustProductSectionProps {
  product: Product;
  language?: string;
}

export const WhyTrustProductSection: React.FC<WhyTrustProductSectionProps> = ({
  product,
  language = 'en'
}) => {
  const [showAuditModal, setShowAuditModal] = useState(false);
  const trustDetails = trustService.getProductTrustDetails(product);

  const isTa = language === 'ta';
  const isHi = language === 'hi';

  const sectionTitle = isTa
    ? 'இந்த தயாரிப்பை ஏன் நம்ப வேண்டும்?'
    : isHi
    ? 'इस उत्पाद पर भरोसा क्यों करें?'
    : 'Why trust this product?';

  const sectionSubtitle = isTa
    ? 'சரிபார்க்கப்பட்ட கைவினைஞர் சான்றுகள் மற்றும் கைமுறை உற்பத்தி உத்தரவாதம்'
    : isHi
    ? 'सत्यापित कारीगर साख एवं हस्तनिर्मित उत्पादन गारंटी'
    : 'Transparent provenance, artisan verification, and curated craft audit';

  return (
    <section className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-secondary text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>KalaConnect Trust & Authenticity</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-serif text-primary leading-tight">
            {sectionTitle}
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {sectionSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAuditModal(true)}
          className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-[11px] font-bold border border-outline-variant/30 transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[13px] text-secondary">policy</span>
          <span>View Audit</span>
        </button>
      </div>

      {/* Subtle Trust Badges Row */}
      {trustDetails.badges.length > 0 && (
        <div className="pt-1 pb-1">
          <TrustBadgesRow badges={trustDetails.badges} size="md" interactive={true} />
        </div>
      )}

      {/* 4 Verified Information Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {trustDetails.whyTrustItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-2xl border transition-all ${
              item.verified
                ? 'bg-surface-container/60 border-outline-variant/30 text-on-surface'
                : 'bg-surface-container-low/40 border-outline-variant/20 text-on-surface-variant opacity-80'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  item.verified
                    ? 'bg-secondary/15 text-secondary'
                    : 'bg-surface-container text-outline'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {item.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-xs text-primary">{item.title}</span>
                  {item.verified ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[11px]">check</span>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[10px] font-medium">
                      In Review
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scalable Official Program Integration & Responsible Notice */}
      <div className="p-3 rounded-2xl bg-surface-container/50 border border-outline-variant/20 flex items-start gap-2.5 text-[11px] text-on-surface-variant">
        <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
          account_balance
        </span>
        <div className="space-y-0.5">
          <span className="font-bold text-primary block">
            Official Craft Verification Program (Integration Ready)
          </span>
          <p className="leading-relaxed">
            KalaConnect is architected for prospective integration with recognized regional and national craft registries. We verify individual artisan declarations, cluster records, and workshop proofs without making false or unsubstantiated statutory certification claims.
          </p>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {showAuditModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowAuditModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-outline-variant/20 pb-3">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-secondary uppercase tracking-wider mb-0.5">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>Authenticity Audit Log</span>
                </div>
                <h3 className="font-bold text-base text-primary">
                  {product.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Artisan: {product.artisanName} · {product.artisanLocation}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-surface-container-high transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Verification Level Status Stepper */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-outline">
                Artisan Verification Level: Level {trustDetails.verificationLevel} of 4
              </h4>

              <div className="grid grid-cols-4 gap-1 text-center">
                {[
                  { lvl: 1, name: 'Profile' },
                  { lvl: 2, name: 'Contact' },
                  { lvl: 3, name: 'Artisan' },
                  { lvl: 4, name: 'Craft' }
                ].map((s) => {
                  const isCompleted = trustDetails.verificationLevel >= s.lvl;
                  return (
                    <div
                      key={s.lvl}
                      className={`p-2 rounded-xl border text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-secondary/15 border-secondary/40 text-secondary'
                          : 'bg-surface-container border-outline-variant/20 text-outline'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-0.5 mb-0.5">
                        <span className="material-symbols-outlined text-[12px]">
                          {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span>L{s.lvl}</span>
                      </div>
                      <span className="truncate block">{s.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submitted Documentation Summary */}
            {trustDetails.profile?.submittedDocuments && trustDetails.profile.submittedDocuments.length > 0 && (
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-outline">
                  Reviewed Documentation & Provenance
                </h4>
                <div className="space-y-1.5">
                  {trustDetails.profile.submittedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">
                          description
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-primary block truncate">{doc.title}</span>
                          <span className="text-[10px] text-outline">{doc.fileHint || doc.type}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviewer Notes if available */}
            {trustDetails.profile?.adminNotes && (
              <div className="p-3 rounded-2xl bg-surface-container border border-outline-variant/20 space-y-1 text-xs">
                <span className="font-bold text-primary block text-[11px] uppercase tracking-wider">
                  Curator Verification Note:
                </span>
                <p className="text-[11px] text-on-surface-variant italic">
                  "{trustDetails.profile.adminNotes}"
                </p>
              </div>
            )}

            {/* Responsible Trust Declaration */}
            <div className="text-[11px] text-outline space-y-1 border-t border-outline-variant/20 pt-3">
              <p>
                <strong>Ethical Authenticity Guarantee:</strong> KalaConnect prohibits machine-made counterfeit imitations. Inquiries or re-verification requests may be reported to the platform trust desk.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
