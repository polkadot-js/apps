// Copyright 2017-2021 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { Option, Vec } from '@polkadot/types';
import type { EraIndex, UnappliedSlash } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

type Unsub = () => void;

export function useAvailableSlashes (): [BN, UnappliedSlash[]][] {
  const { api } = useApi();
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session?.indexes);
  const earliestSlash = useCall<Option<EraIndex>>(api.query.staking?.earliestUnappliedSlash);
  const mountedRef = useIsMountedRef();
  const [slashes, setSlashes] = useState<[BN, UnappliedSlash[]][]>([]);

  useEffect((): Unsub => {
    let unsub: Unsub | undefined;

    if (mountedRef.current && indexes && earliestSlash && earliestSlash.isSome) {
      const from = earliestSlash.unwrap();
      const range: BN[] = [];
      let start = new BN(from);

      // any <= activeEra (we include activeEra since slashes are immediately reflected)
      while (start.lte(indexes.activeEra)) {
        range.push(start);
        start = start.iadd(BN_ONE);
      }

      if (range.length) {
        (async (): Promise<void> => {
          unsub = await api.query.staking.unappliedSlashes.multi<Vec<UnappliedSlash>>(range, (values): void => {
            mountedRef.current && setSlashes(
              values
                .map((value, index): [BN, UnappliedSlash[]] => [from.addn(index), value])
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
