// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

// augment package
import '@polkadot/api-augment/substrate';

import type { PalletAssetsAssetAccount } from '@polkadot/types/lookup';
import type { bool } from '@polkadot/types-codec';
import type { BN } from '@polkadot/util';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate.js';
import Transfer from './Transfer.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This looks correct in the editor, but incorrect in composite mode
interface AccountExt extends PalletAssetsAssetAccount {
  isFrozen?: bool;
  sufficient?: bool
}

interface Props {
  account: AccountExt;
  accountId: string;
  assetId: BN;
  className?: string;
  minBalance: BN;
  siFormat: [number, string];
}

function Account ({ account: { balance, isFrozen, reason, sufficient }, accountId, assetId, minBalance, siFormat }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td className='start'>
        {isFrozen?.isTrue ? t('Yes') : t('No')}
      </td>
      <td className='start'>
        {sufficient
          ? sufficient.isTrue ? t('Yes') : t('No')
          : reason?.toString()}
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
    </>
  );
}

export default React.memo(Account);
