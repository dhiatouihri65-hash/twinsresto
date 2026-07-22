import React, { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { CartItem, Order } from './types'
import { Header } from './components/Header'
import { LoginPage } from './pages/Login'
import { SignUpPage } from './pages/SignUp'
import { MenuPage } from './pages/Menu'
import { CartPage } from './pages/Cart'
import { OrdersPage } from './pages/Orders'
import { AdminDashboard } from './pages/AdminDashboard'

type PageType = 'login' | 'signup' | 'menu' | 'cart' | 'orders' | 'admin' | 'order-confirmation'

export default function App() {
  const { user, isAuthenticated, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<PageType>('login')
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastOrder, setLastOrder] = useState<Order | null>(null)

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('twins_cart')
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart))
      } catch (error) {
        console.error('Failed to load cart from localStorage', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('twins_cart', JSON.stringify(cart))
    } else {
      localStorage.removeItem('twins_cart')
    }
  }, [cart])

  const handleAddToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.menuItemId === item.menuItemId)
      if (existingItem) {
        return prevCart.map((i) =>
          i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prevCart, item]
    })
  }

  const handleRemoveFromCart = (menuItemId: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.menuItemId !== menuItemId))
  }

  const handleUpdateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(menuItemId)
    } else {
      setCart((prevCart) =>
        prevCart.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
      )
    }
  }

  const handleOrderPlaced = (order: Order) => {
    setLastOrder(order)
    setCart([])
    setCurrentPage('order-confirmation')

    // Auto redirect to orders after 3 seconds
    setTimeout(() => {
      setCurrentPage('orders')
    }, 3000)
  }

  // Redirect to appropriate page based on auth state
  useEffect(() => {
    if (!isAuthenticated && currentPage !== 'signup') {
      setCurrentPage('login')
      setCart([])
    }
  }, [isAuthenticated, currentPage])

  const handleLogout = () => {
    logout()
    setCurrentPage('login')
    setCart([])
  }

  // Render appropriate page
  const renderPage = () => {
    if (!isAuthenticated) {
      return currentPage === 'signup' ? (
        <SignUpPage onSwitchToLogin={() => setCurrentPage('login')} />
      ) : (
        <LoginPage onSwitchToSignUp={() => setCurrentPage('signup')} />
      )
    }

    // User is authenticated
    if (user?.role === 'admin') {
      if (currentPage === 'admin') {
        return <AdminDashboard onLogout={handleLogout} />
      } else {
        // Redirect admin to admin dashboard
        setCurrentPage('admin')
        return <AdminDashboard onLogout={handleLogout} />
      }
    }

    // Customer routes
    switch (currentPage) {
      case 'menu':
        return (
          <>
            <Header />
            <MenuPage
              onAddToCart={handleAddToCart}
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              onViewCart={() => setCurrentPage('cart')}
            />
          </>
        )
      case 'cart':
        return (
          <>
            <Header />
            <CartPage
              items={cart}
              onRemoveItem={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onBackToMenu={() => setCurrentPage('menu')}
              onOrderPlaced={handleOrderPlaced}
            />
          </>
        )
      case 'orders':
        return (
          <>
            <Header />
            <OrdersPage onBackToMenu={() => setCurrentPage('menu')} />
          </>
        )
      case 'order-confirmation':
        return (
          <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                <div className="text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Your order has been placed successfully and is being prepared.
                </p>
                {lastOrder && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-bold text-foreground">{lastOrder.id}</p>
                    <p className="text-sm text-gray-600 mt-3">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ${lastOrder.totalPrice.toFixed(2)}
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-600">Redirecting to your orders...</p>
              </div>
            </div>
          </>
        )
      default:
        return (
          <>
            <Header />
            <MenuPage
              onAddToCart={handleAddToCart}
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              onViewCart={() => setCurrentPage('cart')}
            />
          </>
        )
    }
  }

  return <div className="min-h-screen bg-background">{renderPage()}</div>
}
