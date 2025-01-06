// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { Hash } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventTrigger, useMapKeys } from '@polkadot/react-hooks';

const OPT = {
  transform: (keys: StorageKey<[Hash]>[]): string[] =>
    keys.map(({ args: [hash] }) => hash.toHex())
};

function useTipHashesImpl (): string[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([
    api.events.tips?.NewTip,
    api.events.tips?.TipClosed,
    api.events.tips?.TipRetracted
  ]);

  return useMapKeys((api.query.tips || api.query.treasury)?.tips, [], OPT, trigger.blockHash);
}

export default createNamedHook('useTipHashes', useTipHashesImpl);
