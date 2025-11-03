import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * @constant worker
 * @description
 * 브라우저 환경에서 동작하는 MSW Service Worker 인스턴스.
 * - `handlers` 배열에 정의된 HTTP 핸들러를 모두 주입한다.
 * - 개발 서버에서 실행될 때 네트워크 요청을 가로채며,
 *   각 핸들러는 실제 API와 동일한 응답 형태를 제공하도록 구성한다.
 */
export const worker = setupWorker(...handlers)
