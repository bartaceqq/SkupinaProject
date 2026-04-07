import { useEffect, useState } from 'react'

function resolveValue(initialValue) {
  return typeof initialValue === 'function' ? initialValue() : initialValue
}

function readStorageValue(key, initialValue, parser) {
  if (typeof window === 'undefined') {
    return resolveValue(initialValue)
  }

  try {
    const storedValue = window.localStorage.getItem(key)
    if (storedValue === null) {
      return resolveValue(initialValue)
    }

    return parser(storedValue)
  } catch {
    return resolveValue(initialValue)
  }
}

export function useLocalStorage(
  key,
  initialValue,
  {
    parser = JSON.parse,
    serializer = JSON.stringify,
  } = {},
) {
  const [storedValue, setStoredValue] = useState(() =>
    readStorageValue(key, initialValue, parser),
  )

  useEffect(() => {
    setStoredValue(readStorageValue(key, initialValue, parser))
  }, [initialValue, key, parser])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleStorage = (event) => {
      if (event.key !== key) {
        return
      }

      setStoredValue(readStorageValue(key, initialValue, parser))
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [initialValue, key, parser])

  const setValue = (valueOrUpdater) => {
    setStoredValue((currentValue) => {
      const nextValue =
        typeof valueOrUpdater === 'function'
          ? valueOrUpdater(currentValue)
          : valueOrUpdater

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, serializer(nextValue))
        } catch {
          return currentValue
        }
      }

      return nextValue
    })
  }

  const removeValue = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key)
      } catch {
        return
      }
    }

    setStoredValue(resolveValue(initialValue))
  }

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
