// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { PalletAssetsAssetBalance } from '@polkadot/types/lookup';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import Transfer from './Transfer';

interface Props {
  accountId: string;
  assetId: BN;
  balance: PalletAssetsAssetBalance;
  className?: string;
  minBalance: BN;
  siFormat: [number, string];
}

function Account ({ accountId, assetId, balance: { balance, isFrozen, sufficient }, className, minBalance, siFormat }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td className='start'>
        {isFrozen.isTrue ? t<string>('Yes') : t<string>('No')}
      </td>
      <td className='start'>
        {sufficient.isTrue ? t<string>('Yes') : t<string>('No')}
      </td>
      <td className='number all'>
        <FormatBalance
          format={siFormat}
          value={balance}
        />
      </td>
      <td className='button'>
        <Transfer
          accountId={accountId}
          assetId={assetId}
          minBalance={minBalance}
          siFormat={siFormat}
        />
      </td>
    </tr>
  );
}

export default React.memo(Account);
