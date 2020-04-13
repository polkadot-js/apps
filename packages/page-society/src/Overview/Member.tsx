// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyMember } from '@polkadot/api-derive/types';

import React from 'react';
import { AddressSmall, Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isHead?: boolean;
  value: DeriveSocietyMember;
}

function Member ({ className, isHead, value: { accountId, strikes } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td>
        {isHead && (
          <Tag
            color='green'
            hover={t('Current society head, exempt')}
            label={t('society head')}
          />
        )}
      </td>
      <td className='all'>&nbsp;</td>
      <td className='number top'>
        {strikes.toString()}
      </td>
    </tr>
  );
}

export default React.memo(Member);
