// src/components/pos/MenuGrid.jsx

import { useCurrency } from "../../utils/currency"

const CATEGORIES = ['All Items', 'Beverage', 'Main Course', 'Dessert', 'Side Dish','Snack']

// Emoji placeholders since we can't use external images

const bgColors = {
  'Vanilla Latte':     'bg-amber-50',
  'Butter Croissant':  'bg-yellow-50',
  'Avocado Toast':     'bg-green-50',
  'Iced Macchiato':    'bg-sky-50',
  'Doppio Espresso':   'bg-stone-100',
}


export default function MenuGrid({ activeCategory, onCategoryChange, onAddToCart, menuItems }) {
  const filteredItems =
  activeCategory === 'All Items'
    ? menuItems
    : menuItems.filter(i => i.category === activeCategory)
    console.log(menuItems)
  const {format}=useCurrency()
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between items-start gap-5">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Main Menu</h2>
          <p className="text-on-surface-variant font-medium text-sm">Downtown Branch • Active Session</p>
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                ${activeCategory === cat
                  ? 'bg-primary-container text-white'
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest rounded-xl p-4 group hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            {/* Image area */}
            <div className={`aspect-square rounded-lg mb-4 overflow-hidden relative flex items-center justify-center text-6xl ${bgColors[item.name] || 'bg-surface-container'}`}>

            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <span className="group-hover:scale-110 transition-transform duration-500 inline-block select-none">
                🍽️
              </span>
            )}

            {item.tag && (
              <span className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold shadow-sm ${item.tagColor}`}>
                {item.tag}
              </span>
            )}
          </div>

            <div className="flex justify-between items-start mb-1">
              <h3 className="font-headline font-bold text-on-surface text-sm">{item.name}</h3>
              <span className="font-bold text-primary text-sm">{format(item.price.toFixed(2))}</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4 line-clamp-2 flex-1">{item.desc}</p>

            <button
              onClick={() => onAddToCart(item)}
              className="w-full py-2 bg-surface-container-high hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              Add to Cart
            </button>
          </div>
        ))}

        {/* More items placeholder */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center min-h-[220px]">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">inventory_2</span>
          <p className="text-xs font-bold text-on-surface-variant">More items in Inventory</p>
        </div>
      </div>
    </div>
  )
}
