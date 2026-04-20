import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Potvrdit',
  cancelLabel = 'Zrušit',
  onConfirm,
  onCancel,
}) {
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    if (!open || typeof document === 'undefined') {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onCancel])

  if (!open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel?.()
        }
      }}
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <h2 id="confirm-modal-title">{title}</h2>
        <p className="modal-card__description">{description}</p>

        <div className="modal-card__actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="button-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="button-danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ConfirmModal
