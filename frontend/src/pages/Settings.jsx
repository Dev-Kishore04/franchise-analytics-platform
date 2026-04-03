// src/pages/Settings.jsx
import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import { settingsApi } from '@/lib/api'
import SettingsTabs from '@/components/settings/SettingsTabs'
import FranchiseProfileCard from '@/components/settings/FranchiseProfileCard'
import AIInsightSettingsCard from '@/components/settings/AIInsightSettingsCard'
import AlertThresholdsCard from '@/components/settings/AlertThresholdsCard'

export default function Settings() {
  const { data: serverSettings, loading } = useApi(settingsApi.get)

  const [activeTab, setActiveTab]     = useState('General Settings')
  const [profile, setProfile]         = useState({ name: '', currency: '', timezone: '' })
  const [toggles, setToggles] = useState(() => ({
    autoRecommend: localStorage.getItem("aiEnabled") !== "false",
    emailInsights: false
  }))
  const [thresholds, setThresholds]   = useState({ lowStock: 15, salesDip: 8 })
  const [sensitivity, setSensitivity] = useState(75)
  const [saved, setSaved]             = useState(false)
  const [saving, setSaving]           = useState(false)
  const [lastSaved, setLastSaved]     = useState('Not saved yet')

  // Hydrate form when API data loads
  useEffect(() => {
    if (!serverSettings) return
    setProfile({
      name:     serverSettings.franchiseName || '',
      currency: serverSettings.currency || 'USD - US Dollar ($)',
      timezone: serverSettings.timezone || '(GMT-05:00) Eastern Time',
    })
    setToggles({
      autoRecommend: serverSettings.autoRecommendEnabled ?? true,
      emailInsights: serverSettings.emailInsightsEnabled ?? true,
    })
    setThresholds({
      lowStock: serverSettings.lowStockThresholdPct ?? 15,
      salesDip: serverSettings.salesDipWarningPct ?? 8,
    })
    setSensitivity(serverSettings.anomalySensitivity ?? 75)
  }, [serverSettings])

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsApi.update({
        franchiseName:         profile.name,
        currency:              profile.currency,
        timezone:              profile.timezone,
        lowStockThresholdPct:  thresholds.lowStock,
        salesDipWarningPct:    thresholds.salesDip,
        anomalySensitivity:    sensitivity,
        autoRecommendEnabled:  toggles.autoRecommend,
        emailInsightsEnabled:  toggles.emailInsights,
      })
      const now = new Date().toLocaleString('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
      setLastSaved(now)
      setSaved(true)
    } catch (e) {
      alert('Save failed: ' + (e?.response?.data?.message || e.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    if (serverSettings) {
      setProfile({ name: serverSettings.franchiseName, currency: serverSettings.currency, timezone: serverSettings.timezone })
      setToggles({ autoRecommend: serverSettings.autoRecommendEnabled, emailInsights: serverSettings.emailInsightsEnabled })
      setThresholds({ lowStock: serverSettings.lowStockThresholdPct, salesDip: serverSettings.salesDipWarningPct })
      setSensitivity(serverSettings.anomalySensitivity)
    }
    setSaved(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin mr-3">sync</span>Loading settings…
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-16 py-12">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-2">
          System Settings
        </h2>
        <p className="text-on-surface-variant text-lg font-body">
          Manage global franchise parameters and AI configuration.
        </p>
      </div>

      <SettingsTabs active={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-7 space-y-8">
          <FranchiseProfileCard
            values={profile}
            onChange={(field, val) => { setProfile(p => ({ ...p, [field]: val })); setSaved(false) }}
          />
          <AIInsightSettingsCard
            toggles={toggles}
            onToggle={(key, val) => {

              setToggles(t => ({ ...t, [key]: val }))
              setSaved(false)

              // 🔹 store AI toggle in localStorage
              if (key === "autoRecommend") {
                localStorage.setItem("aiEnabled", val)
              }

            }}
          />
        </section>

        <section className="col-span-12 lg:col-span-5">
          <AlertThresholdsCard
            thresholds={thresholds}
            onThresholdChange={(key, val) => { setThresholds(t => ({ ...t, [key]: val })); setSaved(false) }}
            sensitivity={sensitivity}
            onSensitivityChange={(v) => { setSensitivity(v); setSaved(false) }}
          />
        </section>
      </div>

      <div className="mt-12 flex justify-end items-center gap-4 bg-surface-container-low p-6 rounded-2xl border border-outline/5">
        <span className="text-sm text-on-surface-variant font-medium mr-auto">
          {saved
            ? <span className="text-green-600 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                Saved at {lastSaved}
              </span>
            : `Last saved: ${lastSaved}`
          }
        </span>
        <button onClick={handleDiscard} className="px-8 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest rounded-xl transition-all">
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-3 text-sm font-bold bg-gradient-to-br from-primary to-primary-container text-white rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
