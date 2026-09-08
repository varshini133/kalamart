/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/mockData';
import { ScreenType, Product, CartItem, Language, User, BuyerOrder } from './types';
import { NavigationHeader } from './components/NavigationHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/checkout/OrderConfirmationModal';
import { OrderTrackingModal } from './components/checkout/OrderTrackingModal';
import { AudioAssistantModal } from './components/AudioAssistantModal';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { ArtisanAuthScreen } from './screens/ArtisanAuthScreen';
import { BuyerAuthScreen } from './screens/BuyerAuthScreen';
import { ArtisanOnboardingScreen } from './screens/ArtisanOnboardingScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { GuildsScreen } from './screens/GuildsScreen';
import { StudioScreen } from './screens/StudioScreen';
import { VoiceCatalogingScreen } from './screens/VoiceCatalogingScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { B2BPortalScreen } from './screens/B2BPortalScreen';
import { AdminPortalScreen } from './screens/AdminPortalScreen';
import { AdminRouteGuard } from './components/admin/AdminRouteGuard';
import { MyProductsScreen } from './screens/MyProductsScreen';
import { ProductManageScreen } from './screens/ProductManageScreen';
import { OfflineStatusBar } from './components/OfflineStatusBar';
import { OfflineSyncModal } from './components/OfflineSyncModal';
import { OfflineDemoModal } from './components/OfflineDemoModal';
import { HackathonDemoWalkthroughModal } from './components/demo/HackathonDemoWalkthroughModal';
import { DEMO_PERSONAS } from './data/hackathonDemoData';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { NotificationToast } from './components/notifications/NotificationToast';
import { notificationService } from './services/notificationService';
import { offlineSyncService } from './services/offlineSyncService';
import { getStoredUser, saveUser, clearUser, setSelectedRole } from './services/authService';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getStoredUser();
  });

  // Screen State - strictly defaults to 'welcome' (Landing Page with Role Selection)
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');

  // Offline-First Network Simulation State
  const [isOnline, setIsOnline] = useState<boolean>(() => offlineSyncService.isOnline());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => offlineSyncService.getPendingCount());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);
  const [isSyncQueueModalOpen, setIsSyncQueueModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(false);

  // Dynamic Products Inventory (supports newly published crafts)
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kalamart_products_v3');
      if (saved) return JSON.parse(saved);
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Selected Product for Details & Buyer Preview
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => productsList[0] || PRODUCTS[0]);

  // Selected Product for Artisan Management
  const [selectedManageProduct, setSelectedManageProduct] = useState<Product>(() => productsList[0] || PRODUCTS[0]);

  // Wishlist State (persisted across sessions)
  const [wishlist, setWishlist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kalamart_wishlist');
      return saved ? JSON.parse(saved) : { 'kutch-kalash': true };
    } catch {
      return { 'kutch-kalash': true };
    }
  });

  // Cart State (persisted across sessions)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kalamart_cart');
      return saved ? JSON.parse(saved) : [
        {
          product: PRODUCTS[0],
          quantity: 1,
          selectedSize: 'Large (2.5L)'
        }
      ];
    } catch {
      return [
        {
          product: PRODUCTS[0],
          quantity: 1,
          selectedSize: 'Large (2.5L)'
        }
      ];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<BuyerOrder | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<BuyerOrder | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(() => {
    return notificationService.getUnreadCount();
  });
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to notification updates for live badge count
  useEffect(() => {
    const unsubscribe = notificationService.subscribe(() => {
      const roleCat = currentUser?.role === 'artisan' ? 'artisan' : currentUser?.role === 'buyer' ? 'buyer' : 'all';
      setUnreadNotificationCount(notificationService.getUnreadCount(roleCat));
    });
    return unsubscribe;
  }, [currentUser]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kalamart_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kalamart_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kalamart_products_v3', JSON.stringify(productsList));
    } catch {}
  }, [productsList]);

  // Toast Notification Helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Unified Login & Registration Success Handler
  const handleLoginSuccess = (user: User, isNewUser?: boolean) => {
    setCurrentUser(user);
    saveUser(user);
    setSelectedRole(user.role);

    // Strict Role-Based Dashboard Redirection
    if (user.role === 'artisan') {
      if (isNewUser || !user.hasCompletedOnboarding) {
        setCurrentScreen('artisan-onboarding');
        showToast(
          currentLanguage === 'ta'
            ? `வணக்கம் ${user.name}! கைவினைஞர் சுயவிவரத்தை அமைக்கவும்.`
            : currentLanguage === 'hi'
            ? `स्वागत है ${user.name}! कृपया अपनी कारीगर प्रोफ़ाइल पूरी करें।`
            : `Welcome, ${user.name}! Please set up your Artisan profile.`
        );
      } else {
        setCurrentScreen('studio');
        showToast(
          currentLanguage === 'ta'
            ? `மீண்டும் வருக, ${user.name}! கைவினை அரங்கம் திறக்கப்பட்டது.`
            : currentLanguage === 'hi'
            ? `वापसी पर स्वागत है, ${user.name}! स्टूडियो अनलॉक हो गया।`
            : `Welcome back, Master Maker ${user.name}! Studio unlocked.`
        );
      }
    } else if (user.role === 'buyer') {
      setCurrentScreen('discover');
      showToast(
        currentLanguage === 'ta'
          ? `வணக்கம் ${user.name}! இந்திய கைவினைப் பொருட்களை ஆராயுங்கள்.`
          : currentLanguage === 'hi'
          ? `स्वागत है ${user.name}! हस्तनिर्मित भारत की खोज करें।`
          : `Welcome, ${user.name}! Discovering handmade India.`
      );
    } else if (user.role === 'b2b') {
      setCurrentScreen('b2b-portal');
      showToast(
        currentLanguage === 'ta'
          ? `வணக்கம் ${user.name}! மொத்த வர்த்தக மையம் திறக்கப்பட்டது.`
          : currentLanguage === 'hi'
          ? `स्वागत है ${user.name}! थोक एवं निर्यात केंद्र सक्रिय।`
          : `Welcome, ${user.name}! B2B Wholesale Hub unlocked.`
      );
    } else if (user.role === 'admin') {
      setCurrentScreen('admin-portal');
      showToast(
        currentLanguage === 'ta'
          ? `வணக்கம் நிர்வாகி ${user.name}! சரிபார்ப்பு மையம் திறக்கப்பட்டது.`
          : currentLanguage === 'hi'
          ? `स्वागत है प्रशासक ${user.name}! सत्यापन केंद्र सक्रिय।`
          : `Welcome Administrator ${user.name}! Trust console active.`
      );
    }
  };

  // Artisan Onboarding Complete Handler
  const handleArtisanOnboardingComplete = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    saveUser(updatedUser);
    setCurrentScreen('studio');
    showToast(
      currentLanguage === 'ta'
        ? `சுயவிவரம் முடிந்தது! அரங்கம் திறக்கப்பட்டது, ${updatedUser.name}.`
        : currentLanguage === 'hi'
        ? `ऑनबोर्डिंग पूरी हुई! स्टूडियो में आपका स्वागत है, ${updatedUser.name}।`
        : `Onboarding complete! Welcome to your Studio, ${updatedUser.name}.`
    );
  };

  // Logout Handler
  const handleLogout = () => {
    clearUser();
    setCurrentUser(null);
    setCurrentScreen('welcome');
    showToast(
      currentLanguage === 'ta'
        ? 'வெளியேறியது. உள்நுழைய உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்.'
        : currentLanguage === 'hi'
        ? 'लॉग आउट किया गया। कृपया अपनी भूमिका चुनें।'
        : 'Signed out successfully. Please select your role to log in.'
    );
  };

  // Demo Persona Switcher for Hackathon Demonstrations
  const handleSelectDemoPersona = (persona: any) => {
    const mockUser: User = {
      id: persona.id,
      name: persona.name,
      role: persona.role,
      buyerType: persona.buyerType,
      email: `${persona.id}@kalaconnect.org`,
      phone: '+91 98765 43210',
      hasCompletedOnboarding: true,
      preferredLanguage: currentLanguage
    };
    setCurrentUser(mockUser);
    saveUser(mockUser);
    showToast(`Switched account to ${persona.name} (${persona.role.toUpperCase()})`);
  };

  // Offline Toggle Handler
  const toggleOnline = () => {
    const willBeOnline = !isOnline;
    offlineSyncService.setSimulatedOffline(!willBeOnline);
    setIsOnline(willBeOnline);

    if (willBeOnline) {
      showToast(
        currentLanguage === 'ta'
          ? 'இணையம் இணைக்கப்பட்டது! நிலுவையில் உள்ள மாற்றங்கள் ஒத்திசைக்கப்படுகின்றன...'
          : currentLanguage === 'hi'
          ? 'इंटरनेट पुनः कनेक्ट हो गया! लंबित बदलाव स्वचालित रूप से सिंक हो रहे हैं...'
          : 'Back online! Automatically synchronizing pending changes...'
      );
      offlineSyncService.syncNow();
    } else {
      showToast(
        currentLanguage === 'ta'
          ? 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். உங்கள் வேலை இந்த சாதனத்தில் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளது.'
          : currentLanguage === 'hi'
          ? 'आप ऑफ़लाइन हैं। आपका काम इस डिवाइस पर सुरक्षित रूप से सहेजा गया है।'
          : "You're offline. Your work is safely saved on this device."
      );
    }
  };

  // Offline Sync Service Event Subscription
  useEffect(() => {
    const unsubscribe = offlineSyncService.subscribe((event) => {
      if (event.type === 'network-change') {
        setIsOnline(event.payload.isOnline);
      } else if (event.type === 'queue-updated') {
        setPendingSyncCount(event.payload.pendingCount);
      } else if (event.type === 'sync-started') {
        setIsSyncing(true);
        setSyncSuccessMessage(null);
      } else if (event.type === 'sync-completed') {
        setIsSyncing(false);
        setPendingSyncCount(offlineSyncService.getPendingCount());
        // Refresh products inventory from local persistent cache
        try {
          const saved = localStorage.getItem('kalamart_products');
          if (saved) setProductsList(JSON.parse(saved));
        } catch {}
        if (event.payload?.syncedCount > 0) {
          const msg = 'All changes synced successfully.';
          setSyncSuccessMessage(msg);
          showToast(msg);
          setTimeout(() => setSyncSuccessMessage(null), 4500);

          try {
            notificationService.notifyArtisanSyncCompleted(event.payload.syncedCount);
          } catch {}
        }
      } else if (event.type === 'sync-failed') {
        setIsSyncing(false);
      }
    });

    return () => unsubscribe();
  }, [currentLanguage]);

  // Strict Authentication & Role-Gated Navigation
  const handleNavigate = (targetScreen: ScreenType) => {
    // 1. Unauthenticated screens - open to all
    if (
      targetScreen === 'welcome' ||
      targetScreen === 'auth' ||
      targetScreen === 'artisan-auth' ||
      targetScreen === 'buyer-auth'
    ) {
      setCurrentScreen(targetScreen);
      return;
    }

    // 2. Unauthenticated user attempting to access ANY protected screen
    if (!currentUser) {
      if (
        targetScreen === 'studio' ||
        targetScreen === 'voice-cataloging' ||
        targetScreen === 'artisan-onboarding' ||
        targetScreen === 'my-products' ||
        targetScreen === 'product-manage'
      ) {
        setSelectedRole('artisan');
        setCurrentScreen('artisan-auth');
        showToast('Artisan Studio requires authentication. Please log in.');
      } else if (targetScreen === 'b2b-portal') {
        setSelectedRole('b2b');
        setCurrentScreen('auth');
        showToast('B2B Wholesale Hub requires authentication. Please log in.');
      } else if (targetScreen === 'admin-portal') {
        setSelectedRole('admin');
        setCurrentScreen('auth');
        showToast('Administrator privileges required. Please log in.');
      } else {
        setSelectedRole('buyer');
        setCurrentScreen('buyer-auth');
        showToast('Please sign in to your account to proceed.');
      }
      return;
    }

    // 3. Strict Role-Boundary Protection for Authenticated Users:
    // A. ARTISAN
    if (currentUser.role === 'artisan') {
      // Must finish onboarding before accessing studio or creation
      if (
        !currentUser.hasCompletedOnboarding &&
        (targetScreen === 'studio' ||
          targetScreen === 'voice-cataloging' ||
          targetScreen === 'my-products' ||
          targetScreen === 'product-manage')
      ) {
        setCurrentScreen('artisan-onboarding');
        showToast('Please complete your Artisan profile setup first.');
        return;
      }
      // Cannot access Admin portal
      if (targetScreen === 'admin-portal') {
        showToast('Access denied. Admin portal is restricted to platform administrators.');
        return;
      }
    }

    // B. BUYER
    if (currentUser.role === 'buyer') {
      // Cannot access Artisan Studio or product management
      if (
        targetScreen === 'studio' ||
        targetScreen === 'voice-cataloging' ||
        targetScreen === 'artisan-onboarding' ||
        targetScreen === 'my-products' ||
        targetScreen === 'product-manage'
      ) {
        showToast('Artisan Studio is restricted to registered artisans.');
        return;
      }
      // Cannot access Admin portal
      if (targetScreen === 'admin-portal') {
        showToast('Access denied. Administrator privileges required.');
        return;
      }
    }

    // C. B2B BUYER
    if (currentUser.role === 'b2b') {
      // Cannot access Artisan Studio or product management
      if (
        targetScreen === 'studio' ||
        targetScreen === 'voice-cataloging' ||
        targetScreen === 'artisan-onboarding' ||
        targetScreen === 'my-products' ||
        targetScreen === 'product-manage'
      ) {
        showToast('Artisan Studio is restricted to registered artisans.');
        return;
      }
      // Cannot access Admin portal
      if (targetScreen === 'admin-portal') {
        showToast('Access denied. Administrator privileges required.');
        return;
      }
    }

    // D. ADMIN
    if (currentUser.role === 'admin') {
      // Admin dashboard only - cannot access artisan creation studio
      if (
        targetScreen === 'studio' ||
        targetScreen === 'voice-cataloging' ||
        targetScreen === 'artisan-onboarding' ||
        targetScreen === 'my-products' ||
        targetScreen === 'product-manage'
      ) {
        showToast('Administrator console active. Studio is reserved for artisan accounts.');
        return;
      }
    }

    setCurrentScreen(targetScreen);
  };

  // Add to Cart
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Instant Buy Now
  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Update Cart Quantity
  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from bag');
  };

  // Proceed to Checkout
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your bag is empty. Add a handcrafted item first!');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Success Callback
  const handleOrderSuccess = (newOrder: BuyerOrder) => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    setConfirmedOrder(newOrder);
    showToast(`Order ${newOrder.orderNumber} confirmed! Tracking is live.`);
  };

  // Track Order from Confirmation
  const handleTrackFromConfirmation = (order: BuyerOrder) => {
    setConfirmedOrder(null);
    setActiveTrackingOrder(order);
  };

  // Wishlist Toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const nextVal = !prev[productId];
      showToast(nextVal ? 'Saved to your Wishlist' : 'Removed from Wishlist');
      return { ...prev, [productId]: nextVal };
    });
  };

  // Legacy Checkout Handler
  const handleCheckoutSuccess = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Publish New Product from Voice Cataloging
  const handlePublishProduct = (newProduct: Product) => {
    const isCurrentlyOnline = offlineSyncService.isOnline();
    const productWithStatus: Product = {
      ...newProduct,
      syncStatus: isCurrentlyOnline ? 'synced' : 'saved_local'
    };
    setProductsList((prev) => [productWithStatus, ...prev]);
    setSelectedProduct(productWithStatus);

    if (!isCurrentlyOnline) {
      offlineSyncService.enqueueOperation({
        entityId: productWithStatus.id,
        entityType: 'product',
        operationType: 'create',
        title: productWithStatus.title,
        payload: productWithStatus,
        status: 'saved_local'
      });
      setPendingSyncCount(offlineSyncService.getPendingCount());
      showToast(
        currentLanguage === 'ta'
          ? 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். உங்கள் வேலை இந்த சாதனத்தில் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளது.'
          : currentLanguage === 'hi'
          ? 'आप ऑफ़लाइन हैं। आपका काम इस डिवाइस पर सुरक्षित रूप से सहेजा गया है।'
          : "You're offline. Your work is safely saved on this device."
      );
    } else {
      showToast(
        currentLanguage === 'ta'
          ? 'புதிய கைவினைப் பொருள் சந்தையில் வெளியிடப்பட்டது!'
          : currentLanguage === 'hi'
          ? 'नया शिल्प बाज़ार में सफलतापूर्वक प्रकाशित हुआ!'
          : 'New craft published directly to global marketplace!'
      );
    }
    setCurrentScreen(currentUser?.role === 'artisan' ? 'studio' : 'discover');
  };

  // Multimodal Voice Action Handler
  const handleVoiceAction = (action: string) => {
    setIsVoiceModalOpen(false);
    if (action === 'open-kutch') {
      const kutchProd = productsList.find((p) => p.id === 'kutch-kalash') || productsList[0];
      setSelectedProduct(kutchProd);
      handleNavigate('product-detail');
    } else if (action === 'open-cataloging') {
      handleNavigate('voice-cataloging');
    } else if (action === 'open-orders') {
      handleNavigate('orders');
    }
  };

  // Artisan Product Management Handlers
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (selectedProduct?.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
    if (selectedManageProduct?.id === updatedProduct.id) {
      setSelectedManageProduct(updatedProduct);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prev) => {
      const remaining = prev.filter((p) => p.id !== productId);
      if (selectedManageProduct?.id === productId && remaining.length > 0) {
        setSelectedManageProduct(remaining[0]);
      }
      return remaining;
    });
    showToast(
      currentLanguage === 'ta'
        ? 'பொருள் வெற்றிகரமாக நீக்கப்பட்டது.'
        : currentLanguage === 'hi'
        ? 'उत्पाद सफलतापूर्वक हटा दिया गया।'
        : 'Product removed from your catalog.'
    );
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `craft-${Date.now()}`,
      title: `${product.title} (Copy)`,
      hindiTitle: product.hindiTitle ? `${product.hindiTitle} (प्रतिलिपि)` : undefined,
      status: 'draft',
      inStock: true,
      stockCount: 1,
      performance: {
        views: 0,
        inquiries: 0,
        orders: 0,
        revenue: 0,
        rating: 5.0,
        reviewsCount: 0
      }
    };
    setProductsList((prev) => [duplicated, ...prev]);
    setSelectedManageProduct(duplicated);
    showToast(
      currentLanguage === 'ta'
        ? 'பொருள் நகலெடுக்கப்பட்டது (வரைவாக சேமிக்கப்பட்டது)!'
        : currentLanguage === 'hi'
        ? 'उत्पाद की प्रतिलिपि बनाई गई (ड्राफ्ट में सहेजा गया)!'
        : 'Product duplicated and saved as draft!'
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = Object.values(wishlist).filter(Boolean).length;
  const isAuthOrWelcomeScreen =
    currentScreen === 'welcome' ||
    currentScreen === 'auth' ||
    currentScreen === 'artisan-auth' ||
    currentScreen === 'buyer-auth' ||
    currentScreen === 'artisan-onboarding';

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col items-center">
      {/* Container wrapper for mobile viewport framing or fluid desktop layout */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-surface shadow-2xl">
        {/* Offline & Sync Status Banner */}
        <OfflineStatusBar
          isOnline={isOnline}
          onToggleOnline={toggleOnline}
          pendingSyncCount={pendingSyncCount}
          lastSyncStatus={isOnline ? (pendingSyncCount > 0 ? 'pending_sync' : 'synced') : 'saved_local'}
          language={currentLanguage}
          onOpenSyncQueue={() => setIsSyncQueueModalOpen(true)}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          isSyncing={isSyncing}
          syncSuccessMessage={syncSuccessMessage || undefined}
        />

        {/* Navigation Header (Sticky on all main authenticated screens) */}
        {!isAuthOrWelcomeScreen && (
          <NavigationHeader
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenNotifications={() => setIsNotificationCenterOpen(true)}
            onOpenDemo={() => setIsWalkthroughOpen(true)}
            cartCount={totalCartCount}
            unreadNotificationCount={unreadNotificationCount}
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            user={currentUser}
          />
        )}

        {/* Screen Switcher */}
        <main className="flex-1 flex flex-col">
          {currentScreen === 'welcome' && (
            <WelcomeScreen
              onNavigate={handleNavigate}
              language={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              onShowToast={showToast}
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenDemo={() => setIsWalkthroughOpen(true)}
            />
          )}

          {currentScreen === 'auth' && (
            <AuthScreen
              initialMode="login"
              initialRole={currentUser?.role || 'artisan'}
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
              onShowToast={showToast}
              language={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          )}

          {currentScreen === 'artisan-auth' && (
            <ArtisanAuthScreen
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
              onShowToast={showToast}
              language={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          )}

          {currentScreen === 'buyer-auth' && (
            <BuyerAuthScreen
              onNavigate={handleNavigate}
              onLoginSuccess={handleLoginSuccess}
              onShowToast={showToast}
              language={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          )}

          {currentScreen === 'artisan-onboarding' && (
            <ArtisanOnboardingScreen
              user={currentUser}
              onComplete={handleArtisanOnboardingComplete}
              onNavigate={handleNavigate}
              onShowToast={showToast}
              language={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          )}

          {currentScreen === 'discover' && (
            <DiscoverScreen
              onNavigate={handleNavigate}
              onSelectProduct={setSelectedProduct}
              onAddToCart={handleAddToCart}
              onOpenVoice={() => setIsVoiceModalOpen(true)}
              onShowToast={showToast}
              products={productsList}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              user={currentUser}
              language={currentLanguage}
            />
          )}

          {currentScreen === 'product-detail' && (
            <ProductDetailScreen
              product={selectedProduct}
              onNavigate={handleNavigate}
              onAddToCart={handleAddToCart}
              onShowToast={showToast}
              onOpenVoice={() => setIsVoiceModalOpen(true)}
              isWishlisted={!!wishlist[selectedProduct.id]}
              onToggleWishlist={handleToggleWishlist}
              onBuyNow={handleBuyNow}
              language={currentLanguage}
              userRole={currentUser?.role}
              isBuyerPreview={currentUser?.role === 'artisan'}
            />
          )}

          {currentScreen === 'guilds' && (
            <GuildsScreen
              onNavigate={handleNavigate}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                handleNavigate('product-detail');
              }}
              onShowToast={showToast}
              language={currentLanguage}
            />
          )}

          {currentScreen === 'studio' && (
            <StudioScreen
              onNavigate={handleNavigate}
              onShowToast={showToast}
              onOpenVoice={() => setIsVoiceModalOpen(true)}
              onOpenNotifications={() => setIsNotificationCenterOpen(true)}
              user={currentUser}
              products={productsList}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setSelectedManageProduct(p);
              }}
              language={currentLanguage}
            />
          )}

          {currentScreen === 'my-products' && (
            <MyProductsScreen
              products={productsList}
              onNavigate={handleNavigate}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onDuplicateProduct={handleDuplicateProduct}
              onSelectProductForManage={(p) => {
                setSelectedManageProduct(p);
                handleNavigate('product-manage');
              }}
              onSelectProductForBuyer={(p) => {
                setSelectedProduct(p);
                handleNavigate('product-detail');
              }}
              onShowToast={showToast}
              language={currentLanguage}
            />
          )}

          {currentScreen === 'product-manage' && (
            <ProductManageScreen
              product={selectedManageProduct}
              onNavigate={handleNavigate}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onDuplicateProduct={handleDuplicateProduct}
              onSelectProductForBuyer={(p) => {
                setSelectedProduct(p);
                handleNavigate('product-detail');
              }}
              onShowToast={showToast}
              language={currentLanguage}
            />
          )}

          {currentScreen === 'voice-cataloging' && (
            <VoiceCatalogingScreen
              onNavigate={handleNavigate}
              onShowToast={showToast}
              currentLanguage={currentLanguage}
              onPublishProduct={handlePublishProduct}
              user={currentUser}
            />
          )}

          {currentScreen === 'orders' && (
            <OrdersScreen
              onNavigate={handleNavigate}
              onShowToast={showToast}
              user={currentUser}
              language={currentLanguage}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              onNavigate={handleNavigate}
              language={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              onShowToast={showToast}
              user={currentUser}
              onLogout={handleLogout}
              wishlistCount={wishlistCount}
              onOpenNotifications={() => setIsNotificationCenterOpen(true)}
              unreadNotificationCount={unreadNotificationCount}
            />
          )}

          {currentScreen === 'b2b-portal' && (
            <B2BPortalScreen
              onNavigate={handleNavigate}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                handleNavigate('product-detail');
              }}
              onShowToast={showToast}
              language={currentLanguage}
              user={currentUser}
            />
          )}

          {currentScreen === 'admin-portal' && (
            currentUser?.role === 'admin' ? (
              <AdminPortalScreen
                onNavigate={handleNavigate}
                onShowToast={showToast}
                language={currentLanguage}
                user={currentUser}
              />
            ) : (
              <AdminRouteGuard
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onAuthenticateAsAdmin={() => {
                  const adminUser: User = {
                    id: 'admin-seed-1',
                    role: 'admin',
                    name: 'Platform Custodian',
                    email: 'admin@kalaconnect.com',
                    phone: '+91 99001 12233',
                    location: 'KalaConnect Trust HQ, New Delhi'
                  };
                  saveUser(adminUser);
                  setSelectedRole('admin');
                  setCurrentUser(adminUser);
                  showToast('Authenticated as KalaConnect Platform Custodian (Admin)');
                }}
              />
            )
          )}
        </main>

        {/* Bottom Navigation Bar (Hidden on Landing & Authentication screens) */}
        {!isAuthOrWelcomeScreen && (
          <BottomNavBar
            currentScreen={currentScreen}
            role={currentUser?.role}
            onNavigate={handleNavigate}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            activeOrdersCount={2}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={handleProceedToCheckout}
          language={currentLanguage}
        />

        {/* Checkout Modal with Modular Payment Architecture */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cartItems}
          user={currentUser}
          language={currentLanguage}
          onOrderSuccess={handleOrderSuccess}
          onShowToast={showToast}
        />

        {/* Order Confirmation Modal */}
        <OrderConfirmationModal
          isOpen={Boolean(confirmedOrder)}
          order={confirmedOrder}
          onClose={() => {
            setConfirmedOrder(null);
            setCurrentScreen('orders');
          }}
          onTrackOrder={handleTrackFromConfirmation}
          language={currentLanguage}
        />

        {/* Live Order Journey Tracking Modal */}
        <OrderTrackingModal
          isOpen={Boolean(activeTrackingOrder)}
          order={activeTrackingOrder}
          onClose={() => setActiveTrackingOrder(null)}
          onShowToast={showToast}
          language={currentLanguage}
        />

        {/* Multimodal Audio Assistant Modal */}
        <AudioAssistantModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          language={currentLanguage}
          onSelectAction={handleVoiceAction}
        />

        {/* Offline Sync Queue Dashboard Modal */}
        <OfflineSyncModal
          isOpen={isSyncQueueModalOpen}
          onClose={() => setIsSyncQueueModalOpen(false)}
          onShowToast={showToast}
          language={currentLanguage}
        />

        {/* Offline-First Interactive Demo Walkthrough Modal */}
        <OfflineDemoModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
          onShowToast={showToast}
        />

        {/* Hackathon Pitch Demo Walkthrough Guide Modal */}
        <HackathonDemoWalkthroughModal
          isOpen={isWalkthroughOpen}
          onClose={() => setIsWalkthroughOpen(false)}
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onSelectPersona={handleSelectDemoPersona}
          isOnline={isOnline}
          onToggleOnline={toggleOnline}
          pendingSyncCount={pendingSyncCount}
          onTriggerSync={() => {
            offlineSyncService.syncNow();
            showToast('Synchronizing offline queue with cloud catalog...');
          }}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onShowToast={showToast}
        />

        {/* Real-time Notification Toast (Discrete & Non-Intrusive) */}
        <NotificationToast
          onNavigate={handleNavigate}
          onOpenCenter={() => setIsNotificationCenterOpen(true)}
        />

        {/* Central Notification Center (Modal/Sheet) */}
        <NotificationCenter
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          onNavigate={handleNavigate}
          language={currentLanguage}
          userRole={currentUser?.role}
        />

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xs w-full px-4 animate-fadeIn">
            <div className="bg-primary text-on-primary px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-secondary/40 text-xs font-semibold">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                verified
              </span>
              <span className="flex-1 leading-snug">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
