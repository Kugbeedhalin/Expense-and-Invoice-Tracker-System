import React, { useState } from 'react';
import { UserPlus, Search, Building, Mail, Phone, MapPin, FileText, Pencil, Trash2 } from 'lucide-react';
import { Client } from '../types';

interface ClientsViewProps {
  clients: Client[];
  onCreateClient: (client: Partial<Client>) => Promise<void>;
  onUpdateClient?: (id: string, client: Partial<Client>) => Promise<void>;
  onDeleteClient?: (id: string) => Promise<void>;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onCreateClient,
  onUpdateClient,
  onDeleteClient,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [attn, setAttn] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingClient(null);
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setAddress('');
    setAttn('');
    setShowModal(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setCompany(client.company || '');
    setEmail(client.email);
    setPhone(client.phone || '');
    setAddress(client.address || '');
    setAttn(client.attn || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);

    try {
      if (editingClient && onUpdateClient) {
        await onUpdateClient(editingClient.id, {
          name,
          company: company || name,
          email,
          phone,
          address,
          attn,
        });
      } else {
        await onCreateClient({
          name,
          company: company || name,
          email,
          phone,
          address,
          attn,
        });
      }

      setShowModal(false);
      setEditingClient(null);
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setAddress('');
      setAttn('');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: number) =>
    '¢' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Client Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage client profiles, custom billing addresses, and lifetime revenue.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by client or company name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-lg shadow-2xs">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{client.name}</h3>
                  <p className="text-xs text-slate-400">{client.company}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {client.status}
                </span>
                <button
                  onClick={() => handleOpenEditModal(client)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                  title="Edit Client Details"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {onDeleteClient && (
                  <button
                    onClick={() => onDeleteClient(client.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{client.address}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">LIFETIME BILLED</span>
                <span className="font-extrabold text-slate-900">{formatCurrency(client.totalBilled)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block">ACTIVE INVOICES</span>
                <span className="font-bold text-purple-600">{client.activeInvoicesCount} Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editingClient ? 'Edit Client Details' : 'Add New Client'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingClient(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client / Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corporation"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="billing@acmecorp.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+233 24 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Client Address</label>
                <textarea
                  rows={2}
                  placeholder="Enter full address (e.g. 14 Ring Road Central, Accra)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingClient(null);
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
                  {submitting ? 'Saving...' : editingClient ? 'Update Client' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
