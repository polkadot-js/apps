// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { QueryableStorageMultiArg } from '@polkadot/api/types';
import type { DeriveEraExposure, DeriveEraNominatorExposure, DeriveEraValidatorExposurePaged, DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { Option, u16, u32 } from '@polkadot/types';
import type { EraIndex, Exposure, Nominations, SlashingSpans } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { BN, BN_ZERO } from '@polkadot/util';

interface Inactives {
  nomsActive?: string[];
  nomsChilled?: string[];
  nomsInactive?: string[];
  nomsOver?: string[];
  nomsWaiting?: string[];
}

interface ExtractStateParams {
  api: ApiPromise;
  stashId: string;
  slashes: Option<SlashingSpans>[];
  nominees: string[];
  activeEra: EraIndex| undefined;
  submittedIn: EraIndex;
  exposures: Exposure[];
  version: number | undefined;
  allNominators?: DeriveEraNominatorExposure;
  activeValidators?: DeriveEraValidatorExposurePaged;
}

function extractState (params: ExtractStateParams): Inactives {
  const { activeEra, activeValidators, allNominators, api, exposures, nominees, slashes, stashId, submittedIn, version } = params;

  if (((version && version >= 14) && !allNominators && !activeValidators) || !activeEra || !version) {
    return { nomsActive: [], nomsChilled: [], nomsInactive: [], nomsOver: [], nomsWaiting: [] };
  }

  // / For older non-paged exposure, a reward payout was restricted to the top
  // / `MaxExposurePageSize` nominators. This is to limit the i/o cost for the
  // / nominator payout.
  const max = api.consts.staking?.maxNominatorRewardedPerValidator as u32 || new BN(512);

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
  const inactiveValidators = exposures.map((exposure, index) => exposure.others.some(({ who }) => who.eq(stashId)) ? null : nominees[index])
    .filter((nominee): nominee is string => !!nominee);

  /**
   * Waiting validator / nomination
   * - the validator is not active, not producing blocks in this era.
  */
  let nomsWaiting: string[] = [];

  /**
   * Active validator / nomination
   * - the validator your funds are bonded to,
   * - they are earning rewards in the current era (they were selected to be part of the current validators set in the current era)
  */
  let nomsActive: string[] = [];

  /**
   * Inactive validator / nomination
   * - A set of nominations will be inactive when none of those nominees are participating in the current validator set
   *  (the set of validators currently elected to validate the network).
   */
  let nomsInactive: string[] = [];

  /**
   * When you first nominate validators, all of them will be "waiting" in the current era.
   * The nominations will take effect in the next era. One will only see active validators (and begin earning staking rewards) after two eras,
   * so on the third day earliest.
   */
  if (submittedIn.eq(activeEra)) {
    return { nomsActive: [], nomsChilled, nomsInactive: [], nomsOver, nomsWaiting: nominees };
  }

  if (version >= 14) {
    nomsWaiting = inactiveValidators.filter((inactive) => !activeValidators?.[inactive] && !nomsChilled.includes(inactive) && !nomsOver.includes(inactive));
    nomsActive = allNominators?.[stashId] ? [allNominators?.[stashId][0].validatorId] : [];
    nomsInactive = inactiveValidators.filter((nominee) => !nomsWaiting.includes(nominee) && !nomsChilled.includes(nominee) && !nomsOver.includes(nominee) && !nomsActive.includes(nominee));

    return { nomsActive, nomsChilled, nomsInactive, nomsOver, nomsWaiting };
  }

  /**
   * Keeping this for backwards compatibility   *
   * For staking pallet lower than version 14
   */
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

  return { nomsActive, nomsChilled, nomsInactive, nomsOver, nomsWaiting };
}

/**
 *
 * @param stashId - address of the account that is performing staking
 * @param nominees - the validators that the given account has nominated
 * @returns
 */
function useInactivesImpl (stashId: string, nominees?: string[], eraExposure?: DeriveEraExposure): Inactives {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Inactives>({});
  const [exposures, setExposures] = useState<Exposure[]>([]);
  const [slashes, setSlashes] = useState<Option<SlashingSpans>[]>([]);
  const [submittedIn, setSubmittedIn] = useState<EraIndex>();
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session.indexes);
  const version = useCall<u16>(api.query.staking.palletVersion)?.toNumber();

  /**
   * pallet updates v14 introduces ErasStakersPaged which is used by the derive `staking.eraExposure`
   */
  useEffect(() => {
    if (version && version >= 14 && !eraExposure) {
      return;
    }

    const exposuresData = nominees?.map((id) => eraExposure?.validators?.[id]).filter((val) => val) as Exposure[];

    mountedRef.current && exposuresData?.length && nominees?.length && !!submittedIn && setState(
      extractState({
        activeEra: indexes?.activeEra,
        activeValidators: eraExposure?.validators,
        allNominators: eraExposure?.nominators,
        api,
        exposures: exposuresData,
        nominees,
        slashes,
        stashId,
        submittedIn,
        version
      })
    );
  }, [api, stashId, slashes, nominees, indexes, submittedIn, eraExposure, version, mountedRef]);

  /**
   * These calls are used by both staking pallet before v14 and after
   */
  useEffect((): () => void => {
    let unsub: (() => void) | undefined;

    if (mountedRef.current && nominees?.length && indexes) {
      api.queryMulti(
        [[api.query.staking.nominators, stashId] as QueryableStorageMultiArg<'promise'>]
          .concat(
            nominees.map((id) => [api.query.staking.slashingSpans, id]))
        , ([optNominators, ...slashingSpans]: [Option<Nominations>, ...(Option<SlashingSpans>)[]]): void => {
          setSubmittedIn(optNominators.unwrapOrDefault().submittedIn);
          setSlashes(slashingSpans);
        })
        .then((_unsub): void => {
          unsub = _unsub;
        })
        .catch(console.error);
    }

    return (): void => {
      unsub && unsub();
    };
  }, [api, indexes, mountedRef, nominees, stashId]);

  /**
   * Deprecated calls for exposure
   * - erasStakers - deprecated in v14
   * - stakers - deprecated earlier
   */
  useEffect((): () => void => {
    let unsub: (() => void) | undefined;

    if (version && version < 14 && mountedRef.current && nominees?.length && indexes) {
      api.queryMulti(
        api.query.staking.erasStakers
          ? nominees.map((id) => [api.query.staking.erasStakers, [indexes?.activeEra, id]])
          : nominees.map((id) => [api.query.staking.stakers, id])
        , (exposures: Exposure[]): void => setExposures(exposures))
        .then((_unsub): void => {
          unsub = _unsub;
        })
        .catch(console.error);
    }

    return (): void => {
      unsub && unsub();
    };
  }, [api, indexes, mountedRef, nominees, stashId, version]);

  /**
   * Extracting state for deprecated calls
   */
  useEffect(() => {
    if (exposures.length && slashes.length && nominees?.length && !!submittedIn) {
      mountedRef.current && setState(
        extractState({
          activeEra: indexes?.activeEra,
          api,
          exposures,
          nominees,
          slashes,
          stashId,
          submittedIn,
          version
        })
      );
    }
  }, [api, stashId, slashes, nominees, indexes, submittedIn, exposures, version, mountedRef]);

  return state;
}

export default createNamedHook('useInactives', useInactivesImpl);
