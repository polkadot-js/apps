// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import Voters from './Voters';

interface Props {
  className?: string;
  address: AccountId;
  balance?: Balance;
  isPrime?: boolean;
  voters?: AccountId[];
}

function Candidate ({ className, address, balance, isPrime, voters }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={`${className} ${isPrime ? 'council--isPrime' : ''}`}>
      <td className='top'>
        <AddressSmall value={address} />
      </td>
      <td className='top council--prime'>
        {isPrime && t('prime voter')}
      </td>
      <td className='top together right'>
        {balance && balance.gtn(0) && (
          <FormatBalance label={<label>{t('backing')}</label>} value={balance} />
        )}
      </td>
      <td className='all'>
        {voters && voters.length !== 0 && (
          <Voters voters={voters} />
        )}
      </td>
    </tr>
  );
}

export default styled(Candidate)`
  &.council--isPrime {
    td {
      background-color: rgba(239, 255, 239, 0.8) !important;
    }
  }

  .council--prime {
    white-space: nowrap;
    color: green;
  }
`;
