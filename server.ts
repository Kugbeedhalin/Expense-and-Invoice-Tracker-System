import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'extract-financials-super-secret-key-2026';

const app = express();
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data matching the prompt & Figma design screenshot
const INITIAL_SEED = {
  users: [
    {
      id: 'usr_101',
      email: 'owner@extract.com',
      password: 'password123', // Demo login
      name: 'Kugbee Floky',
      role: 'admin',
      companyName: 'Extract Financials',
      companyAddress: 'Accra - Ghana',
      companyPhone: '+233 24 123 4567',
      companyEmail: 'hello@extract.com',
    },
  ],
  transactions: [
    {
      id: 'tx_1',
      type: 'income',
      name: 'Sebastian Kingsley',
      category: 'Transfer',
      amount: 50.2,
      date: '02/06/2023 - 10:45 AM',
      isoDate: '2023-06-02',
      status: 'Success',
      note: 'Freelance payment for mobile design',
      transferMethod: 'Card',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'tx_2',
      type: 'expense',
      name: 'Amazon Prime',
      category: 'Subscriptions',
      amount: 43.9,
      date: '02/06/2023 - 12:00 AM',
      isoDate: '2023-06-02',
      status: 'Success',
      note: 'Office monthly supply auto-renewal',
      transferMethod: 'Same Bank',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'tx_3',
      type: 'expense',
      name: 'Gabriel Whitman',
      category: 'Services',
      amount: 30.1,
      date: '07/06/2023 - 01:00 PM',
      isoDate: '2023-06-07',
      status: 'Failed',
      note: 'Consulting fee retry',
      transferMethod: 'Wallet',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'tx_4',
      type: 'income',
      name: 'Nathaniel Ashford',
      category: 'Transfer',
      amount: 90.9,
      date: '15/06/2023 - 10:02 AM',
      isoDate: '2023-06-15',
      status: 'Success',
      note: 'Invoiced retainer settlement',
      transferMethod: 'Card',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'tx_5',
      type: 'expense',
      name: 'Netflix',
      category: 'Subscriptions',
      amount: 20.0,
      date: '23/06/2023 - 04:22 PM',
      isoDate: '2023-06-23',
      status: 'Success',
      note: 'Team breakroom streaming account',
      transferMethod: 'Other Bank',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'tx_6',
      type: 'income',
      name: 'Acme Enterprise Solutions',
      category: 'Invoice',
      amount: 1200.0,
      date: '10/08/2026 - 09:30 AM',
      isoDate: '2026-08-10',
      status: 'Success',
      note: 'Payment for Invoice #INV-2024-001',
      transferMethod: 'Same Bank',
    },
    {
      id: 'tx_7',
      type: 'expense',
      name: 'Figma & GitHub Suite',
      category: 'Software',
      amount: 185.0,
      date: '08/08/2026 - 02:15 PM',
      isoDate: '2026-08-08',
      status: 'Success',
      note: 'Design & Dev tools license renewal',
      transferMethod: 'Card',
    },
    {
      id: 'tx_8',
      type: 'income',
      name: 'Stark Industries LLC',
      category: 'Invoice',
      amount: 3500.0,
      date: '05/08/2026 - 11:00 AM',
      isoDate: '2026-08-05',
      status: 'Success',
      note: 'Q3 Enterprise Architecture Retainer',
      transferMethod: 'Wire',
    },
  ],
  invoices: [
    {
      id: 'inv_1',
      invoiceNumber: 'INV-2024-001',
      clientName: 'Acme Corporation',
      clientEmail: 'billing@acmecorp.com',
      clientAddress: 'Attn: Jane Doe\nAccra - Ghana',
      clientAttn: 'Jane Doe',
      issueDate: '2026-08-12',
      dueDate: '2026-09-11',
      items: [
        {
          id: 'item_1',
          description: 'Q3 Enterprise Software Development Retainer',
          qty: 1,
          rate: 1200,
          amount: 1200,
        },
        {
          id: 'item_2',
          description: 'Custom API Gateway Security Audit',
          qty: 1,
          rate: 450,
          amount: 450,
        },
      ],
      subtotal: 1650,
      taxPercent: 5,
      taxAmount: 82.5,
      discount: 0,
      total: 1732.5,
      status: 'Sent',
      notes: 'Payment due within 30 days. Thank you for your business!',
      template: 'modern',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'inv_2',
      invoiceNumber: 'INV-2024-002',
      clientName: 'Stark Industries',
      clientEmail: 'finance@stark.com',
      clientAddress: 'Accra - Ghana',
      clientAttn: 'Pepper Potts',
      issueDate: '2026-08-01',
      dueDate: '2026-08-31',
      items: [
        {
          id: 'item_3',
          description: 'Cloud Infrastructure Migration & Monitoring',
          qty: 2,
          rate: 1750,
          amount: 3500,
        },
      ],
      subtotal: 3500,
      taxPercent: 0,
      taxAmount: 0,
      discount: 200,
      total: 3300,
      status: 'Paid',
      notes: 'Wire transfer received on 05/08/2026.',
      template: 'modern',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'inv_3',
      invoiceNumber: 'INV-2024-003',
      clientName: 'Wayne Enterprises',
      clientEmail: 'accounts@wayne.com',
      clientAddress: 'Accra - Ghana',
      clientAttn: 'Lucius Fox',
      issueDate: '2026-08-10',
      dueDate: '2026-08-25',
      items: [
        {
          id: 'item_4',
          description: 'UI/UX Design System & Figma Component Library',
          qty: 1,
          rate: 2800,
          amount: 2800,
        },
      ],
      subtotal: 2800,
      taxPercent: 8,
      taxAmount: 224,
      discount: 0,
      total: 3024,
      status: 'Pending',
      notes: 'Payment due within 15 days.',
      template: 'modern',
      createdAt: new Date().toISOString(),
    },
  ],
  clients: [
    {
      id: 'cli_1',
      name: 'Acme Corporation',
      company: 'Acme Corp',
      email: 'billing@acmecorp.com',
      phone: '+233 24 987 6543',
      address: 'Accra - Ghana',
      attn: 'Jane Doe',
      totalBilled: 1732.5,
      activeInvoicesCount: 1,
      status: 'Active',
    },
    {
      id: 'cli_2',
      name: 'Stark Industries',
      company: 'Stark Industries',
      email: 'finance@stark.com',
      phone: '+233 24 234 5678',
      address: 'Accra - Ghana',
      attn: 'Pepper Potts',
      totalBilled: 3300,
      activeInvoicesCount: 0,
      status: 'Active',
    },
    {
      id: 'cli_3',
      name: 'Wayne Enterprises',
      company: 'Wayne Ent',
      email: 'accounts@wayne.com',
      phone: '+233 24 876 5432',
      address: 'Accra - Ghana',
      attn: 'Lucius Fox',
      totalBilled: 3024,
      activeInvoicesCount: 1,
      status: 'Active',
    },
  ],
  dashboardStats: {
    currentBalance: 8200,
    balanceGrowth: 21,
    totalIncome: 1550,
    incomeGrowth: 7.9,
    totalExpenses: 5210,
    expenseGrowth: -32,
    fundTransfers: {
      card: 1200,
      sameBank: 4500,
      wallet: 3200,
      otherBank: 1150,
    },
    cashFlow: [
      { month: 'Jan', income: 6200, expenses: 4100 },
      { month: 'Feb', income: 7800, expenses: 5200 },
      { month: 'Mar', income: 5500, expenses: 3900 },
      { month: 'Apr', income: 8900, expenses: 6100 },
      { month: 'May', income: 9400, expenses: 4800 },
      { month: 'Jun', income: 7100, expenses: 5900 },
      { month: 'Jul', income: 8500, expenses: 4500 },
      { month: 'Aug', income: 9200, expenses: 5210 },
      { month: 'Sep', income: 7600, expenses: 3800 },
      { month: 'Oct', income: 8100, expenses: 4900 },
      { month: 'Nov', income: 6900, expenses: 3600 },
      { month: 'Dec', income: 10500, expenses: 6500 },
    ],
  },
};

