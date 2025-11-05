import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import type { FeedPost } from '../../../types'

/**
 * @interface ZustandEngineState
 * @description
 * Zustand 엔진이 전역으로 관리해야 하는 상태와 액션의 형태를 정의한다.
 */
export interface ZustandEngineState {
  posts: FeedPost[]
  isLoading: boolean
  error: string | null
  likePost: (postId: number) => Promise<void>
}

/**
 * @type ZustandEngineStore
 * @description Zustand 상태 컨테이너(StoreApi) 타입 별칭.
 */
export type ZustandEngineStore = StoreApi<ZustandEngineState>

/**
 * @constant ZustandEngineContext
 * @description
 * Zustand 스토어 인스턴스를 공유하기 위한 React Context.
 */
export const ZustandEngineContext = createContext<ZustandEngineStore | null>(null)

/**
 * @hook useZustandEngine
 * @description
 * Provider 하위에서 Zustand 상태를 구독할 수 있는 추상화.
 * selector를 전달해 필요한 조각만 구독하면 렌더링을 최소화할 수 있다.
 *
 * @param selector 구독할 상태를 선택하는 함수. 기본값은 전체 상태 반환.
 * @throws Provider 외부에서 호출 시 잘못된 사용을 알리기 위해 예외를 발생시킨다.
 */
function useZustandEngineImpl<T>(
  selector: (state: ZustandEngineState) => T,
): T {
  const store = useContext(ZustandEngineContext)

  if (!store) {
    throw new Error('useZustandEngine must be used within a ZustandEngineProvider')
  }

  return useStore(store, selector)
}

export function useZustandEngine(): ZustandEngineState
export function useZustandEngine<T>(selector: (state: ZustandEngineState) => T): T
export function useZustandEngine<T>(
  selector: (state: ZustandEngineState) => T = (state) =>
    state as unknown as T,
): ZustandEngineState | T {
  return useZustandEngineImpl(selector)
}
