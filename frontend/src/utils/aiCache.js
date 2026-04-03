// src/utils/aiCache.js

export function getAICache(key) {

  const cached = localStorage.getItem(key)

  if (!cached) return null

  const parsed = JSON.parse(cached)

  if (Date.now() > parsed.expiry) {
    localStorage.removeItem(key)
    return null
  }

  return parsed.value
}

export function setAICache(key, value) {

  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expiry: Date.now() + 60 * 60 * 1000 // 1 hour
    })
  )


}

export function isAIEnabled() {
  return localStorage.getItem("aiEnabled") !== "false"
}