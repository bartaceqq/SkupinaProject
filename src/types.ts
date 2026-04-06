export type CategoryId =
  | "length"
  | "weight"
  | "temperature"
  | "currency"
  | "time";

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
}

// ===== Jednotky =====

export type UnitId = string;

export interface Unit {
  id: UnitId;
  label: string;
  symbol: string;
  category: CategoryId;
}

export interface ConversionFactor {
  unitId: UnitId;
  toBase: number;
  offset?: number;
}

export interface ConversionResult {
  input: number;
  output: number;
  fromUnit: UnitId;
  toUnit: UnitId;
  category: CategoryId;
}

export interface HistoryItem {
  id: string;
  result: ConversionResult;
  createdAt: string;
}
