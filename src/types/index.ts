export type UserRole = 'customer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  available: boolean
}

export interface CartItem {
  menuItemId: string
  quantity: number
  specialInstructions?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  estimatedReadyTime?: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  signUp: (name: string, email: string, password: string) => Promise<void>
}
