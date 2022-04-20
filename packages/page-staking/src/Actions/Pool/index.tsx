// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { u32 } from '@polkadot/types';
import type { PalletNominationPoolsDelegator } from '@polkadot/types/lookup';
import type { SortedTargets } from '../../types';

import React, { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { stringToU8a, u8aConcat } from '@polkadot/util';

import usePoolInfo from '../../Pools/usePoolInfo';
import Account from './Account';

interface Props {
  accounts: Record<string, PalletNominationPoolsDelegator>;
  count: number;
  className?: string;
  poolId: u32;
  targets: SortedTargets;
}

const POOL_PREFIX = stringToU8a('modlpy/npols\0');
const EMPTY_H256 = new Uint8Array(32);

function Pool ({ accounts, className, count, poolId, targets }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const info = usePoolInfo(poolId);

  const stashId = useMemo(
    () => api.registry.createType('AccountId', u8aConcat(POOL_PREFIX, poolId.toU8a(), EMPTY_H256)).toString(),
    [api, poolId]
  );

  const stakingInfo = useCall<DeriveStakingAccount>(api.derive.staking.account, [stashId]);

  if (!info) {
    return null;
  }

  return (
    <>
      {Object.entries(accounts).map(([accountId], index) => (
        <Account
          accountId={accountId}
          className={`${className || ''} ${count % 2 ? 'isEven' : 'isOdd'}`}
          info={info}
          isFirst={index === 0}
          key={`${poolId.toString()}:${accountId}`}
          poolId={poolId}
          stakingInfo={stakingInfo}
          stashId={stashId}
          targets={targets}
        />
      ))}
    </>
  );
}

export default React.memo(Pool);
