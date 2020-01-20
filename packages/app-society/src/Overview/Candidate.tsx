// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyCandidate } from '@polkadot/api-derive/types';

import React from 'react';
import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  value: DeriveSocietyCandidate;
}

export default function Candidate ({ value: { accountId, kind, value } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr>
      <td className='top'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number top'>
        <label>{t('kind')}</label>
        {kind.toString()}
      </td>
      <td className='number top'>
        <FormatBalance
          label={t('value')}
          value={value}
        />
      </td>
    </tr>
  );
}
