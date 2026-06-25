import { ClockWidget } from '@widgets/clock'
import styles from './HomePage.module.css'

/**
 * @layer pages/home
 * Головна сторінка — відображення поточного часу
 */
export function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="44" fill="none" stroke="url(#lg)" strokeWidth="4"/>
            <line x1="50" y1="50" x2="50" y2="18" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="72" y2="56" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="4" fill="#818cf8"/>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#22d3ee"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className={styles.headerTitle}>Часові Координати</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.heroSubtitle}>Поточний момент у часі</p>
        <ClockWidget />
      </section>

      <footer className={styles.footer}>
        <p>React + Vite · Feature-Sliced Design · TypeScript</p>
      </footer>
    </main>
  )
}
