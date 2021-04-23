// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetBalance } from '@polkadot/types/interfaces';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  accountId: string;
  balance: AssetBalance;
  className?: string;
  siFormat: [number, string];
}

function Balance ({ accountId, balance: { balance, isFrozen, isSufficient }, className, siFormat }: Props): React.ReactElement<Props> {
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
        {isSufficient.isTrue ? t<string>('Yes') : t<string>('No')}
      </td>
      <td className='number all'>
        <FormatBalance
          format={siFormat}
          value={balance}
        />
      </td>
    </tr>
  );
}

export default React.memo(Balance);
