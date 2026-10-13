const NOT_AVAILABLE = 'N/A'

export function formatCurrency(value: string | null): string {
  const amount = Number(value)
  if (!value || !Number.isFinite(amount)) return NOT_AVAILABLE
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function formatDate(value: string | null): string {
  if (!value) return NOT_AVAILABLE
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return NOT_AVAILABLE
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatText(value: string | null): string {
  return value?.trim() || NOT_AVAILABLE
}

/** e.g. "$90M" — for compact labels such as card chips */
export function formatCompactCurrency(value: string | null): string | null {
  const amount = Number(value)
  if (!value || !Number.isFinite(amount)) return null
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  })
}

export function formatYear(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : String(date.getUTCFullYear())
}
