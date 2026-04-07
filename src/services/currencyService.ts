import type { CurrencyRates, UnitId } from "../types";

export const CURRENCY_REFRESH_INTERVAL_MS = 30 * 60 * 1000;

const FRANKFURTER_ENDPOINTS = [
  "https://api.frankfurter.app/latest",
  "https://api.frankfurter.dev/v1/latest",
];

function normalizeBaseCurrency(baseCurrency: UnitId): string {
  return String(baseCurrency || "eur").toUpperCase();
}

async function requestRates(url: string, signal?: AbortSignal) {
  const response = await fetch(url, {
    signal,
    cache: "no-store",
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
      return normalizePayload(payload, url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      lastError = error;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("Unable to load currency rates.");
}
