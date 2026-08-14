import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  User as UserIcon,
  Search,
  Mail,
  Lock,
  Building,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Shield,
  UserCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { User, UserRole } from '../types';

interface UserManagementViewProps {
  currentUser: User | null;
  users: User[];
  onCreateUser: (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    companyName?: string;
  }) => Promise<void>;
  onUpdateRole: (id: string, role: UserRole) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  users,
  onCreateUser,
  onUpdateRole,
  onDeleteUser,
}) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('user');
  const [companyName, setCompanyName] = useState('Extract Financials');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
    setCompanyName(currentUser?.companyName || 'Extract Financials');
    setError(null);
    setShowRegisterModal(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onCreateUser({
        name,
        email,
        password,
        role,
        companyName,
      });

      setSuccessMsg(`User ${name} successfully registered as ${role === 'admin' ? 'Admin' : 'Normal User'}.`);
      setShowRegisterModal(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to register user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            Admin Access Portal
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Registration & Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Register new users into the system, select their access level (Admin or Normal User), and manage team permissions.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New User</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Stats Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/60 text-purple-700 font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Admins: {users.filter((u) => u.role === 'admin').length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            Normal Users: {users.filter((u) => u.role !== 'admin').length}
          </span>
        </div>
      </div>

      {/* Users Directory List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Registered Users ({filteredUsers.length})
          </h3>
          <span className="text-[11px] text-slate-400">Total System Accounts</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <UserIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium">No users found matching your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUsers.map((u) => {
              const isAdmin = u.role === 'admin';
              const isSelf = u.id === currentUser?.id;

              return (
                <div
                  key={u.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl font-bold flex items-center justify-center text-sm shadow-xs ${
                        isAdmin
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{u.name}</h4>
                        {isSelf && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            You (Current Session)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{u.companyName || 'Extract Financials'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Role badge and selector */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                          isAdmin
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> : <UserIcon className="w-3.5 h-3.5 text-slate-500" />}
                        {isAdmin ? 'Admin' : 'Normal User'}
                      </span>

                      {/* Quick Role Toggle */}
                      {!isSelf && (
                        <select
                          value={u.role || 'user'}
                          onChange={(e) => onUpdateRole(u.id, e.target.value as UserRole)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700 font-semibold cursor-pointer hover:border-purple-300"
                          title="Change User Access Level"
                        >
                          <option value="user">Normal User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </div>

                    {/* Delete user button */}
                    {!isSelf && (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Register User Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                  Register New User
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set user credentials and select access role (Normal User or Admin).
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Amankwah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. samuel@extract.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden p-0.5 rounded cursor-pointer transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* USER ROLE SELECTION - Explicit option for Normal User or Admin */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Select User Role *</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => setRole('user')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                      role === 'user'
                        ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20 text-purple-900 font-bold'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value="user"
                      checked={role === 'user'}
                      onChange={() => setRole('user')}
                      className="sr-only"
                    />
                    <UserIcon className={`w-5 h-5 ${role === 'user' ? 'text-purple-600' : 'text-slate-400'}`} />
                    <span className="text-xs">Normal User</span>
                    <span className="text-[10px] text-slate-500 font-normal leading-tight">
                      Standard access to transactions & invoices
                    </span>
                  </label>

                  <label
                    onClick={() => setRole('admin')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                      role === 'admin'
                        ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20 text-purple-900 font-bold'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={() => setRole('admin')}
                      className="sr-only"
                    />
                    <ShieldCheck className={`w-5 h-5 ${role === 'admin' ? 'text-purple-600' : 'text-slate-400'}`} />
                    <span className="text-xs">Admin</span>
                    <span className="text-[10px] text-slate-500 font-normal leading-tight">
                      Full access & user management rights
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Extract Financials"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all cursor-pointer"
                >
                  {submitting ? 'Registering...' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
