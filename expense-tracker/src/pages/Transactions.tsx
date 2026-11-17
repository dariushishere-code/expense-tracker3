import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
  clearFilters,
  selectFilteredTransactions,
} from '../store/transactionSlice'
import type { Transaction, TransactionType } from '../types'

export default function Transactions() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.currentUser)
  const categories = useAppSelector(state => state.transactions.categories)
  const filters = useAppSelector(state => state.transactions.filters)
  const filtered = useAppSelector(state =>
    selectFilteredTransactions(state, user?.id || '')
  )

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState('')

  const resetForm = () => {
    setTitle('')
    setAmount('')
    setType('expense')
    setDate(new Date().toISOString().slice(0, 10))
    setCategory('')
    setEditing(null)
    setShowForm(false)
  }

  const openEdit = (tx: Transaction) => {
    setEditing(tx)
    setTitle(tx.title)
    setAmount(tx.amount.toString())
    setType(tx.type)
    setDate(tx.date)
    setCategory(tx.category)
    setShowForm(true)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      date,
      category: category || 'Other',
      userId: user.id,
    }
    if (editing) {
      dispatch(updateTransaction({ ...payload, id: editing.id }))
    } else {
      dispatch(addTransaction(payload))
    }
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch(deleteTransaction(id))
    }
  }

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  const availableCats = categories.filter(
    c => c.type === type || c.type === 'both' || c.userId === 'default'
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Search title or amount..."
            value={filters.search}
            onChange={e => dispatch(setFilters({ search: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={filters.type}
            onChange={e => dispatch(setFilters({ type: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filters.category}
            onChange={e => dispatch(setFilters({ category: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.startDate}
            onChange={e => dispatch(setFilters({ startDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={e => dispatch(setFilters({ endDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          onClick={() => dispatch(clearFilters())}
          className="mt-3 text-sm text-gray-500 hover:text-primary-600"
        >
          Clear filters
        </button>
      </div>

      {/* Form modal-ish */}
      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            {editing ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as TransactionType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select...</option>
                {availableCats.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                {editing ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{tx.title}</td>
                    <td className="px-4 py-3 text-gray-600">{tx.category}</td>
                    <td className="px-4 py-3 text-gray-500">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(tx)}
                        className="text-primary-600 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
