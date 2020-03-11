// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import { Exposure } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

export default function useInactives (stashId: string, nominees?: string[]): string[] {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [inactives, setInactives] = useState<string[]>([]);
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session.indexes, []);

  useEffect((): () => void => {
    let unsub: (() => void) | undefined;

    if (mountedRef.current && nominees?.length && indexes) {
      api
        .queryMulti(
          api.query.staking.erasStakers
            ? nominees.map((id) => [api.query.staking.erasStakers, [indexes.activeEra, id]])
            : nominees.map((id) => [api.query.staking.stakers, id]),
          (exposures: Exposure[]): void => {
            const inactives: string[] = [];

            exposures.forEach((exposure, index): void => {
              if (!exposure.others.some((indv): boolean => indv.who.eq(stashId))) {
                inactives.push(nominees[index].toString());
              }
            });

            setInactives(inactives);
          }
        )
        .then((_unsub): void => {
          unsub = _unsub;
        });
    }

    return (): void => {
      unsub && unsub();
    };
  }, [indexes, nominees, stashId]);

  return inactives;
}
