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
import { useFeedQuery } from '../hooks/useFeedQuery'

/**
 * @component FeedPage
 * @description
 * React Query 기반 데이터 흐름을 이용해 피드 목록을 표출하고 좋아요를 토글한다.
 * - 세 엔진(Context/Zustand/Redux)이 동일한 UI와 데이터 소스를 공유하도록 설계되었다.
 * - Provider 계층에서 TanStack Query 캐시를 공급받아 엔진별 비교가 가능하다.
 */
export function FeedPage() {
  const { posts, isLoading, error, likePost } = useFeedQuery()

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
                  onClick={() => likePost(post.id)}
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
