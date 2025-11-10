import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { FeedPost } from '../../../types'

/**
 * @interface ReduxFeedState
 * @description
 * Redux Toolkit 엔진이 관리하는 피드 데이터 구조.
 */
export interface ReduxFeedState {
  posts: FeedPost[]
  isLoading: boolean
  error: string | null
}

const initialState: ReduxFeedState = {
  posts: [],
  isLoading: true,
  error: null,
}

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    /**
     * @action setFeedState
     * @description React Query에서 가져온 최신 피드 상태를 Redux 스토어에 동기화한다.
     */
    setFeedState(state, action: PayloadAction<ReduxFeedState>) {
      state.posts = action.payload.posts
      state.isLoading = action.payload.isLoading
      state.error = action.payload.error
    },
  },
})

export const { setFeedState } = feedSlice.actions

/**
 * @function createReduxEngineStore
 * @description
 * Redux Toolkit 스토어를 생성해 프레임 엔진에서 재사용한다.
 */
export function createReduxEngineStore() {
  return configureStore({
    reducer: {
      feed: feedSlice.reducer,
    },
  })
}

export type ReduxEngineStore = ReturnType<typeof createReduxEngineStore>
export type ReduxEngineRootState = ReturnType<ReduxEngineStore['getState']>
export type ReduxEngineDispatch = ReduxEngineStore['dispatch']

/**
 * @selector selectFeedState
 * @description Redux 루트 상태에서 피드 슬라이스를 선택한다.
 */
export const selectFeedState = (state: ReduxEngineRootState) => state.feed
