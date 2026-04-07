import { formatConversionSummary, formatHistoryTimestamp } from '../../utils'

function HistoryItem({ historyItem, onApply, onDelete }) {
  return (
    <article className="history-item">
      <button
        type="button"
        className="history-item__summary"
        onClick={() => onApply(historyItem)}
      >
        <span>{formatConversionSummary(historyItem.result, 'cs-CZ')}</span>
        <small>{formatHistoryTimestamp(historyItem.createdAt, 'cs-CZ')}</small>
      </button>

      <button
        type="button"
        className="history-item__delete"
        onClick={() => onDelete(historyItem.id)}
        aria-label="Delete history item"
      >
        Remove
      </button>
    </article>
  )
}

export default HistoryItem
