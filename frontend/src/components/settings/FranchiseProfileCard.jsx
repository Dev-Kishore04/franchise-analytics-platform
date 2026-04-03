// src/components/settings/FranchiseProfileCard.jsx

const CURRENCIES = ['USD - US Dollar ($)', 'EUR - Euro (€)', 'GBP - British Pound (£)', 'INR - Indian Rupee (₹)']
const TIMEZONES  = ['(GMT-05:00) Eastern Time', '(GMT-08:00) Pacific Time', '(GMT+00:00) London', '(GMT+05:30) India Standard Time']

export default function FranchiseProfileCard({ values, onChange }) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary">business_center</span>
        <h3 className="text-xl font-bold font-headline">Franchise Profile</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Franchise Name */}
        <div className="col-span-2">
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Franchise Name
          </label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface text-sm"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Currency
          </label>
          <select
            value={values.currency}
            onChange={(e) => onChange('currency', e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface text-sm appearance-none"
          >
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Timezone
          </label>
          <select
            value={values.timezone}
            onChange={(e) => onChange('timezone', e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface text-sm appearance-none"
          >
            {TIMEZONES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
