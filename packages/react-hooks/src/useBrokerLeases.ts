// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Vec } from '@polkadot/types';
import type { PalletBrokerLeaseRecordItem } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall } from '@polkadot/react-hooks';

interface Lease {
  core: number,
  until: number,
  task: string
}

function useBrokerLeasesImpl (api: ApiPromise, ready: boolean): Lease[] | undefined {
  const leases = useCall<[any, Vec<Vec<PalletBrokerLeaseRecordItem>>[]]>(ready && api.query.broker.leases);
  const [state, setState] = useState<Lease[]>();

  useEffect((): void => {
    if (!leases) {
      return;
    }

    setState(
      leases.map((info: PalletBrokerLeaseRecordItem[], index: number) => {
        return {
          core: index,
          until: info.until.toNumber(),
          task: info.task.toString()
        };
      }
      ));
  }, [leases]);

  return state;
}

export const useBrokerLeases = createNamedHook('useBrokerLeases', useBrokerLeasesImpl);
