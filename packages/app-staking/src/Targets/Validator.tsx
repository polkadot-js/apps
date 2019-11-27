// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.v

import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorInfo } from './types';

import React from 'react';
import { AddressMini, Icon } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  info: ValidatorInfo;
  toggleFavorite: (accountId: string) => void;
}

function Validator ({ info: { accountId, bondOther, bondOwn, bondTotal, commission, isFavorite, key, numNominators, rankOverall, rewardPayout }, toggleFavorite }: Props): React.ReactElement<Props> {
  const _onFavorite = (): void => toggleFavorite(key);
  const _onQueryStats = (): void => {
    window.location.hash = `/staking/query/${key}`;
  };

  return (
    <tr>
      <td>
        <Icon
          className={`favorite ${isFavorite && 'isSelected'}`}
          name={isFavorite ? 'star' : 'star outline'}
          onClick={_onFavorite}
        />
      </td>
      <td className='number'>{formatNumber(rankOverall)}</td>
      <td className='address'><AddressMini value={accountId} /></td>
      <td className='number'><FormatBalance value={commission} /></td>
      <td className='number'>{formatNumber(numNominators)}</td>
      <td className='number'><FormatBalance value={bondTotal} /></td>
      <td className='number'><FormatBalance value={bondOwn} /></td>
      <td className='number'><FormatBalance value={bondOther} /></td>
      <td className='number'><FormatBalance value={rewardPayout} /></td>
      <td>
        <Icon
          className='staking--stats'
          name='line graph'
          onClick={_onQueryStats}
        />
      </td>
    </tr>
  );
}

export default translate(Validator);
