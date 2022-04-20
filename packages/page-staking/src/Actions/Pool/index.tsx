// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PoolInfoExists } from '../../Pools/types';

import React from 'react';

import usePoolInfo from '../../Pools/usePoolInfo';
import Account from './Account';

interface Props {
  accounts: string[];
  className?: string;
  id: BN;
}

function Pool ({ accounts, className, id }: Props): React.ReactElement<Props> | null {
  const info = usePoolInfo(id);

  if (!info || !info.bonded) {
    return null;
  }

  return (
    <>
      {accounts.map((accountId) => (
        <Account
          accountId={accountId}
          className={className}
          id={id}
          info={info as PoolInfoExists}
          key={`${id.toString()}:${accountId}`}
        />
      ))}
    </>
  );
}

export default React.memo(Pool);
