/**
 * @layer entities/datetime
 * Форматування дати та часу українською мовою.
 */

export interface DateTimeParts {
  year: number
  monthIndex: number   // 0-based
  day: number
  hours: number
  minutes: number
  seconds: number
  weekdayIndex: number // 0=Sunday
}

export interface FormattedDateTime {
  /** Наприклад: «25 червня 2026 р. 12:42:09» */
  humanReadable: string
  /** Масив рядків для відображення у таблиці */
  tableRows: TableRow[]
  parts: DateTimeParts
}

export interface TableRow {
  label: string
  value: string
}

// ────────────────────────────────────────────────────────────────────────────
// Локалізовані назви
// ────────────────────────────────────────────────────────────────────────────

const MONTHS_UK: readonly string[] = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
]

const WEEKDAYS_UK: readonly string[] = [
  'Неділя', 'Понеділок', 'Вівторок', 'Середа',
  'Четвер', 'П\'ятниця', 'Субота',
]

// ────────────────────────────────────────────────────────────────────────────
// Утиліти
// ────────────────────────────────────────────────────────────────────────────

const pad2 = (n: number): string => String(n).padStart(2, '0')

// ────────────────────────────────────────────────────────────────────────────
// Основна функція
// ────────────────────────────────────────────────────────────────────────────

export function formatDateTime(date: Date): FormattedDateTime {
  const parts: DateTimeParts = {
    year:         date.getFullYear(),
    monthIndex:   date.getMonth(),
    day:          date.getDate(),
    hours:        date.getHours(),
    minutes:      date.getMinutes(),
    seconds:      date.getSeconds(),
    weekdayIndex: date.getDay(),
  }

  const monthName   = MONTHS_UK[parts.monthIndex]
  const weekdayName = WEEKDAYS_UK[parts.weekdayIndex]

  const humanReadable =
    `${parts.day} ${monthName} ${parts.year} р. ` +
    `${pad2(parts.hours)}:${pad2(parts.minutes)}:${pad2(parts.seconds)}`

  const tableRows: TableRow[] = [
    { label: 'День тижня', value: weekdayName },
    { label: 'Рік',       value: String(parts.year) },
    { label: 'Місяць',    value: MONTHS_UK[parts.monthIndex].charAt(0).toUpperCase() + MONTHS_UK[parts.monthIndex].slice(1) },
    { label: 'День',      value: pad2(parts.day) },
    { label: 'Година',    value: pad2(parts.hours) },
    { label: 'Хвилина',   value: pad2(parts.minutes) },
    { label: 'Секунда',   value: pad2(parts.seconds) },
  ]

  return { humanReadable, tableRows, parts }
}
