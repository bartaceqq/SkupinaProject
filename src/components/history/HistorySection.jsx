import HistoryItem from './HistoryItem'

<<<<<<< Updated upstream
function HistorySection({ items, onClearRequest }) {
  return (
    <section className="history-section" aria-labelledby="history-title">
      <div className="history-section__header">
        <h2 id="history-title" className="history-section__title">
          Historie
        </h2>
=======
function HistorySection({ history, onApplyItem, onDeleteItem, onClearAll }) {
  return (
    <section className="history-section" aria-label="Recent conversions">
      <div className="history-section__header">
        <div>
          <p className="history-section__eyebrow">History</p>
          <h2>Recent conversions</h2>
        </div>
>>>>>>> Stashed changes

        <button
          type="button"
          className="history-section__clear"
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
      )}
    </section>
  )
}

export default HistorySection