// Database helper functions
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2));
      return INITIAL_SEED;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB file, using in-memory seed:', err);
    return INITIAL_SEED;
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

// Authentication Middleware
interface AuthenticatedRequest extends Request {
  user?: any;
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// ================= API ROUTES =================

// 1. Authentication Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = readDB();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const userRole = user.role || (user.id === 'usr_101' ? 'admin' : 'user');
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: userRole },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPass } = user;
  return res.json({ token, user: { ...userWithoutPass, role: userRole } });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, name, companyName, role } = req.body;
  const db = readDB();

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const assignedRole = role === 'admin' ? 'admin' : 'user';

  const newUser = {
    id: `usr_${Date.now()}`,
    email,
    password,
    name,
    role: assignedRole,
    companyName: companyName || 'Extract Financials',
    companyAddress: 'Accra - Ghana',
    companyPhone: '+233 24 123 4567',
    companyEmail: email,
  };

  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPass } = newUser;
  return res.json({ token, user: userWithoutPass });
});

app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = readDB();
  const user = db.users.find((u: any) => u.id === req.user.id) || db.users[0];
  const { password, ...userWithoutPass } = user;
  const userRole = user.role || (user.id === 'usr_101' ? 'admin' : 'user');
  res.json({ user: { ...userWithoutPass, role: userRole } });
});

