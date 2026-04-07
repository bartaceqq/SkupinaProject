function ConverterField({
  id,
  label,
  value,
  unitId,
  units,
  onValueChange,
  onUnitChange,
  inputMode = 'text',
  readOnly = false,
}) {
  return (
    <div className="converter-field">
      <label className="converter-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="converter-field__input"
        type="text"
        inputMode={inputMode}
        value={value}
        readOnly={readOnly}
        placeholder="0"
        onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
      />
      <select
        className="converter-field__select"
        value={unitId}
        onChange={(event) => onUnitChange(event.target.value)}
      >
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.symbol} {unit.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ConverterField
