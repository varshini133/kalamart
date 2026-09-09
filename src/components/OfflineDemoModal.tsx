import React, { useState } from 'react';
import { offlineSyncService } from '../services/offlineSyncService';
import { Language } from '../types';
import { getTranslations } from '../services/localizationService';

interface OfflineDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onShowToast: (msg: string) => void;
  onViewProduct?: () => void | ((productId: string) => void);
}

export const OfflineDemoModal: React.FC<OfflineDemoModalProps> = ({
  isOpen,
  onClose,
  language,
  onShowToast,
  onViewProduct
}) => {
  const t = getTranslations(language);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepDetail, setStepDetail] = useState<string>('');
  const [demoProdId, setDemoProdId] = useState<string | null>(null);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Online → Create Product',
      icon: 'cloud_done',
      desc: 'Verify online connectivity and publish initial craft to marketplace'
    },
    {
      step: 2,
      title: 'Turn Simulated Offline Mode ON',
      icon: 'wifi_off',
      desc: 'Simulate losing internet connection in a rural artisan village'
    },
    {
      step: 3,
      title: 'Create Product Draft Offline',
      icon: 'edit_note',
      desc: 'Artisan enters specifications, craft pricing, and captures voice audio metadata'
    },
    {
      step: 4,
      title: 'Show Local Save',
      icon: 'save',
      desc: 'Draft saved in local device storage with "Saved locally" / "Waiting to sync" status'
    },
    {
      step: 5,
      title: 'Turn Online Mode ON',
      icon: 'wifi',
      desc: 'Internet returns. App automatically detects network connectivity'
    },
    {
      step: 6,
      title: 'Automatic Synchronization',
      icon: 'sync',
      desc: 'Auto-sync uploads pending queue items with timestamp conflict resolution'
    }
  ];

  const handleRunFullDemo = async () => {
    setIsRunning(true);
    setCurrentStep(1);

    try {
      const res = await offlineSyncService.runDemoMode({
        onStepChange: (stepNum, stepTitle, detail) => {
          setCurrentStep(stepNum);
          setStepDetail(`${stepTitle}: ${detail}`);
        }
      });

      if (res.demoProductId) {
        setDemoProdId(res.demoProductId);
      }

      onShowToast('All changes synced successfully. Offline demo completed!');
    } catch (err: any) {
      onShowToast(`Demo paused: ${err?.message || 'Error running demo'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg bg-surface rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-primary/15 via-secondary/10 to-surface-container-low border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-primary">{t.offlineDemoTitle}</h3>
                <span className="px-2 py-0.2 rounded-full bg-secondary/20 text-secondary text-[10px] font-extrabold uppercase">
                  Interactive
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                {t.offlineDemoSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Current Step Banner */}
        <div className="p-3.5 bg-surface-container-lowest border-b border-outline-variant/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-secondary">alt_route</span>
              <span>
                {currentStep === 0
                  ? 'Ready to run demonstration'
                  : `Demonstrating Step ${currentStep} of 6`}
              </span>
            </span>
            {isRunning && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 text-[10px] font-bold animate-pulse flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
                <span>In Progress</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-on-surface-variant font-medium">
            {stepDetail || 'Simulates how traditional artisans in remote craft clusters continue cataloging without connectivity.'}
          </p>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {steps.map((st) => {
            const isCurrent = currentStep === st.step;
            const isCompleted = currentStep > st.step;

            return (
              <div
                key={st.step}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-secondary/10 border-secondary shadow-xs scale-[1.01]'
                    : isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-surface-container-lowest border-outline-variant/20 opacity-80'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isCurrent
                      ? 'bg-secondary text-on-secondary animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-[17px]">check</span>
                  ) : (
                    <span>{st.step}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs font-bold ${isCurrent ? 'text-secondary' : isCompleted ? 'text-emerald-800 dark:text-emerald-300' : 'text-primary'}`}>
                      {st.title}
                    </h4>
                    {isCurrent && (
                      <span className="material-symbols-outlined text-[15px] text-secondary animate-spin">
                        progress_activity
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            id="btn-start-auto-demo"
            onClick={handleRunFullDemo}
            disabled={isRunning}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-all ${
              isRunning
                ? 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'
                : 'bg-primary text-on-primary hover:opacity-90 cursor-pointer active:scale-95'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isRunning ? 'animate-spin' : ''}`}>
              {isRunning ? 'sync' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Running Live Demo...' : t.startInteractiveDemo}</span>
          </button>

          {currentStep === 6 && demoProdId && onViewProduct && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewProduct(demoProdId);
              }}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>View Synced Product</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-xs font-bold transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
