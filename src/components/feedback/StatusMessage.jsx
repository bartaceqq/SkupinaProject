function StatusMessage({ tone = 'success', text, compact = false }) {
  if (!text) {
    return null
  }

  return (
    <div
      className={`status-message status-message--${tone}${compact ? ' status-message--compact' : ''}`}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
    >
      <span className="status-message__text">{text}</span>
    </div>
  )
}

export default StatusMessage
