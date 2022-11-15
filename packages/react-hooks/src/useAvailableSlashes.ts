// Copyright 2017-2022 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { EraIndex } from '@polkadot/types/interfaces';
import type { PalletStakingUnappliedSlash } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { BN, BN_ONE } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';

type Unsub = () => void;

function useAvailableSlashesImpl (): [BN, PalletStakingUnappliedSlash[]][] {
  const { api } = useApi();
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session?.indexes);
  const earliestSlash = useCall<Option<EraIndex>>(api.query.staking?.earliestUnappliedSlash);
  const mountedRef = useIsMountedRef();
  const [slashes, setSlashes] = useState<[BN, PalletStakingUnappliedSlash[]][]>([]);

  useEffect((): Unsub => {
    let unsub: Unsub | undefined;
    const [from, isEarliest] = api.query.staking?.earliestUnappliedSlash
      ? [earliestSlash && earliestSlash.unwrapOr(null), true]
      : indexes
        ? [indexes.activeEra, false]
        : [null, false];

    if (mountedRef.current && indexes && from) {
      const range: BN[] = [];
      const end = isEarliest
        // any <= activeEra (we include activeEra since slashes are immediately reflected)
        // NOTE: the era refers to where the slashes actually ocurred
        ? indexes.activeEra
        // we don't have access to earliestUnappliedSlash, use duration
        // NOTE: the era refers to where these are to be applied
        : indexes.activeEra.add(api.consts.staking.slashDeferDuration);
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
