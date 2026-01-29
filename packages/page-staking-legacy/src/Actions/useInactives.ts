// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { QueryableStorageMultiArg } from '@polkadot/api/types';
import type { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { Option, u32 } from '@polkadot/types';
import type { EraIndex, Exposure, Nominations, SlashingSpans } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

interface Inactives {
  nomsActive?: string[];
  nomsChilled?: string[];
  nomsInactive?: string[];
  nomsOver?: string[];
  nomsWaiting?: string[];
}

function extractState (api: ApiPromise, stashId: string, slashes: Option<SlashingSpans>[], nominees: string[], { activeEra }: DeriveSessionIndexes, submittedIn: EraIndex, exposures: Exposure[]): Inactives {
  const max = api.consts.staking?.maxNominatorRewardedPerValidator as u32;

  // chilled
  // NOTE With the introduction of the SlashReported event,
  // nominators are not auto-chilled on validator slash
  const nomsChilled = !api.events.staking.SlashReported
    ? nominees.filter((_, index) =>
      slashes[index].isNone
        ? false
        // to be chilled, we have a slash era and it is later than the submission era
        // (if submitted in the same, the nomination will only take effect after the era)
        : slashes[index].unwrap().lastNonzeroSlash.gt(submittedIn)
    )
    : [];

  // all nominations that are oversubscribed
  const nomsOver = exposures
    .map(({ others }) =>
      others.sort((a, b) =>
        (b.value?.unwrap() || BN_ZERO).cmp(a.value?.unwrap() || BN_ZERO)
      )
    )
    .map((others, index) =>
      !max || max.gtn(others.map(({ who }) => who.toString()).indexOf(stashId))
        ? null
        : nominees[index]
    )
    .filter((nominee): nominee is string => !!nominee && !nomsChilled.includes(nominee));

  // first a blanket find of nominations not in the active set
  let nomsInactive = exposures
    .map((exposure, index) =>
      exposure.others.some(({ who }) => who.eq(stashId))
        ? null
        : nominees[index]
    )
    .filter((nominee): nominee is string => !!nominee);

  // waiting if validator is inactive or we have not submitted long enough ago
  const nomsWaiting = exposures
    .map((exposure, index) =>
      exposure.total?.unwrap().isZero() || (
        nomsInactive.includes(nominees[index]) &&
        // it could be activeEra + 1 (currentEra for last session)
        submittedIn.gte(activeEra)
      )
        ? nominees[index]
        : null
    )
    .filter((nominee): nominee is string => !!nominee)
    .filter((nominee) => !nomsChilled.includes(nominee) && !nomsOver.includes(nominee));

  // filter based on all inactives
  const nomsActive = nominees.filter((nominee) => !nomsInactive.includes(nominee) && !nomsChilled.includes(nominee) && !nomsOver.includes(nominee));

  // inactive also contains waiting, remove those
  nomsInactive = nomsInactive.filter((nominee) => !nomsWaiting.includes(nominee) && !nomsChilled.includes(nominee) && !nomsOver.includes(nominee));

  return {
    nomsActive,
    nomsChilled,
    nomsInactive,
    nomsOver,
    nomsWaiting
  };
}

function useInactivesImpl (stashId: string, nominees?: string[]): Inactives {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Inactives>({});
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session.indexes);

  useEffect((): () => void => {
    let unsub: (() => void) | undefined;

    if (mountedRef.current && nominees?.length && indexes) {
      api
        .queryMulti(
          [[api.query.staking.nominators, stashId] as QueryableStorageMultiArg<'promise'>]
            .concat(
              api.query.staking.erasStakers
                ? nominees.map((id) => [api.query.staking.erasStakers, [indexes.activeEra, id]])
                : nominees.map((id) => [api.query.staking.stakers, id])
            )
            .concat(
              nominees.map((id) => [api.query.staking.slashingSpans, id])
            ),
          ([optNominators, ...exposuresAndSpans]: [Option<Nominations>, ...(Exposure | Option<SlashingSpans>)[]]): void => {
            const exposures = exposuresAndSpans.slice(0, nominees.length) as Exposure[];
            const slashes = exposuresAndSpans.slice(nominees.length) as Option<SlashingSpans>[];

            mountedRef.current && setState(
              extractState(api, stashId, slashes, nominees, indexes, optNominators.unwrapOrDefault().submittedIn, exposures)
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

export default createNamedHook('useInactives', useInactivesImpl);
