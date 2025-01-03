// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { PalletStakingUnappliedSlash } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { BN, BN_HUNDRED, BN_ONE, BN_ZERO } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';
import { useIsMountedRef } from './useIsMountedRef.js';

type Unsub = () => void;

function useAvailableSlashesImpl (): [BN, PalletStakingUnappliedSlash[]][] {
  const { api } = useApi();
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session?.indexes);
  const earliestSlash = useCall<Option<EraIndex>>(api.query.staking?.earliestUnappliedSlash);
  const mountedRef = useIsMountedRef();
  const [slashes, setSlashes] = useState<[BN, PalletStakingUnappliedSlash[]][]>([]);

  useEffect((): Unsub => {
    let unsub: Unsub | undefined;
    const [from, offset] = api.query.staking?.earliestUnappliedSlash
      ? [earliestSlash?.unwrapOr(null), BN_ZERO]
      // future depth (one more than activeEra for delay)
      : [indexes?.activeEra, BN_ONE.add(api.consts.staking?.slashDeferDuration || BN_HUNDRED)];

    if (mountedRef.current && indexes && from) {
      const range: BN[] = [];
      const end = indexes.activeEra.add(offset);
      let start = new BN(from);

      while (start.lte(end)) {
        range.push(start);
        start = start.add(BN_ONE);
      }

      if (range.length) {
        (async (): Promise<void> => {
          unsub = await api.query.staking.unappliedSlashes.multi(range, (values): void => {
            mountedRef.current && setSlashes(
              values
                .map((value, index): [BN, PalletStakingUnappliedSlash[]] => [from.addn(index), value])
                .filter(([, slashes]) => slashes.length)
            );
          });
        })().catch(console.error);
      }
    }

    return (): void => {
      unsub && unsub();
    };
  }, [api, earliestSlash, indexes, mountedRef]);

  return slashes;
}

export const useAvailableSlashes = createNamedHook('useAvailableSlashes', useAvailableSlashesImpl);
