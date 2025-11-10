import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchFeedPosts, toggleLike } from '../services/feed.api'
import type { FeedEngineState } from '../../../frame/engine/types'
import type { FeedPost } from '../../../types'

/**
 * @constant FEED_QUERY_KEY
 * @description React Query에서 피드 데이터를 식별하기 위한 기준 키.
 */
export const FEED_QUERY_KEY = ['feed', 'posts'] as const

/**
 * @typedef UseFeedQueryResult
 * @description Feed 엔트리에서 필요로 하는 공통 엔진 계약과 동일한 타입.
 */
export type UseFeedQueryResult = FeedEngineState

/**
 * @hook useFeedQuery
 * @description
 * - 피드 목록을 React Query로 로드하고 캐시에 저장한다.
 * - 좋아요 토글 시 Optimistic Update를 적용해 빠른 UI 피드백을 제공한다.
 * - mutation 실패 시 캐시를 롤백해 데이터 일관성을 유지한다.
 * @returns UseFeedQueryResult 피드 데이터와 인터랙션 핸들러 묶음.
 */
export function useFeedQuery(): FeedEngineState {
  const queryClient = useQueryClient()

  const {
    data,
    error,
    isLoading,
  } = useQuery<FeedPost[], Error>({
    queryKey: FEED_QUERY_KEY,
    queryFn: fetchFeedPosts,
  })

  const mutation = useMutation<FeedPost, Error, number, { previousPosts?: FeedPost[] }>(
    {
      mutationFn: toggleLike,
      onMutate: async (postId: number) => {
        await queryClient.cancelQueries({ queryKey: FEED_QUERY_KEY })

        const previousPosts = queryClient.getQueryData<FeedPost[]>(FEED_QUERY_KEY)

        if (previousPosts) {
          const nextPosts = previousPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  liked: !post.liked,
                  likes: post.likes + (post.liked ? -1 : 1),
                }
              : post,
          )

          queryClient.setQueryData(FEED_QUERY_KEY, nextPosts)
        }

        return { previousPosts }
      },
      onError: (_error, _postId, context) => {
        if (context?.previousPosts) {
          queryClient.setQueryData(FEED_QUERY_KEY, context.previousPosts)
        }
      },
      onSuccess: (updatedPost) => {
        queryClient.setQueryData<FeedPost[]>(FEED_QUERY_KEY, (currentPosts = []) =>
          currentPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEY })
      },
    },
  )

  const likePost = useMemo(
    () => async (postId: number) => {
      await mutation.mutateAsync(postId)
    },
    [mutation],
  )

  return {
    posts: data ?? [],
    isLoading,
    error: error ? error.message : null,
    likePost,
  }
}
