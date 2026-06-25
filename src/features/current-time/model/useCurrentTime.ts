import { useState, useEffect } from 'react'
import { formatDateTime } from '@entities/datetime'
import type { FormattedDateTime } from '@entities/datetime'

/**
 * @layer features/current-time
 * Хук, що повертає поточний відформатований час,
 * оновлюючи стан кожну секунду.
 */
export function useCurrentTime(): FormattedDateTime {
  const [formatted, setFormatted] = useState<FormattedDateTime>(() =>
    formatDateTime(new Date()),
  )

  useEffect(() => {
    const tick = () => setFormatted(formatDateTime(new Date()))
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return formatted
}
