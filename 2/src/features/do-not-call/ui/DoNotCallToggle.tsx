import { Switch } from '@shared/ui'
import { useDoNotCall } from '../model/useDoNotCall'
import styles from './DoNotCallToggle.module.css'

/**
 * @layer features/do-not-call
 * Компонент-перемикач "не телефонувати".
 * Використовує базовий Switch зі shared/ui та власну бізнес-логіку.
 */
export function DoNotCallToggle() {
  const { isActive, toggle } = useDoNotCall()

  return (
    <div className={`${styles.container} ${isActive ? styles.containerActive : ''}`}>
      {/* Іконка телефону */}
      <div className={`${styles.phoneIcon} ${isActive ? styles.phoneIconActive : ''}`} aria-hidden="true">
        {isActive ? (
          /* Телефон закреслений */
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="currentColor"/>
            <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          /* Нормальний телефон */
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="currentColor"/>
          </svg>
        )}
      </div>

      {/* Вміст */}
      <div className={styles.content}>
        <Switch
          id="do-not-call-switch"
          checked={isActive}
          onChange={toggle}
          label="не телефонувати"
        />

        {/* Статусне повідомлення */}
        <p className={`${styles.status} ${isActive ? styles.statusActive : styles.statusInactive}`}>
          {isActive
            ? '🔕 Дзвінки вимкнено'
            : '📞 Дзвінки дозволено'}
        </p>
      </div>
    </div>
  )
}
