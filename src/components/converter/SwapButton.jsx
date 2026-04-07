<<<<<<< Updated upstream
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
=======
function SwapButton({ onClick }) {
  return (
    <button type="button" className="swap-button" onClick={onClick} aria-label="Swap units">
      <span aria-hidden="true">↔</span>
>>>>>>> Stashed changes
    </button>
  )
}

export default SwapButton
