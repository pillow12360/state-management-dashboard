import { Box, Container, Stack, Typography } from '@mui/material';
import { memo, useEffect, useMemo, useState } from 'react';
import type { EngineId } from '../types';

const engines: EngineId[] = ['context', 'zustand', 'redux'];

type InitialRenderMetricPayload = {
  engineId: EngineId;
  duration: number;
  timestamp: number;
};

type InitialRenderMetricMessage = {
  type: 'metric:initial-render';
  payload: InitialRenderMetricPayload;
};

/**
 * @component DashboardApp
 * @description
 * 메인 대시보드에서 세 가지 상태관리 엔진을 각각 iframe으로 로드한다.
 */
function DashboardAppComponent() {
  const [initialRenderMetrics, setInitialRenderMetrics] = useState<
    Partial<Record<EngineId, InitialRenderMetricPayload>>
  >({});

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) {
        return;
      }

      const data = event.data as InitialRenderMetricMessage;

      if (!data || data.type !== 'metric:initial-render' || !data.payload) {
        return;
      }

      const { payload } = data;
      if (
        !engines.includes(payload.engineId) ||
        typeof payload.duration !== 'number' ||
        typeof payload.timestamp !== 'number'
      ) {
        return;
      }

      setInitialRenderMetrics((prev) => {
        const current = prev[payload.engineId];
        if (current && current.timestamp >= payload.timestamp) {
          return prev;
        }
        return {
          ...prev,
          [payload.engineId]: payload,
        };
      });
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const metricCards = useMemo(
    () =>
      engines.map((engine) => {
        const metric = initialRenderMetrics[engine];
        const valueLabel =
          typeof metric?.duration === 'number'
            ? `${(metric.duration / 1000).toFixed(2)}s`
            : '측정 중';

        return (
          <Box
            key={engine}
            sx={{
              flex: 1,
              borderRadius: 2,
              px: 2,
              py: 1.5,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {engine.toUpperCase()} INITIAL RENDER
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {valueLabel}
            </Typography>
          </Box>
        );
      }),
    [initialRenderMetrics],
  );

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

          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
            {metricCards}
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
