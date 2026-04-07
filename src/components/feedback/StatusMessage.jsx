function StatusMessage({ children, variant = 'neutral' }) {
  return (
    <p
      className={`status-message status-message--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <span className="status-message__dot" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

export default StatusMessage
