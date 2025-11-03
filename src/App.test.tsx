import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from 'vitest'
import App from './App'

const renderApp = () =>
  render(
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

describe('App', () => {
  test('shows MSW status based on environment flag', () => {
    vi.stubEnv('VITE_ENABLE_MSW', 'true')
    renderApp()

    expect(screen.getByTestId('msw-status')).toHaveTextContent('MSW: Enabled')
  })

  test('increments the counter when the button is clicked', async () => {
    vi.stubEnv('VITE_ENABLE_MSW', 'false')
    const user = userEvent.setup()
    renderApp()

    const incrementButton = screen.getByRole('button', { name: /increment/i })
    expect(incrementButton).toHaveTextContent('Increment (0)')

    await user.click(incrementButton)

    expect(incrementButton).toHaveTextContent('Increment (1)')
  })
})
