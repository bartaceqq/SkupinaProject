import HistoryItem from './HistoryItem'

function HistorySection({ items, onClearRequest }) {
  return (
    <section className="history-section" aria-labelledby="history-title">
      <div className="history-section__header">
        <h2 id="history-title" className="history-section__title">
          Historie
        </h2>

        <button
          type="button"
          className="history-section__clear"
          onClick={onClearRequest}
          disabled={!items.length}
        >
          Vymazat vše
        </button>
      </div>

      {items.length ? (
        <div className="history-section__list">
          {items.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="history-section__empty">Žádné historické záznamy</p>
      )}
    </section>
  )
}

export default HistorySection
