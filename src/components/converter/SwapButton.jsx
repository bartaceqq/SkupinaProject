import { useState } from 'react'

function SwapButton({ onClick }) {
  const [isRotated, setIsRotated] = useState(false)

  const handleClick = () => {
    setIsRotated((previousState) => !previousState)
    onClick?.()
  }

  return (
    <button
      type="button"
      className={`swap-button${isRotated ? ' is-rotated' : ''}`}
      onClick={handleClick}
      aria-label="Prohodit jednotky"
    >
      <span className="swap-button__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="presentation" focusable="false">
          <path d="M4 12h14" />
          <path d="M14 7l5 5-5 5" />
        </svg>
      </span>
    </button>
  )
}

export default SwapButton
