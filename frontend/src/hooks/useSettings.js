import { useApi } from "@/hooks/useApi"
import { settingsApi } from "@/lib/api"

export function useSettings() {

  const { data, loading } = useApi(settingsApi.get)

  return {
    settings: data,
    loading
  }
}