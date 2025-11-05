import type { PropsWithChildren } from 'react'

/**
 * @component ContextEngineProvider
 * @description
 * Context API 기반 구현을 주입할 예정인 래퍼.
 * - 현재 단계에서는 상위에서 공급되는 TanStack Query 캐시와 공통 UI를 그대로 전달한다.
 * - 차후에는 Context 전용 전역 상태와 파생 훅을 여기서 구성할 예정이다.
 */
export function ContextEngineProvider({ children }: PropsWithChildren) {
  return <>{children}</>
}
