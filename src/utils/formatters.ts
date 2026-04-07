import { Category, ConversionResult, HistoryItem, Unit } from "../types";

const DEFAULT_NUMBER_FORMAT_OPTIONS = {
  maximumFractionDigits: 4,
  minimumFractionDigits: 0,
};

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = DEFAULT_NUMBER_FORMAT_OPTIONS,
) {
  return new Intl.NumberFormat("cs-CZ", options).format(value);
}

export function formatUnitOption(unit: Unit) {
  const code = unit.category === "currency" ? unit.id.toUpperCase() : unit.symbol;

  return `${code} ${unit.label}`;
}

function getHistoryUnitLabel(unit?: Unit) {
  if (!unit) {
    return "";
  }

  return unit.category === "currency" ? unit.id.toUpperCase() : unit.symbol;
}

export function formatConversionSummary(
  result: ConversionResult,
  unitsById: Map<string, Unit>,
) {
  const fromUnit = unitsById.get(result.fromUnit);
  const toUnit = unitsById.get(result.toUnit);

  return `${formatNumber(result.input)} ${getHistoryUnitLabel(fromUnit)} → ${formatNumber(result.output)} ${getHistoryUnitLabel(toUnit)}`;
}

export function formatHistoryMeta(
  item: HistoryItem,
  categoriesById: Map<string, Category>,
) {
  const timestamp = new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(item.createdAt));

  return `${categoriesById.get(item.result.category)?.label ?? ""} • ${timestamp}`;
}

export function formatExchangeSummary(
  fromUnitId: string,
  toUnitId: string,
  rates: Record<string, number>,
) {
  const fromRate = fromUnitId === "eur" ? 1 : rates[fromUnitId];
  const toRate = toUnitId === "eur" ? 1 : rates[toUnitId];

  if (!fromRate || !toRate) {
    return "";
  }

  const directRate = toRate / fromRate;

  return `1 ${fromUnitId.toUpperCase()} = ${formatNumber(directRate)} ${toUnitId.toUpperCase()}`;
}

export function formatRateTimestamp(updatedAt?: string | null, sourceDate?: string | null) {
  if (!updatedAt && !sourceDate) {
    return "Kurzy se načítají z veřejného API.";
  }

  if (sourceDate) {
    return `Kurzovní den: ${sourceDate}`;
  }

  return `Naposledy aktualizováno ${new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(updatedAt ?? ""))}`;
}
