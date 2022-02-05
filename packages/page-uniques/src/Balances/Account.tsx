// Copyright 2017-2022 @polkadot/app-uniquests authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAssetsAssetAccount } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import Transfer from './Transfer';

interface Props {
  account: PalletAssetsAssetAccount;
  accountId: string;
  uniqueId: BN;
}

function Account ({ account: { balance, isFrozen }, accountId, uniqueId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={uniqueId}>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td className='start'>
        {isFrozen.isTrue ? t<string>('Yes') : t<string>('No')}
      </td>
      <td className='number all'>
        <FormatBalance
          value={balance}
        />
      </td>
      <td className='button'>
        <Transfer
          accountId={accountId}
          uniqueId={uniqueId}
        />
      </td>
    </tr>
  );
}

export default React.memo(Account);
