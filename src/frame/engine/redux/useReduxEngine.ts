import { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'
import type { FeedEngineState } from '../types'
import type { ReduxFeedState, ReduxEngineRootState } from './store'
import { selectFeedState } from './store'

/**
 * @interface ReduxEngineActions
 * @description Redux 엔진 하위에서 사용할 액션(비동기 함수) 집합.
 */
export interface ReduxEngineActions {
  likePost: (postId: number) => Promise<void>
}

/**
 * @constant ReduxEngineActionsContext
 * @description `likePost` 등 부수효과 액션을 전달하기 위한 Context.
 */
export const ReduxEngineActionsContext = createContext<ReduxEngineActions | null>(null)

/**
 * @hook useReduxEngine
 * @description
 * Redux 스토어에 저장된 피드 상태와 Provider가 주입한 액션을 하나의 인터페이스로 묶어 반환한다.
 * @throws Provider 외부에서 호출하면 예외를 발생시켜 잘못된 사용을 방지한다.
 */
export function useReduxEngine(): FeedEngineState {
  const state = useSelector<ReduxEngineRootState, ReduxFeedState>(selectFeedState)
  const actions = useContext(ReduxEngineActionsContext)

  if (!actions) {
    throw new Error('useReduxEngine must be used within a ReduxEngineProvider')
  }

  return {
    ...state,
    likePost: actions.likePost,
  }
}
