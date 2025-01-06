// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Vec } from '@polkadot/types';
import type { PalletBrokerLeaseRecordItem } from '@polkadot/types/lookup';
import type { LegacyLease } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall } from '@polkadot/react-hooks';

function useBrokerLeasesImpl (api: ApiPromise, ready: boolean): LegacyLease[] | undefined {
  const leases = useCall<Vec<PalletBrokerLeaseRecordItem>>(ready && api?.query?.broker?.leases);
  const [state, setState] = useState<LegacyLease[]>();

  useEffect((): void => {
    if (!leases) {
      return;
    }

    setState(
      leases.map((info, index: number) => ({
        core: index,
        task: info.task.toString(),
        until: info.until.toNumber()
      })
      ));
  }, [leases]);

  return state;
}

export const useBrokerLeases = createNamedHook('useBrokerLeases', useBrokerLeasesImpl);
