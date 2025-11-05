import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { bootstrapReactApp } from './lib/bootstrap'
import { DashboardApp } from './dashboard/DashboardApp'
import { SharedQueryProvider } from './lib/queryProvider'
import { theme } from './theme'

/**
 * @description
 * 대시보드 엔트리 포인트로, 글로벌 테마/쿼리 Provider를 장착하고 메인 페이지를 렌더링한다.
 */
bootstrapReactApp('root', (root) =>
  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <SharedQueryProvider>
          <CssBaseline />
          <DashboardApp />
        </SharedQueryProvider>
      </ThemeProvider>
    </StrictMode>,
  ),
)
