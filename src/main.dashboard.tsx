import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { bootstrapReactApp } from './lib/bootstrap'
import { DashboardApp } from './dashboard/DashboardApp'
import { theme } from './theme'

bootstrapReactApp('root', (root) =>
  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DashboardApp />
      </ThemeProvider>
    </StrictMode>,
  ),
)
