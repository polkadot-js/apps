// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyMember } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import { AddressSmall, Badge, Icon } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isHead?: boolean;
  value: DeriveSocietyMember;
}

function Member ({ className, isHead, value: { accountId, strikes } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={`${className} ${isHead && 'society--isHead'}`}>
      <td className='top padtop'>
        <AddressSmall value={accountId} />
      </td>
      <td className='society--head'>
        {isHead && (
          <div>
            <Badge
              hover={t('Current head')}
              info={<Icon name='chess king' />}
              isInline
              isTooltip
              type='green'
            />
            <span>&nbsp;{t('society head')}</span>
          </div>
        )}
      </td>
      <td className='number top'>
        <label>{t('strikes')}</label>
        {strikes.toString()}
      </td>
    </tr>
  );
}

export default React.memo(styled(Member)`
  &.society--isHead {
    td {
      background-color: rgba(239, 255, 239, 0.8) !important;
    }
  }

  .society--head > div {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;

    > span {
      color: green;
    }
  }
`);
