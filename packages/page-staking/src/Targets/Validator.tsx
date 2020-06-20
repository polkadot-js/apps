// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { ValidatorInfo } from '../types';

import React, { useCallback, useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { AddressSmall, Icon, Toggle } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';

import MaxBadge from '../MaxBadge';
import Favorite from '../Overview/Address/Favorite';

interface Props {
  canSelect: boolean;
  info: ValidatorInfo;
  isSelected: boolean;
  toggleFavorite: (accountId: string) => void;
  toggleSelected: (accountId: string) => void;
  withoutName: boolean;
}

function checkVisibility (api: ApiPromise, accountInfo: DeriveAccountInfo): boolean {
  let isVisible = false;

  const { accountId, identity, nickname } = accountInfo;

  if (api.query.identity && api.query.identity.identityOf) {
    isVisible = !!(identity?.display && identity.display.toString());
  } else if (nickname) {
    isVisible = !!nickname.toString();
  }

  if (!isVisible && accountId) {
    const account = keyring.getAddress(accountId.toString());

    isVisible = !!account?.meta?.name;
  }

  return isVisible;
}

function Validator ({ canSelect, info, isSelected, toggleFavorite, toggleSelected, withoutName }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, [info.accountId]);
  const [hasName, setHasName] = useState(true);

  useEffect((): void => {
    if (accountInfo) {
      const hasIdentity = checkVisibility(api, accountInfo);

      info.hasIdentity = hasIdentity;
      setHasName(hasIdentity);
    }
  }, [accountInfo, api, info]);

  const _onQueryStats = useCallback(
    (): void => {
      window.location.hash = `/staking/query/${info.key}`;
    },
    [info.key]
  );

  const _toggleSelected = useCallback(
    () => toggleSelected(info.key),
    [info.key, toggleSelected]
  );

  if (!hasName && !withoutName) {
    return null;
  }

  const { accountId, bondOther, bondOwn, bondTotal, commissionPer, isCommission, isFavorite, isNominating, key, numNominators, rankOverall, rewardPayout, validatorPayment } = info;

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
      <td className='number'>{numNominators || ''}</td>
      <td className='number'>
        {
          isCommission
            ? `${commissionPer.toFixed(2)}%`
            : <FormatBalance value={validatorPayment} />
        }
      </td>
      <td className='number together'>{!bondTotal.isZero() && <FormatBalance value={bondTotal} />}</td>
      <td className='number together'>{!bondOwn.isZero() && <FormatBalance value={bondOwn} />}</td>
      <td className='number together'>
        {!bondOther.isZero() && (
          <FormatBalance
            labelPost={` (${numNominators})`}
            value={bondOther}
          />
        )}
      </td>
      <td className='number together'>{!rewardPayout.isZero() && <FormatBalance value={rewardPayout} />}</td>
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
