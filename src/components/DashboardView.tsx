import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building,
  Wallet,
  Globe,
  Plus,
  FilePlus,
  ChevronRight,
  Sparkles,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { DashboardStats, Transaction, User } from '../types';

interface DashboardViewProps {
  stats: DashboardStats | null;
  user: User | null;
  onNavigateToTransactions: () => void;
  onNavigateToInvoices: () => void;
  onQuickAddTransaction: () => void;
  onQuickCreateInvoice: () => void;
  onOpenUserManagement?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  user,
  onNavigateToTransactions,
  onNavigateToInvoices,
  onQuickAddTransaction,
  onQuickCreateInvoice,
  onOpenUserManagement,
}) => {
  const activeStats: DashboardStats = stats || {
    currentBalance: 0,
    balanceGrowth: 0,
    totalIncome: 0,
    incomeGrowth: 0,
    totalExpenses: 0,
    expenseGrowth: 0,
    fundTransfers: { card: 0, sameBank: 0, wallet: 0, otherBank: 0 },
    cashFlow: [],
    recentTransactions: [],
  };

  const formatCurrency = (val: number) =>
    '¢' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            Executive Financial Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Extract Dashboard
            {isAdmin && (
              <span className="text-xs bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                Admin
              </span>
            )}
          </h1>
          <p className="text-sm text-indigo-200 mt-1">
            Real-time balance, income vs expense cash flow, and latest transaction history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {isAdmin && onOpenUserManagement && (
            <button
              onClick={onOpenUserManagement}
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-purple-400/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register User</span>
            </button>
          )}

          <button
            onClick={onQuickAddTransaction}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
          >
            <Plus className="w-4 h-4" />
            Log Entry
          </button>
          <button
            onClick={onQuickCreateInvoice}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* 3 Metric Cards matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Current Balance Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-50/90 via-sky-50/60 to-white border border-cyan-100/80 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Balance</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {formatCurrency(activeStats.currentBalance)}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ {activeStats.balanceGrowth}% vs last month</span>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50/90 via-indigo-50/60 to-white border border-purple-100/80 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Income</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {formatCurrency(activeStats.totalIncome)}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ {activeStats.incomeGrowth}% vs last month</span>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/90 via-pink-50/60 to-white border border-rose-100/80 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {formatCurrency(activeStats.totalExpenses)}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-bold">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>↓ {Math.abs(activeStats.expenseGrowth)}% vs last month</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Cash Flow Chart + Latest Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cash Flow Overview Bar Chart (Cols 7) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cash Flow Overview</h3>
              <p className="text-xs text-slate-400">Monthly breakdown of income and expenses</p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-xl">2026</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeStats.cashFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `¢${v / 1000}K`}
                />
                <Tooltip
                  formatter={(value: any) => [`¢${value.toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
                  formatter={(value) => (value === 'income' ? 'Income' : 'Expenses')}
                />
                <Bar dataKey="income" fill="#635BFF" radius={[4, 4, 0, 0]} barSize={12} name="income" />
                <Bar dataKey="expenses" fill="#00D2FF" radius={[4, 4, 0, 0]} barSize={12} name="expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Transactions Table (Cols 5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Latest Transactions</h3>
            <button
              onClick={onNavigateToTransactions}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">NAME</th>
                  <th className="pb-3 font-semibold text-right">AMOUNT</th>
                  <th className="pb-3 font-semibold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeStats.recentTransactions.slice(0, 5).map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3">
                          {tx.avatarUrl ? (
                            <img
                              src={tx.avatarUrl}
                              alt={tx.name}
                              className="w-8 h-8 rounded-full object-cover shadow-2xs"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                              {tx.name.charAt(0)}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-800 truncate">{tx.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{tx.date}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 text-right text-xs font-extrabold whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-600' : 'text-slate-800'}>
                          {isIncome ? `+¢${tx.amount.toFixed(2)}` : `-¢${tx.amount.toFixed(2)}`}
                        </span>
                      </td>

                      <td className="py-3 text-right whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tx.status === 'Success'
                              ? 'bg-emerald-100 text-emerald-700'
                              : tx.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row: Fund Transfers Summary */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900">Fund Transfers Breakdown</h3>
          <span className="text-xs text-slate-400">Aggregated channel volume</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black text-slate-900">¢{activeStats.fundTransfers.card.toLocaleString()}</h4>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">TRANSFER VIA CARD</p>
          </div>

          {/* Same Bank */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <Building className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black text-slate-900">¢{activeStats.fundTransfers.sameBank.toLocaleString()}</h4>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">SAME BANK</p>
          </div>

          {/* Via Wallet */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2">
              <Wallet className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black text-slate-900">¢{activeStats.fundTransfers.wallet.toLocaleString()}</h4>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">VIA WALLET</p>
          </div>

          {/* Other Bank */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black text-slate-900">¢{activeStats.fundTransfers.otherBank.toLocaleString()}</h4>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">OTHER BANK</p>
          </div>
        </div>
      </div>
    </div>
  );
};
