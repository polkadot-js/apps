// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EraIndex, UnappliedSlash } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { Option, Vec } from '@polkadot/types';

type Unsub = () => void;

export default function useAvailableSlashes (): [BN, UnappliedSlash[]][] {
  const { api } = useApi();
  const currentEra = useCall<EraIndex>(api.query.staking?.currentEra, []);
  const earliestSlash = useCall<Option<EraIndex>>(api.query.staking?.earliestUnappliedSlash, []);
  const mounted = useIsMountedRef();
  const [slashes, setSlashes] = useState<[BN, UnappliedSlash[]][]>([]);

  useEffect((): Unsub => {
    let unsub: Unsub | undefined;

    if (mounted.current && currentEra && earliestSlash?.isSome) {
      const from = earliestSlash.unwrap();
      const range: BN[] = [];
      let start = new BN(from);

      while (start.lt(currentEra)) {
        range.push(start);
        start = start.addn(1);
      }

      if (range.length) {
        (async (): Promise<void> => {
          unsub = await api.query.staking.unappliedSlashes.multi<Vec<UnappliedSlash>>(range, (values): void =>
            setSlashes(
              values
                .map((value, index): [BN, UnappliedSlash[]] => [from.addn(index), value])
                .filter(([, slashes]): boolean => slashes.length !== 0)
            )
          );
        })();
      }
    }

    return (): void => {
      unsub && unsub();
    };
  }, [currentEra, earliestSlash]);

  return slashes;
}
