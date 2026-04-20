import { useCallback, useEffect, useRef, useState } from 'react'

function normalizeError(error) {
  if (error instanceof Error) {
    return error
  }

  return new Error('Unexpected request failure.')
}

export function useFetch(
  fetcher,
  {
    enabled = true,
    initialData = null,
    dependencies = [],
    refreshIntervalMs = null,
  } = {},
) {
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(Boolean(enabled) && initialData === null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetcherRef = useRef(fetcher)
  const requestIdRef = useRef(0)
  const dependencyKey = JSON.stringify(dependencies)
  fetcherRef.current = fetcher

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!enabled) {
      return null
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    if (!silent) {
      setLoading(true)
    }

    setError(null)

    try {
      const nextData = await fetcherRef.current()

      if (requestId !== requestIdRef.current) {
        return null
      }

      setData(nextData)
      setLastUpdated(new Date().toISOString())
      return nextData
    } catch (fetchError) {
      if (requestId !== requestIdRef.current) {
        return null
      }

      setError(normalizeError(fetchError))
      return null
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return undefined
    }

    let intervalId
    refresh()

    if (refreshIntervalMs) {
      intervalId = window.setInterval(() => {
        refresh({ silent: true })
      }, refreshIntervalMs)
    }

    return () => {
      requestIdRef.current += 1
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [dependencyKey, enabled, refresh, refreshIntervalMs])

  return {
    data,
    error,
    loading,
    lastUpdated,
    refresh,
    setData,
  }
}

export default useFetch
