# React State Management Dashboard

iframe 안에서 **Context / Zustand / Redux Toolkit** 세 가지 전역 상태 엔진을 동일한 UI로 실행하고,  
부모 대시보드가 각 엔진의 초기 렌더 성능을 수집·시각화하는 실험용 프로젝트입니다.

> LCP(Largest Contentful Paint)는 최상위 문맥에서만 노출되기 때문에([web.dev/vitals](https://web.dev/vitals/))  
> iframe 내부에서는 근사치를 따로 측정해야 합니다. 본 프로젝트는 `docs/initial-render-metrics.md`에 정리된 방식대로  
> 각 iframe이 “초기 렌더링 시간”을 계산해 부모 창으로 전달하도록 구성되어 있습니다.

---

## 핵심 기능

- **Feed 데이터 공통화**: TanStack Query + MSW(Mock Service Worker)로 `/api/posts`를 호출하고 Optimistic Update를 적용합니다.
- **세 엔진 비교**: Context, Zustand, Redux Toolkit Provider가 `FeedEngineState` 계약을 구현하여 같은 UI를 재사용합니다.
- **엔진 불가지론 UI**: `useFrameEngine` 훅 하나로 FeedPage가 동작하므로 엔진 교체 시에도 UI 코드는 변경되지 않습니다.
- **초기 렌더 성능 측정**: 각 iframe이 첫 페인트 이후 2프레임을 기다려 `metric:initial-render` 메시지를 부모에 전송합니다.
- **대시보드 출력**: 상단 Metric 카드에서 엔진별 초기 렌더 시간을 초 단위로 비교할 수 있습니다.
- **문서 레시피 제공**:
  - `docs/frame-engine-recipe.md`: 새 상태관리 엔진을 추가할 때 따라야 할 Provider 패턴
  - `docs/initial-render-metrics.md`: LCP 제약을 우회한 초기 렌더 지표 수집 파이프라인
  - `docs/ai-agent-recipe.md`: Codex/AI 작업 흐름 가이드

---

## 기술 스택

| 구분          | 사용 기술                             | 비고                       |
| ------------- | ------------------------------------- | -------------------------- |
| UI 프레임워크 | React 19 + Vite                       | Concurrent 기능 실험 환경  |
| 상태관리      | Context API / Zustand / Redux Toolkit | 엔진 간 비교 대상          |
| 데이터 패칭   | @tanstack/react-query                 | 캐싱 + Optimistic Update   |
| 스타일        | Material UI (MUI)                     | 대시보드 · 카드 UI         |
| Mock API      | MSW (Service Worker)                  | 로컬에서 실제 API처럼 동작 |
| 언어/도구     | TypeScript, ESLint                    | 개발 편의                  |

---

## 폴더 구조 하이라이트

```bash
.
├── public/
│   └── mockServiceWorker.js     # MSW가 생성하는 서비스워커 스크립트
├── src/
│   ├── main.dashboard.tsx       # 부모 대시보드 엔트리
│   ├── main.frame.tsx           # iframe 엔트리 (엔진별 초기 렌더 측정 포함)
│   ├── dashboard/DashboardApp.tsx
│   ├── frame/
│   │   ├── FrameApp.tsx
│   │   └── engine/
│   │       ├── types.ts         # FeedEngineState 계약
│   │       ├── useFrameEngine.ts
│   │       ├── context|zustand|redux/Provider.tsx
│   │       └── loadEngineProvider.ts
│   ├── features/feed/
│   │   ├── components/FeedPage.tsx
│   │   ├── hooks/useFeedQuery.ts
│   │   └── services/feed.api.ts
│   ├── mocks/
│   │   ├── handlers.ts          # /api/posts, /api/posts/:id/like 정의
│   │   └── browser.ts
│   ├── lib/bootstrap.ts         # MSW 초기화 + React 부트스트랩
│   ├── theme.ts
│   └── types.ts
└── docs/
    ├── frame-engine-recipe.md
    ├── initial-render-metrics.md
    └── ai-agent-recipe.md
```

---

## MSW Mock API

MSW(Service Worker)가 `/api/*` 요청을 가로채 아래와 같이 응답합니다 (`src/mocks/handlers.ts`).

| Method | Endpoint              | 설명                                 |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/api/health`         | 헬스 체크                            |
| GET    | `/api/posts`          | 피드 목록 조회                       |
| PATCH  | `/api/posts/:id/like` | 좋아요 토글 (400ms 인위적 지연 포함) |

예시 응답:

```json
[
  { "id": 1, "title": "Context API 기반 피드", "likes": 12, "liked": false },
  { "id": 2, "title": "Zustand는 가볍고 빠르다", "likes": 28, "liked": true },
  { "id": 3, "title": "Redux Toolkit 활용 패턴", "likes": 19, "liked": false }
]
```

> 개발 서버에서 Mock API를 사용하려면 `.env` 또는 실행 환경에 `VITE_ENABLE_MSW=true` 를 설정하세요.  
> 최초 한 번은 `npx msw init public/ --save` 로 서비스워커 스크립트를 생성해야 합니다.

---

## 초기 렌더 성능 지표

1. **측정 방법** (`src/main.frame.tsx`)

   - iframe이 마운트된 뒤 `requestAnimationFrame`을 두 번 대기해 첫 페인트 이후 프레임을 포착합니다.
   - `performance.getEntriesByType('navigation')[0]` 기준 시간과의 차이를 `duration`(ms)로 계산합니다.
   - `{ type: 'metric:initial-render', payload: { engineId, duration, timestamp } }` 메시지를 부모 창으로 전송합니다.

2. **출력 방법** (`src/dashboard/DashboardApp.tsx`)
   - 부모 대시보드는 동일 오리진 메시지만 수신하고 스키마를 검증합니다.
   - 엔진별 최신 타임스탬프 기록만 유지하여 상단 카드에 초 단위로 표시합니다.

> 자세한 설계 근거는 `docs/initial-render-metrics.md`에서 확인할 수 있습니다.

---

## 실행 방법

```bash
pnpm install | npm install    # 의존성 설치

VITE_ENABLE_MSW=true npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하면,

- 상단 카드에서 각 엔진의 초기 렌더 시간을 확인하고
- 하단의 세 iframe(Context/Zustand/Redux)이 동일한 Feed UI를 렌더링하는 모습을 비교할 수 있습니다.

프로덕션 번들 확인:

```bash
npm run build && npm run preview
```

---

## 추가 참고 문서

- [`docs/frame-engine-recipe.md`](docs/frame-engine-recipe.md): 새 상태관리 엔진 Provider를 붙이는 단계별 레시피
- [`docs/initial-render-metrics.md`](docs/initial-render-metrics.md): LCP 제약을 우회한 초기 렌더 지표 수집 방식
- [`docs/ai-agent-recipe.md`](docs/ai-agent-recipe.md): Codex/AI 에이전트 작업 흐름 가이드

---

## 라이선스

MIT © 2025 Han Dongchan
