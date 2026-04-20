# Frontend handoff pro Role A

Poznamka: tento dokument vznikl pred dodelanim UI. Aktualni stav repozitare uz obsahuje funkcni MVP aplikaci, ne jen scaffold.

Tento commit nechává `src/components/` a aktuální vizuální scaffold beze změny. Role B je připravená jako logická vrstva, na kterou se můžeš na druhém zařízení napojit.

## Co je hotové

- `src/hooks/useConverterApp.js`
  - centrální hook pro stav aplikace, `useReducer`, localStorage historii a akce formuláře
- `src/hooks/useCurrencyRates.js`
  - fetch měnových kurzů s automatickým refreshem
- `src/hooks/useFetch.js`
  - obecný hook pro request lifecycle (`loading`, `error`, `refresh`, `lastUpdated`)
- `src/hooks/useLocalStorage.js`
  - persistence do `localStorage`
- `src/services/currencyService.ts`
  - načítání kurzů z Frankfurter API s fallback endpointem
- `src/utils/converters.ts`
  - převodní logika pro délku, váhu, teplotu, čas i měny
- `src/utils/formatters.ts`
  - formátování čísel, kurzů a historie

## Stavový kontrakt pro UI

`useConverterApp()` vrací:

- `categories`
- `category`, `amount`, `fromUnitId`, `toUnitId`
- `fromUnit`, `toUnit`, `availableUnits`
- `previewResult`
- `canConvert`
- `history`
- `statusMessage`
- `rateInfo`
- `isClearHistoryModalOpen`
- akce:
  - `setCategory(categoryId)`
  - `setAmount(value)`
  - `setFromUnit(unitId)`
  - `setToUnit(unitId)`
  - `swapUnits()`
  - `submitConversion()`
  - `applyHistoryItem(historyItem)`
  - `deleteHistoryItem(historyItemId)`
  - `openClearHistoryModal()`
  - `closeClearHistoryModal()`
  - `clearHistory()`
  - `refreshRates()`

## Doporučené napojení komponent

- `AppLayout`
  - header / main / footer wrapper, mobile-first stack
- `PageHeader`
  - použij `statusMessage` pro krátký stav pod titulkem
- `CategoryTabs`
  - `categories`, `activeCategoryId={category}`, `onChange={setCategory}`
- `ConverterField`
  - jedno pole pro vstup (`value={amount}`), druhé pro výstup (`value={previewResult?.output ?? ''}`)
  - select napoj na `availableUnits`
- `SwapButton`
  - `onClick={swapUnits}`
- `ConvertButton`
  - `disabled={!canConvert}`, `onClick={submitConversion}`
- `RateInfoCard`
  - zobraz jen při `rateInfo.visible`
- `HistorySection`
  - napoj na `history`, `applyHistoryItem`, `deleteHistoryItem`, `openClearHistoryModal`
- `ConfirmModal`
  - `open={isClearHistoryModalOpen}`, `onConfirm={clearHistory}`, `onCancel={closeClearHistoryModal}`

## Doporučený start v `App.jsx`

```jsx
import { useConverterApp } from './hooks'

function App() {
  const app = useConverterApp()

  return null
}
```

Pak už jen postupně rozbal jednotlivé komponenty a props z objektu `app`.

## Poznámky

- Theme jsem nepřepisoval do CSS/framework configu, protože to patří do Role A. Hodnoty jsou pořád v `src/theme.ts`.
- Historie je na prvním načtení seedovaná z `src/data/sampleHistory.ts`, aby bylo hned co renderovat. Pokud chceš čistý start, změň initial value v `useConverterApp`.
- `localStorage` klíče:
  - draft: `unit-converter-draft`
  - history: `unit-converter-history`
