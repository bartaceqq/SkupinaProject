import HistoryItem from './HistoryItem'

function HistorySection({ history, onApplyItem, onDeleteItem, onClearAll }) {
  return (
    <section className="history-section" aria-label="Recent conversions">
      <div className="history-section__header">
        <div>
          <p className="history-section__eyebrow">History</p>
          <h2>Recent conversions</h2>
        </div>

        <button
          type="button"
          className="history-section__clear"
          onClick={onClearAll}
          disabled={history.length === 0}
        >
          Clear all
        </button>
      </div>

      {history.length === 0 ? (
        <p className="history-section__empty">No conversion history yet.</p>
      ) : (
        <div className="history-section__list">
          {history.map((historyItem) => (
            <HistoryItem
              key={historyItem.id}
              historyItem={historyItem}
              onApply={onApplyItem}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HistorySection
