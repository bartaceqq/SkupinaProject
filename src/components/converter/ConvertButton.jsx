function ConvertButton({ disabled, onClick }) {
  return (
    <button type="button" className="convert-button" disabled={disabled} onClick={onClick}>
      Convert
    </button>
  )
}

export default ConvertButton
