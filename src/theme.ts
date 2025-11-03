import { createTheme } from '@mui/material'

/**
 * @constant theme
 * @description
 * 대시보드 및 iframe 모두에서 공유하는 Material UI 테마 정의.
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: `'Pretendard', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`,
  },
})
