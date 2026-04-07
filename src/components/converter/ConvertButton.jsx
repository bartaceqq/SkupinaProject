function ConvertButton({ disabled = false, onClick }) {
  return (
    <button type="button" className="convert-button" onClick={onClick} disabled={disabled}>
      Převést
    </button>
  )
}

export default ConvertButton
