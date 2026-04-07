<<<<<<< Updated upstream
function StatusMessage({ children, variant = 'neutral' }) {
  return (
    <p
      className={`status-message status-message--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <span className="status-message__dot" aria-hidden="true" />
      <span>{children}</span>
=======
function StatusMessage({ message }) {
  if (!message?.text) {
    return null
  }

  return (
    <p className={`status-message status-message--${message.tone || 'info'}`}>
      {message.text}
>>>>>>> Stashed changes
    </p>
  )
}

export default StatusMessage
