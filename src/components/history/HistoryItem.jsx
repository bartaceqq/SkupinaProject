import { formatConversionSummary, formatHistoryTimestamp } from '../../utils'

function HistoryItem({ item, onApply }) {
  return (
    <li className="history-item">
      <button
        type="button"
        className="history-item__apply"
        onClick={() => onApply(item)}
        title={formatHistoryTimestamp(item.createdAt)}
      >
        <span className="history-item__summary">{formatConversionSummary(item.result)}</span>
        <span className="history-item__chevron" aria-hidden="true">
          ▾
        </span>
      </button>
    </li>
  )
}

export default HistoryItem
