// Copyright 2017-2020 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import { EraIndex, UnappliedSlash } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { Option, Vec } from '@polkadot/types';

type Unsub = () => void;

export default function useAvailableSlashes (): [BN, UnappliedSlash[]][] {
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

      while (start.lt(indexes.activeEra)) {
        range.push(start);
        start = start.addn(1);
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
