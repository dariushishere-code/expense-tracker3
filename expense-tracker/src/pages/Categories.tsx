import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { addCategory, deleteCategory } from '../store/transactionSlice'
import type { TransactionType } from '../types'

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#0ea5e9'
]

export default function Categories() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.currentUser)
  const categories = useAppSelector(state => state.transactions.categories)

  const [name, setName] = useState('')
  const [type, setType] = useState<TransactionType | 'both'>('expense')
  const [color, setColor] = useState(COLORS[0])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!user || !name.trim()) return
    dispatch(addCategory({
      name: name.trim(),
      type,
      color,
      userId: user.id,
    }))
    setName('')
    setColor(COLORS[Math.floor(Math.random() * COLORS.length)])
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this category?')) {
      dispatch(deleteCategory(id))
    }
  }

  const userCats = categories.filter(c => c.userId === user?.id || c.userId === 'default')

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Add Custom Category</h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Coffee"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Color</label>
            <div className="flex gap-1">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-gray-800' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userCats.map(cat => (
          <div
            key={cat.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <div>
                <p className="font-medium text-gray-800">{cat.name}</p>
                <p className="text-xs text-gray-400 capitalize">{cat.type}</p>
              </div>
            </div>
            {cat.userId !== 'default' && (
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
