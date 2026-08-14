import React, { useState } from 'react';
import { Plus, Trash2, Save, Send, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Client, Invoice, InvoiceItem, User } from '../types';

interface InvoiceEditorProps {
  clients: Client[];
  user: User | null;
  initialInvoice?: Invoice | null;
  onSave: (invoice: Partial<Invoice>, status: 'Draft' | 'Sent' | 'Pending') => Promise<void>;
  onPreview: (invoice: Invoice) => void;
  onCancel: () => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  clients,
  user,
  initialInvoice,
  onSave,
  onPreview,
  onCancel,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber || `# INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientName, setClientName] = useState(initialInvoice?.clientName || '');
  const [clientEmail, setClientEmail] = useState(initialInvoice?.clientEmail || '');
  const [clientAddress, setClientAddress] = useState(initialInvoice?.clientAddress || '');
  const [clientAttn, setClientAttn] = useState(initialInvoice?.clientAttn || '');
  const [issueDate, setIssueDate] = useState(
    initialInvoice?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    initialInvoice?.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(initialInvoice?.notes || 'Payment due within 30 days.');
  const [taxPercent, setTaxPercent] = useState<number>(initialInvoice?.taxPercent || 5);
  const [discount, setDiscount] = useState<number>(initialInvoice?.discount || 0);

  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items || [
      {
        id: '1',
        description: 'Q3 Enterprise Software Development Retainer',
        qty: 1,
        rate: 1200,
        amount: 1200,
      },
    ]
  );

  const [saving, setSaving] = useState(false);

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value;
    setSelectedClientId(cid);
    const found = clients.find((c) => c.id === cid);
    if (found) {
      setClientName(found.name);
      setClientEmail(found.email);
      setClientAddress(found.address);
      setClientAttn(found.attn || '');
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'qty' || field === 'rate') {
            const q = field === 'qty' ? parseFloat(value) || 0 : item.qty;
            const r = field === 'rate' ? parseFloat(value) || 0 : item.rate;
            updated.amount = q * r;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: 'New Services Item',
      qty: 1,
      rate: 100,
      amount: 100,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  // Computations
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = Math.max(0, subtotal + taxAmount - discount);

  const getInvoiceData = (status: 'Draft' | 'Sent' | 'Pending'): Partial<Invoice> => ({
    id: initialInvoice?.id,
    invoiceNumber,
    clientName,
    clientEmail,
    clientAddress,
    clientAttn,
    issueDate,
    dueDate,
    items,
    subtotal,
    taxPercent,
    taxAmount,
    discount,
    total,
    status,
    notes,
    template: 'modern',
  });

  const handleSubmit = async (status: 'Draft' | 'Sent' | 'Pending') => {
    setSaving(true);
    try {
      await onSave(getInvoiceData(status), status);
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewClick = () => {
    onPreview(getInvoiceData('Draft') as Invoice);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
            <p className="text-xs text-slate-400">Fill in details, line items, and pricing schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviewClick}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => handleSubmit('Draft')}
            disabled={saving}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSubmit('Sent')}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md shadow-purple-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{saving ? 'Processing...' : 'Send Invoice'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Form: Details */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
          <h3 className="text-xs font-extrabold text-purple-600 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Invoice Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-mono font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Right Form: Billed To Client */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-purple-600 uppercase tracking-widest">
              Billed To (Client Info)
            </h3>
            {clients.length > 0 && (
              <select
                onChange={handleClientSelect}
                value={selectedClientId}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
              >
                <option value="">-- Choose Existing Client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Client / Company Name</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Acme Corporation"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="billing@acmecorp.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Attention To (Attn)</label>
              <input
                type="text"
                value={clientAttn}
                onChange={(e) => setClientAttn(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Address</label>
            <textarea
              rows={2}
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Accra - Ghana"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Line Items</h3>
          <button
            onClick={addItem}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ITEM DESCRIPTION</th>
                <th className="py-3 px-2 w-20 text-center">QTY</th>
                <th className="py-3 px-2 w-28 text-right">RATE (¢)</th>
                <th className="py-3 px-4 w-32 text-right">AMOUNT (¢)</th>
                <th className="py-3 px-2 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="Service or product description"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                      className="w-full text-center bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                    />
                  </td>
                  <td className="p-2 text-right">
                    <input
                      type="number"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                      className="w-full text-right bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800"
                    />
                  </td>
                  <td className="p-2 text-right font-bold text-slate-900 pr-4">
                    ¢{item.amount.toFixed(2)}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Box & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Notes / Payment Terms</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment due within 30 days. Late payments subject to interest."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
          />
        </div>

        <div className="bg-purple-600 text-white p-5 rounded-2xl shadow-lg shadow-purple-600/20 space-y-3">
          <div className="flex justify-between text-xs text-purple-100">
            <span>Subtotal</span>
            <span className="font-semibold">¢{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-purple-100 gap-2">
            <span className="flex items-center gap-1">Tax (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={taxPercent}
              onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
              className="w-16 bg-purple-700/80 border border-purple-400 text-white text-right px-2 py-0.5 rounded text-xs"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-200 gap-2">
            <span>Discount (¢)</span>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              className="w-20 bg-purple-700/80 border border-purple-400 text-white text-right px-2 py-0.5 rounded text-xs"
            />
          </div>

          <div className="flex justify-between text-lg font-extrabold text-white pt-2 border-t border-purple-400/50">
            <span>Total Amount</span>
            <span>¢{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
