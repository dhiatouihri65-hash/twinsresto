import React, { useState, useMemo } from 'react'
import { mockMenuItems } from '../lib/mockData'
import { CartItem } from '../types'
import { Button } from '../components/Button'
import { Plus, Minus, ShoppingCart } from 'lucide-react'

interface MenuPageProps {
  onAddToCart: (item: CartItem) => void
  cartCount: number
  onViewCart: () => void
}

export const MenuPage: React.FC<MenuPageProps> = ({ onAddToCart, cartCount, onViewCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(mockMenuItems.map((item) => item.category))]
    return cats
  }, [])

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return mockMenuItems
    }
    return mockMenuItems.filter((item) => item.category === selectedCategory)
  }, [selectedCategory])

  const handleAddToCart = (itemId: string) => {
    const quantity = quantities[itemId] || 1
    onAddToCart({
      menuItemId: itemId,
      quantity,
    })
    setQuantities({ ...quantities, [itemId]: 0 })
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return
    setQuantities({ ...quantities, [itemId]: newQuantity })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Browse Menu</h2>
        <button
          onClick={onViewCart}
          className="relative flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <ShoppingCart size={20} />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Categories */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-foreground hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{item.name.charAt(0)}</div>
                  <p className="text-sm text-secondary mt-2">{item.category}</p>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      item.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {item.available && (
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, (quantities[item.id] || 0) - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-2 font-semibold">
                        {quantities[item.id] || 0}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, (quantities[item.id] || 0) + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(item.id)}
                      disabled={(quantities[item.id] || 0) === 0}
                      className="flex-1"
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
