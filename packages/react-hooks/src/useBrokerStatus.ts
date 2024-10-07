// Copyright 2017-2024 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import type { ApiPromise } from '@polkadot/api'
import { useEffect, useState } from 'react';

import { createNamedHook, useCall } from '@polkadot/react-hooks';

function useBrokerStatusImpl (api: ApiPromise, ready: boolean, query?: string): any | undefined {
  const status = useCall<PalletBrokerStatusRecord>(ready && api.query.broker?.status);
  const [state, setState] = useState<PalletBrokerStatusRecord | undefined>();

  useEffect((): void => {
    status &&
            setState(
              status
            );
  }, [status]);

  if (query) {
    return state?.toJSON()?.[query]?.toString();
  }
  return state?.toJSON();
}

export const useBrokerStatus = createNamedHook('useBrokerStatus', useBrokerStatusImpl);
