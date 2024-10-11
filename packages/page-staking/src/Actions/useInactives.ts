// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { QueryableStorageMultiArg } from '@polkadot/api/types';
import type { DeriveEraExposure, DeriveEraNominatorExposure, DeriveEraValidatorExposurePaged, DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { Option, u32 } from '@polkadot/types';
import type { EraIndex, Exposure, Nominations, SlashingSpans } from '@polkadot/types/interfaces';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { BN_ZERO, isFunction } from '@polkadot/util';

interface Inactives {
  nomsActive?: string[];
  nomsChilled?: string[];
  nomsInactive?: string[];
  nomsOver?: string[];
  nomsWaiting?: string[];
}

function extractState (api: ApiPromise, stashId: string, slashes: Option<SlashingSpans>[], nominees: string[], { activeEra }: DeriveSessionIndexes, submittedIn: EraIndex, exposures: Exposure[], allNominators: DeriveEraNominatorExposure, activeValidators: DeriveEraValidatorExposurePaged): Inactives {
  const max = api.consts.staking?.maxNominatorRewardedPerValidator as u32;

  /**
   * NOTE With the introduction of the SlashReported event, nominators are not auto-chilled on validator slash
   *
   * Chilled validators / nominations
   * - Chilling is the act of stepping back from any nominating or validating
   * To be chilled, we have a slash era and it is later than the submission era
   * (if submitted in the same, the nomination will only take effect after the era)
   */
  const nomsChilled = !api.events.staking.SlashReported
    ? nominees.filter((_, index) => slashes[index].isNone ? false : slashes[index].unwrap().lastNonzeroSlash.gt(submittedIn))
    : [];

  /**
   * Oversubscribed validators / nominations
   * - validators that have been nominated by more than max accounts
   */
  const nomsOver = exposures
    .map(({ others }) =>
      others.sort((a, b) => (b.value?.unwrap() || BN_ZERO).cmp(a.value?.unwrap() || BN_ZERO))
    )
    .map((others, index) =>
      !max || max.gtn(others.map(({ who }) => who.toString()).indexOf(stashId))
        ? null
        : nominees[index]
    )
    .filter((nominee): nominee is string => !!nominee && !nomsChilled.includes(nominee));

  // first a blanket find of nominations not in the active set
  let inactiveValidators = exposures.map((exposure, index) => exposure.others.some(({ who }) => who.eq(stashId)) ? null : nominees[index])
    .filter((nominee): nominee is string => !!nominee);

  /**
   * Waiting validator / nomination
   * - the validator is not active, not producing blocks in this era.
   * When you first nominate validators, all of them will be "waiting" in the current era.
   * The nominations will take effect in the next era. One will only see active validators (and begin earning staking rewards) after two eras,
   * so on the third day earliest.
  */
  let nomsWaiting = [];

  /**
   * Active validator / nomination
   * - the validator your funds are bonded to,
   * - they are earning rewards in the current era (they were selected to be part of the current validators set in the current era)
  */
  let nomsActive = [];

  /**
   * Inactive validator / nomination
   * - A set of nominations will be inactive when none of those nominees are participating in the current validator set
   *  (the set of validators currently elected to validate the network).
   */
  let nomsInactive = [];

  if (!!activeValidators && !!allNominators) {
    if (submittedIn.eq(activeEra) || submittedIn.gte(activeEra)) {
      nomsWaiting = inactiveValidators;
      inactiveValidators = [];
    } else {
      nomsWaiting = inactiveValidators.filter((inactive) => !activeValidators[inactive] && !nomsChilled.includes(inactive) && !nomsOver.includes(inactive));
      nomsInactive = inactiveValidators.filter((nominee) => !nomsWaiting.includes(nominee) && !nomsChilled.includes(nominee) && !nomsOver.includes(nominee) && !nomsActive.includes(nominee));
    }

    nomsActive = allNominators[stashId] ? [allNominators[stashId][0].validatorId] : [];
  } else {
    // Keeping this for backwards compatibility, can be replaced by the top part of the "if" later
    nomsWaiting = exposures.map((exposure, index) =>
      exposure.total?.unwrap().isZero() || (
        inactiveValidators.includes(nominees[index]) &&
        // it could be activeEra + 1 (currentEra for last session)
        submittedIn.gte(activeEra)
      )
        ? nominees[index]
        : null
    )
      .filter((nominee): nominee is string => !!nominee)
      .filter((nominee) => !nomsChilled.includes(nominee) && !nomsOver.includes(nominee));

    nomsActive = nominees.filter((nominee) => !nomsInactive.includes(nominee) && !nomsChilled.includes(nominee) && !nomsOver.includes(nominee));
    // inactive also contains waiting, remove those
    nomsInactive = inactiveValidators.filter((nominee) => !nomsWaiting.includes(nominee) && !nomsChilled.includes(nominee) && !nomsOver.includes(nominee) && !nomsActive.includes(nominee));
  }

  return {
    nomsActive,
    nomsChilled,
    nomsInactive,
    nomsOver,
    nomsWaiting
  };
}

/**
 *
 * @param stashId - address of the account that is performing staking
 * @param nominees - the validators that the given account has nominated
 * @returns
 */
function useInactivesImpl (stashId: string, nominees?: string[]): Inactives {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Inactives>({});
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session.indexes);

  /**
   * pallet updates v14 introduces ErasStakersPaged which is used by the derive `staking.eraExposure`
   */
  const erasStakers = useCall<DeriveEraExposure>(isFunction(api.query.staking.erasStakers) && api.derive.staking.eraExposure, [indexes?.activeEra]);
  const activeValidators: DeriveEraValidatorExposurePaged = erasStakers?.validators;
  const allNominators: DeriveEraNominatorExposure = erasStakers?.nominators;
  const eraExposure = useMemo(() => activeValidators ? nominees?.map((id) => activeValidators[id]).filter((val) => val) : null, [activeValidators, nominees]);

  useEffect((): () => void => {
    let unsub: (() => void) | undefined;

    if (mountedRef.current && nominees?.length && indexes) {
      api
        .queryMulti(
          // get the validators that were nominated by the given address
          [[api.query.staking.nominators, stashId] as QueryableStorageMultiArg<'promise'>]
            .concat(
              // v14: erasStakers is deprecated.
              // stakers deprecated earlier
              api.query.staking.erasStakers
                ? nominees.map((id) => [api.query.staking.erasStakers, [indexes.activeEra, id]])
                : nominees.map((id) => [api.query.staking.stakers, id])
            )
            .concat(
              nominees.map((id) => [api.query.staking.slashingSpans, id])
            ),
          ([optNominators, ...exposuresAndSpans]: [Option<Nominations>, ...(Exposure | Option<SlashingSpans>)[]]): void => {
            const exposures = eraExposure ? eraExposure as Exposure[] : exposuresAndSpans.slice(0, nominees.length) as Exposure[];
            const slashes = exposuresAndSpans.slice(nominees.length) as Option<SlashingSpans>[];

            mountedRef.current && setState(
              extractState(api, stashId, slashes, nominees, indexes, optNominators.unwrapOrDefault().submittedIn, exposures, allNominators, activeValidators)
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
  }, [api, indexes, mountedRef, nominees, stashId, eraExposure, activeValidators, allNominators]);

  return state;
}

export default createNamedHook('useInactives', useInactivesImpl);
