// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { StorageKey, u32, Vec } from '@polkadot/types';
import type { PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor } from '@polkadot/types/lookup';
import type { CoreDescription } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall, useMapKeys } from '@polkadot/react-hooks';

function extractInfo (info: PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor[], core: number) {
  return {
    core,
    info
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys.map(({ args: [id] }) => id)
};

function useCoreDescriptorImpl (api: ApiPromise, ready: boolean): CoreDescription[] | undefined {
  const keys = useMapKeys(ready && api.query.coretimeAssignmentProvider.coreDescriptors, [], OPT_KEY);

  const sanitizedKeys = keys?.map((_, index) => {
    return index;
  });

  sanitizedKeys?.pop();

  const coreDescriptors = useCall<[[number[]], Vec<PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor>[]]>(ready && api.query.coretimeAssignmentProvider.coreDescriptors.multi, [sanitizedKeys], { withParams: true });

  const [state, setState] = useState<CoreDescription[] | undefined>();

  useEffect((): void => {
    coreDescriptors &&
      setState(
        coreDescriptors[0][0].map((info, index) => {
          return extractInfo(coreDescriptors[1][index], info);
        }
        )
      );
  }, [coreDescriptors]);

  return state;
}

export const useCoreDescriptor = createNamedHook('useCoreDescriptor', useCoreDescriptorImpl);
