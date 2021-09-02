// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Balance } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import { BN_MILLION, BN_ZERO, u8aConcat } from '@polkadot/util';

import { useApi } from './useApi';
import { useCall } from './useCall';

const EMPTY_U8A_32 = new Uint8Array(32);

interface Result {
  value?: Balance;
  burn?: BN;
  spendPeriod: BN;
  treasuryAccount: Uint8Array;
}

export function useTreasury (): Result {
  const { api } = useApi();
  const [result, setResult] = useState<Result>(() => ({
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
  const treasuryBalance = useCall<DeriveBalancesAccount>(api.derive.balances?.account, [result.treasuryAccount]);

  useEffect((): void => {
    treasuryBalance && api.consts.treasury &&
      setResult(({ spendPeriod, treasuryAccount }) => ({
        burn: treasuryBalance.freeBalance.gt(BN_ZERO) && !api.consts.treasury.burn.isZero()
          ? api.consts.treasury.burn.mul(treasuryBalance.freeBalance).div(BN_MILLION)
          : BN_ZERO,
        spendPeriod,
        treasuryAccount,
        value: treasuryBalance.freeBalance.gt(BN_ZERO)
          ? treasuryBalance.freeBalance
          : undefined
      }));
  }, [api, treasuryBalance]);

  return result;
}
