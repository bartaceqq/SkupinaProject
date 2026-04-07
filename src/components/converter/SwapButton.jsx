function SwapButton({ disabled = false, onClick }) {
  return (
    <button
      type="button"
      className="swap-button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Prohodit jednotky"
    >
      <span aria-hidden="true">→</span>
    </button>
  )
}

export default SwapButton
