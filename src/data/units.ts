import { Unit } from "../types";

export const units: Unit[] = [
  // Délka (základní jednotka: metr)
  { id: "mm", label: "Milimetr", symbol: "mm", category: "length" },
  { id: "cm", label: "Centimetr", symbol: "cm", category: "length" },
  { id: "m", label: "Metr", symbol: "m", category: "length" },
  { id: "km", label: "Kilometr", symbol: "km", category: "length" },
  { id: "in", label: "Palec", symbol: "in", category: "length" },
  { id: "ft", label: "Stopa", symbol: "ft", category: "length" },
  { id: "mi", label: "Míle", symbol: "mi", category: "length" },

  // Hmotnost (základní jednotka: kilogram)
  { id: "mg", label: "Miligram", symbol: "mg", category: "weight" },
  { id: "g", label: "Gram", symbol: "g", category: "weight" },
  { id: "kg", label: "Kilogram", symbol: "kg", category: "weight" },
  { id: "t", label: "Tuna", symbol: "t", category: "weight" },
  { id: "lb", label: "Libra", symbol: "lb", category: "weight" },
  { id: "oz", label: "Unce", symbol: "oz", category: "weight" },

  // Teplota (základní jednotka: Celsius)
  { id: "c", label: "Celsius", symbol: "°C", category: "temperature" },
  { id: "f", label: "Fahrenheit", symbol: "°F", category: "temperature" },
  { id: "k", label: "Kelvin", symbol: "K", category: "temperature" },

  // Čas (základní jednotka: sekunda)
  { id: "s", label: "Sekunda", symbol: "s", category: "time" },
  { id: "min", label: "Minuta", symbol: "min", category: "time" },
  { id: "h", label: "Hodina", symbol: "h", category: "time" },

  // Měna (základní jednotka: EUR)
  { id: "eur", label: "Euro", symbol: "€", category: "currency" },
  { id: "usd", label: "Americký dolar", symbol: "$", category: "currency" },
  { id: "czk", label: "Česká koruna", symbol: "Kč", category: "currency" },
  { id: "gbp", label: "Britská libra", symbol: "£", category: "currency" },
  { id: "pln", label: "Polský zlotý", symbol: "zł", category: "currency" },
];
