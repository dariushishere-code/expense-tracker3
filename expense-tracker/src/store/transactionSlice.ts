import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Transaction, Category, FilterOptions } from '../types';

interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  filters: FilterOptions;
}

const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem('et_transactions');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const loadCategories = (): Category[] => {
  try {
    const data = localStorage.getItem('et_categories');
    if (data) return JSON.parse(data);
  } catch {}
  return [
    { id: '1', name: 'Food', type: 'expense', color: '#ef4444', userId: 'default' },
    { id: '2', name: 'Transport', type: 'expense', color: '#f97316', userId: 'default' },
    { id: '3', name: 'Bills', type: 'expense', color: '#eab308', userId: 'default' },
    { id: '4', name: 'Entertainment', type: 'expense', color: '#8b5cf6', userId: 'default' },
    { id: '5', name: 'Shopping', type: 'expense', color: '#ec4899', userId: 'default' },
    { id: '6', name: 'Salary', type: 'income', color: '#22c55e', userId: 'default' },
    { id: '7', name: 'Freelance', type: 'income', color: '#14b8a6', userId: 'default' },
    { id: '8', name: 'Other', type: 'both', color: '#6b7280', userId: 'default' },
  ];
};

const saveTransactions = (txs: Transaction[]) => {
  localStorage.setItem('et_transactions', JSON.stringify(txs));
};

const saveCategories = (cats: Category[]) => {
  localStorage.setItem('et_categories', JSON.stringify(cats));
};

const initialState: TransactionState = {
  transactions: loadTransactions(),
  categories: loadCategories(),
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    startDate: '',
    endDate: '',
  },
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
      const newTx: Transaction = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.transactions.push(newTx);
      saveTransactions(state.transactions);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const idx = state.transactions.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.transactions[idx] = action.payload;
        saveTransactions(state.transactions);
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
      saveTransactions(state.transactions);
    },
    addCategory: (state, action: PayloadAction<Omit<Category, 'id'>>) => {
      const newCat: Category = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.categories.push(newCat);
      saveCategories(state.categories);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
      saveCategories(state.categories);
    },
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: 'all',
        type: 'all',
        startDate: '',
        endDate: '',
      };
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  addCategory,
  deleteCategory,
  setFilters,
  clearFilters,
} = transactionSlice.actions;

export default transactionSlice.reducer;

export const selectUserTransactions = (state: { transactions: TransactionState }, userId: string) =>
  state.transactions.transactions.filter(t => t.userId === userId);

export const selectFilteredTransactions = (
  state: { transactions: TransactionState },
  userId: string
) => {
  const { transactions, filters } = state.transactions;
  return transactions
    .filter(t => t.userId === userId)
    .filter(t => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!t.title.toLowerCase().includes(s) && !t.amount.toString().includes(s)) {
          return false;
        }
      }
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.startDate && t.date < filters.startDate) return false;
      if (filters.endDate && t.date > filters.endDate) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
};
