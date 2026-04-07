const CURRENCY_API_URL =
  "https://api.frankfurter.app/latest?from=EUR&to=USD,CZK,GBP,PLN";

const FALLBACK_RATES = {
  eur: 1,
  usd: 1.08,
  czk: 24.9,
  gbp: 0.85,
  pln: 4.28,
} as const;

export function getFallbackRates() {
  return { ...FALLBACK_RATES };
}

export async function fetchCurrencyRates() {
  const response = await fetch(CURRENCY_API_URL);

  if (!response.ok) {
    throw new Error("Nepodařilo se aktualizovat kurzy z API.");
  }

  const data = await response.json();

  return {
    rates: {
      eur: 1,
      usd: data?.rates?.USD ?? FALLBACK_RATES.usd,
      czk: data?.rates?.CZK ?? FALLBACK_RATES.czk,
      gbp: data?.rates?.GBP ?? FALLBACK_RATES.gbp,
      pln: data?.rates?.PLN ?? FALLBACK_RATES.pln,
    },
    updatedAt: new Date().toISOString(),
    sourceDate: data?.date ?? null,
  };
}
