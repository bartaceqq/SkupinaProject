<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
}) {
  return (
    <div className="converter-field">
      <label className="converter-field__label" htmlFor={id}>
        {label}
      </label>
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
      <input
        id={id}
        className="converter-field__input"
        type="text"
<<<<<<< Updated upstream
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
=======
        inputMode={inputMode}
        value={value}
        readOnly={readOnly}
        placeholder="0"
        onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
      />
      <select
        className="converter-field__select"
        value={unitId}
>>>>>>> Stashed changes
        onChange={(event) => onUnitChange(event.target.value)}
      >
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
<<<<<<< Updated upstream
            {formatUnitOption(unit)}
=======
            {unit.symbol} {unit.label}
>>>>>>> Stashed changes
          </option>
        ))}
      </select>
    </div>
  )
}

export default ConverterField
