// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { u32 } from '@polkadot/types';
import type { PoolInfoExists } from '../../Pools/types';
import type { SortedTargets } from '../../types';

import React, { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { stringToU8a, u8aConcat } from '@polkadot/util';

import usePoolInfo from '../../Pools/usePoolInfo';
import Account from './Account';

interface Props {
  accounts: string[];
  className?: string;
  id: u32;
  targets: SortedTargets;
}

const POOL_PREFIX = stringToU8a('modlpy/npols\0');
const EMPTY_H256 = new Uint8Array(32);

function Pool ({ accounts, className, id, targets }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const info = usePoolInfo(id);

  const stashId = useMemo(
    () => api.registry.createType('AccountId', u8aConcat(POOL_PREFIX, id.toU8a(), EMPTY_H256)).toString(),
    [api, id]
  );

  const stakingInfo = useCall<DeriveStakingAccount>(api.derive.staking.account, [stashId]);

  if (!info || !info.bonded) {
    return null;
  }

  return (
    <>
      {accounts.map((accountId, index) => (
        <Account
          accountId={accountId}
          className={className}
          id={id}
          info={info as PoolInfoExists}
          key={`${id.toString()}:${accountId}`}
          stakingInfo={stakingInfo}
          stashId={stashId}
          targets={targets}
          withMeta={index === 0}
        />
      ))}
    </>
  );
}

export default React.memo(Pool);
