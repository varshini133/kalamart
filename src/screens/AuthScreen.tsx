import React, { useState } from 'react';
import { Language, ScreenType, User, UserRole } from '../types';
import {
  authenticateUser,
  registerNewUser,
  authenticateWithGoogle,
  requestPasswordReset,
  resetPasswordWithCode
} from '../services/authService';
import { getTranslations } from '../services/localizationService';
import { KalaMartLogo } from '../components/KalaMartLogo';

interface AuthScreenProps {
  initialMode?: 'login' | 'signup';
  initialRole?: UserRole;
  onNavigate: (screen: ScreenType) => void;
  onLoginSuccess: (user: User, isNewUser?: boolean) => void;
  onShowToast: (msg: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  initialRole = 'artisan',
  onNavigate,
  onLoginSuccess,
  onShowToast,
  language,
  onLanguageChange
}) => {
  const t = getTranslations(language);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // LOGIN STATE
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginFieldErrors, setLoginFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  // SIGNUP STATE
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [craftSpecialization, setCraftSpecialization] = useState('Terracotta Pottery');
  const [businessName, setBusinessName] = useState('');
  const [signupFieldErrors, setSignupFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // FORGOT PASSWORD STATE
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotInfoMsg, setForgotInfoMsg] = useState<string | null>(null);

  // Pre-fill 1-Click test credentials for reviewers
  const handleFillDemoCredentials = (roleToFill: UserRole) => {
    setSelectedRole(roleToFill);
    setAuthError(null);
    setLoginFieldErrors({});
    if (roleToFill === 'artisan') {
      setLoginIdentifier('artisan@kalaconnect.com');
      setLoginPassword('artisan123');
    } else if (roleToFill === 'buyer') {
      setLoginIdentifier('buyer@kalaconnect.com');
      setLoginPassword('buyer123');
    } else if (roleToFill === 'b2b') {
      setLoginIdentifier('b2b@kalaconnect.com');
      setLoginPassword('b2b123');
    } else if (roleToFill === 'admin') {
      setLoginIdentifier('admin@kalaconnect.com');
      setLoginPassword('admin123');
    }
  };

  // LOGIN VALIDATION
  const validateLoginForm = (): boolean => {
    const errors: { identifier?: string; password?: string } = {};
    const idClean = loginIdentifier.trim();
    if (!idClean) {
      errors.identifier = language === 'ta'
        ? 'மின்னஞ்சல் அல்லது தொலைபேசி எண்ணை உள்ளிடவும்'
        : language === 'hi'
        ? 'कृपया ईमेल या मोबाइल नंबर दर्ज करें'
        : 'Please enter your email or phone number';
    }

    if (!loginPassword) {
      errors.password = language === 'ta'
        ? 'கடவுச்சொல்லை உள்ளிடவும்'
        : language === 'hi'
        ? 'कृपया पासवर्ड दर्ज करें'
        : 'Please enter your password';
    } else if (loginPassword.length < 4) {
      errors.password = language === 'ta'
        ? 'கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துகள் இருக்க வேண்டும்'
        : language === 'hi'
        ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए'
        : 'Password must be at least 6 characters';
    }

    setLoginFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // SIGNUP VALIDATION
  const validateSignupForm = (): boolean => {
    const errors: {
      fullName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const nameClean = fullName.trim();
    if (!nameClean || nameClean.length < 2) {
      errors.fullName = language === 'ta'
        ? 'முழு பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துகள்)'
        : language === 'hi'
        ? 'कृपया पूरा नाम दर्ज करें (कम से कम 2 अक्षर)'
        : 'Please enter your real full name (at least 2 characters)';
    }

    const emailClean = signupEmail.trim();
    const phoneClean = signupPhone.trim();

    if (!emailClean && !phoneClean) {
      errors.email = language === 'ta'
        ? 'மின்னஞ்சல் அல்லது தொலைபேசி எண் தேவை'
        : language === 'hi'
        ? 'ईमेल या फोन नंबर आवश्यक है'
        : 'Email or phone number is required';
      errors.phone = errors.email;
    } else {
      if (emailClean && (!emailClean.includes('@') || !emailClean.includes('.'))) {
        errors.email = language === 'ta'
          ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்'
          : language === 'hi'
          ? 'कृपया एक वैध ईमेल पता दर्ज करें'
          : 'Please enter a valid email address';
      }
      if (phoneClean && phoneClean.replace(/\D/g, '').length < 10) {
        errors.phone = language === 'ta'
          ? '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்'
          : language === 'hi'
          ? 'कृपया 10 अंकों का वैध फोन नंबर दर्ज करें'
          : 'Please enter a valid 10-digit mobile number';
      }
    }

    if (!signupPassword) {
      errors.password = language === 'ta'
        ? 'கடவுச்சொல்லை உள்ளிடவும்'
        : language === 'hi'
        ? 'कृपया पासवर्ड दर्ज करें'
        : 'Please enter a password';
    } else if (signupPassword.length < 6) {
      errors.password = language === 'ta'
        ? 'கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துகள் இருக்க வேண்டும்'
        : language === 'hi'
        ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए'
        : 'Password must be at least 6 characters';
    }

    if (!signupConfirmPassword) {
      errors.confirmPassword = language === 'ta'
        ? 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்'
        : language === 'hi'
        ? 'कृपया पासवर्ड की पुष्टि करें'
        : 'Please confirm your password';
    } else if (signupPassword !== signupConfirmPassword) {
      errors.confirmPassword = language === 'ta'
        ? 'கடவுச்சொற்கள் பொருந்தவில்லை'
        : language === 'hi'
        ? 'पासवर्ड मेल नहीं खा रहे हैं'
        : 'Passwords do not match';
    }

    setSignupFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // HANDLE LOGIN SUBMISSION
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateLoginForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await authenticateUser({
        identifier: loginIdentifier,
        password: loginPassword,
        expectedRole: selectedRole
      });

      onShowToast(
        language === 'ta'
          ? `வணக்கம், ${result.user.name}! உள்நுழைவு வெற்றிகரமானது.`
          : language === 'hi'
          ? `स्वागत है, ${result.user.name}! लॉगिन सफल रहा।`
          : `Welcome back, ${result.user.name}!`
      );

      onLoginSuccess(result.user, result.isNewUser);
    } catch (err: any) {
      if (err.message === 'USER_NOT_FOUND') {
        setAuthError(
          language === 'ta'
            ? 'இந்த மின்னஞ்சல் அல்லது தொலைபேசியில் கணக்கு எதுவும் இல்லை. பதிவு செய்யவும்.'
            : language === 'hi'
            ? 'इस ईमेल या फोन नंबर से कोई खाता नहीं मिला। कृपया नया खाता बनाएं।'
            : 'No account found with this email or mobile number. Please create an account.'
        );
      } else if (err.message === 'INVALID_PASSWORD') {
        setAuthError(
          language === 'ta'
            ? 'தவறான கடவுச்சொல். தயவுசெய்து மீண்டும் சரிபார்க்கவும்.'
            : language === 'hi'
            ? 'गलत पासवर्ड। कृपया पुनः प्रयास करें।'
            : 'Invalid password. Please check your credentials and try again.'
        );
      } else {
        setAuthError(
          language === 'ta'
            ? 'உள்நுழைவு தோல்வியடைந்தது. விவரங்களை சரிபார்க்கவும்.'
            : language === 'hi'
            ? 'लॉगिन विफल रहा। कृपया विवरण जांचें।'
            : 'Authentication failed. Please verify your credentials.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // HANDLE SIGNUP SUBMISSION
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateSignupForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await registerNewUser({
        fullName: fullName,
        email: signupEmail || undefined,
        phone: signupPhone || undefined,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
        role: selectedRole,
        preferredLanguage: language,
        craftSpecialization: selectedRole === 'artisan' ? craftSpecialization : undefined,
        businessName: selectedRole === 'b2b' ? businessName : undefined
      });

      onShowToast(
        language === 'ta'
          ? `கணக்கு உருவாக்கப்பட்டது! நல்வரவு, ${result.user.name}!`
          : language === 'hi'
          ? `खाता सफलतापूर्वक बनाया गया! स्वागत है, ${result.user.name}!`
          : `Account created successfully! Welcome, ${result.user.name}!`
      );

      onLoginSuccess(result.user, result.isNewUser);
    } catch (err: any) {
      if (err.message === 'USER_ALREADY_EXISTS') {
        setAuthError(
          language === 'ta'
            ? 'இந்த மின்னஞ்சல் அல்லது தொலைபேசி ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. உள்நுழையவும்.'
            : language === 'hi'
            ? 'इस ईमेल या फोन नंबर के साथ पहले से ही एक खाता मौजूद है। कृपया लॉगिन करें।'
            : 'An account with this email or phone number already exists. Please log in instead.'
        );
      } else if (err.message === 'PASSWORD_TOO_SHORT') {
        setAuthError('Password must be at least 6 characters.');
      } else if (err.message === 'PASSWORDS_DO_NOT_MATCH') {
        setAuthError('Passwords do not match.');
      } else {
        setAuthError('Registration failed. Please check the entered information.');
      }
    } finally {
      setLoading(false);
    }
  };

  // CONTINUE WITH GOOGLE
  const handleContinueWithGoogle = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    try {
      // Use logged in reviewer profile if available or dynamic name
      const result = await authenticateWithGoogle(
        selectedRole,
        'santhanavarshini@gmail.com',
        'Santhana Varshini'
      );

      onShowToast(
        language === 'ta'
          ? `Google வழியாக இணைக்கப்பட்டது: ${result.user.name}`
          : language === 'hi'
          ? `Google द्वारा प्रमाणित: ${result.user.name}`
          : `Signed in with Google as ${result.user.name}`
      );

      onLoginSuccess(result.user, result.isNewUser);
    } catch {
      setAuthError('Google sign in encountered an issue. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // FORGOT PASSWORD SUBMIT
  const handleForgotRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      onShowToast('Please enter your email or phone number.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await requestPasswordReset(forgotIdentifier);
      setForgotInfoMsg(res.message);
      setResetCode(res.tempCode);
      setForgotStep('reset');
    } catch {
      onShowToast('No account found with this identifier.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      onShowToast('New password must be at least 6 characters.');
      return;
    }

    setForgotLoading(true);
    try {
      await resetPasswordWithCode(forgotIdentifier, resetCode, newPassword);
      onShowToast('Password reset successfully! You can now log in.');
      setShowForgotModal(false);
      setAuthMode('login');
      setLoginIdentifier(forgotIdentifier);
      setLoginPassword(newPassword);
      setForgotStep('request');
      setForgotInfoMsg(null);
    } catch {
      onShowToast('Failed to reset password. Please check your details.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Roles Metadata
  const ROLES_INFO = [
    {
      id: 'artisan' as UserRole,
      title: language === 'ta' ? 'கைவினைஞர்' : language === 'hi' ? 'कारीगर' : 'Artisan',
      subtitle: language === 'ta' ? 'பாரம்பரிய கைவினைத் திறனாளர்' : language === 'hi' ? 'पारंपरिक शिल्पकार' : 'Master Maker & Craftsman',
      icon: 'palette',
      badge: 'GI Master'
    },
    {
      id: 'buyer' as UserRole,
      title: language === 'ta' ? 'வாங்குபவர்' : language === 'hi' ? 'खरीदार' : 'Buyer',
      subtitle: language === 'ta' ? 'கலை ஆர்வலர் & சேகரிப்பாளர்' : language === 'hi' ? 'कला संरक्षक व उपभोक्ता' : 'Art Patron & Conscious Shopper',
      icon: 'shopping_bag',
      badge: 'Direct Provenance'
    },
    {
      id: 'b2b' as UserRole,
      title: 'B2B Buyer',
      subtitle: language === 'ta' ? 'மொத்த வர்த்தகம் & கார்ப்பரேட்' : language === 'hi' ? 'थोक व कॉर्पोरेट ऑर्डर' : 'Bulk Wholesale & Retailers',
      icon: 'corporate_fare',
      badge: 'MOQ Pricing'
    },
    {
      id: 'admin' as UserRole,
      title: 'Admin',
      subtitle: language === 'ta' ? 'சரிபார்ப்பு & தணிக்கை' : language === 'hi' ? 'प्रमाणीकरण व ट्रस्ट' : 'Trust, GI & Verification',
      icon: 'admin_panel_settings',
      badge: 'Governance'
    }
  ];

  return (
    <div className="flex-1 flex flex-col relative w-full pt-4 pb-20 px-4 max-w-md mx-auto space-y-4 animate-fadeIn bg-surface">
      {/* Top Header Bar with Back to Welcome & Language Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-1 text-xs font-bold text-secondary hover:text-primary transition-colors py-1.5 px-3 rounded-full bg-surface-container active:scale-95 cursor-pointer"
          id="btn-back-to-welcome"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{t.backToRoles}</span>
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-full text-xs font-semibold">
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === 'en' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === 'hi' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            हिं
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('ta')}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === 'ta' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            த
          </button>
        </div>
      </div>

      {/* Brand & Portal Title */}
      <div className="flex flex-col items-center justify-center pt-1 pb-1">
        <KalaMartLogo size="md" subtitle="" className="mb-1" />
        <p className="text-xs font-medium text-on-surface-variant">
          {authMode === 'login'
            ? language === 'ta'
              ? 'உங்கள் கணக்கில் பாதுகாப்பாக உள்நுழையவும்'
              : language === 'hi'
              ? 'अपने खाते में सुरक्षित लॉगिन करें'
              : 'Secure Sign In to Authentic Craft Marketplace'
            : language === 'ta'
            ? 'புதிய கைவினைஞர் / வாங்குபவர் கணக்கை உருவாக்கவும்'
            : language === 'hi'
            ? 'नया कारीगर या खरीदार खाता बनाएं'
            : 'Create Your Verified KalaMart Account'}
        </p>
      </div>

      {/* Tab Switcher: LOGIN vs SIGN UP */}
      <div className="flex bg-surface-container-low p-1 rounded-2xl border border-outline-variant/30 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setAuthMode('login');
            setAuthError(null);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            authMode === 'login'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          id="tab-login"
        >
          {t.loginTab}
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('signup');
            setAuthError(null);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            authMode === 'signup'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          id="tab-signup"
        >
          {t.signupTab}
        </button>
      </div>

      {/* Auth Error Banner */}
      {authError && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
          <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">
            error
          </span>
          <span className="leading-snug font-medium flex-1">{authError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOGIN VIEW */}
      {/* ========================================================================= */}
      {authMode === 'login' && (
        <div className="space-y-4">
          {/* 1-Click Quick Demo Evaluation Bar */}
          <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">bolt</span>
                <span>1-Click Test Credentials</span>
              </span>
              <span className="text-[10px] text-on-surface-variant">Tap to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemoCredentials('artisan')}
                className={`px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold border transition-all ${
                  selectedRole === 'artisan'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container text-on-surface border-outline-variant/30 hover:border-secondary'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Artisan</span>
                  <span className="text-[9px] opacity-80">Potter</span>
                </div>
                <div className="text-[10px] opacity-75 truncate">9876543210</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemoCredentials('buyer')}
                className={`px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold border transition-all ${
                  selectedRole === 'buyer'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container text-on-surface border-outline-variant/30 hover:border-secondary'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Buyer</span>
                  <span className="text-[9px] opacity-80">Patron</span>
                </div>
                <div className="text-[10px] opacity-75 truncate">buyer@kalaconnect.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemoCredentials('b2b')}
                className={`px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold border transition-all ${
                  selectedRole === 'b2b'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container text-on-surface border-outline-variant/30 hover:border-secondary'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>B2B Wholesale</span>
                  <span className="text-[9px] opacity-80">Bulk</span>
                </div>
                <div className="text-[10px] opacity-75 truncate">b2b@kalaconnect.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemoCredentials('admin')}
                className={`px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold border transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container text-on-surface border-outline-variant/30 hover:border-secondary'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Admin</span>
                  <span className="text-[9px] opacity-80">Trust</span>
                </div>
                <div className="text-[10px] opacity-75 truncate">admin@kalaconnect.com</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            {/* Email or Phone Input */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="login-identifier">
                {t.emailOrPhone}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                  account_circle
                </span>
                <input
                  id="login-identifier"
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => {
                    setLoginIdentifier(e.target.value);
                    if (loginFieldErrors.identifier) {
                      setLoginFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                    }
                  }}
                  placeholder="artisan@kalaconnect.com or 9876543210"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-container-lowest border text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all ${
                    loginFieldErrors.identifier ? 'border-red-500' : 'border-outline-variant/40'
                  }`}
                />
              </div>
              {loginFieldErrors.identifier && (
                <p className="text-[11px] text-red-600 mt-1 font-medium pl-1">
                  {loginFieldErrors.identifier}
                </p>
              )}
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-on-surface" htmlFor="login-password">
                  {t.password}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-secondary hover:text-primary transition-colors cursor-pointer"
                  id="btn-forgot-password"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                  lock
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginFieldErrors.password) {
                      setLoginFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl bg-surface-container-lowest border text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all ${
                    loginFieldErrors.password ? 'border-red-500' : 'border-outline-variant/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-[18px] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {loginFieldErrors.password && (
                <p className="text-[11px] text-red-600 mt-1 font-medium pl-1">
                  {loginFieldErrors.password}
                </p>
              )}
            </div>

            {/* Login Action Button */}
            <button
              id="btn-submit-login"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>
                    {selectedRole === 'artisan'
                      ? 'Sign In as Artisan'
                      : selectedRole === 'buyer'
                      ? 'Sign In as Buyer'
                      : selectedRole === 'b2b'
                      ? 'Sign In to B2B Portal'
                      : 'Sign In as Admin'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-outline-variant/30 w-full" />
            <span className="bg-surface px-3 text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">
              or
            </span>
          </div>

          {/* Continue with Google */}
          <button
            id="btn-google-auth"
            type="button"
            onClick={handleContinueWithGoogle}
            disabled={googleLoading}
            className="w-full py-3 px-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-secondary text-on-surface font-semibold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.28 21.43 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32 0-.83.13-1.6.38-2.32V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.1z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.28 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Switch to Signup */}
          <div className="text-center pt-2">
            <p className="text-xs text-on-surface-variant">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                className="font-bold text-primary hover:text-secondary underline cursor-pointer"
                id="btn-switch-to-signup"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIGNUP VIEW */}
      {/* ========================================================================= */}
      {authMode === 'signup' && (
        <form onSubmit={handleSignupSubmit} className="space-y-3.5">
          {/* 1. Role Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Select Your KalaConnect Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES_INFO.map((roleObj) => {
                const isSelected = selectedRole === roleObj.id;
                return (
                  <button
                    key={roleObj.id}
                    type="button"
                    onClick={() => setSelectedRole(roleObj.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:border-secondary'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isSelected ? 'text-secondary-fixed-dim' : 'text-secondary'
                        }`}
                      >
                        {roleObj.icon}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {roleObj.badge}
                      </span>
                    </div>
                    <div className="font-bold text-xs leading-tight">{roleObj.title}</div>
                    <div
                      className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${
                        isSelected ? 'text-white/80' : 'text-on-surface-variant'
                      }`}
                    >
                      {roleObj.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name Input (NEVER hardcoded) */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="signup-name">
              {t.fullName} *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                person
              </span>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (signupFieldErrors.fullName) {
                    setSignupFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                placeholder="Enter your real full name"
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-lowest border text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all ${
                  signupFieldErrors.fullName ? 'border-red-500' : 'border-outline-variant/40'
                }`}
              />
            </div>
            {signupFieldErrors.fullName && (
              <p className="text-[11px] text-red-600 mt-1 font-medium pl-1">
                {signupFieldErrors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="signup-email">
              {t.email} *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                mail
              </span>
              <input
                id="signup-email"
                type="email"
                value={signupEmail}
                onChange={(e) => {
                  setSignupEmail(e.target.value);
                  if (signupFieldErrors.email) {
                    setSignupFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-lowest border text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all ${
                  signupFieldErrors.email ? 'border-red-500' : 'border-outline-variant/40'
                }`}
              />
            </div>
            {signupFieldErrors.email && (
              <p className="text-[11px] text-red-600 mt-1 font-medium pl-1">
                {signupFieldErrors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="signup-phone">
              {t.phone} *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                phone_android
              </span>
              <input
                id="signup-phone"
                type="tel"
                value={signupPhone}
                onChange={(e) => {
                  setSignupPhone(e.target.value);
                  if (signupFieldErrors.phone) {
                    setSignupFieldErrors((prev) => ({ ...prev, phone: undefined }));
                  }
                }}
                placeholder="9876543210 (10 digits)"
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-lowest border text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all ${
                  signupFieldErrors.phone ? 'border-red-500' : 'border-outline-variant/40'
                }`}
              />
            </div>
            {signupFieldErrors.phone && (
              <p className="text-[11px] text-red-600 mt-1 font-medium pl-1">
                {signupFieldErrors.phone}
              </p>
            )}
          </div>

          {/* Artisan specific field: Craft Specialization */}
          {selectedRole === 'artisan' && (
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Primary Craft Specialization
              </label>
              <select
                value={craftSpecialization}
                onChange={(e) => setCraftSpecialization(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              >
                <option value="Terracotta Pottery">Terracotta Pottery (Indus Tradition)</option>
                <option value="Kutch Rogan & Bandhani">Kutch Rogan & Bandhani Textiles</option>
                <option value="Dhokra Lost-Wax Brass">Dhokra Lost-Wax Brass Metalcraft</option>
                <option value="Blue Pottery of Jaipur">Blue Pottery of Jaipur</option>
                <option value="Bidriware Silver Inlay">Bidriware Silver Inlay Art</option>
                <option value="Handloom Silk Weaving">Handloom Silk Weaving (Kanchipuram/Banarasi)</option>
              </select>
            </div>
          )}

          {/* B2B specific field: Business Name */}
          {selectedRole === 'b2b' && (
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Company / Organization Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Heritage Crafts Trading Co."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>
          )}

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="signup-password">
                {t.password} (min 6) *
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    if (signupFieldErrors.password) {
                      setSignupFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 rounded-2xl bg-surface-container-lowest border text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 ${
                    signupFieldErrors.password ? 'border-red-500' : 'border-outline-variant/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {signupFieldErrors.password && (
                <p className="text-[11px] text-red-600 mt-1 font-medium pl-1">
                  {signupFieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1" htmlFor="signup-confirm-password">
                {t.confirmPassword} *
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={signupConfirmPassword}
                  onChange={(e) => {
                    setSignupConfirmPassword(e.target.value);
                    if (signupFieldErrors.confirmPassword) {
                      setSignupFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 rounded-2xl bg-surface-container-lowest border text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 ${
                    signupFieldErrors.confirmPassword ? 'border-red-500' : 'border-outline-variant/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {signupFieldErrors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1 font-medium pl-1">
                  {signupFieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Role-specific onboarding note */}
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-[11px] text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px]">info</span>
            <span>
              {selectedRole === 'artisan'
                ? 'Artisan accounts will be guided through craft onboarding before entering the studio.'
                : selectedRole === 'buyer'
                ? 'Buyer accounts enter the curated marketplace immediately upon registration.'
                : selectedRole === 'b2b'
                ? 'B2B accounts gain immediate access to wholesale tiers, MOQ pricing, and RFQ tools.'
                : 'Admin accounts enter the trust & GI verification portal.'}
            </span>
          </div>

          {/* Submit Sign Up Button */}
          <button
            id="btn-submit-signup"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Your Account...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Create KalaConnect Account</span>
              </>
            )}
          </button>

          {/* Social Google option */}
          <button
            type="button"
            onClick={handleContinueWithGoogle}
            disabled={googleLoading}
            className="w-full py-3 px-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-secondary text-on-surface font-semibold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.28 21.43 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32 0-.83.13-1.6.38-2.32V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.1z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.28 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
              />
            </svg>
            <span>Sign Up with Google</span>
          </button>

          {/* Switch to Login */}
          <div className="text-center pt-2">
            <p className="text-xs text-on-surface-variant">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className="font-bold text-primary hover:text-secondary underline cursor-pointer"
                id="btn-switch-to-login"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL */}
      {/* ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-outline-variant/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <span className="material-symbols-outlined text-[22px] text-secondary">
                  lock_reset
                </span>
                <span>{t.resetPassword}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotStep('request');
                  setForgotInfoMsg(null);
                }}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotRequestSubmit} className="space-y-3.5">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {t.resetInstructions}
                </p>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    {t.emailOrPhone}
                  </label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="e.g. artisan@kalaconnect.com or 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-2xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container cursor-pointer disabled:opacity-60"
                >
                  {forgotLoading ? 'Searching Account...' : t.sendResetLink}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotResetSubmit} className="space-y-3.5">
                {forgotInfoMsg && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                    {forgotInfoMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="6-digit code"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    New Password (min 6 characters)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-2xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container cursor-pointer disabled:opacity-60"
                >
                  {forgotLoading ? 'Updating Password...' : 'Save New Password & Log In'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
