function ConvertButton({ disabled, onClick }) {
  return (
    <button
      type="button"
      className="convert-button"
      disabled={disabled}
      onClick={onClick}
    >
      Převést
    </button>
  )
}

export default ConvertButton
