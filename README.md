
# 🧠 React State Management Dashboard  
> **React 상태관리 라이브러리(Context API, Zustand, Redux Toolkit)의 데이터 흐름 및 성능 비교 프로젝트**

---

## 🚀 프로젝트 개요
이 프로젝트는 동일한 UI 구조를 기반으로 **서로 다른 상태관리 라이브러리의 동작 특성과 성능 차이**를 시각화하여 비교하기 위한 실험형 대시보드입니다.  

React Profiler와 커스텀 로깅 훅을 이용해 각 엔진별 렌더링 횟수, 반응 속도, 코드 복잡도를 수집하고  
이를 Recharts 기반의 그래프로 시각화합니다.

---

## 🎯 목표
> "상태관리 선택은 단순한 라이브러리 취향이 아니라, 아키텍처 설계의 문제다."

- Context, Zustand, Redux Toolkit의 구조적 차이를 직접 비교
- Optimistic UI, 전역 상태 관리, 데이터 캐싱 등의 성능 및 코드 복잡도 분석
- 결과를 대시보드 형태로 시각화하여 한눈에 파악

---

## ⚙️ 기술 스택

| 구분 | 기술 | 선택 이유 |
|------|------|-----------|
| **Frontend Framework** | React 19 (Vite) | 최신 React 기능 실험용 |
| **Mock Server** | MSW (Mock Service Worker) | 실제 네트워크 요청처럼 작동하는 Mock API |
| **Data Fetching** | TanStack Query | 캐싱, 리트라이, Optimistic UI 제어 |
| **State Management** | Context API / Zustand / Redux Toolkit | 상태관리 비교 목적 |
| **Styling** | Tailwind CSS | 빠른 UI 프로토타이핑 및 반응형 구현 |
| **Chart Library** | Recharts | 성능 데이터 시각화 |
| **Performance Tools** | React Profiler, Performance API | 렌더링 및 UX 지표 수집 |

---

## 🧱 프로젝트 구조

```bash
src/
 ├─ features/
 │   ├─ feed/
 │   │   ├─ components/   # 피드 카드, 버튼 등 UI
 │   │   ├─ hooks/        # usePerformanceLog, useFeed 등
 │   │   └─ services/     # API 통신 (TanStack Query)
 │   ├─ dashboard/        # 성능 비교 그래프 시각화
 │   └─ state/            # 상태관리 엔진별 구현체
 │       ├─ context/
 │       ├─ zustand/
 │       └─ redux/
 ├─ mocks/
 │   ├─ handlers.ts       # MSW API Mock 핸들러
 │   └─ browser.ts        # 서비스워커 초기화
 ├─ hooks/
 │   └─ usePerformanceLog.ts
 ├─ pages/
 │   └─ Home.tsx
 └─ main.tsx
```
---

## 🔍 주요 기능

### 기능	설명
- 📰 피드 목록 표시	/api/posts Mock API에서 데이터 Fetch
- ❤️ 좋아요(Optimistic UI)	서버 응답 전에 즉시 상태 반영 후 롤백 테스트
- 🔄 상태관리 엔진 전환	Zustand / Context / Redux 간 실시간 전환
- 📊 성능 로그 시각화	렌더링 횟수, 인터랙션 지연(ms), 코드 라인수 비교


---

## 🌐 API 명세 (MSW 기반)

Method	Endpoint	설명
GET	/api/posts	피드 목록 조회
PATCH	/api/posts/:id/like	좋아요 상태 토글 (800ms 지연 포함)

예시 응답
```
[
  { "id": 1, "title": "React Query is powerful", "likes": 10 },
  { "id": 2, "title": "Zustand is minimal", "likes": 5 }
]
```
---

## ⚖️ 비교 지표


### 항목	측정 방법
1. 렌더링 횟수	React Profiler API
2. 사용자 인터랙션 지연	performance.now() 기반 Custom Hook
3. 코드 복잡도	LOC(Line of Code) 계산
4. API 응답 속도	TanStack Query onSuccess 타이밍 측정
5. 상태 일관성	optimistic update → rollback 동작 비교


---

## 📈 대시보드 구성

그래프	설명
📊 Render Count Chart	각 상태관리 엔진별 총 렌더링 횟수
⚡ Interaction Delay Chart	클릭 → UI 반영까지의 평균 지연시간
🧩 Code Complexity Chart	기능별 코드 라인 수 및 store 구조 비교
🔁 Success Rate Chart	낙관적 업데이트 성공률 및 실패 롤백 비율


---

## 🧩 마일스톤 (Sprint 1 - 10 Days)

```
Day	주요 목표	산출물
D1~2	기본 피드 UI + TanStack Query 셋업	공통 UI 완성
D3~4	Context + Zustand 버전 구현	상태관리 구조 완성
D5~6	Redux Toolkit 버전 + 전환 기능 추가	3버전 전환 가능
D7	Profiler + 성능 로깅 Hook 구현	로그 JSON 출력
D8~9	대시보드 그래프 구현	시각화 페이지 완성
D10	README + 블로그형 결과 정리	포트폴리오 제출용 정리
```

---

## 🧠 프로젝트 설계 의도
	1. 실무형 비교 실험
	•	단순한 라이브러리 비교가 아닌, 실제 서비스 수준의 데이터 흐름 실험.
	2. 시각화 중심 설계
	•	결과를 직관적으로 전달할 수 있도록 대시보드 형태로 구성.
	3. 확장성 고려
	•	향후 MobX, Recoil, custom hook 기반 상태관리 추가 예정.

---

## 🚀 향후 확장 계획
- Zustand Devtools / Redux Logger 연동
- React 19의 useOptimistic, useTransition 비교 추가
- Lighthouse 기반 Web Vitals 측정 (LCP/CLS/INP)
- GitHub Actions 기반 자동 벤치마크 실행

---

📘 실행 방법


# 1. 패키지 설치
```bash
npm install
```
# 2. MSW 서버 실행
```bash
npm run dev
```
# 3. Mock API 활성화
```bash
npx msw init public/ --save
```
# 4. 개발 서버 시작
```bash
npm run dev
```

---
🪪 License

MIT License
Copyright (c) 2025 Han Dongchan

---
