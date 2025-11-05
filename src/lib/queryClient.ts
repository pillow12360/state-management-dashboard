import { QueryClient } from '@tanstack/react-query'

/**
 * @constant baseQueryClientOptions
 * @description
 * TanStack Query에서 공통으로 사용할 기본 옵션.
 * - retry 횟수 제한 및 stale time 등은 이후 실험에 맞춰 조정 가능하도록 명시적으로 선언한다.
 */
const baseQueryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
} satisfies ConstructorParameters<typeof QueryClient>[0]

/**
 * @function createSharedQueryClient
 * @description
 * 대시보드와 프레임 엔트리 모두에서 사용 가능한 QueryClient 인스턴스를 생성한다.
 * @returns QueryClient 2개의 엔트리에서 공유하는 캐시 컨테이너.
 */
export function createSharedQueryClient() {
  return new QueryClient(baseQueryClientOptions)
}
