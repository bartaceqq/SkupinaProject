<<<<<<< Updated upstream
import { useEffect } from 'react'

function ConfirmModal({
  cancelLabel = 'Zrušit',
  confirmLabel = 'Potvrdit',
  message,
  onCancel,
  onConfirm,
  open,
  title,
}) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onCancel, open])

=======
function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
>>>>>>> Stashed changes
  if (!open) {
    return null
  }

  return (
<<<<<<< Updated upstream
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="confirm-modal"
=======
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
>>>>>>> Stashed changes
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
<<<<<<< Updated upstream
        <h2 id="confirm-modal-title" className="confirm-modal__title">
          {title}
        </h2>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__actions">
          <button type="button" className="confirm-modal__button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-modal__button confirm-modal__button--confirm"
            onClick={onConfirm}
            autoFocus
          >
=======
        <h2 id="confirm-modal-title">{title}</h2>
        <p>{description}</p>
        <div className="modal-card__actions">
          <button type="button" className="modal-card__button is-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="modal-card__button is-primary" onClick={onConfirm}>
>>>>>>> Stashed changes
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
