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
import { useFrameEngine } from '../../../frame/engine/useFrameEngine'

/**
 * @component FeedPage
 * @description
 * 엔진 Provider가 주입한 공통 계약(`useFrameEngine`)을 통해 피드 목록과 상호작용을 수행한다.
 * - 세 엔진(Context/Zustand/Redux)이 동일한 UI와 데이터 소스를 공유하되, UI는 엔진 구현에 대해 불가지론적으로 유지된다.
 */
export function FeedPage() {
  const { posts, isLoading, error, likePost } = useFrameEngine()

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
