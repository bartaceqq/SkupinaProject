import type { ConversionResult, HistoryItem, UnitId } from "../types";
import { getCurrencyPairRate, getUnitById } from "./converters";

export function formatNumber(
  value: number,
  locale = "cs-CZ",
  maximumFractionDigits = 4,
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value);
}

export function formatConversionSummary(
  result: ConversionResult,
  locale = "cs-CZ",
): string {
  const fromUnit = getUnitById(result.fromUnit);
  const toUnit = getUnitById(result.toUnit);

  return `${formatNumber(result.input, locale)} ${
    fromUnit?.symbol || result.fromUnit
  } = ${formatNumber(result.output, locale)} ${toUnit?.symbol || result.toUnit}`;
}

export function formatHistoryTimestamp(value: string, locale = "cs-CZ"): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsedDate);
}

export function formatCurrencyRate(
  fromUnitId: UnitId,
  toUnitId: UnitId,
  rates: Record<UnitId, number>,
  locale = "cs-CZ",
): string {
  const pairRate = getCurrencyPairRate(fromUnitId, toUnitId, rates);
  const fromUnit = getUnitById(fromUnitId);
  const toUnit = getUnitById(toUnitId);

  return `1 ${fromUnit?.symbol || fromUnitId.toUpperCase()} = ${formatNumber(
    pairRate,
    locale,
  )} ${toUnit?.symbol || toUnitId.toUpperCase()}`;
}

export function formatHistoryItem(historyItem: HistoryItem, locale = "cs-CZ"): string {
  return `${formatConversionSummary(historyItem.result, locale)} | ${formatHistoryTimestamp(
    historyItem.createdAt,
    locale,
  )}`;
}
