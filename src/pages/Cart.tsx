import React, { useState } from 'react'
import { CartItem, Order } from '../types'
import { mockMenuItems, getMenuItemById } from '../lib/mockData'
import { Button } from '../components/Button'
import { Trash2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface CartPageProps {
  items: CartItem[]
  onRemoveItem: (menuItemId: string) => void
  onUpdateQuantity: (menuItemId: string, quantity: number) => void
  onBackToMenu: () => void
  onOrderPlaced: (order: Order) => void
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onBackToMenu,
  onOrderPlaced,
}) => {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const totalPrice = items.reduce((sum, item) => {
    const menuItem = getMenuItemById(item.menuItemId)
    return sum + (menuItem?.price || 0) * item.quantity
  }, 0)

  const handleCheckout = async () => {
    if (!user || items.length === 0) return

    setLoading(true)

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      items,
      totalPrice,
      status: 'pending',
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      estimatedReadyTime: '20 mins',
    }

    // Save order to localStorage
    const existingOrders = localStorage.getItem('twins_orders')
    const orders = existingOrders ? JSON.parse(existingOrders) : []
    orders.push(newOrder)
    localStorage.setItem('twins_orders', JSON.stringify(orders))

    // Clear cart
    localStorage.removeItem('twins_cart')

    onOrderPlaced(newOrder)
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </button>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Start adding items from our menu to place an order!
          </p>
          <Button onClick={onBackToMenu} variant="primary">
            Browse Menu
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button
        onClick={onBackToMenu}
        className="flex items-center gap-2 text-primary hover:underline mb-8"
      >
        <ArrowLeft size={20} />
        Continue Shopping
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-foreground">Order Summary</h2>
          </div>

          <div className="p-6 space-y-4">
            {items.map((item) => {
              const menuItem = getMenuItemById(item.menuItemId)
              if (!menuItem) return null

              return (
                <div
                  key={item.menuItemId}
                  className="flex justify-between items-center border-b border-gray-200 pb-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{menuItem.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${menuItem.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        ${(menuItem.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(item.menuItemId, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-3 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.menuItemId)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-6 bg-gray-50 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any dietary restrictions or special requests..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
              <span className="text-xl font-bold text-foreground">Total:</span>
              <span className="text-3xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
