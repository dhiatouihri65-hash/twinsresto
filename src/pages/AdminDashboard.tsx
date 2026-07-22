import React, { useState, useEffect } from 'react'
import { Order, MenuItem } from '../types'
import { getAllOrders, mockMenuItems, getMenuItemById } from '../lib/mockData'
import { Button } from '../components/Button'
import { Edit2, Plus, Trash2, TrendingUp } from 'lucide-react'

interface AdminDashboardProps {
  onLogout: () => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({})

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const allOrders = getAllOrders()
    setOrders(allOrders)
  }

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('twins_orders', JSON.stringify(updatedOrders))
    setSelectedOrder(null)
  }

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      preparing: orders.filter((o) => o.status === 'preparing').length,
      ready: orders.filter((o) => o.status === 'ready').length,
      revenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    }
  }

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

  const stats = getOrderStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md p-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin Panel</span>
            <Button onClick={onLogout} variant="danger">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <TrendingUp className="text-primary opacity-20" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Preparing</p>
            <p className="text-3xl font-bold text-blue-600">{stats.preparing}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Ready</p>
            <p className="text-3xl font-bold text-green-600">{stats.ready}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Revenue</p>
            <p className="text-3xl font-bold text-primary">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('orders')
              setSelectedOrder(null)
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-primary text-white'
                : 'bg-white text-foreground hover:bg-gray-100'
            }`}
          >
            Orders Management
          </button>
          <button
            onClick={() => {
              setActiveTab('menu')
              setEditingMenuItem(null)
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'menu'
                ? 'bg-primary text-white'
                : 'bg-white text-foreground hover:bg-gray-100'
            }`}
          >
            Menu Management
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-primary hover:underline mb-4"
                >
                  ← Back to Orders
                </button>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Order #{selectedOrder.id}
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-semibold text-foreground capitalize">
                          {selectedOrder.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Time</p>
                        <p className="font-semibold text-foreground">
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">
                          ${selectedOrder.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground mb-3">Items</h3>
                    <div className="space-y-2 mb-6">
                      {selectedOrder.items.map((item) => {
                        const menuItem = getMenuItemById(item.menuItemId)
                        return (
                          <div key={item.menuItemId} className="flex justify-between text-sm">
                            <span>{menuItem?.name}</span>
                            <span className="font-semibold">x{item.quantity}</span>
                          </div>
                        )
                      })}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Update Status:</p>
                      <div className="space-y-2">
                        {(['pending', 'preparing', 'ready', 'completed', 'cancelled'] as const).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => updateOrderStatus(selectedOrder.id, status)}
                              className={`w-full px-4 py-2 rounded-lg font-semibold transition capitalize ${
                                selectedOrder.status === status
                                  ? `${getStatusColor(status)}`
                                  : 'bg-gray-100 hover:bg-gray-200 text-foreground'
                              }`}
                            >
                              {status}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="w-full bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition text-left"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-foreground">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {order.items.length} items • ${order.totalPrice.toFixed(2)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg font-semibold ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-bold text-foreground mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingMenuItem(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
