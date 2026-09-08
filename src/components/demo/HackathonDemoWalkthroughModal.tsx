/**
 * KalaConnect - Hackathon Demo Presentation & Walkthrough Modal
 * 
 * Optimized for a compelling 3 to 5 minute live pitch:
 * "Voice → AI → Professional Catalog → Offline Sync → Premium Marketplace"
 */

import React, { useState } from 'react';
import { DEMO_PERSONAS, DEMO_FLOW_STEPS, DemoPersona, DemoStoryStep } from '../../data/hackathonDemoData';
import { User, ScreenType, Language } from '../../types';

interface HackathonDemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  currentUser: User | null;
  onSelectPersona: (persona: DemoPersona) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  onTriggerSync: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onShowToast: (msg: string) => void;
}

export const HackathonDemoWalkthroughModal: React.FC<HackathonDemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  currentUser,
  onSelectPersona,
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  onTriggerSync,
  currentLanguage,
  onLanguageChange,
  onShowToast
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'personas' | 'quick-controls'>('walkthrough');

  if (!isOpen) return null;

  const currentStep: DemoStoryStep = DEMO_FLOW_STEPS[activeStepIndex];

  const handleJumpToStep = (index: number) => {
    setActiveStepIndex(index);
    const step = DEMO_FLOW_STEPS[index];
    const persona = DEMO_PERSONAS.find((p) => p.id === step.personaId);
    if (persona) {
      onSelectPersona(persona);
    }
    onNavigate(step.targetScreen as ScreenType);
    onShowToast(`Jumped to ${step.badge}: ${step.title}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-surface-container-lowest border border-secondary/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Strip */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-primary to-primary-container text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary/20 border border-secondary/40 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Hackathon Demo Mode
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-extrabold">
                  3–5 Min Pitch
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-white">
                KalaConnect Live Presentation Guide
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-outline-variant/30 px-4 pt-2 bg-surface-container-low text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('walkthrough')}
            className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'walkthrough'
                ? 'border-secondary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            5-Step Demo Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personas')}
            className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'personas'
                ? 'border-secondary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Switch Persona ({DEMO_PERSONAS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quick-controls')}
            className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'quick-controls'
                ? 'border-secondary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Simulation Toggles
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* TAB 1: 5-STEP WALKTHROUGH */}
          {activeTab === 'walkthrough' && (
            <div className="space-y-4">
              {/* Flow Timeline Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {DEMO_FLOW_STEPS.map((step, idx) => (
                  <button
                    key={step.stepNumber}
                    type="button"
                    onClick={() => handleJumpToStep(idx)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeStepIndex === idx
                        ? 'bg-secondary text-on-secondary shadow-xs scale-102'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span>{step.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Current Step Spotlight Card */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-secondary/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-[10px] font-extrabold uppercase tracking-wider">
                    {currentStep.badge}
                  </span>
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    Target: <strong className="text-primary">{currentStep.targetScreen}</strong>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-primary font-serif">
                    {currentStep.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {currentStep.tagline}
                  </p>
                </div>

                {/* Key Talking Points for Judges */}
                <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-1.5">
                  <div className="text-[11px] font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[16px]">record_voice_over</span>
                    <span>Talking Points for Pitch:</span>
                  </div>
                  <ul className="space-y-1 text-on-surface-variant list-disc pl-4 text-[11px]">
                    {currentStep.talkingPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* Jump to Step CTA Button */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleJumpToStep(activeStepIndex);
                      onClose();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-primary-container active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>{currentStep.actionText}</span>
                  </button>

                  {activeStepIndex < DEMO_FLOW_STEPS.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleJumpToStep(activeStepIndex + 1)}
                      className="px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="Next step in flow"
                    >
                      <span>Next</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Pitch Summary Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-[11px] text-amber-950 dark:text-amber-100">
                <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">emoji_objects</span>
                <div>
                  <strong>The Core Problem & KalaConnect Solution:</strong> 90% of traditional rural artisans are excluded from digital e-commerce due to language & text forms. KalaConnect bridges them from unscripted voice directly to global fair trade with zero false claims and offline resilience.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SWITCH PERSONA */}
          {activeTab === 'personas' && (
            <div className="space-y-3">
              <p className="text-on-surface-variant text-[11px]">
                Switch user accounts instantly to demonstrate multi-role capabilities (Artisan, Buyer, B2B Buyer, Admin):
              </p>

              <div className="space-y-2.5">
                {DEMO_PERSONAS.map((persona) => {
                  const isActive = currentUser?.role === persona.role && (
                    persona.role !== 'buyer' ||
                    (currentUser?.name?.includes(persona.name.split(' ')[0]))
                  );

                  return (
                    <div
                      key={persona.id}
                      className={`p-3 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-secondary/10 border-secondary ring-1 ring-secondary/30'
                          : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={persona.avatar}
                          alt={persona.name}
                          className="w-10 h-10 rounded-full object-cover border border-secondary/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-primary truncate">
                              {persona.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded-md bg-surface-container-high text-[9px] font-extrabold uppercase text-secondary">
                              {persona.role}
                            </span>
                          </div>
                          <div className="text-[10px] text-on-surface-variant truncate">
                            {persona.title} • {persona.location}
                          </div>
                          <div className="text-[10px] text-secondary font-medium truncate mt-0.5">
                            {persona.highlights.join(' • ')}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectPersona(persona);
                          onNavigate(persona.suggestedStartingScreen as ScreenType);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-primary text-on-primary hover:bg-primary-container'
                        }`}
                      >
                        {isActive ? 'Active' : 'Switch & Open'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: QUICK CONTROLS & SIMULATION */}
          {activeTab === 'quick-controls' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
                <div className="font-bold text-xs text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">wifi_tethering</span>
                  <span>Network Connectivity Simulation</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold">
                      Current Status: <span className={isOnline ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                        {isOnline ? 'Online (Direct Cloud Connect)' : 'Offline (Local Storage Engine)'}
                      </span>
                    </div>
                    <div className="text-[10px] text-on-surface-variant">
                      Toggle to demonstrate local draft saving and auto-sync queue.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleOnline}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isOnline
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isOnline ? 'Go Offline' : 'Go Online'}
                  </button>
                </div>
              </div>

              {/* Sync Queue Action */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary">sync</span>
                    <span>Pending Sync Operations</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-[10px] font-extrabold text-primary">
                    {pendingSyncCount} in Queue
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Items created offline wait in the local queue and sync reliably when the network reconnects.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onTriggerSync();
                    onShowToast('Sync triggered successfully');
                  }}
                  disabled={pendingSyncCount === 0}
                  className="w-full py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  Force Process Sync Queue
                </button>
              </div>

              {/* Language Quick Switcher */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="font-bold text-xs text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">translate</span>
                  <span>Active Display Language</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'ta', label: 'தமிழ்' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(l.code as Language);
                        onShowToast(`Language switched to ${l.label}`);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentLanguage === l.code
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>KalaConnect • Built for National Hackathon</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
