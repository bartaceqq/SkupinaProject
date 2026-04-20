import HistoryItem from './HistoryItem'

function HistorySection({ history, onApplyItem, onClearAll }) {
  return (
    <section className="history-section" aria-labelledby="history-section-title">
      <div className="history-section__head">
        <h2 id="history-section-title">Historie</h2>

        <button
          type="button"
          className="button-secondary"
          onClick={onClearAll}
          disabled={history.length === 0}
        >
          Vymazat vše
        </button>
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <p>Žádné historické záznamy</p>
        </div>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onApply={onApplyItem}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default HistorySection
