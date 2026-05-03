import { useSyncExternalStore } from 'react'

/** True after hydration — avoids `useEffect(() => setMounted(true))` (eslint react-hooks/set-state-in-effect). */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}
