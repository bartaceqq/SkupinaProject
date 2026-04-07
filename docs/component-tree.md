# Component Tree

Actual component structure used by the app.

```txt
src/
  hooks/
    useConverterApp.js
    useCurrencyRates.js
    useFetch.js
    useLocalStorage.js
  components/
    layout/
      AppLayout.jsx
      PageHeader.jsx
    converter/
      CategoryTabs.jsx
      ConverterField.jsx
      SwapButton.jsx
      ConvertButton.jsx
      RateInfoCard.jsx
    history/
      HistorySection.jsx
      HistoryItem.jsx
    feedback/
      StatusMessage.jsx
    modal/
      ConfirmModal.jsx
  data/
    categories.ts
    units.ts
    conversionFactors.ts
    sampleHistory.ts
  services/
    currencyService.ts
  utils/
    converters.ts
    formatters.ts
  theme.ts
  types.ts
```
