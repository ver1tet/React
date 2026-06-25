import { useState } from 'react'
import { DoNotCallToggle } from '@features/do-not-call'
import styles from './CounterWidget.module.css'

/**
 * @layer widgets/counter
 * Лічильник з кнопками +/- та компонентом "не телефонувати".
 */
export function CounterWidget() {
  const [count, setCount] = useState(0)

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  const reset     = () => setCount(0)

  const isPositive = count > 0
  const isNegative = count < 0

  return (
    <div className={styles.card}>

      {/* ── Заголовок ── */}
      <header className={styles.header}>
        <span className={styles.headerIcon} aria-hidden="true">🔢</span>
        <h1 className={styles.title}>Лічильник</h1>
      </header>

      {/* ── Дисплей числа ── */}
      <div
        className={`${styles.display} ${
          isPositive ? styles.displayPositive :
          isNegative ? styles.displayNegative :
          styles.displayNeutral
        }`}
        aria-live="polite"
        aria-label={`Поточне значення: ${count}`}
      >
        <span className={styles.countValue}>{count}</span>
      </div>

      {/* ── Кнопки керування ── */}
      <div className={styles.controls} role="group" aria-label="Керування лічильником">
        <button
          id="btn-decrement"
          className={`${styles.btn} ${styles.btnDecrement}`}
          onClick={decrement}
          aria-label="Зменшити на 1"
        >
          −
        </button>

        <button
          id="btn-reset"
          className={`${styles.btn} ${styles.btnReset}`}
          onClick={reset}
          aria-label="Скинути до нуля"
          title="Скинути"
        >
          ↺
        </button>

        <button
          id="btn-increment"
          className={`${styles.btn} ${styles.btnIncrement}`}
          onClick={increment}
          aria-label="Збільшити на 1"
        >
          +
        </button>
      </div>

      {/* ── Роздільник ── */}
      <div className={styles.divider} aria-hidden="true" />

      {/* ── Секція "не телефонувати" ── */}
      <section className={styles.doNotCallSection} aria-label="Налаштування дзвінків">
        <DoNotCallToggle />
      </section>

    </div>
  )
}
