import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  error: string | null;
}

const loadUsers = (): User[] => {
  try {
    const data = localStorage.getItem('et_users');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const loadCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem('et_currentUser');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  currentUser: loadCurrentUser(),
  isAuthenticated: !!loadCurrentUser(),
  users: loadUsers(),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action: PayloadAction<{ name: string; email: string; password: string }>) => {
      state.error = null;
      const exists = state.users.find(u => u.email === action.payload.email);
      if (exists) {
        state.error = 'Email already registered';
        return;
      }
      const newUser: User = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        email: action.payload.email,
        password: action.payload.password,
      };
      state.users.push(newUser);
      localStorage.setItem('et_users', JSON.stringify(state.users));
      state.currentUser = newUser;
      state.isAuthenticated = true;
      localStorage.setItem('et_currentUser', JSON.stringify(newUser));
    },
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.error = null;
      const user = state.users.find(
        u => u.email === action.payload.email && u.password === action.payload.password
      );
      if (!user) {
        state.error = 'Invalid email or password';
        return;
      }
      state.currentUser = user;
      state.isAuthenticated = true;
      localStorage.setItem('et_currentUser', JSON.stringify(user));
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('et_currentUser');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
