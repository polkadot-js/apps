// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import { useApi } from '@polkadot/react-hooks/useApi';
import { useCall } from '@polkadot/react-hooks/useCall';
import { BN_MILLION, BN_ZERO, stringToU8a } from '@polkadot/util';

const TREASURY_ACCOUNT = stringToU8a('modlpy/trsry'.padEnd(32, '\0'));

interface Treasury {
  value?: Balance;
  burn?: BN;
  spendPeriod: BN;
}

export function useTreasury (): Treasury {
  const { api } = useApi();

  const [value, setValue] = useState<Balance>();
  const [burn, setBurn] = useState<BN>();

  const treasuryBalance = useCall<DeriveBalancesAccount>(api.derive.balances.account, [TREASURY_ACCOUNT]);
  const spendPeriod = api.consts.treasury ? api.consts.treasury.spendPeriod : BN_ZERO;

  useEffect(() => {
    if (!api.consts.treasury) {
      return;
    }

    setValue(treasuryBalance?.freeBalance.gtn(0)
      ? treasuryBalance.freeBalance
      : undefined);
    setBurn(treasuryBalance?.freeBalance.gtn(0) && !api.consts.treasury.burn.isZero()
      ? api.consts.treasury.burn.mul(treasuryBalance.freeBalance).div(BN_MILLION)
      : BN_ZERO);
  }, [api, treasuryBalance, spendPeriod]);

  return {
    burn,
    spendPeriod,
    value
  };
}
