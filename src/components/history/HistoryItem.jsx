function HistoryItem({ item }) {
  return (
    <article className="history-item">
      <p className="history-item__summary">{item.summary}</p>
      <p className="history-item__meta">{item.meta}</p>
    </article>
  )
}

export default HistoryItem
