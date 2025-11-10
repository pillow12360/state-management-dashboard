import type { FeedPost } from '../../types'

/**
 * @interface FeedEngineState
 * @description
 * Frame 영역의 모든 상태관리 엔진(Context/Zustand/Redux 등)이
 * 외부(UI 컴포넌트)로 노출해야 하는 최소 계약.
 * - 새로운 엔진을 추가할 때는 이 형태를 우선 충족해야 한다.
 */
export interface FeedEngineState {
  posts: FeedPost[]
  isLoading: boolean
  error: string | null
  likePost: (postId: number) => Promise<void>
}
