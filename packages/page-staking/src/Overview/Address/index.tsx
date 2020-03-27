// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';
import { DeriveAccountInfo, DerivedStakingQuery } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import ApiPromise from '@polkadot/api/promise';
import { AddressSmall, Icon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import keyring from '@polkadot/ui-keyring';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';
import Favorite from './Favorite';
import Status from './Status';
import StakeOther from './StakeOther';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  hasQueries: boolean;
  isAuthor?: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isMain?: boolean;
  lastBlock?: string;
  onlineCount?: false | number;
  onlineMessage?: boolean;
  points?: false | number;
  setNominators?: false | ((nominators: string[]) => void);
  toggleFavorite: (accountId: string) => void;
  withNominations?: boolean;
}

interface StakingState {
  commission?: string;
  controllerId?: string;
  nominators: [AccountId, Balance][];
  sessionId?: string;
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

function expandInfo ({ controllerId, exposure, nextSessionIds, validatorPrefs }: DerivedStakingQuery, withNominations = true): StakingState {
  const nominators = withNominations && exposure
    ? exposure.others.map(({ who, value }): [AccountId, Balance] => [who, value.unwrap()])
    : [];
  const stakeTotal = (exposure && !exposure.total.isEmpty && exposure.total.unwrap()) || undefined;
  const stakeOwn = (exposure && !exposure.own.isEmpty && exposure.own.unwrap()) || undefined;
  const stakeOther = (stakeTotal && stakeOwn) ? stakeTotal.sub(stakeOwn) : undefined;
  const commission = validatorPrefs?.commission?.unwrap();

  return {
    commission: commission
      ? `${(commission.toNumber() / 10_000_000).toFixed(2)}%`
      : undefined,
    controllerId: controllerId?.toString(),
    nominators,
    sessionId: nextSessionIds && nextSessionIds[0]?.toString(),
    stakeOther,
    stakeOwn,
    stakeTotal
  };
}

function checkVisibility (api: ApiPromise, address: string, filterName: string, info: DeriveAccountInfo | undefined): boolean {
  let isVisible = false;
  const filterLower = filterName.toLowerCase();

  if (filterLower) {
    if (info) {
      const { identity, nickname, accountId, accountIndex } = info;

      if (accountId?.toString().includes(filterName) || accountIndex?.toString().includes(filterName)) {
        isVisible = true;
      } else if (api.query.identity && api.query.identity.identityOf && identity?.display) {
        isVisible = identity.display.toLowerCase().includes(filterLower);
      } else if (nickname) {
        isVisible = nickname.toLowerCase().includes(filterLower);
      }
    }

    if (!isVisible) {
      const account = keyring.getAddress(address);

      isVisible = account?.meta?.name
        ? account.meta.name.toLowerCase().includes(filterLower)
        : false;
    }
  } else {
    isVisible = true;
  }

  return isVisible;
}

function Address ({ address, className, filterName, hasQueries, isAuthor, isElected, isFavorite, isMain, lastBlock, onlineCount, onlineMessage, points, setNominators, toggleFavorite, withNominations }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const info = useCall<DeriveAccountInfo>(api.derive.accounts.info as any, [address]);
  const stakingInfo = useCall<DerivedStakingQuery>(isMain && api.derive.staking.query as any, [address]);
  const [{ commission, nominators, stakeOwn, stakeOther }, setStakingState] = useState<StakingState>({ nominators: [] });
  const [isVisible, setIsVisible] = useState(true);

  useEffect((): void => {
    if (stakingInfo) {
      const info = expandInfo(stakingInfo, withNominations);

      setNominators && setNominators(info.nominators.map(([who]): string => who.toString()));
      setStakingState(info);
    }
  }, [stakingInfo]);

  useEffect((): void => {
    setIsVisible(
      checkVisibility(api, address, filterName, info)
    );
  }, [address, filterName, info]);

  const _onQueryStats = useCallback(
    (): void => {
      window.location.hash = `/staking/query/${address}`;
    },
    [address]
  );

  return (
    <tr className={`${className} ${isAuthor && 'isHighlight'} ${!isVisible && 'staking--hidden'}`}>
      <Favorite
        address={address}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
      <Status
        isElected={isElected}
        onlineCount={onlineCount}
        onlineMessage={onlineMessage}
      />
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td className='top'>
        {stakeOwn && (
          <FormatBalance
            label={<label>{t('own stake')}</label>}
            value={stakeOwn}
          />
        )}
      </td>
      <StakeOther
        nominators={nominators}
        stakeOther={stakeOther}
      />
      <td className='number top'>
        {commission && (
          <><label>{t('commission')}</label>{commission}</>
        )}
      </td>
      <td className='number top'>
        {points && (
          <><label>{t('points')}</label>{formatNumber(points)}</>
        )}
      </td>
      <td className='number top'>
        {lastBlock && (
          <><label>{t('last #')}</label>{lastBlock}</>
        )}
      </td>
      <td>
        {hasQueries && (
          <Icon
            name='line graph'
            onClick={_onQueryStats}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Address);
