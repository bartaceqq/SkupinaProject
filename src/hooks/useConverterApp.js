import { useEffect, useReducer } from 'react'
import { categories } from '../data'
import { EMPTY_HISTORY } from '../constants'
import {
  createHistoryEntry,
  getCurrencyPairRate,
  getDefaultUnitPair,
  getUnitById,
  getUnitsByCategory,
  isUnitInCategory,
  limitHistory,
  parseInputAmount,
  convertValue,
} from '../utils'
import { formatCurrencyRate } from '../utils/formatters'
import { useCurrencyRates } from './useCurrencyRates'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT_DRAFT_STORAGE_KEY = 'unit-converter-draft'
const DEFAULT_HISTORY_STORAGE_KEY = 'unit-converter-history'
const DEFAULT_HISTORY_LIMIT = 10
const DEFAULT_CATEGORY = categories[0]?.id ?? 'currency'

function createDefaultDraft(categoryId = DEFAULT_CATEGORY) {
  const { fromUnitId, toUnitId } = getDefaultUnitPair(categoryId)

  return {
    category: categoryId,
    amount: '100',
    fromUnitId,
    toUnitId,
    isClearHistoryModalOpen: false,
  }
}

function sanitizeDraft(value) {
  if (!value || typeof value !== 'object') {
    return createDefaultDraft()
  }

  const categoryExists = categories.some((category) => category.id === value.category)
  const category = categoryExists ? value.category : DEFAULT_CATEGORY
  const fallbackPair = getDefaultUnitPair(category)
  const nextDraft = {
    category,
    amount:
      typeof value.amount === 'string' || typeof value.amount === 'number'
        ? String(value.amount)
        : '100',
    fromUnitId: isUnitInCategory(value.fromUnitId, category)
      ? value.fromUnitId
      : fallbackPair.fromUnitId,
    toUnitId: isUnitInCategory(value.toUnitId, category)
      ? value.toUnitId
      : fallbackPair.toUnitId,
    isClearHistoryModalOpen: false,
  }

  if (nextDraft.fromUnitId === nextDraft.toUnitId) {
    const alternativeUnit = getUnitsByCategory(category).find(
      (unit) => unit.id !== nextDraft.fromUnitId,
    )

    nextDraft.toUnitId = alternativeUnit?.id ?? fallbackPair.toUnitId
  }

  return nextDraft
}

function sanitizeHistory(items) {
  if (!Array.isArray(items)) {
    return EMPTY_HISTORY
  }

  return items.filter((item) => {
    if (!item || typeof item.id !== 'string' || typeof item.createdAt !== 'string') {
      return false
    }

    const result = item.result

    if (!result || !categories.some((category) => category.id === result.category)) {
      return false
    }

    if (!Number.isFinite(result.input) || !Number.isFinite(result.output)) {
      return false
    }

    return (
      isUnitInCategory(result.fromUnit, result.category) &&
      isUnitInCategory(result.toUnit, result.category)
    )
  })
}

function readDraftFromStorage(storageKey) {
  if (typeof window === 'undefined') {
    return createDefaultDraft()
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey)
    return sanitizeDraft(storedValue ? JSON.parse(storedValue) : null)
  } catch {
    return createDefaultDraft()
  }
}

function persistDraft(storageKey, draft) {
  if (typeof window === 'undefined') {
    return
  }

  const payload = {
    category: draft.category,
    amount: draft.amount,
    fromUnitId: draft.fromUnitId,
    toUnitId: draft.toUnitId,
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(payload))
  } catch {
    return
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'setCategory': {
      const nextPair = getDefaultUnitPair(action.categoryId)

      return {
        ...state,
        category: action.categoryId,
        fromUnitId: nextPair.fromUnitId,
        toUnitId: nextPair.toUnitId,
      }
    }
    case 'setAmount':
      return {
        ...state,
        amount: action.amount,
      }
    case 'setFromUnit':
      if (action.unitId === state.toUnitId) {
        return {
          ...state,
          fromUnitId: action.unitId,
          toUnitId: state.fromUnitId,
        }
      }

      return {
        ...state,
        fromUnitId: action.unitId,
      }
    case 'setToUnit':
      if (action.unitId === state.fromUnitId) {
        return {
          ...state,
          fromUnitId: state.toUnitId,
          toUnitId: action.unitId,
        }
      }

      return {
        ...state,
        toUnitId: action.unitId,
      }
    case 'swapUnits':
      return {
        ...state,
        fromUnitId: state.toUnitId,
        toUnitId: state.fromUnitId,
      }
    case 'applyHistoryItem':
      return sanitizeDraft({
        category: action.historyItem.result.category,
        amount: String(action.historyItem.result.input),
        fromUnitId: action.historyItem.result.fromUnit,
        toUnitId: action.historyItem.result.toUnit,
      })
    case 'openClearHistoryModal':
      return {
        ...state,
        isClearHistoryModalOpen: true,
      }
    case 'closeClearHistoryModal':
      return {
        ...state,
        isClearHistoryModalOpen: false,
      }
    default:
      return state
  }
}

