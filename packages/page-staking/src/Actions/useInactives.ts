// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import { EraIndex, Exposure, Nominations } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

interface Inactives {
  nomsActive?: string[];
  nomsInactive?: string[];
  nomsWaiting?: string[];
}

function extractState (stashId: string, nominees: string[], activeEra: EraIndex, submittedIn: EraIndex, exposures: Exposure[]): Inactives {
  // first a blanket find of nominations not in the active set
  let nomsInactive = exposures
    .map((exposure, index) =>
      exposure.others.some(({ who }) => who.eq(stashId))
        ? null
        : nominees[index]
    )
    .filter((inactiveId): inactiveId is string => !!inactiveId);

  // waiting if validator is inactive or we have not submitted long enough ago
  const nomsWaiting = exposures
    .map((exposure, index) =>
      exposure.total.unwrap().isZero() || (nomsInactive.includes(nominees[index]) && activeEra.sub(submittedIn).lten(2))
        ? nominees[index]
        : null
    )
    .filter((waitingId): waitingId is string => !!waitingId);

  // filter based on all inactives
  const nomsActive = nominees.filter((nominee) => !nomsInactive.includes(nominee));

  // inactive also contains waiting, remove those
  nomsInactive = nomsInactive.filter((inactiveId) => !nomsWaiting.includes(inactiveId));

  return {
    nomsActive,
    nomsInactive,
    nomsWaiting
  };
}

export default function useInactives (stashId: string, nominees?: string[]): Inactives {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Inactives>({});
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session.indexes, []);

  useEffect((): () => void => {
    let unsub: (() => void) | undefined;

    if (mountedRef.current && nominees && nominees.length && indexes) {
      api
        .queryMulti(
          [[api.query.staking.nominators, stashId] as any].concat(
            api.query.staking.erasStakers
              ? nominees.map((id) => [api.query.staking.erasStakers, [indexes.activeEra, id]])
              : nominees.map((id) => [api.query.staking.stakers, id])
          ),
          ([optNominators, ...exposures]: [Option<Nominations>, ...Exposure[]]): void => {
            mountedRef.current && setState(
              extractState(stashId, nominees, indexes.activeEra, optNominators.unwrapOrDefault().submittedIn, exposures)
            );
          }
        )
        .then((_unsub): void => {
          unsub = _unsub;
        }).catch(console.error);
    }

    return (): void => {
      unsub && unsub();
    };
  }, [api, indexes, mountedRef, nominees, stashId]);

  return state;
}
