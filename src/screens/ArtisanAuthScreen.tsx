import React from 'react';
import { Language, ScreenType, User } from '../types';
import { AuthScreen } from './AuthScreen';

interface ArtisanAuthScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (user: User, isNewUser?: boolean) => void;
  onShowToast: (msg: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const ArtisanAuthScreen: React.FC<ArtisanAuthScreenProps> = ({
  onNavigate,
  onLoginSuccess,
  onShowToast,
  language,
  onLanguageChange
}) => {
  return (
    <AuthScreen
      initialMode="login"
      initialRole="artisan"
      onNavigate={onNavigate}
      onLoginSuccess={onLoginSuccess}
      onShowToast={onShowToast}
      language={language}
      onLanguageChange={onLanguageChange}
    />
  );
};
