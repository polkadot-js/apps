// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { u32 } from '@polkadot/types';
import type { PalletNominationPoolsDelegator } from '@polkadot/types/lookup';
import type { SortedTargets } from '../../types';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import usePoolInfo from '../../Pools/usePoolInfo';
import Account from './Account';

interface Props {
  count: number;
  className?: string;
  members: Record<string, PalletNominationPoolsDelegator>;
  poolId: u32;
  targets: SortedTargets;
}

function Pool ({ className, count, members, poolId, targets }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const info = usePoolInfo(poolId);

  const stakingInfo = useCall<DeriveStakingAccount>(info && api.derive.staking.account, [info?.accountStash]);

  if (!info) {
    return null;
  }

  return (
    <>
      {Object.entries(members).map(([accountId], index) => (
        <Account
          accountId={accountId}
          className={`${className || ''} ${count % 2 ? 'isEven' : 'isOdd'}`}
          info={info}
          isFirst={index === 0}
          key={`${poolId.toString()}:${accountId}`}
          poolId={poolId}
          stakingInfo={stakingInfo}
          stashId={info.accountStash.toString()}
          targets={targets}
        />
      ))}
    </>
  );
}

export default React.memo(Pool);
