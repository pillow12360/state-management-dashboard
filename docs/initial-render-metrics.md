# Initial Render Metric Pipeline

이 문서는 iframe으로 분리된 세 엔진(Context/Zustand/Redux)의 초기 렌더 시간을 부모 대시보드에서 수집·표시하기 위해 적용한 로직을 설명합니다. Chrome Web Vitals 문서에 따르면 LCP는 최상위 문맥에서만 보고되므로([web.dev/vitals/](https://web.dev/vitals/)), 동일 출처 iframe 내부에서는 LCP를 직접 구할 수 없습니다. 따라서 각 iframe이 자체적으로 “초기 렌더 완료 시점”을 추정해 부모 창으로 전달하는 방식을 사용합니다.

## 1. 계측 포인트 (iframe 내부)
- 파일: `src/main.frame.tsx`
- `resolveEngineId()`가 쿼리스트링의 `engine` 값을 읽어 현재 iframe이 어떤 상태관리 엔진(Context/Zustand/Redux)을 렌더링하는지 판단합니다.
- `reportInitialRender()`는 React 트리 렌더 완료 후 `requestAnimationFrame`을 두 번 대기합니다. 이는 첫 페인트 이후 다음 프레임까지 기다려 “사용자가 시각적으로 콘텐츠를 본” 시점에 근접하도록 하기 위함입니다. Chrome 성능 튜닝 글([developer.chrome.com/docs/lighthouse/performance/lighthouse-performance-scoring](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-performance-scoring))에서도 첫 페인트 이후 프레임 대기가 LCP 근사치로 쓰입니다.
- `performance.getEntriesByType('navigation')[0]`의 `startTime`을 기준으로 현재 시점과의 차이를 `duration`으로 계산하고, `{ type: 'metric:initial-render', payload }` 형태의 메시지를 `window.parent.postMessage`로 보냅니다.

```ts
type InitialRenderMetricMessage = {
  type: 'metric:initial-render'
  payload: {
    engineId: EngineId
    duration: number // ms
    timestamp: number // Date.now() 기준
  }
}
```

## 2. 부모 대시보드 수신
- 파일: `src/dashboard/DashboardApp.tsx`
- `useEffect`로 `window.addEventListener('message', handler)`를 등록하고, `event.origin`이 현재 오리진과 같은지 확인한 뒤 메시지 타입이 `metric:initial-render`인지 검증합니다.
- payload 검사(`engineId`가 허용 목록인지, `duration/timestamp`가 number인지)를 통과하면 `engineId`별로 최신 측정값만 상태에 저장합니다. (새 타임스탬프가 이전보다 클 때만 교체)
- 상단 카드 섹션에서 각 엔진의 초기 렌더 시간을 초 단위로 포맷(`(duration / 1000).toFixed(2) + 's'`)해 보여줍니다.

## 3. UI/UX 의미
- 측정값은 “iframe이 로드된 후 FeedPage가 화면에 그려지기까지” 걸린 시간을 근사합니다. LCP와 동일한 표준 지표는 아니지만, 각 엔진 Provider 초기화와 상태 동기화 비용을 직관적으로 비교할 수 있습니다.
- 추후 정확한 LCP가 필요하다면, 부모 문맥에서 Element Timing API나 `LargestContentfulPaint` PerformanceObserver를 이용해 iframe 외부에서 엔진별 주요 콘텐츠를 추적해야 합니다.

## 4. 확장 계획
- payload에 `networkConditions`, `cpuThrottling` 등을 추가해 동일 환경에서 반복 측정 값을 저장할 수 있습니다.
- 같은 구조를 활용해 CLS/INP 등 다른 사용자 중심 지표도 커스텀 측정 후 부모로 전달할 수 있습니다. Web Vitals 측정 패턴은 공식 문서([https://github.com/GoogleChrome/web-vitals](https://github.com/GoogleChrome/web-vitals))를 참고하면 됩니다.

이 문서를 통해 iframe 기반 실험 환경에서 LCP 제약을 우회하는 방법과 코드 위치를 빠르게 파악할 수 있습니다.
