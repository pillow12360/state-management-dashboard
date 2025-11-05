import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { FrameApp } from './frame/FrameApp'
import { bootstrapReactApp } from './lib/bootstrap'
import { SharedQueryProvider } from './lib/queryProvider'
import { theme } from './theme'

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
