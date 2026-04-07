<<<<<<< Updated upstream
function RateInfoCard({ description, status = 'neutral', title }) {
  return (
    <section className={`rate-info rate-info--${status}`}>
      <p className="rate-info__title">{title}</p>
      <p className="rate-info__description">{description}</p>
=======
function RateInfoCard({ rateInfo, onRefresh }) {
  if (!rateInfo?.visible) {
    return null
  }

  return (
    <section className="rate-card" aria-label="Currency rate information">
      <div>
        <p className="rate-card__label">Exchange rate</p>
        <strong className="rate-card__value">
          {rateInfo.rateText || 'Rate unavailable'}
        </strong>
        <p className="rate-card__meta">
          Source:{' '}
          {rateInfo.source ? (
            <a href={rateInfo.source} target="_blank" rel="noreferrer">
              Frankfurter API
            </a>
          ) : (
            'Unavailable'
          )}
        </p>
        <p className="rate-card__meta">
          Effective: {rateInfo.effectiveDate || 'Unknown'} | Updated:{' '}
          {rateInfo.lastUpdated
            ? new Date(rateInfo.lastUpdated).toLocaleString('cs-CZ')
            : 'Not yet'}
        </p>
      </div>

      <button
        type="button"
        className="rate-card__button"
        onClick={() => onRefresh()}
        disabled={rateInfo.loading}
      >
        {rateInfo.loading ? 'Refreshing...' : 'Refresh rates'}
      </button>
>>>>>>> Stashed changes
    </section>
  )
}

export default RateInfoCard
