// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, Balance } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import translate from '../translate';
import Voters from './Voters';

interface Props extends I18nProps {
  address: AccountId;
  balance?: Balance;
  voters?: AccountId[];
}

function Candidate ({ address, balance, t, voters }: Props): React.ReactElement<Props> {
  return (
    <tr>
      <td className='top'>
        <AddressSmall value={address} />
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

export default translate(Candidate);
