import { useMemo } from 'react'
import { useAppSelector } from '../hooks/redux'
import { selectUserTransactions } from '../store/transactionSlice'
import { Link } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'

export default function Dashboard() {
  const user = useAppSelector(state => state.auth.currentUser)
  const transactions = useAppSelector(state =>
    selectUserTransactions(state, user?.id || '')
  )

  const stats = useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const thisMonth = transactions.filter(t => {
      const d = parseISO(t.date)
      return isWithinInterval(d, { start: monthStart, end: monthEnd })
    })

    const income = thisMonth
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expense = thisMonth
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = income - expense

    const recent = [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)

    return { income, expense, balance, recent, totalTx: transactions.length }
  }, [transactions])

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-gray-500 mt-1">
          Here's your financial overview for {format(new Date(), 'MMMM yyyy')}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Balance</p>
          <p className={`text-2xl font-bold mt-1 ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatMoney(stats.balance)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Income (this month)</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{formatMoney(stats.income)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Expenses (this month)</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{formatMoney(stats.expense)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold mt-1 text-gray-800">{stats.totalTx}</p>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
          <Link to="/transactions" className="text-sm text-primary-600 hover:underline">
            View all
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No transactions yet. <Link to="/transactions" className="text-primary-600">Add one</Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {stats.recent.map(tx => (
              <li key={tx.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                    tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {tx.type === 'income' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{tx.title}</p>
                    <p className="text-xs text-gray-400">{tx.category} · {tx.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
