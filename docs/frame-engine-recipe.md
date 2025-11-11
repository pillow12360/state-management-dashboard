# Frame Engine Provider Recipe

새로운 전역 상태 엔진(예: Recoil, Jotai, MobX 등)을 iframe 환경에 추가할 때 따라야 할 공통 패턴을 정리했습니다. 아래 과정을 지키면 UI(`FeedPage`)는 엔진 종류와 상관없이 동일한 데이터 계약을 받을 수 있습니다.

## 1. 계약 확인
- `src/frame/engine/types.ts`의 `FeedEngineState`가 엔진이 외부로 노출해야 하는 최소 형태입니다.
- 새 엔진은 `posts`, `isLoading`, `error`, `likePost`를 반드시 제공해야 하며, 필요 시 내부 상태는 더 풍부해도 됩니다.

## 2. Provider 뼈대
1. `useFeedQuery()` 혹은 다른 데이터 소스로부터 `FeedEngineState` 값을 확보합니다.
2. 엔진 고유의 스토어/컨텍스트를 초기화하고, 확보한 값을 엔진 내부 상태에 동기화합니다.
3. children을 렌더링할 때 `FrameEngineContext`로 한 번 더 감싸 UI가 엔진 불가지론적 상태를 구독하도록 합니다.

```tsx
import { FrameEngineContext } from '../useFrameEngine'
import type { FeedEngineState } from '../types'

export function RecoilEngineProvider({ children }: PropsWithChildren) {
  const feed = useFeedQuery() // FeedEngineState

  return (
    <RecoilRoot initializeState={syncWith(feed)}>
      <FrameEngineContext.Provider value={feed}>{children}</FrameEngineContext.Provider>
    </RecoilRoot>
  )
}
```

Zustand/Redux처럼 엔진 내부 상태가 비동기 구독 형태라면, 별도 Boundary 컴포넌트를 두고 해당 엔진 전용 훅(`useZustandEngine`, `useReduxEngine`)을 이용해 최신 상태를 읽은 뒤 `FrameEngineContext`에 주입합니다.

## 3. 소비 계층은 불변
- `src/features/feed/components/FeedPage.tsx`는 `useFrameEngine()`만 사용합니다. 새 엔진을 추가하더라도 UI를 수정할 필요가 없어야 합니다.
- 추가 엔진에서만 필요한 selector/헬퍼가 있다면 `useFrameEngine()` 결과를 감싼 전용 훅을 엔진 폴더 안에 만들고, Frame 계층 하위에서만 사용하도록 합니다.

## 4. loadEngineProvider 등록
- `src/frame/engine/loadEngineProvider.ts`에서 새 엔진 식별자를 switch-case에 추가하고, Provider를 dynamic import로 노출하면 iframe에서 `engine=recoil`과 같이 호출할 수 있습니다.

## 5. 검증 체크리스트
- iframe에 새 엔진을 지정한 뒤 로딩/에러/좋아요 토글 플로우가 기존 엔진과 동일하게 동작하는지 확인합니다.
- 엔진 전용 `useXEngine` 훅이 `FeedEngineState`를 완전히 만족하는지 타입 레벨에서 점검합니다(`ReturnType`이 `FeedEngineState`인지 확인).

위 순서를 지키면 새로운 상태관리 라이브러리를 추가할 때도 Frame UI가 동일한 계약을 기대할 수 있으며, Codex나 다른 협업자가 빠르게 구현 패턴을 이해할 수 있습니다.