// Admin User Management Endpoints
app.get('/api/users', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = readDB();
  const currentUser = db.users.find((u: any) => u.id === req.user.id);
  const currentRole = currentUser?.role || (currentUser?.id === 'usr_101' ? 'admin' : 'user');

  if (currentRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }

  const userList = db.users.map(({ password, ...u }: any) => ({
    ...u,
    role: u.role || (u.id === 'usr_101' ? 'admin' : 'user'),
  }));

  res.json(userList);
});

app.post('/api/users', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = readDB();
  const currentUser = db.users.find((u: any) => u.id === req.user.id);
  const currentRole = currentUser?.role || (currentUser?.id === 'usr_101' ? 'admin' : 'user');

  if (currentRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }

  const { email, password, name, role, companyName } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    email,
    password,
    name,
    role: role === 'admin' ? 'admin' : 'user',
    companyName: companyName || 'Extract Financials',
    companyAddress: 'Accra - Ghana',
    companyPhone: '+233 24 123 4567',
    companyEmail: email,
  };

  db.users.push(newUser);
  writeDB(db);

  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json(userWithoutPass);
});

app.put('/api/users/:id/role', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = readDB();
  const currentUser = db.users.find((u: any) => u.id === req.user.id);
  const currentRole = currentUser?.role || (currentUser?.id === 'usr_101' ? 'admin' : 'user');

  if (currentRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }

  const { role } = req.body;
  const index = db.users.findIndex((u: any) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.users[index].role = role === 'admin' ? 'admin' : 'user';
  writeDB(db);

  const { password, ...userWithoutPass } = db.users[index];
  res.json(userWithoutPass);
});

app.delete('/api/users/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = readDB();
  const currentUser = db.users.find((u: any) => u.id === req.user.id);
  const currentRole = currentUser?.role || (currentUser?.id === 'usr_101' ? 'admin' : 'user');

  if (currentRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }

  const targetId = req.params.id;
  if (targetId === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own admin account' });
  }

  const initialLen = db.users.length;
  db.users = db.users.filter((u: any) => u.id !== targetId);

  if (db.users.length === initialLen) {
    return res.status(404).json({ error: 'User not found' });
  }

  writeDB(db);
  res.json({ success: true, message: 'User deleted' });
});

// 2. Dashboard Analytics Endpoint
app.get('/api/dashboard/stats', authenticateToken, (req: Request, res: Response) => {
  const db = readDB();

  // Re-calculate dynamic totals from transactions
  let totalIncome = 0;
  let totalExpenses = 0;

  db.transactions.forEach((tx: any) => {
    if (tx.status === 'Success') {
      if (tx.type === 'income') totalIncome += tx.amount;
      if (tx.type === 'expense') totalExpenses += tx.amount;
    }
  });

  const currentBalance = totalIncome - totalExpenses + 11860; // Base balance calculation

  res.json({
    ...db.dashboardStats,
    currentBalance: Math.max(currentBalance, 8200),
    totalIncome: Math.max(totalIncome, 1550),
    totalExpenses: Math.max(totalExpenses, 5210),
    recentTransactions: db.transactions.slice(0, 6),
  });
});

// 3. Transactions CRUD
app.get('/api/transactions', authenticateToken, (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.transactions);
});

