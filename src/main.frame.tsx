import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { FrameApp } from './frame/FrameApp'
import { bootstrapReactApp } from './lib/bootstrap'
import { SharedQueryProvider } from './lib/queryProvider'
import type { EngineId } from './types'
import { theme } from './theme'

type InitialRenderMetricPayload = {
  engineId: EngineId
  duration: number
  timestamp: number
}

type InitialRenderMetricMessage = {
  type: 'metric:initial-render'
  payload: InitialRenderMetricPayload
}

type DataRenderMetricPayload = {
  engineId: EngineId
  duration: number
  timestamp: number
}

type DataRenderMetricMessage = {
  type: 'metric:data-render'
  payload: DataRenderMetricPayload
}

function resolveEngineId(): EngineId {
  const params = new URLSearchParams(window.location.search)
  const value = params.get('engine') as EngineId | null
  return value ?? 'context'
}

/**
 * @function reportInitialRender
 * @description
 * 첫 번째 페인트 이후 requestAnimationFrame 두 번을 대기해
 * 초기 렌더링 시간을 추정하고 부모 창에 전달한다.
 */
function reportInitialRender() {
  if (!window.parent || window.parent === window) {
    return
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const navigationEntry = performance
        .getEntriesByType('navigation')
        .at(0) as PerformanceNavigationTiming | undefined

      const duration = navigationEntry
        ? performance.now() - navigationEntry.startTime
        : performance.now()

      const message: InitialRenderMetricMessage = {
        type: 'metric:initial-render',
        payload: {
          engineId: resolveEngineId(),
          duration,
          timestamp: Date.now(),
        },
      }

      window.parent?.postMessage(message, window.location.origin)
    })
  })
}

/**
 * @function reportDataRender
 * @description
 * 데이터 렌더링이 완료된 시점에 호출하여 부모 창에 메트릭을 전송한다.
 */
export function reportDataRender() {
  if (!window.parent || window.parent === window) {
    return
  }

  // requestAnimationFrame을 사용하여 페인팅이 완료된 시점을 근사
  requestAnimationFrame(() => {
    const navigationEntry = performance
      .getEntriesByType('navigation')
      .at(0) as PerformanceNavigationTiming | undefined

    const duration = navigationEntry
      ? performance.now() - navigationEntry.startTime
      : performance.now()

    const message: DataRenderMetricMessage = {
      type: 'metric:data-render',
      payload: {
        engineId: resolveEngineId(),
        duration,
        timestamp: Date.now(),
      },
    }

    window.parent?.postMessage(message, window.location.origin)
  })
}

/**
 * @description
 * iframe 엔트리 포인트. 엔진별 Provider 위에 Material UI 테마와
 * TanStack Query 컨텍스트를 미리 제공한 뒤 FrameApp을 렌더링한다.
 */
bootstrapReactApp('frame-root', (root) =>
  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <SharedQueryProvider>
          <CssBaseline />
          <FrameApp />
        </SharedQueryProvider>
      </ThemeProvider>
    </StrictMode>,
  ),
)

reportInitialRender()
