// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { ValidatorInfo } from '../types';

import React, { useCallback, useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { AddressSmall, Badge, Checkbox, Icon } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';

import MaxBadge from '../MaxBadge';
import Favorite from '../Overview/Address/Favorite';
import { checkVisibility } from '../util';

interface Props {
  canSelect: boolean;
  filterName: string;
  info: ValidatorInfo;
  isNominated: boolean;
  isSelected: boolean;
  toggleFavorite: (accountId: string) => void;
  toggleSelected: (accountId: string) => void;
  withElected: boolean;
  withIdentity: boolean;
}

function checkIdentity (api: ApiPromise, accountInfo: DeriveAccountInfo): boolean {
  let hasIdentity = false;

  const { accountId, identity, nickname } = accountInfo;

  if (api.query.identity && api.query.identity.identityOf) {
    hasIdentity = !!(identity?.display && identity.display.toString());
  } else if (nickname) {
    hasIdentity = !!nickname.toString();
  }

  if (!hasIdentity && accountId) {
    const account = keyring.getAddress(accountId.toString());

    hasIdentity = !!account?.meta?.name;
  }

  return hasIdentity;
}

function Validator ({ canSelect, filterName, info, isNominated, isSelected, toggleFavorite, toggleSelected, withElected, withIdentity }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, [info.accountId]);
  const [isVisible, setVisibility] = useState(true);

  useEffect((): void => {
    if (accountInfo) {
      info.hasIdentity = checkIdentity(api, accountInfo);
      setVisibility(checkVisibility(api, info.key, filterName, withIdentity, accountInfo));
    }
  }, [accountInfo, api, filterName, info, withIdentity]);

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

  if (!isVisible || (withElected && !info.isElected)) {
    return null;
  }

  const { accountId, bondOther, bondOwn, bondTotal, commissionPer, isCommission, isElected, isFavorite, key, numNominators, rankOverall, rewardPayout, validatorPayment } = info;

  return (
    <tr>
      <td className='badge together'>
        <Favorite
          address={key}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
        {isNominated
          ? (
            <Badge
              color='green'
              icon='hand-paper'
            />
          )
          : <Badge color='transparent' />
        }
        {isElected
          ? (
            <Badge
              color='blue'
              icon='chevron-right'
            />
          )
          : <Badge color='transparent' />
        }
        <MaxBadge numNominators={numNominators} />
      </td>
      <td className='number'>{formatNumber(rankOverall)}</td>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number ui--media-1200'>{numNominators || ''}</td>
      <td className='number'>
        {
          isCommission
            ? `${commissionPer.toFixed(2)}%`
            : <FormatBalance value={validatorPayment} />
        }
      </td>
      <td className='number together'>{!bondTotal.isZero() && <FormatBalance value={bondTotal} />}</td>
      <td className='number together'>{!bondOwn.isZero() && <FormatBalance value={bondOwn} />}</td>
      <td className='number together ui--media-1600'>{!bondOther.isZero() && <FormatBalance value={bondOther} />}</td>
      <td className='number together'>{!rewardPayout.isZero() && <FormatBalance value={rewardPayout} />}</td>
      <td>
        {(canSelect || isSelected) && (
          <Checkbox
            onChange={_toggleSelected}
            value={isSelected}
          />
        )}
      </td>
      <td>
        <Icon
          className='staking--stats'
          icon='chart-line'
          onClick={_onQueryStats}
        />
      </td>
    </tr>
  );
}

export default React.memo(Validator);
