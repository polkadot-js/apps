// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { StorageKey, u32 } from '@polkadot/types';
import type { PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor, PalletBrokerCoretimeInterfaceCoreAssignment, PolkadotRuntimeParachainsAssignerCoretimeAssignmentState, PolkadotRuntimeParachainsAssignerCoretimeQueueDescriptor, PolkadotRuntimeParachainsAssignerCoretimeWorkState } from '@polkadot/types/lookup';
import type { CoreDescriptor } from './types.js';
import { BN } from '@polkadot/util';
import { useEffect, useState } from 'react';

import { createNamedHook, useCall, useMapKeys } from '@polkadot/react-hooks';

function extractInfo(info: PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor, core: number): CoreDescriptor {
  const currentWork: PolkadotRuntimeParachainsAssignerCoretimeWorkState | null = info?.currentWork.isSome ? info.currentWork.unwrap() : null
  const queue: PolkadotRuntimeParachainsAssignerCoretimeQueueDescriptor | null = info?.queue.isSome ? info.queue.unwrap() : null
  const assignments = currentWork?.assignments || []
  return {
    core,
    info: {
      currentWork: {
        assignments: assignments?.map((one: [PalletBrokerCoretimeInterfaceCoreAssignment, PolkadotRuntimeParachainsAssignerCoretimeAssignmentState]) => {
          return ({
            task: one[0]?.isTask ? one[0]?.asTask.toString() : one[0]?.isPool ? 'Pool' : 'Idle',
            ratio: one[1]?.ratio.toNumber(),
            remaining: one[1]?.remaining.toNumber(),
            isPool: one[0]?.isPool,
            isTask: one[0]?.isTask,

          })
        }),
        endHint: currentWork?.endHint.isSome ? currentWork?.endHint?.unwrap().toBn() : null,
        pos: currentWork?.pos.toNumber() || 0,
        step: currentWork?.step.toNumber() || 0
      },
      queue: {
        first: queue?.first.toBn() || new BN(0),
        last: queue?.last.toBn() || new BN(0)
      }
    }
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys.map(({ args: [id] }) => id)
};

function useCoreDescriptorImpl(api: ApiPromise, ready: boolean): CoreDescriptor[] | undefined {
  const keys = useMapKeys(ready && api.query.coretimeAssignmentProvider.coreDescriptors, [], OPT_KEY);

  const sanitizedKeys = keys?.map((_, index) => {
    return index;
  });

  sanitizedKeys?.pop();

  const coreDescriptors = useCall<[[number[]], PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor[]]>(ready && api.query.coretimeAssignmentProvider.coreDescriptors.multi, [sanitizedKeys], { withParams: true });
  const [state, setState] = useState<CoreDescriptor[] | undefined>();

  useEffect((): void => {
    coreDescriptors &&
      setState(coreDescriptors[0][0].map((info, index) => extractInfo(coreDescriptors[1][index], info))
      );
  }, [coreDescriptors]);

  return state;
}

export const useCoreDescriptor = createNamedHook('useCoreDescriptor', useCoreDescriptorImpl);
