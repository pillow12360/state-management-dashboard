/**
 * @typedef EngineId
 * @description
 * 지원하는 상태관리 엔진 식별자.
 */
export type EngineId = 'context' | 'zustand' | 'redux'

/**
 * @interface FeedPost
 * @description
 * 피드 화면에서 사용하는 포스트 데이터 형태.
 */
export interface FeedPost {
  id: number
  title: string
  likes: number
  liked: boolean
}
