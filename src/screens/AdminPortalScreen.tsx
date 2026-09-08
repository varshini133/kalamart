import React, { useState, useEffect } from 'react';
import {
  Language,
  ScreenType,
  User,
  UserRole,
  AccountStatus,
  ProductStatus,
  OrderStatus,
  VerificationLevel,
  VerificationStatus
} from '../types';
import { databaseService } from '../services/databaseService';
import { trustService } from '../services/trustService';
import { notificationService } from '../services/notificationService';

interface AdminPortalScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onShowToast: (msg: string) => void;
  language: Language;
  user?: User | null;
}

type AdminTab = 'overview' | 'products' | 'artisans' | 'users' | 'orders';

export const AdminPortalScreen: React.FC<AdminPortalScreenProps> = ({
  onNavigate,
  onShowToast,
  language: _language,
  user
}) => {
  // State
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Overview metrics state
  const [metrics, setMetrics] = useState(() => databaseService.getDashboardOverviewMetrics());

  // Products Review state
  const [products, setProducts] = useState(() => databaseService.getProducts('all'));
  const [productStatusFilter, setProductStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [rejectModalProductId, setRejectModalProductId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Artisan Verification state
  const [artisanProfiles, setArtisanProfiles] = useState(() => databaseService.getArtisanProfiles());
  const [artisanFilter, setArtisanFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedArtisanUserId, setSelectedArtisanUserId] = useState<string | null>(null);
  const [artisanVerifyLevel, setArtisanVerifyLevel] = useState<VerificationLevel>(3);
  const [artisanVerifyNotes, setArtisanVerifyNotes] = useState('');
  const [artisanRejectReason, setArtisanRejectReason] = useState('');
  const [artisanActionModal, setArtisanActionModal] = useState<{
    type: 'approve' | 'reject';
    userId: string;
    name: string;
  } | null>(null);

  // User Management state
  const [usersList, setUsersList] = useState(() => databaseService.getUsers('all'));
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | 'all'>('all');

  // Order Monitoring state
  const [ordersList, setOrdersList] = useState(() => databaseService.getOrders('all'));
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Subscribe to real-time database updates
  useEffect(() => {
    const unsub = databaseService.subscribe(() => {
      setMetrics(databaseService.getDashboardOverviewMetrics());
      setProducts(databaseService.getProducts('all'));
      setArtisanProfiles(databaseService.getArtisanProfiles());
      setUsersList(databaseService.getUsers('all', userSearch));
      setOrdersList(databaseService.getOrders('all'));
    });
    return unsub;
  }, [userSearch]);

  const refreshData = () => {
    setMetrics(databaseService.getDashboardOverviewMetrics());
    setProducts(databaseService.getProducts('all'));
    setArtisanProfiles(databaseService.getArtisanProfiles());
    setUsersList(databaseService.getUsers('all', userSearch));
    setOrdersList(databaseService.getOrders('all'));
  };

  // ============================================================================
  // PRODUCT REVIEW HANDLERS
  // ============================================================================

  const handleApproveProduct = (productId: string, productName: string) => {
    try {
      databaseService.approveProduct(productId);
      refreshData();
      onShowToast(`Craft approved: "${productName}" is now published on KalaMart!`);
      if (selectedProductId === productId) {
        setSelectedProductId(null);
      }
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to approve product');
    }
  };

  const handleOpenRejectModal = (productId: string) => {
    setRejectModalProductId(productId);
    setRejectionReason('Additional provenance photos needed for loom and hand technique.');
  };

  const handleConfirmRejectProduct = () => {
    if (!rejectModalProductId) return;
    if (!rejectionReason.trim()) {
      onShowToast('Please provide a specific rejection reason for the artisan.');
      return;
    }
    try {
      const prod = databaseService.getProductById(rejectModalProductId);
      databaseService.rejectProduct(rejectModalProductId, rejectionReason.trim());
      refreshData();
      onShowToast(`Product rejected. Feedback sent to ${prod?.name || 'artisan'}.`);
      setRejectModalProductId(null);
      setRejectionReason('');
      if (selectedProductId === rejectModalProductId) {
        setSelectedProductId(null);
      }
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to reject product');
    }
  };

  // ============================================================================
  // ARTISAN VERIFICATION HANDLERS
  // ============================================================================

  const handleConfirmArtisanApprove = () => {
    if (!artisanActionModal) return;
    try {
      databaseService.updateArtisanVerification(
        artisanActionModal.userId,
        'approved',
        artisanVerifyNotes.trim() || 'Verified authentic craft guild record and workshop audit.'
      );
      // Also sync trust service
      trustService.approveVerification(artisanActionModal.userId, {
        level: artisanVerifyLevel,
        handmadeDeclared: true,
        craftVerified: true,
        bulkReady: true,
        adminNotes: artisanVerifyNotes.trim() || 'Trust audit approved'
      });
      // Notification
      notificationService.notifyArtisanVerificationApproved(
        artisanActionModal.name,
        `Level ${artisanVerifyLevel} Master Artisan`
      );
      refreshData();
      onShowToast(`Artisan ${artisanActionModal.name} verified successfully!`);
      setArtisanActionModal(null);
      setSelectedArtisanUserId(null);
    } catch (err: any) {
      onShowToast(err?.message || 'Verification update failed');
    }
  };

  const handleConfirmArtisanReject = () => {
    if (!artisanActionModal) return;
    if (!artisanRejectReason.trim()) {
      onShowToast('Please provide a reason or clarification request for the artisan.');
      return;
    }
    try {
      databaseService.updateArtisanVerification(artisanActionModal.userId, 'rejected', artisanRejectReason.trim());
      trustService.rejectVerification(artisanActionModal.userId, artisanRejectReason.trim());
      notificationService.notifyArtisanVerificationRejected(
        artisanActionModal.name,
        artisanRejectReason.trim()
      );
      refreshData();
      onShowToast(`Verification rejected for ${artisanActionModal.name}.`);
      setArtisanActionModal(null);
      setArtisanRejectReason('');
      setSelectedArtisanUserId(null);
    } catch (err: any) {
      onShowToast(err?.message || 'Rejection failed');
    }
  };

  // ============================================================================
  // USER MANAGEMENT HANDLERS
  // ============================================================================

  const handleToggleUserStatus = (userId: string, currentStatus?: AccountStatus) => {
    try {
      const nextStatus: AccountStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
      databaseService.updateUserStatus(userId, nextStatus);
      refreshData();
      onShowToast(`User account status updated to "${nextStatus}".`);
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to update user status');
    }
  };

  // ============================================================================
  // ORDER MONITORING HANDLERS
  // ============================================================================

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    try {
      databaseService.updateOrderStatus(orderId, nextStatus);
      refreshData();
      onShowToast(`Order ${orderId} marked as "${nextStatus}".`);
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to update order');
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    if (productStatusFilter === 'all') return true;
    return p.status === productStatusFilter;
  });

  const filteredArtisans = artisanProfiles.filter((ap) => {
    if (artisanFilter === 'all') return true;
    return ap.verification_status === artisanFilter;
  });

  const filteredUsers = usersList.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase().trim();
      return (
        u.name.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.location && u.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredOrders = ordersList.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        (o.delivery_city && o.delivery_city.toLowerCase().includes(q)) ||
        (o.tracking_id && o.tracking_id.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const selectedProductDetails = selectedProductId
    ? databaseService.getProductWithDetails(selectedProductId)
    : null;

  const selectedOrderDetails = selectedOrderId
    ? databaseService.getOrderWithItems(selectedOrderId)
    : null;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Header / Admin Identity Bar */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              title="Return to Marketplace"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-600/90 text-amber-100 text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                ADMIN
              </span>
              <h1 className="text-lg font-semibold text-white tracking-tight">KalaMart Custodian Portal</h1>
            </div>
            <span className="hidden sm:inline-block text-xs text-stone-400 border-l border-stone-700 pl-3">
              Trust & System Management
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-stone-800/80 px-3 py-1.5 rounded-lg text-xs text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Custodian Mode • {user?.name || 'Platform Admin'}</span>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-lg transition"
            >
              Switch Role
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-800/80 flex space-x-1 overflow-x-auto no-scrollbar">
          <button
            id="admin-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            <span>Dashboard Overview</span>
          </button>

          <button
            id="admin-tab-products"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition ${
              activeTab === 'products'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">inventory_2</span>
            <span>Product Review</span>
            {metrics.pendingProductsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-stone-950">
                {metrics.pendingProductsCount}
              </span>
            )}
          </button>

          <button
            id="admin-tab-artisans"
            onClick={() => setActiveTab('artisans')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition ${
              activeTab === 'artisans'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span>Artisan Verification</span>
            {metrics.pendingArtisansCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500 text-white">
                {metrics.pendingArtisansCount}
              </span>
            )}
          </button>

          <button
            id="admin-tab-users"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition ${
              activeTab === 'users'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">group</span>
            <span>User Management</span>
          </button>

          <button
            id="admin-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center space-x-2 whitespace-nowrap transition ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">local_shipping</span>
            <span>Order Monitoring</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-stone-700 text-stone-300">
              {metrics.ordersCount}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ==================================================================== */}
        {/* TAB 1: DASHBOARD OVERVIEW & ANALYTICS                                */}
        {/* ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Alert for Pending Tasks */}
            {metrics.pendingApprovalsCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                    <span className="material-symbols-outlined">notification_important</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900">
                      {metrics.pendingApprovalsCount} Items Awaiting Review
                    </h4>
                    <p className="text-xs text-amber-700">
                      {metrics.pendingProductsCount} craft listings and {metrics.pendingArtisansCount} artisan trust applications need approval.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {metrics.pendingProductsCount > 0 && (
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-medium bg-amber-700 text-white px-3 py-1.5 rounded-lg hover:bg-amber-800 transition"
                    >
                      Review Crafts
                    </button>
                  )}
                  {metrics.pendingArtisansCount > 0 && (
                    <button
                      onClick={() => setActiveTab('artisans')}
                      className="text-xs font-medium bg-stone-800 text-white px-3 py-1.5 rounded-lg hover:bg-stone-900 transition"
                    >
                      Verify Artisans
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Metrics Overview Grid (The 6 required metrics) */}
            <div>
              <h2 className="text-base font-semibold text-stone-900 mb-3">Platform Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* 1. Total Users */}
                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-xs font-medium">Total Users</span>
                    <span className="material-symbols-outlined text-stone-400 text-sm">groups</span>
                  </div>
                  <div className="text-2xl font-bold text-stone-900">{metrics.totalUsers}</div>
                  <div className="text-[11px] text-stone-500 mt-1">Platform-wide</div>
                </div>

                {/* 2. Artisans */}
                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-amber-600 mb-1">
                    <span className="text-xs font-medium">Artisans</span>
                    <span className="material-symbols-outlined text-amber-600 text-sm">palette</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-900">{metrics.artisansCount}</div>
                  <div className="text-[11px] text-amber-700 mt-1">Master Creators</div>
                </div>

                {/* 3. Buyers */}
                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-indigo-600 mb-1">
                    <span className="text-xs font-medium">Buyers</span>
                    <span className="material-symbols-outlined text-indigo-600 text-sm">shopping_bag</span>
                  </div>
                  <div className="text-2xl font-bold text-indigo-900">{metrics.buyersCount}</div>
                  <div className="text-[11px] text-indigo-700 mt-1">Retail & B2B</div>
                </div>

                {/* 4. Products */}
                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-emerald-600 mb-1">
                    <span className="text-xs font-medium">Products</span>
                    <span className="material-symbols-outlined text-emerald-600 text-sm">inventory_2</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-900">{metrics.productsCount}</div>
                  <div className="text-[11px] text-emerald-700 mt-1">{metrics.publishedProductsCount} published</div>
                </div>

                {/* 5. Pending Approvals */}
                <div className="bg-white border border-amber-300 rounded-xl p-4 shadow-sm bg-amber-50/40">
                  <div className="flex items-center justify-between text-amber-700 mb-1">
                    <span className="text-xs font-medium">Pending Approvals</span>
                    <span className="material-symbols-outlined text-amber-700 text-sm">pending_actions</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-950">{metrics.pendingApprovalsCount}</div>
                  <div className="text-[11px] text-amber-800 mt-1">Need Custodian Action</div>
                </div>

                {/* 6. Orders */}
                <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-blue-600 mb-1">
                    <span className="text-xs font-medium">Orders</span>
                    <span className="material-symbols-outlined text-blue-600 text-sm">receipt_long</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{metrics.ordersCount}</div>
                  <div className="text-[11px] text-blue-700 mt-1">₹{metrics.totalRevenue.toLocaleString()} GMV</div>
                </div>
              </div>
            </div>

            {/* Simple Analytics Section */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">KalaMart Analytics & Growth</h3>
                  <p className="text-xs text-stone-500">Key performance signals across onboarding and craft catalog</p>
                </div>
                <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2 py-1 rounded">Live Data</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. New Artisan Registrations */}
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      New Artisan Registrations
                    </span>
                    <span className="material-symbols-outlined text-amber-600 text-sm">trending_up</span>
                  </div>
                  <div className="text-xl font-bold text-stone-900">+{metrics.analytics.newArtisansCount}</div>
                  <p className="text-xs text-stone-500 mt-1">New craft masters onboarded this cycle</p>
                  <div className="mt-3 flex items-center space-x-1.5 text-xs text-emerald-700">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    <span>100% Verified GI/Heritage Origin</span>
                  </div>
                </div>

                {/* 2. Products Published */}
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Products Published
                    </span>
                    <span className="material-symbols-outlined text-emerald-600 text-sm">storefront</span>
                  </div>
                  <div className="text-xl font-bold text-stone-900">{metrics.publishedProductsCount} / {metrics.productsCount}</div>
                  <p className="text-xs text-stone-500 mt-1">Active verified crafts in buyer marketplace</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Object.entries(metrics.analytics.categoryBreakdown).map(([cat, count]) => (
                      <span key={cat} className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-600 font-medium">
                        {cat}: {count}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Orders Velocity */}
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Orders Volume
                    </span>
                    <span className="material-symbols-outlined text-blue-600 text-sm">payments</span>
                  </div>
                  <div className="text-xl font-bold text-stone-900">{metrics.ordersCount} Total Orders</div>
                  <p className="text-xs text-stone-500 mt-1">Gross Merchandise Value: ₹{metrics.totalRevenue.toLocaleString()}</p>
                  <div className="mt-3 flex items-center space-x-1.5 text-xs text-indigo-700">
                    <span className="material-symbols-outlined text-xs">local_shipping</span>
                    <span>Direct Artisan Royalty Flow Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab('products')}
                className="bg-white border border-stone-200 hover:border-amber-400 p-4 rounded-xl cursor-pointer transition flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center transition">
                    <span className="material-symbols-outlined">rate_review</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900">Manage Product Submissions</div>
                    <div className="text-xs text-stone-500">Review images, story, pricing, and approve for marketplace</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-stone-400 group-hover:text-amber-600 transition">
                  arrow_forward
                </span>
              </div>

              <div
                onClick={() => setActiveTab('artisans')}
                className="bg-white border border-stone-200 hover:border-indigo-400 p-4 rounded-xl cursor-pointer transition flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 text-indigo-700 flex items-center justify-center transition">
                    <span className="material-symbols-outlined">workspace_premium</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900">Artisan Verification Queue</div>
                    <div className="text-xs text-stone-500">Audit craft credentials, assign trust levels & badges</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-stone-400 group-hover:text-indigo-600 transition">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: PRODUCT REVIEW                                                */}
        {/* ==================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-stone-900">Product Review & Quality Audit</h2>
                <p className="text-xs text-stone-500">Review submitted craft listings before publishing to buyer catalog</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                {(['all', 'pending_review', 'published', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setProductStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      productStatusFilter === st
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'All'
                      : st === 'pending_review'
                      ? `Pending Review (${products.filter((p) => p.status === 'pending_review').length})`
                      : st === 'published'
                      ? 'Published'
                      : 'Rejected'}
                  </button>
                ))}
              </div>
            </div>

            {/* Products List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-stone-400 mb-2">inventory_2</span>
                <h3 className="text-sm font-semibold text-stone-800">No products found</h3>
                <p className="text-xs text-stone-500 mt-1">No products match the selected status filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((prod) => {
                  const details = databaseService.getProductWithDetails(prod.id);
                  const isPending = prod.status === 'pending_review';
                  const isPublished = prod.status === 'published';
                  const isRejected = prod.status === 'rejected';

                  return (
                    <div
                      key={prod.id}
                      className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm hover:shadow transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded tracking-wide ${
                                isPending
                                  ? 'bg-amber-100 text-amber-800'
                                  : isPublished
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {prod.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-stone-500">{prod.category}</span>
                          </div>
                          <span className="text-xs text-stone-400 font-mono">
                            {new Date(prod.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Product Title & Thumbnail */}
                        <div className="mt-3 flex space-x-3">
                          <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200">
                            {details?.images[0]?.original_url ? (
                              <img
                                src={details.images[0].original_url}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <span className="material-symbols-outlined text-lg">image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-stone-900 truncate">{prod.name}</h3>
                            <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">{prod.description}</p>
                            <div className="mt-1 flex items-center space-x-2 text-[11px] text-stone-500">
                              <span>₹{prod.price}</span>
                              <span>•</span>
                              <span>Stock: {prod.stock}</span>
                              <span>•</span>
                              <span>{prod.production_time}</span>
                            </div>
                          </div>
                        </div>

                        {/* Rejection Note if rejected */}
                        {isRejected && prod.rejection_reason && (
                          <div className="mt-3 p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                            <strong>Rejection Note:</strong> {prod.rejection_reason}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedProductId(prod.id)}
                          className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center space-x-1"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>Full Details</span>
                        </button>

                        <div className="flex items-center space-x-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleOpenRejectModal(prod.id)}
                                className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleApproveProduct(prod.id, prod.name)}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                              >
                                Approve
                              </button>
                            </>
                          )}
                          {isPublished && (
                            <span className="text-xs text-emerald-700 font-medium flex items-center space-x-1">
                              <span className="material-symbols-outlined text-xs">verified</span>
                              <span>Live on KalaMart</span>
                            </span>
                          )}
                          {isRejected && (
                            <button
                              onClick={() => handleApproveProduct(prod.id, prod.name)}
                              className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 rounded-lg transition"
                            >
                              Re-approve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: ARTISAN VERIFICATION                                          */}
        {/* ==================================================================== */}
        {activeTab === 'artisans' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-stone-900">Artisan Verification Queue</h2>
                <p className="text-xs text-stone-500">Audit workshop heritage, assigned trust levels, and GI documentation</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setArtisanFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      artisanFilter === st
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'All'
                      : st === 'pending'
                      ? `Pending (${artisanProfiles.filter((a) => a.verification_status === 'pending').length})`
                      : st === 'approved'
                      ? 'Approved'
                      : 'Rejected'}
                  </button>
                ))}
              </div>
            </div>

            {/* Artisans List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArtisans.map((ap) => {
                const userObj = databaseService.getUserById(ap.user_id);
                const isPending = ap.verification_status === 'pending';
                const isApproved = ap.verification_status === 'approved';

                return (
                  <div
                    key={ap.user_id}
                    className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={userObj?.profile_image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                            alt={userObj?.name}
                            className="w-12 h-12 rounded-full object-cover border border-stone-200"
                          />
                          <div>
                            <h3 className="text-sm font-semibold text-stone-900">{userObj?.name || 'Artisan Master'}</h3>
                            <p className="text-xs text-stone-500">{ap.location}</p>
                            <div className="flex items-center space-x-1 text-[11px] text-amber-700 font-medium mt-0.5">
                              <span>{ap.craft_category}</span>
                              <span>•</span>
                              <span>{ap.experience_years}</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                            isPending
                              ? 'bg-indigo-100 text-indigo-800'
                              : isApproved
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ap.verification_status}
                        </span>
                      </div>

                      {/* Craft Info & Story */}
                      <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-xs space-y-1">
                        <div className="text-stone-700 font-medium">{ap.specialization}</div>
                        <p className="text-stone-600 line-clamp-2">{ap.story}</p>
                        {ap.guild_name && (
                          <div className="text-[11px] text-stone-500 pt-1">
                            <strong>Guild:</strong> {ap.guild_name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedArtisanUserId(ap.user_id)}
                        className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center space-x-1"
                      >
                        <span className="material-symbols-outlined text-sm">badge</span>
                        <span>View Profile & Docs</span>
                      </button>

                      <div className="flex space-x-2">
                        {isPending && (
                          <>
                            <button
                              onClick={() => {
                                setArtisanActionModal({
                                  type: 'reject',
                                  userId: ap.user_id,
                                  name: userObj?.name || 'Artisan'
                                });
                                setArtisanRejectReason('Additional workshop verification required.');
                              }}
                              className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                setArtisanActionModal({
                                  type: 'approve',
                                  userId: ap.user_id,
                                  name: userObj?.name || 'Artisan'
                                });
                                setArtisanVerifyLevel(3);
                                setArtisanVerifyNotes('Verified traditional craft credentials and workshop lineage.');
                              }}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                            >
                              Approve Verification
                            </button>
                          </>
                        )}
                        {isApproved && (
                          <span className="text-xs text-emerald-700 font-medium flex items-center space-x-1">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            <span>Verified Master</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: USER MANAGEMENT                                               */}
        {/* ==================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search and Role Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-stone-400 text-sm">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, city..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                {(['all', 'artisan', 'buyer', 'b2b', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      userRoleFilter === r
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {r === 'all' ? 'All Roles' : r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-50 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={u.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-stone-200"
                            />
                            <div>
                              <div className="font-semibold text-stone-900">{u.name}</div>
                              <div className="text-[11px] text-stone-400 font-mono">ID: {u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              u.role === 'artisan'
                                ? 'bg-amber-100 text-amber-800'
                                : u.role === 'b2b'
                                ? 'bg-indigo-100 text-indigo-800'
                                : u.role === 'admin'
                                ? 'bg-stone-800 text-stone-100'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          <div>{u.email || '—'}</div>
                          <div className="text-[11px] text-stone-400">{u.phone || '—'}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-600">{u.location || 'India'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : u.status === 'suspended'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`text-xs px-2.5 py-1 rounded transition font-medium ${
                              u.status === 'suspended'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: ORDER MONITORING                                              */}
        {/* ==================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-stone-400 text-sm">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by order ID, city, tracking..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                {(['all', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      orderStatusFilter === st
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Buyer / City</th>
                      <th className="py-3 px-4">Artisan</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Tracking</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                    {filteredOrders.map((ord) => {
                      const buyer = databaseService.getUserById(ord.buyer_id);
                      const artisan = databaseService.getUserById(ord.artisan_id);

                      return (
                        <tr key={ord.id} className="hover:bg-stone-50 transition">
                          <td className="py-3 px-4 font-mono font-medium text-stone-900">{ord.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-stone-900">{buyer?.name || 'Buyer'}</div>
                            <div className="text-[11px] text-stone-500">{ord.delivery_city || 'India'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-stone-800 font-medium">{artisan?.name || 'Artisan'}</div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-stone-900">₹{ord.total.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'Shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'Processing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                            {ord.tracking_id || 'Generating...'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => setSelectedOrderId(ord.id)}
                                className="text-xs px-2.5 py-1 text-stone-700 hover:text-stone-900 border border-stone-200 rounded transition"
                              >
                                Items
                              </button>
                              {ord.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'Processing')}
                                  className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded transition"
                                >
                                  Process
                                </button>
                              )}
                              {ord.status === 'Processing' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'Shipped')}
                                  className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition"
                                >
                                  Ship
                                </button>
                              )}
                              {ord.status === 'Shipped' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                                  className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded transition"
                                >
                                  Deliver
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODAL 1: PRODUCT REVIEW & INSPECTION DRAWER                           */}
      {/* ==================================================================== */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {selectedProductDetails.product.status.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  {selectedProductDetails.product.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductId(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Images Gallery */}
            <div>
              <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Product Imagery</h4>
              <div className="grid grid-cols-3 gap-2">
                {selectedProductDetails.images.map((img) => (
                  <div key={img.id} className="aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                    <img src={img.original_url} alt="Review" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Technique */}
            <div className="space-y-2 text-xs text-stone-700">
              <div>
                <strong className="text-stone-900">Description:</strong>
                <p className="mt-0.5 text-stone-600 leading-relaxed">
                  {selectedProductDetails.product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-lg border border-stone-100">
                <div>
                  <span className="text-stone-400">Materials:</span>
                  <div className="font-medium text-stone-800">{selectedProductDetails.product.materials}</div>
                </div>
                <div>
                  <span className="text-stone-400">Craft Technique:</span>
                  <div className="font-medium text-stone-800">{selectedProductDetails.product.craft_technique}</div>
                </div>
                <div>
                  <span className="text-stone-400">Price & Stock:</span>
                  <div className="font-medium text-stone-800">₹{selectedProductDetails.product.price} ({selectedProductDetails.product.stock} in stock)</div>
                </div>
                <div>
                  <span className="text-stone-400">Production Time:</span>
                  <div className="font-medium text-stone-800">{selectedProductDetails.product.production_time}</div>
                </div>
              </div>

              {/* Artisan provenance */}
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center space-x-3">
                <img
                  src={selectedProductDetails.artisan?.profile_image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                  alt="Artisan"
                  className="w-10 h-10 rounded-full object-cover border border-amber-200"
                />
                <div>
                  <div className="font-semibold text-stone-900 text-xs">
                    Crafted by {selectedProductDetails.artisan?.name || 'Artisan'}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    {selectedProductDetails.artisanProfile?.location || 'India'} • {selectedProductDetails.artisanProfile?.experience_years || 'Master Artisan'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedProductId(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
              {selectedProductDetails.product.status === 'pending_review' && (
                <>
                  <button
                    onClick={() => {
                      const pid = selectedProductDetails.product.id;
                      setSelectedProductId(null);
                      handleOpenRejectModal(pid);
                    }}
                    className="px-4 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                  >
                    Reject with Reason
                  </button>
                  <button
                    onClick={() =>
                      handleApproveProduct(
                        selectedProductDetails.product.id,
                        selectedProductDetails.product.name
                      )
                    }
                    className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                  >
                    Approve & Publish
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: REJECT PRODUCT WITH REASON                                   */}
      {/* ==================================================================== */}
      {rejectModalProductId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2 text-rose-700">
                <span className="material-symbols-outlined">cancel</span>
                <h3 className="text-sm font-bold">Reject Craft Submission</h3>
              </div>
              <button
                onClick={() => setRejectModalProductId(null)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Provide specific guidance so the artisan can revise their craft listing:
            </p>

            {/* Quick Reason Suggestions */}
            <div className="space-y-1.5">
              {[
                'Additional workshop and handmade loom photos required.',
                'Materials composition is incomplete or missing natural dye details.',
                'Low-resolution images: please upload clearer craft angles.',
                'Pricing requires clarification against cluster market rates.'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRejectionReason(suggestion)}
                  className="w-full text-left text-[11px] p-2 rounded bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 transition"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Custom Rejection Reason:
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-200 rounded-lg focus:ring-1 focus:ring-rose-500 focus:outline-none"
                placeholder="Explain what the artisan needs to change..."
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setRejectModalProductId(null)}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectProduct}
                className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: ARTISAN VERIFICATION ACTION                                 */}
      {/* ==================================================================== */}
      {artisanActionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                {artisanActionModal.type === 'approve'
                  ? `Approve Verification: ${artisanActionModal.name}`
                  : `Reject Verification: ${artisanActionModal.name}`}
              </h3>
              <button
                onClick={() => setArtisanActionModal(null)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {artisanActionModal.type === 'approve' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Assign Trust & Verification Level:
                  </label>
                  <select
                    value={artisanVerifyLevel}
                    onChange={(e) => setArtisanVerifyLevel(Number(e.target.value) as VerificationLevel)}
                    className="w-full p-2 border border-stone-200 rounded-lg text-xs"
                  >
                    <option value={2}>Level 2: Identity & Cluster Verified</option>
                    <option value={3}>Level 3: Master Artisan & GI Heritage Certified</option>
                    <option value={4}>Level 4: National Awardee & Export Ready</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Auditor Notes (Permanent Record):
                  </label>
                  <textarea
                    rows={2}
                    value={artisanVerifyNotes}
                    onChange={(e) => setArtisanVerifyNotes(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg text-xs"
                    placeholder="Audit notes on workshop setup, guild verification..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <label className="block font-semibold text-stone-700">
                  Reason for Clarification / Rejection:
                </label>
                <textarea
                  rows={3}
                  value={artisanRejectReason}
                  onChange={(e) => setArtisanRejectReason(e.target.value)}
                  className="w-full p-2 border border-stone-200 rounded-lg text-xs"
                  placeholder="Specify why verification cannot be granted..."
                />
              </div>
            )}

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setArtisanActionModal(null)}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800"
              >
                Cancel
              </button>
              {artisanActionModal.type === 'approve' ? (
                <button
                  onClick={handleConfirmArtisanApprove}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                >
                  Confirm Approval
                </button>
              ) : (
                <button
                  onClick={handleConfirmArtisanReject}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
                >
                  Confirm Rejection
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: ORDER ITEMS DETAIL MODAL                                    */}
      {/* ==================================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-stone-900">{selectedOrderDetails.order.id}</span>
                <div className="text-xs text-stone-500">
                  {new Date(selectedOrderDetails.order.created_at).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Buyer & Artisan info */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-lg">
              <div>
                <span className="text-stone-400">Buyer:</span>
                <div className="font-semibold text-stone-900">{selectedOrderDetails.buyer?.name}</div>
                <div className="text-stone-500">{selectedOrderDetails.order.delivery_city}</div>
              </div>
              <div>
                <span className="text-stone-400">Artisan Guild:</span>
                <div className="font-semibold text-stone-900">{selectedOrderDetails.artisan?.name}</div>
                <div className="text-stone-500">{selectedOrderDetails.artisan?.location}</div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-stone-600 uppercase">Items in Shipment</h4>
              {selectedOrderDetails.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between p-2 border border-stone-200 rounded-lg text-xs">
                  <div className="flex items-center space-x-2">
                    {it.image && (
                      <img src={it.image} alt={it.product_name} className="w-10 h-10 rounded object-cover" />
                    )}
                    <div>
                      <div className="font-medium text-stone-900">{it.product_name}</div>
                      <div className="text-stone-500">Qty: {it.quantity} × ₹{it.unit_price}</div>
                    </div>
                  </div>
                  <div className="font-bold text-stone-900">₹{it.total_price}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-700">Total Amount</span>
              <span className="text-base font-bold text-stone-900">₹{selectedOrderDetails.order.total.toLocaleString()}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrderId(null)}
                className="px-4 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
