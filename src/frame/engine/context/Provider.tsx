import type { PropsWithChildren } from 'react'

/**
 * @component ContextEngineProvider
 * @description
 * Context API 기반 전역 상태를 제공할 예정인 래퍼.
 * 현재는 초기 구조 확인을 위해 children을 그대로 반환한다.
 */
export function ContextEngineProvider({ children }: PropsWithChildren) {
  return <>{children}</>
}
