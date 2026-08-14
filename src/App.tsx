/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { api, getStoredToken } from './services/api';
import { AuthState, Client, DashboardStats, Invoice, Transaction, User, UserRole } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { InvoicesView } from './components/InvoicesView';
import { ClientsView } from './components/ClientsView';
import { SettingsView } from './components/SettingsView';
import { UserManagementView } from './components/UserManagementView';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: getStoredToken(),
    isAuthenticated: false,
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // App Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);

  // Trigger quick create modes
  const [quickTransactionOpen, setQuickTransactionOpen] = useState(false);
  const [quickInvoiceOpen, setQuickInvoiceOpen] = useState(false);

  // Initialize Auth - Always start at Login screen for index page
  useEffect(() => {
    // Clear any previous token on fresh load so the index/starting page is always the login page
    api.logout();
    setAuthState({ user: null, token: null, isAuthenticated: false });
    setLoading(false);
  }, []);

  const loadAppData = async (currentUser?: User | null) => {
    try {
      const activeUser = currentUser !== undefined ? currentUser : authState.user;
      const isAdmin = activeUser?.role === 'admin';

      const [s, t, i, c, u] = await Promise.all([
        api.getDashboardStats(),
        api.getTransactions(),
        api.getInvoices(),
        api.getClients(),
        isAdmin ? api.getUsers().catch(() => []) : Promise.resolve([]),
      ]);
      setStats(s);
      setTransactions(t);
      setInvoices(i);
      setClients(c);
      if (u) setUsersList(u);
    } catch (err) {
      console.error('Error fetching application data:', err);
    }
  };

  const handleCreateUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    companyName?: string;
  }) => {
    const newUser = await api.createUser(userData);
    setUsersList((prev) => [...prev, newUser]);
  };

  const handleUpdateUserRole = async (id: string, role: UserRole) => {
    const updated = await api.updateUserRole(id, role);
    setUsersList((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  const handleDeleteUser = async (id: string) => {
    await api.deleteUser(id);
    setUsersList((prev) => prev.filter((u) => u.id !== id));
  };

  // Handlers for Data Mutations
  const handleAddTransaction = async (txData: Omit<Transaction, 'id' | 'isoDate'>) => {
    try {
      const newTx = await api.createTransaction(txData);
      setTransactions((prev) => [newTx, ...prev]);
      await refreshStats();
    } catch (err) {
      console.error('Failed to log transaction:', err);
    }
  };

  const handleUpdateTransaction = async (id: string, txData: Partial<Transaction>) => {
    try {
      const updated = await api.updateTransaction(id, txData);
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      await refreshStats();
    } catch (err) {
      console.error('Failed to update transaction:', err);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      await refreshStats();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  const handleCreateInvoice = async (invoiceData: Partial<Invoice>, status: 'Draft' | 'Sent' | 'Pending') => {
    try {
      const newInv = await api.createInvoice({ ...invoiceData, status });
      setInvoices((prev) => [newInv, ...prev]);
      await refreshStats();
    } catch (err) {
      console.error('Failed to create invoice:', err);
    }
  };

  const handleUpdateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
    try {
      const updated = await api.updateInvoice(id, invoiceData);
      setInvoices((prev) => prev.map((i) => (i.id === id ? updated : i)));
      await refreshStats();
    } catch (err) {
      console.error('Failed to update invoice:', err);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await api.deleteInvoice(id);
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      await refreshStats();
    } catch (err) {
      console.error('Failed to delete invoice:', err);
    }
  };

  const handleCreateClient = async (clientData: Partial<Client>) => {
    try {
      const newClient = await api.createClient(clientData);
      setClients((prev) => [...prev, newClient]);
    } catch (err) {
      console.error('Failed to create client:', err);
    }
  };

  const handleUpdateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const updated = await api.updateClient(id, clientData);
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('Failed to update client:', err);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await api.deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete client:', err);
    }
  };

  const refreshStats = async () => {
    try {
      const updatedStats = await api.getDashboardStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentTab('dashboard');
    setAuthState({ user: null, token: null, isAuthenticated: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-purple-600 animate-spin flex items-center justify-center font-black text-xl mb-4">
          E
        </div>
        <p className="text-sm font-semibold text-slate-300">Loading Extract Financials...</p>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <AuthScreen
        onSuccess={async (user) => {
          const token = getStoredToken();
          setCurrentTab('dashboard');
          setAuthState({ user, token, isAuthenticated: true });
          await loadAppData(user);
        }}
      />
    );
  }

  // Ensure non-admin users default to dashboard if on admin-only tabs or if invalid tab
  const activeTab =
    currentTab === 'user-management' && authState.user?.role !== 'admin'
      ? 'dashboard'
      : currentTab;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900 font-sans antialiased">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={activeTab}
        setCurrentTab={setCurrentTab}
        user={authState.user}
        onLogout={handleLogout}
        isOpen={mobileNavOpen}
        setIsOpen={setMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          user={authState.user}
          onLogout={handleLogout}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onQuickAddTransaction={() => {
            setCurrentTab('transactions');
            setQuickTransactionOpen(true);
          }}
          onQuickCreateInvoice={() => {
            setCurrentTab('invoices');
            setQuickInvoiceOpen(true);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              user={authState.user}
              onNavigateToTransactions={() => setCurrentTab('transactions')}
              onNavigateToInvoices={() => setCurrentTab('invoices')}
              onQuickAddTransaction={() => {
                setCurrentTab('transactions');
                setQuickTransactionOpen(true);
              }}
              onQuickCreateInvoice={() => {
                setCurrentTab('invoices');
                setQuickInvoiceOpen(true);
              }}
              onOpenUserManagement={() => setCurrentTab('user-management')}
            />
          )}

          {activeTab === 'user-management' && authState.user?.role === 'admin' && (
            <UserManagementView
              currentUser={authState.user}
              users={usersList}
              onCreateUser={handleCreateUser}
              onUpdateRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              initialCreateMode={quickTransactionOpen}
            />
          )}

          {activeTab === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              clients={clients}
              user={authState.user}
              onCreateInvoice={handleCreateInvoice}
              onUpdateInvoice={handleUpdateInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              initialCreateMode={quickInvoiceOpen}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView
              clients={clients}
              onCreateClient={handleCreateClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              user={authState.user}
              onUpdateUser={(updated) => {
                if (authState.user) {
                  setAuthState((prev) => ({
                    ...prev,
                    user: { ...prev.user!, ...updated },
                  }));
                }
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
