import React, { useState } from 'react';
import {
  PlusCircle,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Tag,
  DollarSign,
  Pencil,
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'isoDate'>) => Promise<void>;
  onUpdateTransaction?: (id: string, tx: Partial<Transaction>) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
  initialCreateMode?: boolean;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  initialCreateMode = false,
}) => {
  const [showModal, setShowModal] = useState(initialCreateMode);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [type, setType] = useState<TransactionType>('expense');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Software');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [transferMethod, setTransferMethod] = useState<'Card' | 'Same Bank' | 'Wallet' | 'Other Bank' | 'Wire'>('Same Bank');
  const [status, setStatus] = useState<'Success' | 'Pending' | 'Failed'>('Success');
  const [submitting, setSubmitting] = useState(false);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setType('expense');
    setName('');
    setCategory('Software');
    setAmount('');
    setNote('');
    setTransferMethod('Same Bank');
    setStatus('Success');
    setShowModal(true);
  };

  const handleOpenEditModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setType(tx.type);
    setName(tx.name);
    setCategory(tx.category || 'Software');
    setAmount(tx.amount.toString());
    setNote(tx.note || '');
    setTransferMethod(tx.transferMethod || 'Same Bank');
    setStatus(tx.status || 'Success');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;
    setSubmitting(true);

    try {
      if (editingTransaction && onUpdateTransaction) {
        await onUpdateTransaction(editingTransaction.id, {
          type,
          name,
          category,
          amount: parseFloat(amount),
          note,
          transferMethod,
          status,
        });
      } else {
        const now = new Date();
        const dateString = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`;

        await onAddTransaction({
          type,
          name,
          category,
          amount: parseFloat(amount),
          date: dateString,
          status,
          note,
          transferMethod,
        });
      }

      setShowModal(false);
      setEditingTransaction(null);
      setName('');
      setAmount('');
      setNote('');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: number) =>
    '¢' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transaction History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Log financial entries, record expenses, edit details, and organize cash flows by category.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Transaction</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'all' ? 'All Transactions' : t}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor, recipient, note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">NAME / DETAILS</th>
                <th className="py-4 px-4">CATEGORY</th>
                <th className="py-4 px-4">METHOD</th>
                <th className="py-4 px-4 text-right">AMOUNT</th>
                <th className="py-4 px-4 text-center">STATUS</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold ${
                              isIncome
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{tx.name}</p>
                            <p className="text-[10px] text-slate-400">{tx.date} • {tx.note || 'No note'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          {tx.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {tx.transferMethod || 'Bank'}
                      </td>

                      <td className="py-4 px-4 text-right font-extrabold text-sm">
                        <span className={isIncome ? 'text-emerald-600' : 'text-slate-900'}>
                          {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
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

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(tx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                            title="Edit Transaction"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTransaction(tx.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No transactions found matching criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log / Edit Transaction */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editingTransaction ? 'Edit Transaction Details' : 'Log Financial Entry'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTransaction(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    type === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    type === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient / Vendor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Figma, Sebastian Kingsley, AWS"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (¢)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="50.20"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                  >
                    <option value="Transfer">Transfer</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Software">Software</option>
                    <option value="Services">Services</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Retainer">Retainer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Transfer Method</label>
                  <select
                    value={transferMethod}
                    onChange={(e: any) => setTransferMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                  >
                    <option value="Card">Card</option>
                    <option value="Same Bank">Same Bank</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Other Bank">Other Bank</option>
                    <option value="Wire">Wire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                  >
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="Design consulting fee..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTransaction(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200"
                >
                  {submitting ? 'Saving...' : editingTransaction ? 'Update Transaction' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
