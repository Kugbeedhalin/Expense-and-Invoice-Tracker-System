export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
}

export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'Success' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  category: string;
  amount: number;
  date: string; // e.g. "02/06/2023 - 10:45 AM"
  isoDate: string; // e.g. "2026-08-12"
  status: TransactionStatus;
  note?: string;
  transferMethod?: 'Card' | 'Same Bank' | 'Wallet' | 'Other Bank' | 'Cash' | 'Wire';
  avatarUrl?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Pending';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "# INV-2024-001"
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientAttn?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  template?: 'modern' | 'classic' | 'minimal';
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  attn?: string;
  totalBilled: number;
  activeInvoicesCount: number;
  status: 'Active' | 'Inactive';
}

export interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
}

export interface FundTransferSummary {
  card: number;
  sameBank: number;
  wallet: number;
  otherBank: number;
}

export interface DashboardStats {
  currentBalance: number;
  balanceGrowth: number; // percentage, e.g. 21
  totalIncome: number;
  incomeGrowth: number; // e.g. 7.9
  totalExpenses: number;
  expenseGrowth: number; // e.g. -32
  fundTransfers: FundTransferSummary;
  cashFlow: CashFlowData[];
  recentTransactions: Transaction[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
