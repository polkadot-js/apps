// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Bid } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  value: Bid;
}

export default function BidRow ({ value: { who, kind, value } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr>
      <td className='top'>
        <AddressSmall value={who} />
      </td>
      <td className='number top'>
        <label>{t('kind')}</label>
        {kind.type}
      </td>
      <td className='number top'>
        <FormatBalance
          label={<label>{t('value')}</label>}
          value={value}
        />
      </td>
    </tr>
  );
}
