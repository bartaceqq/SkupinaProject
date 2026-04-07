function SwapButton({ onClick }) {
  return (
    <button type="button" className="swap-button" onClick={onClick} aria-label="Swap units">
      <span aria-hidden="true">↔</span>
    </button>
  )
}

export default SwapButton
