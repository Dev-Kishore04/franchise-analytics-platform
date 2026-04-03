import { useEffect, useRef, useState } from "react"
import { useCurrency } from "../../utils/currency"

const PAYMENT_METHODS = [
  { id: "cash", icon: "payments", label: "Cash" },
  { id: "card", icon: "credit_card", label: "Card" },
  { id: "upi", icon: "qr_code_2", label: "UPI" },
]

const TAX_RATE = 0.05

export default function OrderCart({
  items,
  onIncrement,
  onDecrement,
  onClear,
  paymentMethod,
  onPaymentChange,
  onCompleteOrder,
}) {

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const {format}=useCurrency()

  // Scroll container reference
  const cartRef = useRef(null)

  // Track last added item
  const [lastItemId, setLastItemId] = useState(null)

  // Auto scroll when items change
  useEffect(() => {
    if (cartRef.current) {
      cartRef.current.scrollTo({
        top: cartRef.current.scrollHeight,
        behavior: "smooth",
      })
    }

    if (items.length > 0) {
      setLastItemId(items[items.length - 1].id)

      const timer = setTimeout(() => {
        setLastItemId(null)
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [items])

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col h-full min-h-0 border border-surface-container">

      {/* Header */}
      <div className="p-6 border-b border-surface-container-low">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-headline font-extrabold text-xl text-on-surface">
            Current Order
          </h2>

          <button
            onClick={onClear}
            className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors"
            title="Clear cart"
          >
            <span className="material-symbols-outlined">delete_sweep</span>
          </button>
        </div>

        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          Table 12 • Dine In
        </p>
      </div>

      {/* Cart Items */}
      <div ref={cartRef} className="flex-1 overflow-y-auto p-6 space-y-5">

        {items.length === 0 ? (

          <div className="flex flex-col items-center justify-center h-full gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl">
              shopping_cart
            </span>
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs">Add items from the menu</p>
          </div>

        ) : (

          <>
            {items.map((item) => {

              const highlight = item.id === lastItemId

              return (
                <div
                  key={item.id}
                  className={`flex gap-4 transition-all duration-300 ${
                    highlight ? "bg-primary/10 rounded-lg p-2" : ""
                  }`}
                >

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-2xl shrink-0">
                    {item.emoji}
                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-on-surface truncate pr-2">
                        {item.name}
                      </p>

                      <p className="text-sm font-bold shrink-0">
                        {format(item.price * item.qty)}
                      </p>
                    </div>

                    <p className="text-[10px] text-on-surface-variant mb-2">
                      Standard
                    </p>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => onDecrement(item.id)}
                        className="w-6 h-6 flex items-center justify-center bg-surface-container-high rounded-md hover:bg-surface-container-highest transition-colors"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "14px" }}
                        >
                          remove
                        </span>
                      </button>

                      <span className="text-xs font-bold w-4 text-center">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => onIncrement(item.id)}
                        className="w-6 h-6 flex items-center justify-center bg-surface-container-high rounded-md hover:bg-surface-container-highest transition-colors"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "14px" }}
                        >
                          add
                        </span>
                      </button>

                    </div>
                  </div>
                </div>
              )
            })}

            {/* AI Upsell */}
            {/* <div className="p-4 bg-tertiary-container/10 border border-tertiary-container/20 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="material-symbols-outlined text-tertiary"
                  style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <p className="text-[10px] font-bold text-tertiary uppercase tracking-tight">
                  AI Upsell Hint
                </p>
              </div>

              <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed">
                Customers usually add{" "}
                <span className="font-bold underline cursor-pointer">
                  Blueberry Muffin
                </span>{" "}
                to this combo.
              </p>
            </div> */}
          </>
        )}
      </div>

      {/* Checkout Panel */}
      <div
        className="p-5 bg-surface-container-lowest border-t border-surface-container sticky bottom-0"
        style={{ boxShadow: "0 -8px 24px -12px rgba(0,0,0,0.08)" }}
      >

        {/* Totals */}
        <div className="space-y-2 mb-5">
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Subtotal</span>
            <span>{format(subtotal.toFixed(2))}</span>
          </div>

          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>Service Tax (5%)</span>
            <span>{format(tax.toFixed(2))}</span>
          </div>

          <div className="flex justify-between text-xl font-extrabold text-on-surface pt-2 border-t border-surface-container mt-2">
            <span>Total Price</span>
            <span className="text-primary">{format(total.toFixed(2))}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3 tracking-widest">
            Payment Method
          </p>

          <div className="grid grid-cols-3 gap-2">

            {PAYMENT_METHODS.map((method) => {

              const active = paymentMethod === method.id

              return (
                <button
                  key={method.id}
                  onClick={() => onPaymentChange(method.id)}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all
                  ${
                    active
                      ? "ring-2 ring-primary bg-primary/5 text-primary"
                      : "bg-surface-container-high hover:bg-primary/10 hover:ring-2 hover:ring-primary/20"
                  }`}
                >

                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    {method.icon}
                  </span>

                  <span className="text-[10px] font-bold">
                    {method.label}
                  </span>

                </button>
              )
            })}
          </div>
        </div>

        {/* Complete Order */}
        <button
          onClick={onCompleteOrder}
          disabled={items.length === 0}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-headline font-extrabold text-base shadow-lg hover:shadow-primary/30 transition-all active:scale-95 duration-150 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Complete Order
        </button>

      </div>
    </div>
  )
}