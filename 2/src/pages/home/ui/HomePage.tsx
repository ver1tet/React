import { CounterWidget } from '@widgets/counter'
import styles from './HomePage.module.css'

/**
 * @layer pages/home
 * Головна сторінка — Лічильник з перемикачем "не телефонувати"
 */
export function HomePage() {
  return (
    <main className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.badge}>ДЗ №2</div>
        <h2 className={styles.subtitle}>Counter + Switch Feature · FSD</h2>
      </header>

      {/* ── Main content ── */}
      <section className={styles.content} aria-label="Основний вміст">
        <CounterWidget />
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        React + Vite · Feature-Sliced Design · TypeScript · CSS Modules
      </footer>

    </main>
  )
}
