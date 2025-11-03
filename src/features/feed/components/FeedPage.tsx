import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import type { FeedPost } from '../../../types'
import { fetchFeedPosts, toggleLike } from '../services/feed.api'

/**
 * @component FeedPage
 * @description
 * 세 엔진이 공통으로 사용할 피드 UI.
 * 아직 상태관리 엔진과 연결되기 전 초기 구조를 시각적으로 확인하기 위한 간단한 구현이다.
 */
export function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    fetchFeedPosts()
      .then((data) => {
        if (mounted) {
          setPosts(data)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : String(err))
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleToggleLike = useCallback(
    async (postId: number) => {
      try {
        const updatedPost = await toggleLike(postId)
        setPosts((prev) =>
          prev.map((post) => (post.id === postId ? updatedPost : post)),
        )
      } catch (err) {
        console.error(err)
      }
    },
    [],
  )

  if (isLoading) {
    return (
      <Stack alignItems="center" py={6}>
        <CircularProgress />
      </Stack>
    )
  }

  if (error) {
    return (
      <Box py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      {posts.map((post) => (
        <Card key={post.id} variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">{post.title}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  variant={post.liked ? 'contained' : 'outlined'}
                  color="secondary"
                  startIcon={post.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={() => handleToggleLike(post.id)}
                >
                  좋아요 {post.likes}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  ID: {post.id}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
