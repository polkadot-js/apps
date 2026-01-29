// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAccount, DeriveBounties, DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { BN, BN_MILLION, BN_ZERO, u8aConcat } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

const EMPTY_U8A_32 = new Uint8Array(32);

interface Result {
  value?: Balance;
  burn?: BN;
  pendingBounties: BN;
  pendingProposals: BN;
  spendPeriod: BN;
  totalProposals?: number;
  treasuryAccount: Uint8Array;
}

function useTreasuryImpl (): Result {
  const { api } = useApi();
  const [result, setResult] = useState<Result>(() => ({
    pendingBounties: BN_ZERO,
    pendingProposals: BN_ZERO,
    spendPeriod: api.consts.treasury
      ? api.consts.treasury.spendPeriod
      : BN_ZERO,
    treasuryAccount: u8aConcat(
      'modl',
      api.consts.treasury && api.consts.treasury.palletId
        ? api.consts.treasury.palletId.toU8a(true)
        : 'py/trsry',
      EMPTY_U8A_32
    ).subarray(0, 32)
  }));
  const bounties = useCall<DeriveBounties>(api.derive.bounties?.bounties);
  const treasuryProposals = useCall<DeriveTreasuryProposals>(api.derive.treasury.proposals);
  const treasuryBalance = useCall<DeriveBalancesAccount>(api.derive.balances?.account, [result.treasuryAccount]);

  useEffect((): void => {
    treasuryBalance && api.consts.treasury &&
      setResult(({ pendingBounties, pendingProposals, spendPeriod, treasuryAccount }) => ({
        burn: treasuryBalance.freeBalance.gt(BN_ZERO) && !api.consts.treasury.burn.isZero()
          ? api.consts.treasury.burn.mul(treasuryBalance.freeBalance).div(BN_MILLION)
          : BN_ZERO,
        pendingBounties,
        pendingProposals,
        spendPeriod,
        treasuryAccount,
        value: treasuryBalance.freeBalance.gt(BN_ZERO)
          ? treasuryBalance.freeBalance
          : undefined
      }));
  }, [api, treasuryBalance]);

  useEffect((): void => {
    treasuryProposals &&
      setResult((prev) => ({
        ...prev,
        pendingProposals: treasuryProposals.approvals.reduce((total, { proposal: { value } }) =>
          total.iadd(value), new BN(0)
        ),
        totalProposals: treasuryProposals.proposalCount.toNumber()
      }));
  }, [treasuryProposals]);

  useEffect((): void => {
    bounties &&
      setResult((prev) => ({
        ...prev,
        pendingBounties: bounties.reduce((total, { bounty: { status, value } }) =>
          total.iadd(status.isApproved ? value : BN_ZERO), new BN(0)
        )
      }));
  }, [bounties]);

  return result;
}

export const useTreasury = createNamedHook('useTreasury', useTreasuryImpl);
