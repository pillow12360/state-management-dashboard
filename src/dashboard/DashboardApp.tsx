import { Box, Container, Stack, Typography } from '@mui/material';
import { memo } from 'react';
import type { EngineId } from '../types';

const engines: EngineId[] = ['context', 'zustand', 'redux'];

/**
 * @component DashboardApp
 * @description
 * 메인 대시보드에서 세 가지 상태관리 엔진을 각각 iframe으로 로드한다.
 */
function DashboardAppComponent() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h3" fontWeight={700}>
              React State Management Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              각 프레임은 Context API, Zustand, Redux Toolkit 구현을 iframe 내부에서 독립적으로
              로드하여 렌더링 동작과 사용자 경험을 비교할 수 있습니다.
            </Typography>
          </Stack>

          <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems="stretch">
            {engines.map((engine) => (
              <Box
                key={engine}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: (theme) => theme.shadows[4],
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                }}
              >
                <Box
                  component="header"
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {engine.toUpperCase()} 엔진
                  </Typography>
                </Box>
                <Box
                  component="iframe"
                  src={`/frame.html?engine=${engine}`}
                  title={`${engine} frame`}
                  sx={{
                    width: '100%',
                    height: { xs: 440, md: 520 },
                    border: 0,
                    display: 'block',
                    backgroundColor: 'background.paper',
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export const DashboardApp = memo(DashboardAppComponent);
