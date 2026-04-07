import { formatUnitOption } from '../../utils/formatters'

function ConverterField({
  id,
  label,
  onUnitChange,
  onValueChange,
  readOnly = false,
  selectedUnitId,
  units,
  value,
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
        inputMode="decimal"
        value={value}
        onChange={readOnly ? undefined : onValueChange}
        readOnly={readOnly}
        aria-readonly={readOnly}
        placeholder={readOnly ? "Výsledek" : "Zadejte hodnotu"}
      />

      <label className="sr-only" htmlFor={`${id}-unit`}>
        {label} jednotka
      </label>

      <select
        id={`${id}-unit`}
        className="converter-field__select"
        value={selectedUnitId}
        onChange={(event) => onUnitChange(event.target.value)}
      >
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {formatUnitOption(unit)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ConverterField
