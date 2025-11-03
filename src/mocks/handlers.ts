import { HttpResponse, http } from 'msw';
import type { FeedPost } from '../types';

/**
 * @constant handlers
 * @description
 * MSW에서 사용할 HTTP 핸들러 목록.
 * - `/api/health` 라우트는 서버 헬스 체크를 위한 간단한 JSON 응답을 제공한다.
 * - `/api/posts` 및 `/api/posts/:id/like`는 상태관리 비교를 위한 공통 피드 데이터를 제공한다.
 */
const posts: FeedPost[] = [
  { id: 1, title: 'Context API 기반 피드', likes: 12, liked: false },
  { id: 2, title: 'Zustand는 가볍고 빠르다', likes: 28, liked: true },
  { id: 3, title: 'Redux Toolkit 활용 패턴', likes: 19, liked: false },
];

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  http.get('/api/posts', () => {
    return HttpResponse.json(posts);
  }),

  http.patch('/api/posts/:id/like', async ({ params }) => {
    const id = Number(params.id);
    const target = posts.find((post) => post.id === id);

    if (!target) {
      return HttpResponse.json({ message: `Post ${id} not found` }, { status: 404 });
    }

    target.liked = !target.liked;
    target.likes += target.liked ? 1 : -1;

    // 지연을 추가해 optimistic update 테스트 환경 구성
    await new Promise((resolve) => setTimeout(resolve, 400));

    return HttpResponse.json(target);
  }),
];
