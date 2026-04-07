<<<<<<< Updated upstream
function ConvertButton({ disabled = false, onClick }) {
  return (
    <button type="button" className="convert-button" onClick={onClick} disabled={disabled}>
      Převést
=======
function ConvertButton({ disabled, onClick }) {
  return (
    <button type="button" className="convert-button" disabled={disabled} onClick={onClick}>
      Convert
>>>>>>> Stashed changes
    </button>
  )
}

export default ConvertButton
