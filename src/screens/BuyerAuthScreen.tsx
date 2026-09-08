import React from 'react';
import { Language, ScreenType, User } from '../types';
import { AuthScreen } from './AuthScreen';

interface BuyerAuthScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (user: User, isNewUser?: boolean) => void;
  onShowToast: (msg: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const BuyerAuthScreen: React.FC<BuyerAuthScreenProps> = ({
  onNavigate,
  onLoginSuccess,
  onShowToast,
  language,
  onLanguageChange
}) => {
  return (
    <AuthScreen
      initialMode="login"
      initialRole="buyer"
      onNavigate={onNavigate}
      onLoginSuccess={onLoginSuccess}
      onShowToast={onShowToast}
      language={language}
      onLanguageChange={onLanguageChange}
    />
  );
};
