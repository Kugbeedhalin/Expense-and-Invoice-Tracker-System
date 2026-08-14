import React, { useState } from 'react';
import { Search, Bell, Menu, PlusCircle, FilePlus, Calendar, LogOut, User as UserIcon, ChevronDown, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onOpenMobileNav: () => void;
  onQuickAddTransaction: () => void;
  onQuickCreateInvoice: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onOpenMobileNav,
  onQuickAddTransaction,
  onQuickCreateInvoice,
  searchQuery,
  setSearchQuery,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Invoice Paid', time: '10m ago', text: 'Acme Enterprise paid Invoice #INV-2024-001 ($1,200.00)' },
    { id: 2, title: 'New Transaction', time: '1h ago', text: 'Sebastian Kingsley sent $50.20 via Card transfer' },
    { id: 3, title: 'Tax Due Reminder', time: '1d ago', text: 'Q3 Estimated Tax filing deadline is approaching' },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left Search & Mobile Toggle */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileNav}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search finances, invoices, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Right Actions & User Info */}
      <div className="flex items-center gap-3">
        {/* Quick Action Buttons */}
        <button
          onClick={onQuickAddTransaction}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-purple-600" />
          <span>Log Expense/Income</span>
        </button>

        <button
          onClick={onQuickCreateInvoice}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer"
        >
          <FilePlus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (showProfileMenu) setShowProfileMenu(false);
            }}
            className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-600 relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-purple-600 absolute top-2 right-2 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Activity Feed</h4>
                <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">3 New</span>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout Popover */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              if (showNotifications) setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs border border-purple-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Owner'}</p>
              <p className="text-[10px] text-slate-500 font-medium">{user?.companyName || 'Business Owner'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <UserIcon className="w-4 h-4 text-purple-600" />
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Business Owner'}</p>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'owner@extract.com'}</p>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Role</span>
                  <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-purple-600" />
                    {user?.role === 'admin' ? 'Admin' : 'Normal User'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
