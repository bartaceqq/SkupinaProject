import { categories } from "../data/categories";
import { conversionFactors } from "../data/conversionFactors";
import { units } from "../data/units";
import type {
  Category,
  CategoryId,
  ConversionFactor,
  ConversionResult,
  HistoryItem,
  Unit,
  UnitId,
} from "../types";

const categoryMap = new Map<CategoryId, Category>(
  categories.map((category) => [category.id, category]),
);

const unitMap = new Map<UnitId, Unit>(units.map((unit) => [unit.id, unit]));
const factorMap = new Map<UnitId, ConversionFactor>(
  conversionFactors.map((factor) => [factor.unitId, factor]),
);

const defaultUnitPairs: Record<CategoryId, [UnitId, UnitId]> = {
  currency: ["eur", "czk"],
  length: ["m", "cm"],
  weight: ["kg", "lb"],
  temperature: ["c", "f"],
  time: ["h", "min"],
};

function normalizeNumber(value: number): number {
  const roundedValue = Number.parseFloat(value.toPrecision(15));
  return Object.is(roundedValue, -0) ? 0 : roundedValue;
}

function ensureFiniteNumber(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Input amount must be a finite number.");
  }
}

function getFactor(unitId: UnitId): ConversionFactor {
  const factor = factorMap.get(unitId);

  if (!factor) {
    throw new Error(`Missing conversion factor for unit "${unitId}".`);
  }

  return factor;
}

function createHistoryId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `conversion-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function getCategoryById(categoryId: CategoryId): Category | null {
  return categoryMap.get(categoryId) || null;
}

export function getUnitById(unitId: UnitId): Unit | null {
  return unitMap.get(unitId) || null;
}

export function getUnitsByCategory(categoryId: CategoryId): Unit[] {
  return units.filter((unit) => unit.category === categoryId);
}

export function isUnitInCategory(unitId: UnitId, categoryId: CategoryId): boolean {
  return getUnitById(unitId)?.category === categoryId;
}

export function getDefaultUnitPair(categoryId: CategoryId) {
  const fallbackUnits = getUnitsByCategory(categoryId);
  const preferredPair = defaultUnitPairs[categoryId];

  if (
    preferredPair &&
    preferredPair.every((unitId) => isUnitInCategory(unitId, categoryId))
  ) {
    return {
      fromUnitId: preferredPair[0],
      toUnitId: preferredPair[1],
    };
  }

  return {
    fromUnitId: fallbackUnits[0]?.id || "",
    toUnitId: fallbackUnits[1]?.id || fallbackUnits[0]?.id || "",
  };
}

export function parseInputAmount(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const normalizedValue =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));

  return Number.isFinite(normalizedValue) ? normalizedValue : null;
}

export function convertUsingFactors(
  amount: number,
  fromUnitId: UnitId,
  toUnitId: UnitId,
): number {
  ensureFiniteNumber(amount);

  if (fromUnitId === toUnitId) {
    return normalizeNumber(amount);
  }

  const fromFactor = getFactor(fromUnitId);
  const toFactor = getFactor(toUnitId);

  const baseValue = amount * fromFactor.toBase + (fromFactor.offset || 0);
  const convertedValue = (baseValue - (toFactor.offset || 0)) / toFactor.toBase;

  return normalizeNumber(convertedValue);
}

export function convertCurrency(
  amount: number,
  fromUnitId: UnitId,
  toUnitId: UnitId,
  rates: Record<UnitId, number>,
): number {
  ensureFiniteNumber(amount);

  if (fromUnitId === toUnitId) {
    return normalizeNumber(amount);
  }

  const fromRate = rates[String(fromUnitId).toLowerCase()];
  const toRate = rates[String(toUnitId).toLowerCase()];

  if (!Number.isFinite(fromRate) || !Number.isFinite(toRate)) {
    throw new Error("Missing currency rate for the selected pair.");
  }

  const baseValue = amount / fromRate;
  return normalizeNumber(baseValue * toRate);
}

export function convertValue({
  amount,
  categoryId,
  fromUnitId,
  toUnitId,
  currencyRates,
}: {
  amount: number;
  categoryId: CategoryId;
  fromUnitId: UnitId;
  toUnitId: UnitId;
  currencyRates?: Record<UnitId, number> | null;
}): ConversionResult {
  ensureFiniteNumber(amount);

  if (!isUnitInCategory(fromUnitId, categoryId)) {
    throw new Error(`Unit "${fromUnitId}" does not belong to "${categoryId}".`);
  }

  if (!isUnitInCategory(toUnitId, categoryId)) {
    throw new Error(`Unit "${toUnitId}" does not belong to "${categoryId}".`);
  }

  const output =
    categoryId === "currency"
      ? convertCurrency(amount, fromUnitId, toUnitId, currencyRates || {})
      : convertUsingFactors(amount, fromUnitId, toUnitId);

  return {
    input: normalizeNumber(amount),
    output,
    fromUnit: fromUnitId,
    toUnit: toUnitId,
    category: categoryId,
  };
}

export function getCurrencyPairRate(
  fromUnitId: UnitId,
  toUnitId: UnitId,
  rates: Record<UnitId, number>,
): number {
  return convertCurrency(1, fromUnitId, toUnitId, rates);
}

export function createHistoryEntry(
  result: ConversionResult,
  createdAt = new Date().toISOString(),
): HistoryItem {
  return {
    id: createHistoryId(),
    result,
    createdAt,
  };
}

export function limitHistory(items: HistoryItem[], limit = 10): HistoryItem[] {
  return items.slice(0, limit);
}