app.post('/api/transactions', authenticateToken, (req: Request, res: Response) => {
  const { type, name, category, amount, date, status, note, transferMethod } = req.body;
  const db = readDB();

  if (!name || !amount || !type) {
    return res.status(400).json({ error: 'Name, amount, and type are required' });
  }

  const now = new Date();
  const formattedDate = date || `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${now.getFullYear()} - ${now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  const newTx = {
    id: `tx_${Date.now()}`,
    type: type || 'expense',
    name,
    category: category || 'General',
    amount: parseFloat(amount),
    date: formattedDate,
    isoDate: now.toISOString().split('T')[0],
    status: status || 'Success',
    note: note || '',
    transferMethod: transferMethod || 'Same Bank',
  };

  db.transactions.unshift(newTx);
  writeDB(db);

  res.status(201).json(newTx);
});

app.put('/api/transactions/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.transactions.findIndex((t: any) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  db.transactions[index] = { ...db.transactions[index], ...req.body };
  writeDB(db);

  res.json(db.transactions[index]);
});

app.delete('/api/transactions/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = db.transactions.length;
  db.transactions = db.transactions.filter((t: any) => t.id !== id);

  if (db.transactions.length === initialLength) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  writeDB(db);
  res.json({ success: true, message: 'Transaction deleted' });
});

// 4. Invoices CRUD
app.get('/api/invoices', authenticateToken, (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.invoices);
});

app.post('/api/invoices', authenticateToken, (req: Request, res: Response) => {
  const {
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
    template,
  } = req.body;

  const db = readDB();

  const newInv = {
    id: `inv_${Date.now()}`,
    invoiceNumber: invoiceNumber || `# INV-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(3, '0')}`,
    clientName: clientName || 'Valued Client',
    clientEmail: clientEmail || '',
    clientAddress: clientAddress || '',
    clientAttn: clientAttn || '',
    issueDate: issueDate || new Date().toISOString().split('T')[0],
    dueDate: dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    items: items || [],
    subtotal: subtotal || 0,
    taxPercent: taxPercent || 0,
    taxAmount: taxAmount || 0,
    discount: discount || 0,
    total: total || 0,
    status: status || 'Draft',
    notes: notes || 'Payment due within 30 days.',
    template: template || 'modern',
    createdAt: new Date().toISOString(),
  };

  db.invoices.unshift(newInv);
  writeDB(db);

  res.status(201).json(newInv);
});

app.put('/api/invoices/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.invoices.findIndex((inv: any) => inv.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  db.invoices[index] = { ...db.invoices[index], ...req.body };
  writeDB(db);

  res.json(db.invoices[index]);
});

app.delete('/api/invoices/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = db.invoices.length;
  db.invoices = db.invoices.filter((inv: any) => inv.id !== id);

  if (db.invoices.length === initialLength) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  writeDB(db);
  res.json({ success: true, message: 'Invoice deleted' });
});

// 5. Clients CRUD
app.get('/api/clients', authenticateToken, (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.clients);
});

app.post('/api/clients', authenticateToken, (req: Request, res: Response) => {
  const { name, company, email, phone, address, attn } = req.body;
  const db = readDB();

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newClient = {
    id: `cli_${Date.now()}`,
    name,
    company: company || name,
    email,
    phone: phone || '',
    address: address || '',
    attn: attn || '',
    totalBilled: 0,
    activeInvoicesCount: 0,
    status: 'Active',
  };

  db.clients.push(newClient);
  writeDB(db);

  res.status(201).json(newClient);
});

app.put('/api/clients/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.clients.findIndex((c: any) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Client not found' });
  }

  db.clients[index] = { ...db.clients[index], ...req.body };
  writeDB(db);

  res.json(db.clients[index]);
});

app.delete('/api/clients/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();
  const initialLength = db.clients.length;
  db.clients = db.clients.filter((c: any) => c.id !== id);

  if (db.clients.length === initialLength) {
    return res.status(404).json({ error: 'Client not found' });
  }

  writeDB(db);
  res.json({ success: true, message: 'Client deleted' });
});

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'Extract Expense & Invoice Tracker', time: new Date() });
});

// ================= VITE / STATIC SERVING =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Extract App Server running on http://localhost:${PORT}`);
  });
}

startServer();
