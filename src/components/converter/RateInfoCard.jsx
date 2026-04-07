function RateInfoCard({ description, status = 'neutral', title }) {
  return (
    <section className={`rate-info rate-info--${status}`}>
      <p className="rate-info__title">{title}</p>
      <p className="rate-info__description">{description}</p>
    </section>
  )
}

export default RateInfoCard
