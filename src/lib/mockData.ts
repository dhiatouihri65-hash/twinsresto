import { MenuItem, Order } from '../types'

export const mockMenuItems: MenuItem[] = [
  {
    id: 'menu_1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
    price: 12.99,
    category: 'Pizza',
    available: true,
  },
  {
    id: 'menu_2',
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza topped with pepperoni and cheese',
    price: 13.99,
    category: 'Pizza',
    available: true,
  },
  {
    id: 'menu_3',
    name: 'Veggie Burger',
    description: 'Delicious vegetarian burger with fresh greens and special sauce',
    price: 10.99,
    category: 'Burgers',
    available: true,
  },
  {
    id: 'menu_4',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar cheese and all the fixings',
    price: 11.99,
    category: 'Burgers',
    available: true,
  },
  {
    id: 'menu_5',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
    price: 18.99,
    category: 'Main Courses',
    available: true,
  },
  {
    id: 'menu_6',
    name: 'Pasta Carbonara',
    description: 'Traditional Italian pasta with creamy sauce and pancetta',
    price: 14.99,
    category: 'Main Courses',
    available: true,
  },
  {
    id: 'menu_7',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan and homemade Caesar dressing',
    price: 9.99,
    category: 'Salads',
    available: true,
  },
  {
    id: 'menu_8',
    name: 'Greek Salad',
    description: 'Crisp greens with feta, olives, tomatoes, and olive oil vinaigrette',
    price: 10.99,
    category: 'Salads',
    available: true,
  },
  {
    id: 'menu_9',
    name: 'Chocolate Cake',
    description: 'Decadent chocolate layer cake with fudgy frosting',
    price: 7.99,
    category: 'Desserts',
    available: true,
  },
  {
    id: 'menu_10',
    name: 'Tiramisu',
    description: 'Italian dessert with layers of ladyfinger and mascarpone cream',
    price: 8.99,
    category: 'Desserts',
    available: true,
  },
]

export const mockOrders: Order[] = [
  {
    id: 'order_1',
    userId: 'user_1',
    items: [
      { menuItemId: 'menu_1', quantity: 2 },
      { menuItemId: 'menu_9', quantity: 1 },
    ],
    totalPrice: 33.97,
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    estimatedReadyTime: '15 mins',
  },
  {
    id: 'order_2',
    userId: 'user_1',
    items: [
      { menuItemId: 'menu_5', quantity: 1 },
      { menuItemId: 'menu_7', quantity: 1 },
    ],
    totalPrice: 28.98,
    status: 'pending',
    createdAt: new Date().toISOString(),
    estimatedReadyTime: '20 mins',
  },
]

export const getMenuItemById = (id: string): MenuItem | undefined => {
  return mockMenuItems.find((item) => item.id === id)
}

export const getOrdersByUserId = (userId: string): Order[] => {
  const stored = localStorage.getItem('twins_orders')
  if (stored) {
    try {
      const orders = JSON.parse(stored)
      return orders.filter((order: Order) => order.userId === userId)
    } catch (error) {
      console.error('Failed to load orders from localStorage', error)
    }
  }
  return mockOrders.filter((order) => order.userId === userId)
}

export const getAllOrders = (): Order[] => {
  const stored = localStorage.getItem('twins_orders')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error('Failed to load orders from localStorage', error)
    }
  }
  return mockOrders
}
