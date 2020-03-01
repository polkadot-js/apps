// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyMember } from '@polkadot/api-derive/types';

import React from 'react';
import { AddressSmall } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  value: DeriveSocietyMember;
}

export default function Member ({ value: { accountId, strikes } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr>
      <td className='top'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number top'>
        <label>{t('strikes')}</label>
        {strikes.toString()}
      </td>
    </tr>
  );
}
