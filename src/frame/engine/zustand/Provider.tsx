import type { PropsWithChildren } from 'react'

/**
 * @component ZustandEngineProvider
 * @description
 * Zustand 스토어 연결을 담당할 예정인 래퍼.
 */
export function ZustandEngineProvider({ children }: PropsWithChildren) {
  return <>{children}</>
}
