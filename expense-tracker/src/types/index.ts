export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO string YYYY-MM-DD
  category: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType | 'both';
  color: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // plain for localStorage demo only
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

export interface FilterOptions {
  search: string;
  category: string;
  type: TransactionType | 'all';
  startDate: string;
  endDate: string;
}
