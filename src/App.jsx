import { useEffect, useState } from 'react'
import './App.css'
import ConvertButton from './components/converter/ConvertButton'
import ConverterField from './components/converter/ConverterField'
import CategoryTabs from './components/converter/CategoryTabs'
import RateInfoCard from './components/converter/RateInfoCard'
import SwapButton from './components/converter/SwapButton'
import StatusMessage from './components/feedback/StatusMessage'
import HistorySection from './components/history/HistorySection'
import AppLayout from './components/layout/AppLayout'
import PageHeader from './components/layout/PageHeader'
import ConfirmModal from './components/modal/ConfirmModal'
import { categories, sampleHistory, units } from './data'
import { fetchCurrencyRates, getFallbackRates } from './services/currencyService'
import {
  convertValue,
  createHistoryItem,
  parseNumericInput,
  resolveUnitPairForCategory,
  sanitizeNumericInput,
} from './utils/converters'
import {
  formatConversionSummary,
  formatExchangeSummary,
  formatHistoryMeta,
  formatNumber,
  formatRateTimestamp,
} from './utils/formatters'

const STORAGE_KEYS = {
  history: 'unit-converter:history',
  preferences: 'unit-converter:preferences',
  rates: 'unit-converter:rates',
}

const DEFAULT_CATEGORY = 'currency'
const HISTORY_LIMIT = 6
const unitsById = new Map(units.map((unit) => [unit.id, unit]))
const categoriesById = new Map(categories.map((category) => [category.id, category]))

function readStoredJson(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  try {
    const storedValue = window.localStorage.getItem(key)

    return storedValue ? JSON.parse(storedValue) : fallbackValue
  } catch {
    return fallbackValue
  }
}

