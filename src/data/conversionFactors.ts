import { ConversionFactor } from "../types";

// Převodní faktory vůči základní jednotce každé kategorie
// base = vstup * toBase + offset

export const conversionFactors: ConversionFactor[] = [
  // Délka → základ: metr
  { unitId: "mm", toBase: 0.001 },
  { unitId: "cm", toBase: 0.01 },
  { unitId: "m", toBase: 1 },
  { unitId: "km", toBase: 1000 },
  { unitId: "in", toBase: 0.0254 },
  { unitId: "ft", toBase: 0.3048 },
  { unitId: "mi", toBase: 1609.344 },

  // Hmotnost → základ: kilogram
  { unitId: "mg", toBase: 0.000001 },
  { unitId: "g", toBase: 0.001 },
  { unitId: "kg", toBase: 1 },
  { unitId: "t", toBase: 1000 },
  { unitId: "lb", toBase: 0.453592 },
  { unitId: "oz", toBase: 0.0283495 },

  // Teplota → základ: Celsius
  // Celsius → Celsius: base = vstup * 1 + 0
  { unitId: "c", toBase: 1, offset: 0 },
  // Fahrenheit → Celsius: base = vstup * (5/9) + (-160/9)
  { unitId: "f", toBase: 5 / 9, offset: -160 / 9 },
  // Kelvin → Celsius: base = vstup * 1 + (-273.15)
  { unitId: "k", toBase: 1, offset: -273.15 },

  // Čas → základ: sekunda
  { unitId: "s", toBase: 1 },
  { unitId: "min", toBase: 60 },
  { unitId: "h", toBase: 3600 },
];
