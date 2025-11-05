import type { PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'
import { createStore } from 'zustand'
import { useFeedQuery } from '../../../features/feed/hooks/useFeedQuery'
import type { ZustandEngineState, ZustandEngineStore } from './useZustandEngine'
import { ZustandEngineContext } from './useZustandEngine'

/**
 * @function createZustandEngineStore
 * @description
 * Zustand 엔진에서 사용할 기본 스토어를 생성한다.
 * - 초기 상태는 로딩중으로 설정하고, Provider가 마운트되면서 실제 데이터로 대체된다.
 */
function createZustandEngineStore(): ZustandEngineStore {
  return createStore<ZustandEngineState>()(() => ({
    posts: [],
    isLoading: true,
    error: null,
    likePost: async () => undefined,
  }))
}

/**
 * @component ZustandEngineProvider
 * @description
 * Zustand 스토어를 초기화하고 React Query에서 제공하는 데이터/액션과 동기화한다.
 */
export function ZustandEngineProvider({ children }: PropsWithChildren) {
  const feed = useFeedQuery()
  const storeRef = useRef<ZustandEngineStore>(createZustandEngineStore())

  useEffect(() => {
    storeRef.current?.setState({
      posts: feed.posts,
      isLoading: feed.isLoading,
      error: feed.error,
      likePost: feed.likePost,
    })
  }, [feed.posts, feed.isLoading, feed.error, feed.likePost])

  return (
    <ZustandEngineContext.Provider value={storeRef.current}>
      {children}
    </ZustandEngineContext.Provider>
  )
}
