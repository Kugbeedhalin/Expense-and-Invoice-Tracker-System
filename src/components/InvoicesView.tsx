import React, { useState } from 'react';
import { FilePlus, Search, Download, Eye, Edit2, Trash2, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Client, Invoice, User } from '../types';
import { InvoiceEditor } from './InvoiceEditor';
import { InvoicePreview } from './InvoicePreview';

interface InvoicesViewProps {
  invoices: Invoice[];
  clients: Client[];
  user: User | null;
  onCreateInvoice: (inv: Partial<Invoice>, status: 'Draft' | 'Sent' | 'Pending') => Promise<void>;
  onUpdateInvoice: (id: string, inv: Partial<Invoice>) => Promise<void>;
  onDeleteInvoice: (id: string) => Promise<void>;
  initialCreateMode?: boolean;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  clients,
  user,
  onCreateInvoice,
  onUpdateInvoice,
  onDeleteInvoice,
  initialCreateMode = false,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mode, setMode] = useState<'list' | 'editor' | 'preview'>(
    initialCreateMode ? 'editor' : 'list'
  );
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.clientEmail && inv.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleEditClick = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setMode('editor');
  };

  const handlePreviewClick = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setMode('preview');
  };

  const handleCreateSave = async (data: Partial<Invoice>, status: 'Draft' | 'Sent' | 'Pending') => {
    if (selectedInvoice && selectedInvoice.id) {
      await onUpdateInvoice(selectedInvoice.id, { ...data, status });
    } else {
      await onCreateInvoice(data, status);
    }
    setMode('list');
    setSelectedInvoice(null);
  };

  const formatCurrency = (val: number) =>
    '¢' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (mode === 'editor') {
    return (
      <InvoiceEditor
        clients={clients}
        user={user}
        initialInvoice={selectedInvoice}
        onSave={handleCreateSave}
        onPreview={(inv) => {
          setSelectedInvoice(inv);
          setMode('preview');
        }}
        onCancel={() => {
          setMode('list');
          setSelectedInvoice(null);
        }}
      />
    );
  }

  if (mode === 'preview' && selectedInvoice) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setMode('list')}
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl inline-flex items-center gap-1 cursor-pointer"
        >
          ← Back to Invoice List
        </button>
        <InvoicePreview
          invoice={selectedInvoice}
          user={user}
          onSend={async () => {
            if (selectedInvoice.id) {
              await onUpdateInvoice(selectedInvoice.id, { status: 'Sent' });
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create professional invoices, monitor payment statuses, and export PDF documents.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedInvoice(null);
            setMode('editor');
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <FilePlus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
          {['All', 'Paid', 'Sent', 'Pending', 'Draft', 'Overdue'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === tab
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by # or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Invoice Cards / Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">INVOICE #</th>
                <th className="py-4 px-4">CLIENT</th>
                <th className="py-4 px-4">DUE DATE</th>
                <th className="py-4 px-4 text-right">AMOUNT</th>
                <th className="py-4 px-4 text-center">STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 font-mono">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-slate-800">{inv.clientName}</p>
                        <p className="text-[10px] text-slate-400">{inv.clientEmail || 'No email'}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">{inv.dueDate}</td>

                    <td className="py-4 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(inv.total)}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : inv.status === 'Sent'
                            ? 'bg-blue-100 text-blue-700'
                            : inv.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handlePreviewClick(inv)}
                          title="Preview & PDF"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(inv)}
                          title="Edit Invoice"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          title="Delete Invoice"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-semibold">No invoices match your filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
