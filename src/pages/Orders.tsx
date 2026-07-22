import React, { useState, useEffect } from 'react'
import { Order } from '../types'
import { useAuth } from '../context/AuthContext'
import { getOrdersByUserId, getMenuItemById } from '../lib/mockData'
import { Button } from '../components/Button'
import { Clock, CheckCircle, X } from 'lucide-react'

interface OrdersPageProps {
  onBackToMenu: () => void
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onBackToMenu }) => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (user) {
      const userOrders = getOrdersByUserId(user.id)
      setOrders(userOrders)
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'preparing':
        return 'bg-blue-100 text-blue-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={20} />
      case 'pending':
      case 'preparing':
        return <Clock size={20} />
      case 'cancelled':
        return <X size={20} />
      default:
        return null
    }
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <button
          onClick={() => setSelectedOrder(null)}
          className="text-primary hover:underline mb-6"
        >
          ← Back to Orders
        </button>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Order #{selectedOrder.id}</h2>
              <p className="text-gray-600 text-sm">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}
            >
              {getStatusIcon(selectedOrder.status)}
              {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
            </span>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item) => {
                const menuItem = getMenuItemById(item.menuItemId)
                return (
                  <div key={item.menuItemId} className="flex justify-between">
                    <div>
                      <p className="font-medium text-foreground">{menuItem?.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ${((menuItem?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {selectedOrder.notes && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">Special Instructions</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-lg font-bold text-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">
              ${selectedOrder.totalPrice.toFixed(2)}
            </span>
          </div>

          {selectedOrder.estimatedReadyTime && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              Estimated ready time: {selectedOrder.estimatedReadyTime}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <Button onClick={onBackToMenu} variant="outline">
            Back to Menu
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              Place your first order to see it appear here!
            </p>
            <Button onClick={onBackToMenu} variant="primary">
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="w-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Items</p>
                    <p className="font-semibold">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-semibold text-primary">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ready in</p>
                    <p className="font-semibold">{order.estimatedReadyTime}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