function storeJson(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

const storedPreferences = readStoredJson(STORAGE_KEYS.preferences, null)
const initialCategory = categories.some((category) => category.id === storedPreferences?.activeCategory)
  ? storedPreferences.activeCategory
  : DEFAULT_CATEGORY
const initialUnitPair = resolveUnitPairForCategory(
  initialCategory,
  storedPreferences?.fromUnitId,
  storedPreferences?.toUnitId,
)
const storedRates = readStoredJson(STORAGE_KEYS.rates, null)

function App() {
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [inputValue, setInputValue] = useState(
    typeof storedPreferences?.inputValue === 'string' ? storedPreferences.inputValue : '100',
  )
  const [fromUnitId, setFromUnitId] = useState(initialUnitPair.fromUnitId)
  const [toUnitId, setToUnitId] = useState(initialUnitPair.toUnitId)
  const [history, setHistory] = useState(() =>
    readStoredJson(STORAGE_KEYS.history, sampleHistory),
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState(null)
  const [rateError, setRateError] = useState('')
  const [isRatesLoading, setIsRatesLoading] = useState(false)
  const [currencyRates, setCurrencyRates] = useState(storedRates?.rates ?? getFallbackRates())
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(storedRates?.updatedAt ?? null)
  const [rateSourceDate, setRateSourceDate] = useState(storedRates?.sourceDate ?? null)

  useEffect(() => {
    storeJson(STORAGE_KEYS.preferences, {
      activeCategory,
      fromUnitId,
      inputValue,
      toUnitId,
    })
  }, [activeCategory, fromUnitId, inputValue, toUnitId])

  useEffect(() => {
    storeJson(STORAGE_KEYS.history, history)
  }, [history])

  useEffect(() => {
    storeJson(STORAGE_KEYS.rates, {
      rates: currencyRates,
      sourceDate: rateSourceDate,
      updatedAt: ratesUpdatedAt,
    })
  }, [currencyRates, rateSourceDate, ratesUpdatedAt])

  useEffect(() => {
    if (!feedbackMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setFeedbackMessage(null)
    }, 4000)

    return () => window.clearTimeout(timeoutId)
  }, [feedbackMessage])

  useEffect(() => {
    handleRefreshRates(false)
  }, [])

  const currentUnits = units.filter((unit) => unit.category === activeCategory)
  const parsedInput = parseNumericInput(inputValue)
  const conversionResult =
    parsedInput === null
      ? null
      : convertValue({
          categoryId: activeCategory,
          currencyRates,
          fromUnitId,
          toUnitId,
          value: parsedInput,
        })

  const outputValue = conversionResult ? formatNumber(conversionResult.output) : ''
  const canSaveConversion = Boolean(conversionResult)

  const historyItems = history.map((item) => ({
    id: item.id,
    meta: formatHistoryMeta(item, categoriesById),
    summary: formatConversionSummary(item.result, unitsById),
  }))

  const rateCardStatus =
    activeCategory === 'currency'
      ? rateError
        ? 'error'
        : isRatesLoading
          ? 'loading'
          : 'success'
      : 'neutral'

  const rateCardTitle =
    activeCategory === 'currency'
      ? formatExchangeSummary(fromUnitId, toUnitId, currencyRates) || 'Kurz pro vybranou dvojici není dostupný'
      : 'Živý převod'

  const rateCardDescription =
    activeCategory === 'currency'
      ? rateError || formatRateTimestamp(ratesUpdatedAt, rateSourceDate)
      : 'Výsledek se přepočítává okamžitě při psaní i změně jednotek.'

  function handleRefreshRates(showSuccessMessage = true) {
    setIsRatesLoading(true)
    setRateError('')

    fetchCurrencyRates()
      .then((result) => {
        setCurrencyRates(result.rates)
        setRatesUpdatedAt(result.updatedAt)
        setRateSourceDate(result.sourceDate)

        if (showSuccessMessage) {
          setFeedbackMessage({
            text: 'Kurzy byly aktualizovány z API.',
            variant: 'success',
          })
        }
      })
      .catch(() => {
        setRateError('Nepodařilo se načíst nové kurzy. Používám poslední dostupné hodnoty.')
      })
      .finally(() => {
        setIsRatesLoading(false)
      })
  }

  function handleCategoryChange(nextCategory) {
    if (nextCategory === activeCategory) {
      return
    }

    const nextUnitPair = resolveUnitPairForCategory(nextCategory)

    setActiveCategory(nextCategory)
    setFromUnitId(nextUnitPair.fromUnitId)
    setToUnitId(nextUnitPair.toUnitId)
  }

  function handleInputChange(event) {
    const nextValue = sanitizeNumericInput(event.target.value)

    if (nextValue !== null) {
      setInputValue(nextValue)
    }
  }

  function handleSwapUnits() {
    setFromUnitId(toUnitId)
    setToUnitId(fromUnitId)
  }

  function handleSaveConversion() {
    if (!conversionResult) {
      return
    }

    setHistory((previousHistory) => [
      createHistoryItem(conversionResult),
      ...previousHistory,
    ].slice(0, HISTORY_LIMIT))

    setFeedbackMessage({
      text: 'Převod byl uložen do historie.',
      variant: 'success',
    })
  }

  function handleConfirmClearHistory() {
    setHistory([])
    setIsModalOpen(false)
    setFeedbackMessage({
      text: 'Historie byla smazána.',
      variant: 'success',
    })
  }

  return (
    <>
      <AppLayout
        header={
          <>
            <PageHeader title="All Unit Converter" />
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={handleCategoryChange}
            />
          </>
        }
        footer={
          <button
            type="button"
            className="refresh-button"
            onClick={() => handleRefreshRates()}
            disabled={isRatesLoading}
          >
            {isRatesLoading ? 'Aktualizuji kurzy...' : 'Aktualizovat kurzy'}
          </button>
        }
        statusArea={
          isRatesLoading || rateError || feedbackMessage ? (
            <>
              {isRatesLoading ? (
                <StatusMessage variant="loading">Loading: Fetching rates via API</StatusMessage>
              ) : null}
              {rateError ? <StatusMessage variant="error">Error: {rateError}</StatusMessage> : null}
              {feedbackMessage ? (
                <StatusMessage variant={feedbackMessage.variant}>{feedbackMessage.text}</StatusMessage>
              ) : null}
            </>
          ) : null
        }
      >
        <section className="converter-panel">
          <div className="converter-panel__grid">
            <ConverterField
              id="converter-input"
              label="Z:"
              value={inputValue}
              units={currentUnits}
              selectedUnitId={fromUnitId}
              onValueChange={handleInputChange}
              onUnitChange={setFromUnitId}
            />

            <SwapButton onClick={handleSwapUnits} />

            <ConverterField
              id="converter-output"
              label="Do:"
              value={outputValue}
              units={currentUnits}
              selectedUnitId={toUnitId}
              onValueChange={() => {}}
              onUnitChange={setToUnitId}
              readOnly
            />
          </div>

          <ConvertButton onClick={handleSaveConversion} disabled={!canSaveConversion} />
        </section>

        <RateInfoCard
          title={rateCardTitle}
          description={rateCardDescription}
          status={rateCardStatus}
        />

        <HistorySection items={historyItems} onClearRequest={() => setIsModalOpen(true)} />
      </AppLayout>

      <ConfirmModal
        open={isModalOpen}
        title="Vymazat historii?"
        message="Opravdu chcete odstranit všechny uložené převody?"
        confirmLabel="Potvrdit"
        cancelLabel="Zrušit"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClearHistory}
      />
    </>
  )
}

export default App
