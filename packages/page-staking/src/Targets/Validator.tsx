// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ValidatorInfo } from '../types';

import React, { useCallback } from 'react';
import { AddressSmall, Icon, Toggle } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import MaxBadge from '../MaxBadge';
import Favorite from '../Overview/Address/Favorite';

interface Props {
  canSelect: boolean;
  info: ValidatorInfo;
  isSelected: boolean;
  toggleFavorite: (accountId: string) => void;
  toggleSelected: (accountId: string) => void;
}

function Validator ({ canSelect, info: { accountId, bondOther, bondOwn, bondTotal, commissionPer, isCommission, isFavorite, isNominating, key, numNominators, rankOverall, rewardPayout, validatorPayment }, isSelected, toggleFavorite, toggleSelected }: Props): React.ReactElement<Props> {
  const _onQueryStats = useCallback(
    (): void => {
      window.location.hash = `/staking/query/${key}`;
    },
    [key]
  );

  const _toggleSelected = useCallback(
    () => toggleSelected(key),
    [key, toggleSelected]
  );

  return (
    <tr className={`${isNominating ? 'isHighlight' : ''}`}>
      <Favorite
        address={key}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
      <td className='badge'>
        <MaxBadge numNominators={numNominators} />
      </td>
      <td className='number'>{formatNumber(rankOverall)}</td>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number'>
        {
          isCommission
            ? `${commissionPer.toFixed(2)}%`
            : <FormatBalance value={validatorPayment} />
        }
      </td>
      <td className='number together'><FormatBalance value={bondTotal} /></td>
      <td className='number together'><FormatBalance value={bondOwn} /></td>
      <td className='number together'>
        <FormatBalance
          labelPost={` (${numNominators})`}
          value={bondOther}
        />
      </td>
      <td className='number together'><FormatBalance value={rewardPayout} /></td>
      <td>
        {(canSelect || isSelected) && (
          <Toggle
            asSwitch={false}
            onChange={_toggleSelected}
            value={isSelected}
          />
        )}
      </td>
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

export default React.memo(Validator);
