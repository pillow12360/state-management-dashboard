import type { FeedPost } from '../../../types'

const API_BASE_URL = '/api'

/**
 * @function fetchFeedPosts
 * @description 피드 목록 데이터를 요청한다.
 */
export async function fetchFeedPosts(): Promise<FeedPost[]> {
  const response = await fetch(`${API_BASE_URL}/posts`)

  if (!response.ok) {
    throw new Error('Failed to load posts')
  }

  return response.json()
}

/**
 * @function toggleLike
 * @description 포스트 좋아요 상태를 토글한다.
 *
 * @param postId 대상 포스트 id
 */
export async function toggleLike(postId: number): Promise<FeedPost> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    throw new Error('Failed to toggle like')
  }

  return response.json()
}
