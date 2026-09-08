import React from 'react';
import { ScreenType, User } from '../../types';

interface AdminRouteGuardProps {
  currentUser?: User | null;
  onNavigate: (screen: ScreenType) => void;
  onAuthenticateAsAdmin: () => void;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  currentUser,
  onNavigate,
  onAuthenticateAsAdmin
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 shadow-xl p-6 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>

        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-100 mb-2">
            Role-Based Route Protection
          </span>
          <h2 className="text-xl font-bold text-stone-900">Administrator Access Required</h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            The KalaConnect Custodian Dashboard is restricted to verified Administrator accounts. 
            Your current session role is{' '}
            <span className="font-semibold text-stone-900 uppercase">
              {currentUser?.role || 'Guest'}
            </span>.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-left text-xs space-y-1.5 text-stone-600">
          <div className="flex items-center space-x-2 font-medium text-stone-900">
            <span className="material-symbols-outlined text-amber-600 text-sm">security</span>
            <span>Protected Admin Operations:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-500 pl-1">
            <li>Review & approve artisan craft submissions</li>
            <li>Verify artisan GI credentials & assign trust levels</li>
            <li>User account management & status controls</li>
            <li>Full marketplace order monitoring & analytics</li>
          </ul>
        </div>

        <div className="space-y-2 pt-2">
          <button
            id="auth-as-admin-btn"
            onClick={onAuthenticateAsAdmin}
            className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-md transition flex items-center justify-center space-x-2"
          >
            <span className="material-symbols-outlined text-base">admin_panel_settings</span>
            <span>Authenticate as Platform Admin (Demo)</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition"
          >
            Return to Marketplace Home
          </button>
        </div>
      </div>
    </div>
  );
};
