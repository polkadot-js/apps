// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u32, Vec } from '@polkadot/types';
import type { PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor } from '@polkadot/types/lookup';
import type { CoreDescription } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall, useMapKeys } from '@polkadot/react-hooks';

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

function useCoreDescriptorImpl (): CoreDescription[] | undefined {
  const { api } = useApi();
  const keys = useMapKeys(api.query.coretimeAssignmentProvider.coreDescriptors, [], OPT_KEY);

  const sanitizedKeys = keys?.map((_, index) => {
    return index;
  });

  sanitizedKeys?.pop();

  const coreDescriptors = useCall<[[number[]], Vec<PolkadotRuntimeParachainsAssignerCoretimeCoreDescriptor>[]]>(api.query.coretimeAssignmentProvider.coreDescriptors.multi, [sanitizedKeys], { withParams: true });

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

export default createNamedHook('useCoreDescriptor', useCoreDescriptorImpl);
