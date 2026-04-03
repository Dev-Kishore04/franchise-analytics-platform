import { useSettings } from "@/hooks/useSettings"

export function useCurrency() {

  const { settings } = useSettings()

  const currency = settings?.currency || "USD - US Dollar ($)"

  const symbol =
    currency.includes("₹") ? "₹" :
    currency.includes("$") ? "$" :
    currency.includes("€") ? "€" :
    currency.includes("£") ? "£" :
    "$"

  const format = (value) => {
    return `${symbol}${Number(value).toFixed(2)}`
  }

  return { format }
}