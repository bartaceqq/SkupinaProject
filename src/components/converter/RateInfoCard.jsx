function formatDateLabel(value, includeTime = false) {
  if (!value) {
    return '—'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('cs-CZ', {
    dateStyle: 'medium',
    ...(includeTime || String(value).includes('T') ? { timeStyle: 'short' } : {}),
  }).format(parsed)
}

function resolveSourceLabel(source) {
  if (!source) {
    return '—'
  }

  if (source === 'local-fallback') {
    return 'vestavěné offline kurzy'
  }

  if (source === 'local-cache') {
    return 'lokální cache'
  }

  try {
    return new URL(source).hostname
  } catch {
    return source
  }
}

function RateInfoCard({
  visible,
  loading,
  error,
  rateText,
  effectiveDate,
  lastUpdated,
  source,
  onRefresh,
}) {
  if (!visible) {
    return null
  }

  const meta = [
    rateText,
    effectiveDate ? `Platnost ${formatDateLabel(effectiveDate)}` : null,
    lastUpdated ? `Sync ${formatDateLabel(lastUpdated, true)}` : null,
    source ? `Zdroj ${resolveSourceLabel(source)}` : null,
  ]
    .filter(Boolean)
    .join(' • ')

  const statusText =
    loading && !rateText
      ? 'Načítám kurzy z API'
      : error
        ? 'Nepodařilo se aktualizovat kurzy'
        : source === 'local-cache'
          ? 'Používám naposledy uložené kurzy'
          : source === 'local-fallback'
            ? 'Používám vestavěné offline kurzy'
        : rateText || 'Kurz není k dispozici'

  return (
    <section className="rate-card" aria-label="Měnové kurzy">
      <div className="rate-card__content">
        <div className="rate-card__summary" aria-live="polite">
          <strong>{statusText}</strong>
          <span>{meta}</span>
        </div>
        <button
          type="button"
          className="button-secondary"
          onClick={onRefresh}
          disabled={loading}
          title={meta || statusText}
        >
          {loading ? 'Načítání…' : 'Aktualizovat kurzy'}
        </button>
      </div>
    </section>
  )
}

export default RateInfoCard
