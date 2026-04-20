import { HistoryItem } from "../types";

export const sampleHistory: HistoryItem[] = [
  {
    id: "1",
    result: {
      input: 100,
      output: 2490,
      fromUnit: "eur",
      toUnit: "czk",
      category: "currency",
    },
    createdAt: "2026-04-06T09:00:00.000Z",
  },
  {
    id: "2",
    result: {
      input: 2,
      output: 200,
      fromUnit: "m",
      toUnit: "cm",
      category: "length",
    },
    createdAt: "2026-04-06T09:05:00.000Z",
  },
  {
    id: "3",
    result: {
      input: 70,
      output: 154.32,
      fromUnit: "kg",
      toUnit: "lb",
      category: "weight",
    },
    createdAt: "2026-04-06T09:10:00.000Z",
  },
  {
    id: "4",
    result: {
      input: 32,
      output: 89.6,
      fromUnit: "c",
      toUnit: "f",
      category: "temperature",
    },
    createdAt: "2026-04-06T09:15:00.000Z",
  },
  {
    id: "5",
    result: {
      input: 1,
      output: 60,
      fromUnit: "h",
      toUnit: "min",
      category: "time",
    },
    createdAt: "2026-04-06T09:20:00.000Z",
  },
];
