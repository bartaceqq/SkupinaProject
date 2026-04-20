import { useEffect, useRef, useState } from 'react'

function SwapButton({ onClick }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleClick = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    setIsAnimating(false)
    window.requestAnimationFrame(() => {
      setIsAnimating(true)
      timeoutRef.current = window.setTimeout(() => {
        setIsAnimating(false)
      }, 320)
    })

    onClick?.()
  }

  return (
    <button
      type="button"
      className={`swap-button${isAnimating ? ' is-swapped' : ''}`}
      onClick={handleClick}
      aria-label="Prohodit jednotky"
    >
      <span className="swap-button__icon" aria-hidden="true">
        →
      </span>
    </button>
  )
}

export default SwapButton
