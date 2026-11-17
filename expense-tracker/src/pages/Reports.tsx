import { useMemo } from 'react'
import { useAppSelector } from '../hooks/redux'
import { selectUserTransactions } from '../store/transactionSlice'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { format, eachMonthOfInterval, subMonths } from 'date-fns'

export default function Reports() {
  const user = useAppSelector(state => state.auth.currentUser)
  const transactions = useAppSelector(state =>
    selectUserTransactions(state, user?.id || '')
  )
  const categories = useAppSelector(state => state.transactions.categories)

  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const map: Record<string, number> = {}
    expenses.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: categories.find(c => c.name === name)?.color || '#6b7280',
    }))
  }, [transactions, categories])

  const lineData = useMemo(() => {
    const now = new Date()
    const months = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now,
    })
    return months.map(month => {
      const key = format(month, 'yyyy-MM')
      const label = format(month, 'MMM yy')
      let income = 0
      let expense = 0
      transactions.forEach(t => {
        if (t.date.startsWith(key)) {
          if (t.type === 'income') income += t.amount
          else expense += t.amount
        }
      })
      return { month: label, income, expense }
    })
  }, [transactions])

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Expenses by Category</h3>
          {pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No expense data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatMoney(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Income vs Expenses (6 months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(value: number) => formatMoney(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