function buildStatusMessage({
  invalidAmount,
  needsCurrencyRates,
  loading,
  error,
  conversionError,
  rateText,
  source,
}) {
  if (invalidAmount) {
    return {
      tone: 'error',
      text: 'Zadejte platné číslo pro převod.',
    }
  }

  if (conversionError) {
    return {
      tone: 'error',
      text: conversionError.message,
    }
  }

  if (!needsCurrencyRates) {
    return null
  }

  if (loading) {
    return {
      tone: 'loading',
      text: 'Načítám aktuální měnové kurzy...',
    }
  }

  if (error) {
    return {
      tone: 'error',
      text: 'Nepodařilo se načíst kurzy. Zkus obnovit data.',
    }
  }

  if (source === 'local-fallback') {
    return {
      tone: 'warning',
      text: 'API není dostupné, používám vestavěné offline kurzy.',
    }
  }

  if (source === 'local-cache') {
    return {
      tone: 'warning',
      text: 'API není dostupné, používám naposledy uložené kurzy.',
    }
  }

  if (rateText) {
    return {
      tone: 'success',
      text: rateText,
    }
  }

  return null
}

export function useConverterApp({
  draftStorageKey = DEFAULT_DRAFT_STORAGE_KEY,
  historyStorageKey = DEFAULT_HISTORY_STORAGE_KEY,
  historyLimit = DEFAULT_HISTORY_LIMIT,
} = {}) {
  const [history, setHistory] = useLocalStorage(historyStorageKey, EMPTY_HISTORY)
  const [state, dispatch] = useReducer(reducer, draftStorageKey, readDraftFromStorage)
  const { amount, category, fromUnitId, toUnitId } = state

  useEffect(() => {
    persistDraft(draftStorageKey, { amount, category, fromUnitId, toUnitId })
  }, [amount, category, draftStorageKey, fromUnitId, toUnitId])

  const availableUnits = getUnitsByCategory(category)
  const numericAmount = parseInputAmount(amount)
  const hasTypedAmount = String(amount ?? '').trim() !== ''
  const isAmountInvalid = hasTypedAmount && numericAmount === null
  const amountMessage = !hasTypedAmount
    ? 'Zadej hodnotu k převodu.'
    : isAmountInvalid
      ? 'Zadej platné číslo, například 100 nebo 12,5.'
      : null
  const needsCurrencyRates = category === 'currency'
  const currencyRates = useCurrencyRates({
    enabled: needsCurrencyRates,
  })

  let previewResult = null
  let conversionError = null

  try {
    if (numericAmount !== null) {
      previewResult = convertValue({
        amount: numericAmount,
        categoryId: category,
        fromUnitId,
        toUnitId,
        currencyRates: currencyRates.rates,
      })
    }
  } catch (error) {
    conversionError = error instanceof Error ? error : new Error('Conversion failed.')
  }

  let pairRate = null
  let rateText = null

  if (needsCurrencyRates && currencyRates.rates) {
    try {
      pairRate = getCurrencyPairRate(fromUnitId, toUnitId, currencyRates.rates)
      rateText = formatCurrencyRate(fromUnitId, toUnitId, currencyRates.rates)
    } catch {
      pairRate = null
      rateText = null
    }
  }

  const statusMessage = buildStatusMessage({
    invalidAmount: isAmountInvalid,
    needsCurrencyRates,
    loading: currencyRates.loading && !currencyRates.rates,
    error: currencyRates.error,
    conversionError,
    rateText,
    source: currencyRates.source,
  })

  const normalizedHistory = limitHistory(sanitizeHistory(history), historyLimit)
  const canConvert =
    previewResult !== null &&
    conversionError === null &&
    (!needsCurrencyRates || Boolean(currencyRates.rates))

  const submitConversion = () => {
    if (!previewResult) {
      return null
    }

    const nextItem = createHistoryEntry(previewResult)

    setHistory((currentHistory) =>
      limitHistory([nextItem, ...sanitizeHistory(currentHistory)], historyLimit),
    )

    return nextItem
  }

  const clearHistory = () => {
    setHistory([])
    dispatch({ type: 'closeClearHistoryModal' })
  }

  const deleteHistoryItem = (historyItemId) => {
    setHistory((currentHistory) =>
      sanitizeHistory(currentHistory).filter((item) => item.id !== historyItemId),
    )
  }

  const applyHistoryItem = (historyItem) => {
    dispatch({
      type: 'applyHistoryItem',
      historyItem,
    })
  }

  return {
    categories,
    history: normalizedHistory,
    previewResult,
    statusMessage,
    availableUnits,
    canConvert,
    isAmountInvalid,
    amountMessage,
    isClearHistoryModalOpen: state.isClearHistoryModalOpen,
    category,
    amount,
    fromUnitId,
    toUnitId,
    fromUnit: getUnitById(state.fromUnitId),
    toUnit: getUnitById(state.toUnitId),
    setAmount: (amount) => dispatch({ type: 'setAmount', amount }),
    setCategory: (categoryId) => dispatch({ type: 'setCategory', categoryId }),
    setFromUnit: (unitId) => dispatch({ type: 'setFromUnit', unitId }),
    setToUnit: (unitId) => dispatch({ type: 'setToUnit', unitId }),
    swapUnits: () => dispatch({ type: 'swapUnits' }),
    submitConversion,
    applyHistoryItem,
    deleteHistoryItem,
    openClearHistoryModal: () => dispatch({ type: 'openClearHistoryModal' }),
    closeClearHistoryModal: () => dispatch({ type: 'closeClearHistoryModal' }),
    clearHistory,
    refreshRates: currencyRates.refresh,
    rateInfo: {
      visible: needsCurrencyRates,
      loading: currencyRates.loading,
      error: currencyRates.error,
      pairRate,
      rateText,
      effectiveDate: currencyRates.effectiveDate,
      lastUpdated: currencyRates.lastUpdated,
      source: currencyRates.source,
    },
  }
}

export default useConverterApp
