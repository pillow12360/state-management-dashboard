import type { PropsWithChildren } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { useFeedQuery } from '../../../features/feed/hooks/useFeedQuery'
import { FrameEngineContext } from '../useFrameEngine'
import {
  ReduxEngineActionsContext,
  useReduxEngine,
} from './useReduxEngine'
import {
  createReduxEngineStore,
  setFeedState,
  type ReduxEngineStore,
} from './store'

/**
 * @component ReduxEngineProvider
 * @description
 * Redux Toolkit 스토어를 초기화하고 React Query로부터 가져온 데이터/액션을 동기화한다.
 */
export function ReduxEngineProvider({ children }: PropsWithChildren) {
  const feed = useFeedQuery()
  const storeRef = useRef<ReduxEngineStore>(createReduxEngineStore())

  useEffect(() => {
    storeRef.current.dispatch(
      setFeedState({
        posts: feed.posts,
        isLoading: feed.isLoading,
        error: feed.error,
      }),
    )
  }, [feed.posts, feed.isLoading, feed.error])

  const actions = useMemo(
    () => ({
      likePost: feed.likePost,
    }),
    [feed.likePost],
  )

  return (
    <ReduxProvider store={storeRef.current}>
      <ReduxEngineActionsContext.Provider value={actions}>
        <ReduxFrameEngineBoundary>{children}</ReduxFrameEngineBoundary>
      </ReduxEngineActionsContext.Provider>
    </ReduxProvider>
  )
}

function ReduxFrameEngineBoundary({ children }: PropsWithChildren) {
  const state = useReduxEngine()

  return <FrameEngineContext.Provider value={state}>{children}</FrameEngineContext.Provider>
}
