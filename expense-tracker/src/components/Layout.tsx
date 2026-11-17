import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { logout } from '../store/authSlice'

export default function Layout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state.auth.currentUser)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-700">Expense Tracker</h1>
          <p className="text-sm text-gray-500 mt-1 truncate">{user?.name}</p>
        </div>
        <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto">
          <NavLink to="/" end className={navClass}>
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/transactions" className={navClass}>
            <span>💰</span> Transactions
          </NavLink>
          <NavLink to="/categories" className={navClass}>
            <span>🏷️</span> Categories
          </NavLink>
          <NavLink to="/reports" className={navClass}>
            <span>📈</span> Reports
          </NavLink>
        </nav>
        <div className="p-3 mt-auto border-t border-gray-100 hidden md:block">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
