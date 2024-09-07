export const debounce = <T extends any[]>(
  func: (...args: T) => void,
  wait: number,
  immediate: boolean,
) => {
  let timeout: number | null = null

  return (...args: T) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    if (timeout !== null) clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

export const replaceUnderscore = (name: string) => name.replaceAll('_', ' ')
export const capitaliseString = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)
