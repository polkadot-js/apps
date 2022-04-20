// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { PoolInfoExists } from '../../Pools/types';

import React, { useMemo } from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

// import { useTranslation } from '../../translate';

interface Props {
  accountId: string;
  className?: string;
  id: BN;
  info: PoolInfoExists;
}

function Pool ({ accountId, className, id, info: { bonded: { roles }, metadata } }: Props): React.ReactElement<Props> | null {
  // const { t } = useTranslation();

  const [, isNominator, isRoot] = useMemo(
    () => [
      roles.depositor.eq(accountId),
      roles.nominator.eq(accountId),
      roles.root.eq(accountId),
      roles.stateToggler.eq(accountId)
    ],
    [accountId, roles]
  );

  console.log('accountId: isNominator=', isNominator, ', isRoot=', isRoot);

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='start'>{metadata}</td>
      <td className='address'><AddressSmall value={accountId} /></td>
    </tr>
  );
}

export default React.memo(Pool);
