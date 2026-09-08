import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getTranslations } from '../services/localizationService';

interface AudioAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectAction: (action: string) => void;
}

export const AudioAssistantModal: React.FC<AudioAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectAction
}) => {
  const t = getTranslations(language);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setTranscript(
        language === 'ta'
          ? 'வணக்கம்! கச்சின் மண்பாண்டங்கள், கைவினைஞர்கள் அல்லது ஆர்டர்கள் குறித்து கேட்கலாம்...'
          : language === 'hi'
          ? 'नमस्ते! आप कच्छ की मिट्टी के बर्तन या नए ऑर्डर के बारे में पूछ सकते हैं...'
          : 'Listening... Ask about GI certified crafts, artisan stories, or cataloging.'
      );
      setAssistantResponse('');
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleSimulateVoice = (query: string, response: string, actionKey?: string) => {
    setIsListening(false);
    setTranscript(query);
    setAssistantResponse(response);
    if (actionKey) {
      setTimeout(() => {
        onSelectAction(actionKey);
      }, 1800);
    }
  };

  const suggestions = language === 'ta'
    ? [
        {
          label: 'கச்சின் மண்பாண்டங்களைக் காட்டு',
          response: 'ராம்தேவ் கும்ஹாரின் கைவண்ணத்தில் உருவான புவிசார் குறியீடு பெற்ற களிமண் பொருட்கள் திறக்கப்படுகின்றன.',
          action: 'open-kutch'
        },
        {
          label: 'புதிய கைவினைப் பொருளைக் குரல் மூலம் சேர்க்கவும்',
          response: 'புதிய கைவினைப் பட்டியலிடல் பகுதி திறக்கப்படுகிறது.',
          action: 'open-cataloging'
        },
        {
          label: 'எனது ஆர்டரின் நிலை என்ன?',
          response: 'ஆர்டர் எண் #KM-8092 நாளை புளூடார்ட் மூலம் அனுப்ப திட்டமிடப்பட்டுள்ளது.',
          action: 'open-orders'
        }
      ]
    : language === 'hi'
    ? [
        {
          label: 'कच्छ के मिट्टी के बर्तन दिखाएं',
          response: 'रामदेव कुम्हार द्वारा भुज में निर्मित प्रामाणिक जीआई टैग वाले कलश और बर्तन खोजे जा रहे हैं।',
          action: 'open-kutch'
        },
        {
          label: 'नया उत्पाद बोलकर जोड़ें',
          response: 'फोटो स्कैनिंग और वॉयस कैटलॉगिंग के लिए एआई स्मार्ट स्टूडियो खोला जा रहा है।',
          action: 'open-cataloging'
        },
        {
          label: 'कल के पार्सल का समय क्या है?',
          response: 'ऑर्डर #KM-8092 के लिए कूरियर पिकअप कल सुबह 11:00 बजे निर्धारित है।',
          action: 'open-orders'
        }
      ]
    : [
        {
          label: 'Show Kutch Terracotta Claywork',
          response: 'Finding authentic GI-tagged Kutch Kalash pitchers handcrafted by Ramdev Kumbhar in Bhuj.',
          action: 'open-kutch'
        },
        {
          label: 'Add new product via voice',
          response: 'Launching AI Voice Cataloging for photo upload and spoken craft description.',
          action: 'open-cataloging'
        },
        {
          label: 'What is my parcel pickup schedule?',
          response: 'Blue Dart pickup scheduled for tomorrow at 11:00 AM for order #KM-8092.',
          action: 'open-orders'
        }
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-primary text-on-primary rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-secondary/30">
        {/* Glow backdrop */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-secondary/30 blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between relative z-10 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping"></span>
            <span className="font-bold text-xs uppercase tracking-wider text-secondary-fixed">
              {t.voiceCatalogingTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-primary-container text-tertiary-fixed flex items-center justify-center hover:bg-surface-container active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Central Waveform Visualizer */}
        <div className="bg-primary-container/80 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 relative z-10 border border-secondary/20">
          <div className="flex items-center gap-1.5 h-12">
            {[4, 8, 12, 6, 14, 18, 10, 16, 8, 14, 6, 10].map((h, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-full ${isListening ? 'bg-secondary-container animate-pulse' : 'bg-secondary'}`}
                style={{
                  height: `${h * 2}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-tertiary-fixed-dim font-medium">
            <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
            <span>{isListening ? t.listeningInNativeTongue : t.voiceQueryProcessed}</span>
          </div>
        </div>

        {/* Speech Transcript Output */}
        <div className="mt-4 p-3 bg-primary-container/40 rounded-xl relative z-10 text-xs">
          <span className="font-bold text-tertiary-fixed text-[11px] block mb-1">
            {t.liveSpeechInput}:
          </span>
          <p className="italic text-surface-bright leading-relaxed">
            "{transcript}"
          </p>
        </div>

        {/* AI Answer Card */}
        {assistantResponse && (
          <div className="mt-3 p-3 bg-secondary/20 rounded-xl border border-secondary/40 text-xs relative z-10 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-secondary-fixed font-bold text-[11px] mb-1">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span>{t.smartAdvisor}:</span>
            </div>
            <p className="text-surface-bright leading-relaxed">
              {assistantResponse}
            </p>
          </div>
        )}

        {/* Quick Voice Suggestions */}
        <div className="mt-4 relative z-10 space-y-2">
          <span className="text-[10px] text-primary-fixed-dim uppercase tracking-wider font-semibold block">
            {t.tapToSpeakSuggested}:
          </span>
          <div className="flex flex-col gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulateVoice(s.label, s.response, s.action)}
                className="text-left px-3 py-2 rounded-xl bg-primary-container hover:bg-surface-container-high/30 text-xs text-on-primary flex items-center justify-between active:scale-98 transition-all"
              >
                <span>"{s.label}"</span>
                <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
