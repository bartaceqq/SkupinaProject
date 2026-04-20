import type { CurrencyRates, UnitId } from "../types";

export const CURRENCY_REFRESH_INTERVAL_MS = 30 * 60 * 1000;
const RATES_CACHE_STORAGE_KEY = "unit-converter-rates-v1";

const FRANKFURTER_ENDPOINTS = [
  "https://api.frankfurter.app/latest",
  "https://api.frankfurter.dev/v1/latest",
];

const FALLBACK_RATES: Record<UnitId, number> = {
  eur: 1,
  usd: 1.09,
  czk: 24.72,
  gbp: 0.856,
  pln: 4.29,
};

function normalizeBaseCurrency(baseCurrency: UnitId): string {
  return String(baseCurrency || "eur").toUpperCase();
}

async function requestRates(url: string, signal?: AbortSignal) {
  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Currency API returned ${response.status}.`);
  }

  return response.json();
}

function normalizePayload(payload: any, source: string): CurrencyRates {
  const base = String(payload?.base || "EUR").toLowerCase();
  const normalizedRates: Record<string, number> = {
    [base]: 1,
  };

  for (const [unitId, rate] of Object.entries(payload?.rates || {})) {
    const numericRate = Number(rate);

    if (Number.isFinite(numericRate)) {
      normalizedRates[String(unitId).toLowerCase()] = numericRate;
    }
  }

  return {
    base,
    date: String(payload?.date || new Date().toISOString()),
    rates: normalizedRates,
    source,
  };
}

function getRatesCacheKey(baseCurrency: UnitId): string {
  return `${RATES_CACHE_STORAGE_KEY}:${String(baseCurrency || "eur").toLowerCase()}`;
}

function persistCachedRates(rates: CurrencyRates) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      getRatesCacheKey(rates.base),
      JSON.stringify({
        base: rates.base,
        date: rates.date,
        rates: rates.rates,
      }),
    );
  } catch {
    return;
  }
}

function readCachedRates(baseCurrency: UnitId): CurrencyRates | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(getRatesCacheKey(baseCurrency));

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== "object" || !parsedValue.rates) {
      return null;
    }

    const normalizedRates = normalizePayload(parsedValue, "local-cache");
    return normalizedRates.base === String(baseCurrency || "eur").toLowerCase()
      ? normalizedRates
      : null;
  } catch {
    return null;
  }
}

function createFallbackRates(baseCurrency: UnitId): CurrencyRates {
  const base = String(baseCurrency || "eur").toLowerCase();
  const resolvedBaseRate = FALLBACK_RATES[base] || FALLBACK_RATES.eur;
  const normalizedRates: Record<UnitId, number> = {};

  for (const [unitId, rate] of Object.entries(FALLBACK_RATES)) {
    normalizedRates[unitId] = unitId === base ? 1 : Number((rate / resolvedBaseRate).toFixed(6));
  }

  return {
    base,
    date: new Date().toISOString(),
    rates: normalizedRates,
    source: "local-fallback",
  };
}

export async function fetchExchangeRates(
  baseCurrency: UnitId = "eur",
  signal?: AbortSignal,
): Promise<CurrencyRates> {
  const normalizedBase = normalizeBaseCurrency(baseCurrency);
  let lastError: unknown = null;

  for (const endpoint of FRANKFURTER_ENDPOINTS) {
    const url = `${endpoint}?from=${encodeURIComponent(normalizedBase)}`;

    try {
      const payload = await requestRates(url, signal);
      const normalizedRates = normalizePayload(payload, url);
      persistCachedRates(normalizedRates);
      return normalizedRates;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      lastError = error;
    }
  }

  if (lastError instanceof Error) {
    const cachedRates = readCachedRates(normalizedBase);

    if (cachedRates) {
      return cachedRates;
    }
  }

  return createFallbackRates(normalizedBase.toLowerCase());
}
