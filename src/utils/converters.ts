import { conversionFactors, units } from "../data";
import {
  CategoryId,
  ConversionResult,
  HistoryItem,
  Unit,
  UnitId,
} from "../types";

type CurrencyRates = Record<string, number>;

const factorMap = new Map(
  conversionFactors.map((factor) => [factor.unitId, factor]),
);

const unitsByCategory = units.reduce<Record<CategoryId, Unit[]>>(
  (result, unit) => {
    result[unit.category].push(unit);
    return result;
  },
  {
    currency: [],
    length: [],
    temperature: [],
    time: [],
    weight: [],
  },
);

const defaultUnitPairs: Record<
  CategoryId,
  { fromUnitId: UnitId; toUnitId: UnitId }
> = {
  currency: { fromUnitId: "eur", toUnitId: "czk" },
  length: { fromUnitId: "m", toUnitId: "cm" },
  temperature: { fromUnitId: "c", toUnitId: "f" },
  time: { fromUnitId: "h", toUnitId: "min" },
  weight: { fromUnitId: "kg", toUnitId: "lb" },
};

export function getUnitsForCategory(categoryId: CategoryId) {
  return unitsByCategory[categoryId];
}

export function getDefaultUnitPair(categoryId: CategoryId) {
  return defaultUnitPairs[categoryId];
}

export function resolveUnitPairForCategory(
  categoryId: CategoryId,
  fromUnitId?: UnitId,
  toUnitId?: UnitId,
) {
  const categoryUnits = getUnitsForCategory(categoryId);
  const defaultPair = getDefaultUnitPair(categoryId);

  const safeFromUnitId = categoryUnits.some((unit) => unit.id === fromUnitId)
    ? fromUnitId
    : defaultPair.fromUnitId;

  let safeToUnitId = categoryUnits.some((unit) => unit.id === toUnitId)
    ? toUnitId
    : defaultPair.toUnitId;

  if (safeToUnitId === safeFromUnitId) {
    safeToUnitId =
      categoryUnits.find((unit) => unit.id !== safeFromUnitId)?.id ??
      safeToUnitId;
  }

  return {
    fromUnitId: safeFromUnitId,
    toUnitId: safeToUnitId,
  };
}

export function sanitizeNumericInput(rawValue: string) {
  const normalizedValue = rawValue.replace(",", ".");

  return /^-?\d*(?:\.\d*)?$/.test(normalizedValue)
    ? normalizedValue
    : null;
}

export function parseNumericInput(rawValue: string) {
  if (
    rawValue.trim() === "" ||
    rawValue === "-" ||
    rawValue === "." ||
    rawValue === "-."
  ) {
    return null;
  }

  const parsedValue = Number(rawValue.replace(",", "."));

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function convertCurrencyValue(
  value: number,
  fromUnitId: UnitId,
  toUnitId: UnitId,
  currencyRates: CurrencyRates,
) {
  const fromRate = fromUnitId === "eur" ? 1 : currencyRates[fromUnitId];
  const toRate = toUnitId === "eur" ? 1 : currencyRates[toUnitId];

  if (!fromRate || !toRate) {
    return null;
  }

  const amountInEuro = value / fromRate;

  return amountInEuro * toRate;
}

function convertMeasuredValue(value: number, fromUnitId: UnitId, toUnitId: UnitId) {
  const fromFactor = factorMap.get(fromUnitId);
  const toFactor = factorMap.get(toUnitId);

  if (!fromFactor || !toFactor) {
    return null;
  }

  const baseValue = value * fromFactor.toBase + (fromFactor.offset ?? 0);

  return (baseValue - (toFactor.offset ?? 0)) / toFactor.toBase;
}

export function convertValue({
  categoryId,
  currencyRates = {},
  fromUnitId,
  toUnitId,
  value,
}: {
  categoryId: CategoryId;
  currencyRates?: CurrencyRates;
  fromUnitId: UnitId;
  toUnitId: UnitId;
  value: number;
}): ConversionResult | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const output =
    categoryId === "currency"
      ? convertCurrencyValue(value, fromUnitId, toUnitId, currencyRates)
      : convertMeasuredValue(value, fromUnitId, toUnitId);

  if (output === null) {
    return null;
  }

  return {
    category: categoryId,
    fromUnit: fromUnitId,
    input: value,
    output,
    toUnit: toUnitId,
  };
}

export function createHistoryItem(result: ConversionResult): HistoryItem {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `history-${Date.now()}`,
    createdAt: new Date().toISOString(),
    result,
  };
}
