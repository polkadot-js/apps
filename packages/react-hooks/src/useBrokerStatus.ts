// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option } from '@polkadot/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';
import type { BrokerStatus } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall } from '@polkadot/react-hooks';

function useBrokerStatusImpl (api: ApiPromise, ready: boolean): BrokerStatus | undefined {
  const status = useCall<Option<PalletBrokerStatusRecord>>(ready && api?.query.broker?.status);
  const [state, setState] = useState<BrokerStatus | undefined>();

  useEffect((): void => {
    if (!!status && status.isSome) {
      const s = status.unwrap();

      setState({
        coreCount: s.coreCount?.toNumber(),
        lastCommittedTimeslice: s.lastCommittedTimeslice?.toNumber(),
        lastTimeslice: s.lastTimeslice?.toNumber(),
        privatePoolSize: s.privatePoolSize?.toNumber(),
        systemPoolSize: s.systemPoolSize?.toNumber()
      });
    }
  }, [status]);

  return state;
}

export const useBrokerStatus = createNamedHook('useBrokerStatus', useBrokerStatusImpl);
