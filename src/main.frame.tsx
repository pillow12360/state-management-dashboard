import { CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { FrameApp } from './frame/FrameApp'
import { bootstrapReactApp } from './lib/bootstrap'
import { theme } from './theme'

bootstrapReactApp('frame-root', (root) =>
  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FrameApp />
      </ThemeProvider>
    </StrictMode>,
  ),
)
