import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, AuthContextType, UserRole } from '../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('twins_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to load user from localStorage', error)
      }
    }
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    // Simple mock authentication
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      createdAt: new Date().toISOString(),
    }

    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('twins_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('twins_user')
    localStorage.removeItem('twins_cart')
    localStorage.removeItem('twins_orders')
  }

  const signUp = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error('All fields are required')
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: 'customer',
      createdAt: new Date().toISOString(),
    }

    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('twins_user', JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
