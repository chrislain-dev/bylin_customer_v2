
export type CurrencyCode = 'XOF' | 'EUR' | 'USD'

interface CurrencyState {
  rates: Record<CurrencyCode, number>
  lastUpdated: number | null
}