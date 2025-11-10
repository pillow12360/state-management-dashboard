import { createContext, useContext } from 'react'
import type { FeedEngineState } from '../types'

/**
 * @interface ContextEngineValue
 * @description
 * Context API 기반 엔진이 외부로 노출할 데이터/액션의 형태.
 * Feed 엔진 공통 계약과 동일하다.
 */
export type ContextEngineValue = FeedEngineState

/**
 * @constant ContextEngineContext
 * @description Context API 구현에서 사용할 React Context 인스턴스.
 */
export const ContextEngineContext = createContext<ContextEngineValue | null>(null)

/**
 * @hook useContextEngine
 * @description Provider 하위에서 Context 엔진 값을 구독하는 헬퍼 훅.
 * @throws Provider 외부에서 호출 시 잘못된 사용을 빠르게 드러내기 위해 예외를 던진다.
 */
export function useContextEngine(): ContextEngineValue {
  const value = useContext(ContextEngineContext)

  if (!value) {
    throw new Error('useContextEngine must be used within a ContextEngineProvider')
  }

  return value
}
