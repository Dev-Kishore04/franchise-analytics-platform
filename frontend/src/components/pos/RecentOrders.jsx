// src/components/pos/RecentOrders.jsx

const paymentColor = {
  UPI:  'text-green-600',
  CARD: 'text-blue-600',
  CASH: 'text-slate-600',
}


export default function RecentOrders({orders}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline font-extrabold text-xl text-on-surface">Recent Terminal History</h3>
        <button className="text-xs font-bold text-primary hover:underline">View All Records</button>
      </div>
      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-secondary-container" style={{ fontSize: '20px' }}>receipt_long</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{order.orderNumber}</p>
                <p className="text-[10px] text-on-surface-variant">{order.orderId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-on-surface">{order.totalAmount}</p>
              <p className="text-[10px] text-on-surface-variant">
                {order.time} •{' '}
                <span className={`font-bold ${paymentColor[order.method]}`}>{order.paymentMethod}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
