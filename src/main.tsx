import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import App from './App.tsx';

/**
 * @constant theme
 * @description
 * Material UI 컴포넌트에서 사용할 전역 테마 정의.
 * - 밝은 모드 팔레트를 기본값으로 설정하고 주요 색상을 지정한다.
 * - 주요(primary)와 보조(secondary) 컬러를 지정해 버튼 등 컴포넌트의 포커스 색상을 통일한다.
 * - background.default 값을 설정해 앱 전반의 배경 톤을 밝게 유지한다.
 * - 둥근 모서리(borderRadius)를 지정해 카드, 버튼 등의 일관된 라운딩을 제공한다.
 */
const theme = createTheme({
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
    },
  },
  shape: {
    borderRadius: 12,
  },
});

/**
 * 앱 초기화 절차를 담당하는 비동기 함수.
 *
 * 1. 개발 환경(import.meta.env.DEV)이면서 MSW 사용 플래그(VITE_ENABLE_MSW)가 true일 경우
 *    - 동적으로 `./mocks` 모듈을 import 하여 서비스 워커를 구동한다.
 *    - mockServiceWorker는 네트워크 요청을 가로채 API 함수를 테스트하거나 UI를 빠르게 검증할 수 있게 해준다.
 * 2. MSW 처리 여부에 관계없이 React가 렌더링될 루트 DOM 요소를 탐색한다.
 *    - 루트를 찾지 못하면 즉시 예외를 던져 초기화 문제 발생 시 렌더링.
 * 3. 조건이 충족되면 StrictMode, ThemeProvider, CssBaseline을 포함한 컴포넌트 트리를 렌더링한다.
 *    - ThemeProvider는 위에서 정의한 테마를 주입,
 *    - CssBaseline은 기본 브라우저 스타일을 리셋해 일관된 UI를 보장한다.
 */
async function enableMocksAndRender() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { initMocks } = await import('./mocks');
    await initMocks();
  }

  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('React root element not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>
  );
}

enableMocksAndRender();
