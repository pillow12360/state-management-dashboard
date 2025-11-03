import { createRoot } from 'react-dom/client'

/**
 * @function bootstrapReactApp
 * @description
 * 공통 MSW 초기화 절차를 수행한 뒤 React 앱을 지정된 루트에 마운트한다.
 *
 * @param rootElementId DOM 상에서 React 앱이 렌더링될 요소 id
 * @param render 콜백 내부에서 React root.render 호출로 실제 컴포넌트를 렌더링한다.
 */
export async function bootstrapReactApp(
  rootElementId: string,
  render: (root: ReturnType<typeof createRoot>) => void,
) {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { initMocks } = await import('../mocks')
    await initMocks()
  }

  const container = document.getElementById(rootElementId)

  if (!container) {
    throw new Error(`React root element "${rootElementId}" not found`)
  }

  const root = createRoot(container)
  render(root)
}
