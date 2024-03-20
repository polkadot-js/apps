import type { ApiProps } from '@polkadot/react-api/types';

import { createNamedHook } from '../../../react-hooks/src/index.js'
import { ApiPromise } from '@polkadot/api'
import { useApi as useApiBase } from '@polkadot/react-hooks';

import * as derives from '../derives/index.js'
import { useMemo, useState, useEffect } from 'react'

function useApiImpl (): ApiProps {
  const ctx = useApiBase()

  const [isApiReady, setIsApiReady] = useState<boolean>(false)

  const newApi = useMemo(() => new ApiPromise({
    derives: {
      treasury: {
        ...derives as any
      }
    },
    source: ctx.api
  }), [ctx.api])

  useEffect(() => {
    newApi.isReady.then(() => {
      setIsApiReady(true)
    })
  }, [newApi])

  return {
    ...ctx,
    isApiReady,
    api: newApi
  }
}

export const useApi = createNamedHook('useApi', useApiImpl);
