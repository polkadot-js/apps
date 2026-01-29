// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { QueryableStorageMultiArg } from '@polkadot/api/types';
import type { DeriveEraExposure, DeriveEraValidatorExposurePaged, DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { Option, u16, u32, Vec } from '@polkadot/types';
import type { EraIndex, Exposure, Nominations, UnappliedSlash } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall, useIsMountedRef, useStakingAsyncApis } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

/**
 * @interface Inactives
 * @description Defines the structure for the categorized lists of nominated validators.
 * 'nomsAtRisk' replaces the legacy 'nomsChilled' concept for new runtime (for staking async).
 */
export interface Inactives {
  nomsActive?: string[];
  nomsAtRisk?: string[];
  nomsInactive?: string[];
  nomsOver?: string[];
  nomsWaiting?: string[];
}

/**
 * @interface NominationInfo
 * @description A robust data structure to safely link a nominee's address to their exposure data for the current era.
 * This prevents index mismatches when some nominees are not in the active validator set.
 */
interface NominationInfo {
  nomineeId: string;
  exposure?: Exposure;
}

interface ExtractStateParams {
  api?: ApiPromise;
  stashId: string;
  unappliedSlashes: string[];
  nominationsInfo: NominationInfo[];
  activeEra: EraIndex| undefined;
  submittedIn: EraIndex;
  activeValidators: DeriveEraValidatorExposurePaged;
}

/**
 * @name extractState
 * @description A pure function that takes all fetched chain data and classifies the nominations into different states.
 * This is the core classification logic of the hook.
 * @param params An object containing all necessary data from the chain.
 * @returns An `Inactives` object with categorized nominee lists.
 */
function extractState (params: ExtractStateParams): Inactives {
  const { activeEra, activeValidators, api, nominationsInfo, stashId, submittedIn, unappliedSlashes } = params;

  // The maximum number of nominators that can be rewarded for a single validator.
  const max = api?.consts.staking?.maxNominatorRewardedPerValidator as u32 || new BN(512);

  const atRiskSet = new Set(unappliedSlashes);

  // We positively identify which nominees are currently active (i.e., our stake is backing them)
  // and which are inactive. This is more robust than inferring one from the other.
  const nomsActive: string[] = [];
  const nomsInactive: string[] = [];

  for (const { exposure, nomineeId } of nominationsInfo) {
    // A nominator is active for a validator if their stashId appears in the validator's `others` list (their list of nominators).
    if (exposure?.others.some(({ who }) => who.eq(stashId))) {
      nomsActive.push(nomineeId);
    } else {
      nomsInactive.push(nomineeId);
    }
  }

  // NOTE: The 'nomsAtRisk' category is the modern equivalent of the legacy 'nomsChilled' status.
  // A validator is "at risk" if they have a pending (unapplied) slash against them.
  const nomsAtRisk = nominationsInfo.map(({ nomineeId }) => nomineeId).filter((nominee) => atRiskSet.has(nominee));

  // A validator is "oversubscribed" for this nominator if they are active, but the nominator's stake
  // is not high enough to be in the top 'max' nominators for that validator.
  const nomsOver = nominationsInfo
    .filter(({ nomineeId }) => nomsActive.includes(nomineeId)) // Only active validators can be oversubscribed.
    .filter(({ exposure }) => {
      const isStashInTop = exposure?.others
        .sort((a, b) => (b.value.unwrap()).cmp(a.value.unwrap()))
        .slice(0, max.toNumber())
        .some(({ who }) => who.eq(stashId));

      return !isStashInTop;
    })
    .map(({ nomineeId }) => nomineeId);

  // Handle the special case where nominations were submitted in the current era.
  // In this situation, they cannot be active or inactive yet; they are all "waiting" for the next era.
  if (submittedIn.eq(activeEra)) {
    const allNominees = nominationsInfo.map(({ nomineeId }) => nomineeId);

    return {
      nomsActive: [],
      nomsAtRisk,
      nomsInactive: [],
      nomsOver: [],
      nomsWaiting: allNominees.filter((n) => !atRiskSet.has(n))
    };
  }

  // Refine the base lists into the final categories, ensuring no validator appears in multiple lists.
  const finalNomsActive = nomsActive.filter((n) => !atRiskSet.has(n) && !nomsOver.includes(n));
  const nomsWaiting = nomsInactive.filter((n) => !activeValidators[n] && !atRiskSet.has(n));
  const finalNomsInactive = nomsInactive.filter((n) => !nomsWaiting.includes(n) && !atRiskSet.has(n));

  return {
    nomsActive: finalNomsActive,
    nomsAtRisk,
    nomsInactive: finalNomsInactive,
    nomsOver,
    nomsWaiting
  };
}

function useInactivesImpl (stashId: string, nominees?: string[]): Inactives {
  const { ahApi: api } = useStakingAsyncApis();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Inactives>({});

  // The era in which the user last submitted their nominations.
  const [submittedIn, setSubmittedIn] = useState<EraIndex>();

  // A list of the user's nominees who have pending slashes.
  const [unappliedSlashes, setUnappliedSlashes] = useState<string[]>([]);

  const indexes = useCall<DeriveSessionIndexes>(api?.derive.session?.indexes);

  // Fetches the current version of the staking pallet.
  const version = useCall<u16>(api?.query.staking.palletVersion)?.toNumber();
  const eraExposure = useCall<DeriveEraExposure>(indexes && api?.derive.staking.eraExposure, [indexes?.activeEra]);

  /**
   * @description Effect for fetching primary chain data.
   * It retrieves the nominator's submission era and all unapplied slashes for the active era.
   */
  useEffect((): () => void => {
    let unsub: (() => void) | undefined;

    if (mountedRef.current && nominees?.length && stashId && indexes) {
      api?.queryMulti<[Option<Nominations>, Option<Vec<UnappliedSlash>>]>(
        [
          [api?.query.staking.nominators, stashId] as QueryableStorageMultiArg<'promise'>,
          [api?.query.staking.unappliedSlashes, [indexes.activeEra, null]]
        ],
        ([optNominators, eraSlashes]) => {
          if (optNominators.isSome) {
            setSubmittedIn(optNominators.unwrap().submittedIn);
          }

          const atRiskSet = new Set<string>();

          if (eraSlashes.isSome) {
            for (const slash of eraSlashes.unwrap()) {
              atRiskSet.add(slash.validator.toString());
            }
          }

          const atRiskNominees = nominees.filter((nominee) => atRiskSet.has(nominee));

          setUnappliedSlashes(atRiskNominees);
        }
      ).then((_unsub) => {
        unsub = _unsub;
      }).catch(console.error);
    }

    return (): void => {
      unsub && unsub();
    };
  }, [api, mountedRef, nominees, stashId, indexes]);

  useEffect(() => {
    if (eraExposure && nominees?.length && submittedIn && version && indexes) {
      const nominationsInfo: NominationInfo[] = nominees.map((nomineeId) => ({
        exposure: eraExposure.validators[nomineeId],
        nomineeId
      }));

      if (mountedRef.current) {
        setState(
          extractState({
            activeEra: indexes.activeEra,
            activeValidators: eraExposure.validators,
            api,
            nominationsInfo,
            stashId,
            submittedIn,
            unappliedSlashes
          })
        );
      }
    }
  }, [api, stashId, nominees, indexes, submittedIn, eraExposure, version, mountedRef, unappliedSlashes]);

  return state;
}

export default createNamedHook('useInactives', useInactivesImpl);
