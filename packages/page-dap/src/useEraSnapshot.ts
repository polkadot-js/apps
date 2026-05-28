// Copyright 2017-2026 @polkadot/app-dap authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Runtime-specific types are not augmented into polkadot-js typings for this
// runtime, so unavoidable `any` use is disabled file-wide.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

import type { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { useApi, useCall, useCallMulti, useViewFunction } from '@polkadot/react-hooks';

export interface PotSnapshot {
  /** Pot account — undefined until the view function resolves. */
  account?: string;
  /** Era-scoped budget set at snapshot time; undefined before the era has run. */
  budget?: BN;
  /** Current pot balance; decreases as validators claim rewards. */
  remaining?: BN;
}

export interface EraSnapshot {
  era: number;
  incentive: PotSnapshot;
  /** True when this era is the currently active one. */
  isCurrent: boolean;
  /**
   * True when this era has completed and a newer era is active. Ended eras
   * whose pot balance we can't subscribe to can fall back to `remaining = budget`
   * safely for display, since no further spending will happen.
   */
  isEnded: boolean;
  staker: PotSnapshot;
  totalStake?: BN;
}

function eraPotArgs (era: number, kind: 'StakerRewards' | 'ValidatorSelfStake'): readonly unknown[] {
  return [{ Era: [era, kind] }];
}

/**
 * Snapshot of per-era reward state for a single era index.
 *
 * Combines:
 *   - `staking.pot_account(Era(era, kind))` view fn   → pot account
 *   - `staking.erasValidatorReward(era)` storage      → staker budget
 *   - `staking.erasValidatorIncentiveBudget(era)`     → incentive budget
 *   - `staking.erasTotalStake(era)`                   → era-wide stake context
 *   - live `system.account` subscription on each pot  → remaining balance
 */
export function useEraSnapshot (era: number | undefined, currentEra: number | undefined): EraSnapshot | undefined {
  const { api } = useApi();

  const stakerArgs = useMemo(() => era !== undefined ? eraPotArgs(era, 'StakerRewards') : undefined, [era]);
  const incentiveArgs = useMemo(() => era !== undefined ? eraPotArgs(era, 'ValidatorSelfStake') : undefined, [era]);

  // When `era` is undefined the hook still runs (rules of hooks), but we pass
  // `args: undefined` to signal "skip" — `useViewFunction` bails instead of
  // trying to encode zero args against a one-arg signature.
  const stakerPotResult = useViewFunction('Staking', 'pot_account', { args: stakerArgs });
  const incentivePotResult = useViewFunction('Staking', 'pot_account', { args: incentiveArgs });

  const stakerBudgetOpt = useCall<any>(
    era !== undefined && api.query.staking?.erasValidatorReward,
    [era]
  );
  const incentiveBudget = useCall<any>(
    era !== undefined && api.query.staking?.erasValidatorIncentiveBudget,
    [era]
  );
  const totalStake = useCall<any>(
    era !== undefined && api.query.staking?.erasTotalStake,
    [era]
  );

  const stakerAccount = stakerPotResult?.toString();
  const incentiveAccount = incentivePotResult?.toString();

  // Subscribe to both pot balances in one queryMulti so they update atomically
  // as claims land. Memoize the query tuple to avoid a fresh reference every
  // render; skip until both accounts are known.
  const balanceQueries = useMemo(
    () => (stakerAccount && incentiveAccount && api.query.system?.account)
      ? [
        [api.query.system.account, stakerAccount] as [typeof api.query.system.account, string],
        [api.query.system.account, incentiveAccount] as [typeof api.query.system.account, string]
      ]
      : null,
    [stakerAccount, incentiveAccount, api]
  );

  const balances = useCallMulti<FrameSystemAccountInfo[]>(balanceQueries);

  return useMemo((): EraSnapshot | undefined => {
    if (era === undefined) {
      return undefined;
    }

    const stakerBudget = stakerBudgetOpt && !stakerBudgetOpt.isNone
      ? (stakerBudgetOpt.unwrap().toBn() as BN)
      : undefined;

    const incentiveBudgetBn = incentiveBudget ? (incentiveBudget.toBn() as BN) : undefined;
    const totalStakeBn = totalStake ? (totalStake.toBn() as BN) : undefined;

    const stakerRemaining = balances?.[0]?.data?.free;
    const incentiveRemaining = balances?.[1]?.data?.free;

    return {
      era,
      incentive: {
        account: incentiveAccount,
        budget: incentiveBudgetBn,
        remaining: incentiveRemaining
      },
      isCurrent: currentEra !== undefined && era === currentEra,
      isEnded: currentEra !== undefined && era < currentEra,
      staker: {
        account: stakerAccount,
        budget: stakerBudget,
        remaining: stakerRemaining
      },
      totalStake: totalStakeBn
    };
  }, [balances, currentEra, era, incentiveAccount, incentiveBudget, stakerAccount, stakerBudgetOpt, totalStake]);
}
