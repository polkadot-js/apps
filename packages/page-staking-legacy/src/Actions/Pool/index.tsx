// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { u32 } from '@polkadot/types';
import type { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup';
import type { SortedTargets } from '../../types.js';

import React from 'react';

import usePoolInfo from '@polkadot/app-staking2/Pools/usePoolInfo';

import Account from './Account.js';

interface Props {
  count: number;
  className?: string;
  members: Record<string, PalletNominationPoolsPoolMember>;
  poolId: u32;
  sessionProgress?: DeriveSessionProgress;
  targets: SortedTargets;
}

function Pool ({ className, count, members, poolId, sessionProgress, targets }: Props): React.ReactElement<Props> | null {
  const info = usePoolInfo(poolId);

  if (!info) {
    return null;
  }

  return (
    <>
      {Object.keys(members).map((accountId, index) => (
        <Account
          accountId={accountId}
          className={`${className || ''} ${count % 2 ? 'isEven' : 'isOdd'}`}
          info={info}
          isFirst={index === 0}
          key={`${poolId.toString()}:${accountId}`}
          poolId={poolId}
          sessionProgress={sessionProgress}
          targets={targets}
        />
      ))}
    </>
  );
}

export default React.memo(Pool);
