function StatusMessage({ message }) {
  if (!message?.text) {
    return null
  }

  return (
    <p className={`status-message status-message--${message.tone || 'info'}`}>
      {message.text}
    </p>
  )
}

export default StatusMessage
