import styles from './Switch.module.css'

interface SwitchProps {
  /** Поточний стан перемикача */
  checked: boolean
  /** Колбек при зміні */
  onChange: (checked: boolean) => void
  /** Підпис перемикача */
  label?: string
  /** Унікальний id для accessibility */
  id?: string
  /** Відключити перемикач */
  disabled?: boolean
}

/**
 * @layer shared/ui
 * Базовий перемикач (toggle switch) на основі checkbox.
 * Повністю доступний: підтримує клавіатуру та screen readers.
 */
export function Switch({
  checked,
  onChange,
  label,
  id = 'switch',
  disabled = false,
}: SwitchProps) {
  return (
    <label
      htmlFor={id}
      className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}
      aria-label={label}
    >
      {/* Прихований checkbox — основа для accessibility */}
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        role="switch"
        aria-checked={checked}
      />

      {/* Візуальна доріжка перемикача */}
      <span className={`${styles.track} ${checked ? styles.trackOn : styles.trackOff}`}>
        {/* Кнопка-коло */}
        <span className={`${styles.thumb} ${checked ? styles.thumbOn : styles.thumbOff}`} />
      </span>

      {/* Підпис */}
      {label && (
        <span className={`${styles.label} ${checked ? styles.labelOn : styles.labelOff}`}>
          {label}
        </span>
      )}
    </label>
  )
}
