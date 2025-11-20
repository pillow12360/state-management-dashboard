import { HttpResponse, http } from 'msw';
import type { FeedPost } from '../types';

/**
 * @constant handlers
 * @description
 * MSW에서 사용할 HTTP 핸들러 목록.
 * - `/api/health` 라우트는 서버 헬스 체크를 위한 간단한 JSON 응답을 제공한다.
 * - `/api/posts` 및 `/api/posts/:id/like`는 상태관리 비교를 위한 공통 피드 데이터를 제공한다.
 */
const generatePosts = (count: number): FeedPost[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `성능 테스트용 피드 아이템 #${index + 1}`,
    likes: Math.floor(Math.random() * 100),
    liked: Math.random() > 0.5,
  }));
};

// 기본 데이터 (3개)
const defaultPosts: FeedPost[] = [
  { id: 1, title: 'Context API 기반 피드', likes: 12, liked: false },
  { id: 2, title: 'Zustand는 가볍고 빠르다', likes: 28, liked: true },
  { id: 3, title: 'Redux Toolkit 활용 패턴', likes: 19, liked: false },
];

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  http.get('/api/posts', ({ request }) => {
    const url = new URL(request.url);
    const countParam = url.searchParams.get('count');
    const count = countParam ? Number(countParam) : null;

    if (count && count > 0) {
      return HttpResponse.json(generatePosts(count));
    }

    return HttpResponse.json(defaultPosts);
  }),

  http.patch('/api/posts/:id/like', async ({ params }) => {
    const id = Number(params.id);
    // Note: 실제로는 생성된 데이터에 대해 상태를 유지하지 않지만(매번 새로 생성되므로),
    // 간단한 테스트를 위해 성공 응답만 내려줍니다.
    // 만약 영속성이 필요하다면 메모리 DB 등을 도입해야 합니다.
    
    // 지연을 추가해 optimistic update 테스트 환경 구성
    await new Promise((resolve) => setTimeout(resolve, 400));

    return HttpResponse.json({
      id,
      liked: true, // 토글 로직은 생략하고 성공했다고 가정
      likes: 100,
    });
  }),
];
