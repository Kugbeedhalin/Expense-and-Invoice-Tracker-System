import React, { useState } from 'react';
import { Building, ShieldCheck, Database, Save, CheckCircle2, Key } from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  user: User | null;
  onUpdateUser?: (updated: Partial<User>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
  const [companyName, setCompanyName] = useState(user?.companyName || 'Extract Financials');
  const [companyAddress, setCompanyAddress] = useState(
    user?.companyAddress || 'Accra - Ghana'
  );
  const [companyPhone, setCompanyPhone] = useState(user?.companyPhone || '+233 24 123 4567');
  const [companyEmail, setCompanyEmail] = useState(user?.companyEmail || 'hello@extract.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        companyName,
        companyAddress,
        companyPhone,
        companyEmail,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure company branding for invoices, review JWT authorization status, and system specs.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Business settings updated successfully! Invoices will reflect the new branding.</span>
        </div>
      )}

      {/* Business Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <Building className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-bold text-slate-900">Company Invoice Branding</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company Display Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Support Email</label>
            <input
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Postal Address</label>
            <input
              type="text"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md shadow-purple-200 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Security & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Key className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">JWT Token Session</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <p><span className="font-semibold text-slate-800">Auth Token Status:</span> Active (JWT RS256 / Bearer)</p>
            <p><span className="font-semibold text-slate-800">User Email:</span> {user?.email}</p>
            <p><span className="font-semibold text-slate-800">Role:</span> Primary Business Owner</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">System Architecture</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <p><span className="font-semibold text-slate-800">API Endpoint:</span> Express REST API (`/api/*`)</p>
            <p><span className="font-semibold text-slate-800">Database Engine:</span> Local JSON File Store (`./data/db.json`)</p>
            <p><span className="font-semibold text-slate-800">PDF Generator:</span> Vector PDF via jsPDF & html2canvas</p>
          </div>
        </div>
      </div>
    </div>
  );
};
