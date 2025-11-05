import type { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createSharedQueryClient } from './queryClient'

/**
 * @constant sharedQueryClient
 * @description
 * 앱 전역에서 재사용할 TanStack Query 클라이언트.
 * - 단일 인스턴스를 유지함으로써 동일한 iframe 내에서 데이터 캐시가 공유된다.
 */
const sharedQueryClient = createSharedQueryClient()

/**
 * @component SharedQueryProvider
 * @description
 * TanStack Query Provider를 공통으로 래핑해 ThemeProvider 등 상위 컴포넌트에서 쉽게 사용할 수 있게 한다.
 *
 * @example
 * <SharedQueryProvider>
 *   <App />
 * </SharedQueryProvider>
 */
export function SharedQueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={sharedQueryClient}>{children}</QueryClientProvider>
  )
}
