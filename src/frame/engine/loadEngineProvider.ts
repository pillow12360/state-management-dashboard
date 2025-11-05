import type { ComponentType, PropsWithChildren } from 'react'
import type { EngineId } from '../../types'

export type EngineProvider = ComponentType<PropsWithChildren>

/**
 * @function loadEngineProvider
 * @description
 * 주어진 엔진 식별자에 맞는 Provider 컴포넌트를 동적 import 한다.
 * @returns EngineProvider 런타임에 로드된 상태관리 Provider 컴포넌트.
 */
export async function loadEngineProvider(engine: EngineId): Promise<EngineProvider> {
  switch (engine) {
    case 'context': {
      const { ContextEngineProvider } = await import('./context/Provider')
      return ContextEngineProvider
    }
    case 'redux': {
      const { ReduxEngineProvider } = await import('./redux/Provider')
      return ReduxEngineProvider
    }
    case 'zustand': {
      const { ZustandEngineProvider } = await import('./zustand/Provider')
      return ZustandEngineProvider
    }
    default: {
      throw new Error(`Unknown engine: ${engine satisfies never}`)
    }
  }
}
