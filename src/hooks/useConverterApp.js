import { useEffect, useReducer } from 'react'
import { categories, sampleHistory } from '../data'
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
    amount: '1',
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
        : '1',
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
    return sampleHistory
  }

  return items.filter((item) => item?.id && item?.result && item?.createdAt)
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
      return {
        ...state,
        fromUnitId: action.unitId,
      }
    case 'setToUnit':
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
  needsCurrencyRates,
  loading,
  error,
  conversionError,
  rateText,
}) {
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
  const [history, setHistory] = useLocalStorage(historyStorageKey, sampleHistory)
  const [state, dispatch] = useReducer(reducer, draftStorageKey, readDraftFromStorage)

  useEffect(() => {
    persistDraft(draftStorageKey, state)
  }, [draftStorageKey, state.amount, state.category, state.fromUnitId, state.toUnitId])

  const availableUnits = getUnitsByCategory(state.category)
  const numericAmount = parseInputAmount(state.amount)
  const needsCurrencyRates = state.category === 'currency'
  const currencyRates = useCurrencyRates({
    enabled: needsCurrencyRates,
  })

  let previewResult = null
  let conversionError = null

  try {
    if (numericAmount !== null) {
      previewResult = convertValue({
        amount: numericAmount,
        categoryId: state.category,
        fromUnitId: state.fromUnitId,
        toUnitId: state.toUnitId,
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
      pairRate = getCurrencyPairRate(state.fromUnitId, state.toUnitId, currencyRates.rates)
      rateText = formatCurrencyRate(state.fromUnitId, state.toUnitId, currencyRates.rates)
    } catch {
      pairRate = null
      rateText = null
    }
  }

  const statusMessage = buildStatusMessage({
    needsCurrencyRates,
    loading: currencyRates.loading && !currencyRates.rates,
    error: currencyRates.error,
    conversionError,
    rateText,
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
    isClearHistoryModalOpen: state.isClearHistoryModalOpen,
    category: state.category,
    amount: state.amount,
    fromUnitId: state.fromUnitId,
    toUnitId: state.toUnitId,
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
