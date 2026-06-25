import { useCurrentTime } from '@features/current-time'
import styles from './ClockWidget.module.css'

/**
 * @layer widgets/clock
 * Відображає поточний час у двох форматах:
 * 1. Рядковий (людино-зрозумілий)
 * 2. Таблиця
 */
export function ClockWidget() {
  const { humanReadable, tableRows, parts } = useCurrentTime()

  // Кут обертання для анімованих стрілок годинника
  const secDeg  = parts.seconds  * 6
  const minDeg  = parts.minutes  * 6  + parts.seconds  * 0.1
  const hourDeg = (parts.hours % 12) * 30 + parts.minutes * 0.5

  return (
    <div className={styles.widget}>

      {/* ── Аналоговий годинник ── */}
      <div className={styles.analogClock} aria-hidden="true">
        <div className={styles.clockFace}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={styles.tick}
              style={{ transform: `rotate(${i * 30}deg) translateY(-44px)` }}
            />
          ))}
          <div
            className={`${styles.hand} ${styles.hourHand}`}
            style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.minHand}`}
            style={{ transform: `translateX(-50%) rotate(${minDeg}deg)` }}
          />
          <div
            className={`${styles.hand} ${styles.secHand}`}
            style={{ transform: `translateX(-50%) rotate(${secDeg}deg)` }}
          />
          <div className={styles.center} />
        </div>
      </div>

      {/* ── Цифровий рядок ── */}
      <section className={styles.digitalSection} aria-label="Поточна дата та час">
        <p className={styles.label}>Поточний час</p>
        <h1 className={styles.digitalTime}>{humanReadable}</h1>
      </section>

      {/* ── Таблиця ── */}
      <section className={styles.tableSection} aria-label="Розбивка часу">
        <p className={styles.label}>Детальна розбивка</p>
        <div className={styles.tableGrid}>
          {tableRows.map(({ label, value }) => (
            <div key={label} className={styles.tableCell}>
              <span className={styles.cellLabel}>{label}</span>
              <span className={styles.cellValue}>{value}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
