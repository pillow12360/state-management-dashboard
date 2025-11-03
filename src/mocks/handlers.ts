import { HttpResponse, http } from 'msw'

/**
 * @constant handlers
 * @description
 * MSW에서 사용할 HTTP 핸들러 목록.
 * - `/api/health` 라우트는 서버 헬스 체크를 위한 간단한 JSON 응답을 제공한다.
 * - 실제 프로젝트에서는 이 배열에 상태관리 비교에 필요한 REST, GraphQL 핸들러를 확장한다.
 */
export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
