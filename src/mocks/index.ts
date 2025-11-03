/**
 * @function initMocks
 * @description
 * 개발 환경에서만 MSW(Service Worker 기반 Mock Server)를 초기화하는 함수.
 *
 * 1. 프로덕션 번들에는 포함되지 않도록 import.meta.env.DEV 검사로 실행 환경을 제한한다.
 * 2. `.env`에서 선언한 `VITE_ENABLE_MSW` 값이 `'true'`일 때만 서비스 워커를 기동한다.
 *    - 설정이 꺼져 있으면 네트워크 요청을 실제 API로 그대로 전달한다.
 * 3. 워커 초기화는 동적 import를 사용해 번들 크기를 최소화하고 필요할 때만 로드한다.
 * 4. `worker.start` 호출 시 onUnhandledRequest 옵션을 `bypass`로 두어
 *    명시되지 않은 요청은 네트워크로 통과시킨다.
 */
export async function initMocks() {
  if (!import.meta.env.DEV) {
    return
  }

  if (import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return
  }

  const { worker } = await import('./browser')

  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
