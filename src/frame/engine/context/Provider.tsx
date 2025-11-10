import type { PropsWithChildren } from 'react'
import { useFeedQuery } from '../../../features/feed/hooks/useFeedQuery'
import { FrameEngineContext } from '../useFrameEngine'
import { ContextEngineContext } from './useContextEngine'

/**
 * @component ContextEngineProvider
 * @description
 * Context API 기반 상태관리 엔진의 루트 Provider.
 * - TanStack Query에서 제공하는 `useFeedQuery` 훅으로 피드 데이터를 로드한다.
 * - 로드된 데이터와 좋아요 토글 액션을 Context 값으로 내려보내 iframe 내부 컴포넌트가 공통으로 활용하게 한다.
 */
export function ContextEngineProvider({ children }: PropsWithChildren) {
  const feed = useFeedQuery()

  return (
    <ContextEngineContext.Provider value={feed}>
      <FrameEngineContext.Provider value={feed}>{children}</FrameEngineContext.Provider>
    </ContextEngineContext.Provider>
  )
}
