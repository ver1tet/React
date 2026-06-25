import { useState } from 'react'

/**
 * @layer features/do-not-call
 * Стан та логіка для перемикача "не телефонувати".
 */
export function useDoNotCall() {
  const [isActive, setIsActive] = useState(false)

  const toggle = (value: boolean) => setIsActive(value)

  return { isActive, toggle }
}
