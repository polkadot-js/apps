// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfoComplete } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { formatNumber } from '@polkadot/util';

import Account from './Account.js';
import useBalances from './useBalances.js';

interface Props {
  asset: AssetInfoComplete,
  className?: string;

}

const Asset = ({ asset: { details, id, metadata }, className }: Props) => {
  const balances = useBalances(id);

  const siFormat = useMemo(
    (): [number, string] => metadata
      ? [metadata.decimals.toNumber(), metadata.symbol.toUtf8().toUpperCase()]
      : [0, 'NONE'],
    [metadata]
  );

  if (!balances?.length) {
    return <></>;
  }

  return (
    <tr className={className}>
      <td className='all'>
        {metadata.name.toUtf8()} ({formatNumber(id)})
      </td>
      <tr>
        {balances?.map(({ account, accountId }) => (
          <Account
            account={account}
            accountId={accountId}
            assetId={id}
            key={accountId}
            minBalance={details.minBalance}
            siFormat={siFormat}
          />
        ))}
      </tr>
    </tr>
  );
};

export default Asset;
