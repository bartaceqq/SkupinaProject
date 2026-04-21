import type { ConversionResult, HistoryItem, UnitId } from "../types";
import { getCurrencyPairRate, getUnitById } from "./converters";

const MAX_CONVERSION_FRACTION_DIGITS = 6;

export function formatNumber(
  value: number,
  locale = "cs-CZ",
  maximumFractionDigits = 6,
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
  return `${formatNumber(
    result.input,
    locale,
    MAX_CONVERSION_FRACTION_DIGITS,
  )} ${formatUnitLabel(
    result.fromUnit,
  )} → ${formatNumber(
    result.output,
    locale,
    MAX_CONVERSION_FRACTION_DIGITS,
  )} ${formatUnitLabel(result.toUnit)}`;
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
  return `1 ${formatUnitLabel(fromUnitId)} = ${formatNumber(
    pairRate,
    locale,
  )} ${formatUnitLabel(toUnitId)}`;
}

export function formatHistoryItem(historyItem: HistoryItem, locale = "cs-CZ"): string {
  return `${formatConversionSummary(historyItem.result, locale)} | ${formatHistoryTimestamp(
    historyItem.createdAt,
    locale,
  )}`;
}

function formatUnitLabel(unitId: UnitId): string {
  const unit = getUnitById(unitId);

  if (!unit) {
    return String(unitId).toUpperCase();
  }

  return unit.category === "currency" ? String(unitId).toUpperCase() : unit.symbol || unit.id;
}
