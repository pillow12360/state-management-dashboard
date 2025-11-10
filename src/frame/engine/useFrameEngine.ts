import { createContext, useContext } from 'react'
import type { FeedEngineState } from './types'

/**
 * @constant FrameEngineContext
 * @description
 * Frame 전역에서 소비할 수 있는 엔진 불가지론적 상태 컨텍스트.
 */
export const FrameEngineContext = createContext<FeedEngineState | null>(null)

/**
 * @hook useFrameEngine
 * @description
 * iframe UI 컴포넌트에서 공통 계약 형태의 엔진 상태를 구독한다.
 * @throws Provider 외부에서 호출 시 명시적으로 예외를 던져 사용 실수를 드러낸다.
 */
export function useFrameEngine(): FeedEngineState {
  const value = useContext(FrameEngineContext)

  if (!value) {
    throw new Error('useFrameEngine must be used within a FrameEngineContext provider')
  }

  return value
}
