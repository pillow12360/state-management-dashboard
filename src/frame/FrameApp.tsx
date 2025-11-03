import { Alert, Box, CircularProgress, Container, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import type { EngineId } from '../types'
import { FeedPage } from '../features/feed/components/FeedPage'
import { loadEngineProvider, type EngineProvider } from './engine/loadEngineProvider'

const DEFAULT_ENGINE: EngineId = 'context'

/**
 * @component FrameApp
 * @description
 * iframe 내부에서 실행되며 쿼리 파라미터로 전달된 엔진 구현을 로드한다.
 */
export function FrameApp() {
  const engine = useMemo<EngineId | null>(() => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get('engine') as EngineId | null
    return value ?? null
  }, [])

  const [provider, setProvider] = useState<EngineProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const targetEngine: EngineId = engine ?? DEFAULT_ENGINE

    loadEngineProvider(targetEngine)
      .then((EngineProviderComponent) => {
        setProvider(() => EngineProviderComponent)
        setError(null)
      })
      .catch((err) => {
        console.error(err)
        setError(
          err instanceof Error
            ? err.message
            : '엔진 모듈을 불러오는 중 오류가 발생했습니다.',
        )
      })
  }, [engine])

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  if (!provider) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
        <CircularProgress />
      </Stack>
    )
  }

  const EngineProvider = provider

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {`Engine: ${(engine ?? DEFAULT_ENGINE).toUpperCase()}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              공통 FeedPage 컴포넌트가 엔진 프로바이더 내부에서 동작하는지 확인하는
              초기 레이아웃입니다.
            </Typography>
          </Box>
          <EngineProvider>
            <FeedPage />
          </EngineProvider>
        </Stack>
      </Container>
    </Box>
  )
}
