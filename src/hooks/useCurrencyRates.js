import { CURRENCY_REFRESH_INTERVAL_MS, fetchExchangeRates } from '../services'
import { useFetch } from './useFetch'

export function useCurrencyRates({
  baseCurrency = 'eur',
  enabled = true,
  refreshIntervalMs = CURRENCY_REFRESH_INTERVAL_MS,
} = {}) {
  const normalizedBaseCurrency = String(baseCurrency || 'eur').toLowerCase()

  const requestState = useFetch(
    () => fetchExchangeRates(normalizedBaseCurrency),
    {
      enabled,
      dependencies: [normalizedBaseCurrency],
      refreshIntervalMs: enabled ? refreshIntervalMs : null,
    },
  )

  return {
    ...requestState,
    baseCurrency: normalizedBaseCurrency,
    effectiveDate: requestState.data?.date ?? null,
    rates: requestState.data?.rates ?? null,
    source: requestState.data?.source ?? null,
  }
}

export default useCurrencyRates
