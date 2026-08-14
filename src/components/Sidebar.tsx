import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  Users,
  Settings,
  LogOut,
  CreditCard,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  isOpen,
  setIsOpen,
}) => {
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    ...(isAdmin ? [{ id: 'user-management', label: 'User Management', icon: UserPlus }] : []),
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-64 bg-indigo-900 lg:bg-indigo-950 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-indigo-800/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-900/50">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                Extract <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-normal">Pro</span>
              </h1>
              <p className="text-xs text-indigo-300/80 font-medium truncate max-w-[140px]">
                {user?.companyName || 'Financials'}
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-4 py-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 font-semibold'
                      : 'text-indigo-200 hover:bg-indigo-900/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-indigo-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Logout Sidebar Nav Item */}
            <div className="pt-2 mt-2 border-t border-indigo-800/40">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-indigo-800/50 m-4 rounded-2xl bg-indigo-900/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-sm shadow shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-indigo-300 truncate">{user?.email || 'owner@extract.com'}</p>
            </div>
          </div>

          <div className="mb-3 px-2 py-1 rounded-lg bg-indigo-950/60 flex items-center justify-between text-[10px]">
            <span className="text-indigo-300">Access Role:</span>
            <span className="font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
              {user?.role === 'admin' ? 'Admin' : 'Normal User'}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-indigo-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
