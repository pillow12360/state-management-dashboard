import type { PropsWithChildren } from 'react'

/**
 * @component ReduxEngineProvider
 * @description
 * 추후 Redux Toolkit 스토어를 주입할 자리. 현재는 children을 그대로 노출한다.
 */
export function ReduxEngineProvider({ children }: PropsWithChildren) {
  return <>{children}</>
}
