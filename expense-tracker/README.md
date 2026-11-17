# Expense Tracker

A full-featured expense and income tracking application built with React + TypeScript.

## Features

- User authentication (register / login) with LocalStorage
- Add, edit, delete income & expense transactions
- Custom categories with colors
- Search and filter by title, amount, type, category, date range
- Dashboard with monthly summary and recent transactions
- Pie chart for expenses by category
- Line chart for income vs expense trends
- Redux Toolkit for state management
- LocalStorage persistence
- Responsive design with Tailwind CSS
- Fully typed with TypeScript

## Tech Stack

- React 18 + TypeScript
- Redux Toolkit + React-Redux
- React Router v7
- Recharts
- Tailwind CSS
- date-fns
- Vite

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Project Structure

```
src/
  components/   Layout
  hooks/        Typed Redux hooks
  pages/        Login, Register, Dashboard, Transactions, Categories, Reports
  store/        authSlice, transactionSlice, store config
  types/        Shared TypeScript interfaces
```

## Notes

- All data is stored in the browser's LocalStorage.
- Passwords are stored in plain text for demo purposes only (not for production).
- Default categories are pre-loaded; users can add their own.
