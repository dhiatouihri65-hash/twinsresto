import React from 'react'
import { useAuth } from '../context/AuthContext'
import { LogOut, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Twins Restaurant</h1>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <div className="text-sm">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs opacity-90 capitalize">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
