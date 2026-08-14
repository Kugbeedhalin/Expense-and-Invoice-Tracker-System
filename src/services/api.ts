import {
  Client,
  DashboardStats,
  Invoice,
  Transaction,
  User,
} from '../types';

const TOKEN_KEY = 'extract_jwt_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'API Request failed' }));
    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const data = await fetchAPI<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  async register(email: string, password: string, name: string, companyName?: string): Promise<{ token: string; user: User }> {
    const data = await fetchAPI<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, companyName }),
    });
    setStoredToken(data.token);
    return data;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    return fetchAPI<{ user: User }>('/api/auth/me');
  },

  logout() {
    setStoredToken(null);
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return fetchAPI<DashboardStats>('/api/dashboard/stats');
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return fetchAPI<Transaction[]>('/api/transactions');
  },

  async createTransaction(tx: Omit<Transaction, 'id' | 'isoDate'>): Promise<Transaction> {
    return fetchAPI<Transaction>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(tx),
    });
  },

  async updateTransaction(id: string, tx: Partial<Transaction>): Promise<Transaction> {
    return fetchAPI<Transaction>(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tx),
    });
  },

  async deleteTransaction(id: string): Promise<{ success: boolean }> {
    return fetchAPI<{ success: boolean }>(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    return fetchAPI<Invoice[]>('/api/invoices');
  },

  async createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    return fetchAPI<Invoice>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  },

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    return fetchAPI<Invoice>(`/api/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoice),
    });
  },

  async deleteInvoice(id: string): Promise<{ success: boolean }> {
    return fetchAPI<{ success: boolean }>(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
  },

  // Clients
  async getClients(): Promise<Client[]> {
    return fetchAPI<Client[]>('/api/clients');
  },

  async createClient(client: Partial<Client>): Promise<Client> {
    return fetchAPI<Client>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  },

  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    return fetchAPI<Client>(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  },

  async deleteClient(id: string): Promise<{ success: boolean }> {
    return fetchAPI<{ success: boolean }>(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  },

  // Users (Admin Only)
  async getUsers(): Promise<User[]> {
    return fetchAPI<User[]>('/api/users');
  },

  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'user';
    companyName?: string;
  }): Promise<User> {
    return fetchAPI<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async updateUserRole(id: string, role: 'admin' | 'user'): Promise<User> {
    return fetchAPI<User>(`/api/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async deleteUser(id: string): Promise<{ success: boolean }> {
    return fetchAPI<{ success: boolean }>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};
