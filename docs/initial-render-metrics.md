# Initial Render Metric Pipeline

이 문서는 iframe으로 분리된 세 엔진(Context/Zustand/Redux)의 **초기 렌더링(Initial Paint)** 시간을 부모 대시보드에서 수집·표시하기 위해 적용한 로직을 설명합니다.

> **주의**: 본 문서에서 설명하는 지표는 **FCP(First Contentful Paint)**에 가까운 근사치이며, 사용자에게 유의미한 콘텐츠가 표시되는 시점인 **LCP(Largest Contentful Paint)**와는 다릅니다. 현재 구현은 애플리케이션 셸(로딩 스피너 등)이 화면에 그려지는 시점을 측정합니다.

## 1. 계측 포인트 (iframe 내부)

**파일**: `src/main.frame.tsx`

1.  `resolveEngineId()`가 쿼리스트링의 `engine` 값을 읽어 현재 iframe이 어떤 상태관리 엔진을 사용하는지 판단합니다.
2.  `reportInitialRender()`는 React 트리 마운트 직후 `requestAnimationFrame`을 두 번 대기합니다.
    *   이는 브라우저가 첫 페인트를 화면에 그리는 시점을 포착하기 위한 일반적인 기법입니다.
3.  `performance.getEntriesByType('navigation')[0]`의 `startTime`을 기준으로 현재 시점과의 차이를 `duration`으로 계산하고, 부모 창으로 메시지를 전송합니다.

```typescript
type InitialRenderMetricMessage = {
  type: 'metric:initial-render'
  payload: {
    engineId: EngineId
    duration: number // ms (Navigation Start ~ First Paint)
    timestamp: number // Date.now()
  }
}
```

## 2. 부모 대시보드 수신

**파일**: `src/dashboard/DashboardApp.tsx`

1.  `useEffect`로 `message` 이벤트를 구독합니다.
2.  메시지 타입이 `metric:initial-render`이고 오리진이 일치하는지 검증합니다.
3.  엔진별로 최신 측정값을 상태에 저장하고, 대시보드 상단 카드에 초 단위(`s`)로 표시합니다.

## 3. 지표의 의미와 한계

### 의미
*   **초기화 비용 비교**: 각 상태 관리 라이브러리(Context, Zustand, Redux)의 Provider가 초기화되고 앱이 실행되기까지의 기본 오버헤드를 비교할 수 있습니다.
*   **번들 파싱 비용**: 스크립트 로드 및 실행 속도 차이를 간접적으로 확인할 수 있습니다.

### 한계
*   **데이터 렌더링 미포함**: 실제 피드 데이터가 로드되고 리스트가 렌더링되는 시간은 포함되지 않습니다.
*   **사용자 경험과의 괴리**: 사용자는 로딩 스피너가 뜬 시점을 "완료"로 인식하지 않으므로, 실제 체감 성능과는 차이가 있습니다.

## 4. 향후 계획: Data Render 측정

진정한 성능 비교를 위해서는 **데이터 로드 및 대량의 DOM 렌더링이 완료된 시점**을 측정해야 합니다. 이를 위해 추후 다음과 같은 지표를 추가할 예정입니다:

*   **Metric**: `metric:data-render` (가칭)
*   **측정 시점**: `FeedPage` 컴포넌트에서 데이터 패칭 및 리스트 렌더링이 완료된 직후 (`useEffect` 활용).
*   **목적**: 데이터 양(Item Count)에 따른 엔진별 렌더링 성능 및 반응성 비교.
