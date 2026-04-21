import { useEffect, useId, useRef, useState } from 'react'
import { formatNumber } from '../../utils'

function ConverterField({
  label,
  value,
  units,
  selectedUnitId,
  onValueChange,
  onUnitChange,
  readOnly = false,
  helperText,
  isInvalid = false,
  ariaLive,
}) {
  const inputId = useId()
  const selectId = useId()
  const helperId = useId()
  const [isResultFlashing, setIsResultFlashing] = useState(false)
  const hasMountedRef = useRef(false)
  const previousValueRef = useRef(value)
  const selectLabel = readOnly ? 'Cílová jednotka převodu' : 'Zdrojová jednotka převodu'
  const resolvedValue = readOnly
    ? value === '' || value === null || value === undefined
      ? ''
      : typeof value === 'number'
        ? formatNumber(value, 'cs-CZ', 6)
        : value
    : value ?? ''
  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) ?? null
  const inputLabel = readOnly ? 'Výsledná hodnota převodu' : 'Vstupní hodnota převodu'

  const formatUnitOption = (unit) => {
    const prefix = unit.category === 'currency' ? unit.id.toUpperCase() : unit.symbol
    return `${prefix} ${unit.label}`
  }

  useEffect(() => {
    if (!readOnly) {
      return undefined
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      previousValueRef.current = resolvedValue
      return undefined
    }

    if (resolvedValue === '' || resolvedValue === previousValueRef.current) {
      previousValueRef.current = resolvedValue
      return undefined
    }

    previousValueRef.current = resolvedValue
    const animationFrameId = window.requestAnimationFrame(() => {
      setIsResultFlashing(true)
    })

    const timeoutId = window.setTimeout(() => {
      setIsResultFlashing(false)
    }, 320)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.clearTimeout(timeoutId)
    }
  }, [readOnly, resolvedValue])

  const liveAnnouncement =
    resolvedValue === ''
      ? 'Výsledek je prázdný.'
      : `Výsledek ${resolvedValue} ${selectedUnit?.category === 'currency' ? selectedUnit.id.toUpperCase() : selectedUnit?.symbol || ''}`.trim()

  return (
    <section
      className={`converter-field${readOnly ? ' is-readonly' : ''}${isInvalid ? ' is-invalid' : ''}`}
    >
      <div className="converter-field__meta">
        <label className="converter-field__label" htmlFor={inputId}>
          {label}
        </label>
      </div>

      <div className="converter-field__controls">
        <input
          id={inputId}
          className={`converter-field__input${isInvalid ? ' converter-field__input--invalid' : ''}${isResultFlashing ? ' converter-field__input--flash' : ''}`}
          type="text"
          inputMode={readOnly ? 'text' : 'decimal'}
          placeholder={readOnly ? 'Výsledek' : 'Například 100'}
          value={resolvedValue}
          onChange={(event) => onValueChange?.(event.target.value)}
          readOnly={readOnly}
          aria-label={inputLabel}
          aria-invalid={!readOnly && isInvalid ? 'true' : undefined}
          aria-describedby={helperText ? helperId : undefined}
        />
        {readOnly && ariaLive ? (
          <span className="sr-only" aria-live={ariaLive} aria-atomic="true">
            {liveAnnouncement}
          </span>
        ) : null}
        <div className="converter-field__select-wrap">
          <label className="sr-only" htmlFor={selectId}>
            Jednotka pro pole {label}
          </label>
          <select
            id={selectId}
            className="converter-field__select"
            value={selectedUnitId}
            onChange={(event) => onUnitChange(event.target.value)}
            aria-label={selectLabel}
          >
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {formatUnitOption(unit)}
              </option>
            ))}
          </select>
        </div>

        {helperText ? (
          <p id={helperId} className={`converter-field__helper${isInvalid ? ' is-error' : ''}`}>
            {helperText}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default ConverterField
