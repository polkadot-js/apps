// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';
import { DeriveAccountInfo, DeriveStakingQuery } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import ApiPromise from '@polkadot/api/promise';
import { AddressSmall, Icon } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import keyring from '@polkadot/ui-keyring';

import Favorite from './Favorite';
import NominatedBy from './NominatedBy';
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
  nominatedBy?: [string, number][];
  onlineCount?: false | number;
  onlineMessage?: boolean;
  points?: string;
  setNominators?: false | ((nominators: string[]) => void);
  toggleFavorite: (accountId: string) => void;
}

interface StakingState {
  commission?: string;
  nominators: [string, Balance][];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

/* stylelint-disable */
const PERBILL_PERCENT = 10_000_000;
/* stylelint-enable */

function expandInfo ({ exposure, validatorPrefs }: DeriveStakingQuery): StakingState {
  let nominators: [string, Balance][] = [];
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;

  if (exposure) {
    nominators = exposure.others.map(({ value, who }): [string, Balance] => [who.toString(), value.unwrap()]);
    stakeTotal = exposure.total.unwrap();
    stakeOwn = exposure.own.unwrap();
    stakeOther = stakeTotal.sub(stakeOwn);
  }

  const commission = validatorPrefs?.commission?.unwrap();

  return {
    commission: commission
      ? `${(commission.toNumber() / PERBILL_PERCENT).toFixed(2)}%`
      : undefined,
    nominators,
    stakeOther,
    stakeOwn,
    stakeTotal
  };
}

function checkVisibility (api: ApiPromise, address: string, filterName: string, accountInfo?: DeriveAccountInfo): boolean {
  let isVisible = false;
  const filterLower = filterName.toLowerCase();

  if (filterLower) {
    if (accountInfo) {
      const { accountId, accountIndex, identity, nickname } = accountInfo;

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

function Address ({ address, className, filterName, hasQueries, isAuthor, isElected, isFavorite, isMain, lastBlock, nominatedBy, onlineCount, onlineMessage, points, setNominators, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const accountInfo = useCall<DeriveAccountInfo>(isMain && api.derive.accounts.info, [address]);
  const stakingInfo = useCall<DeriveStakingQuery>(api.derive.staking.query, [address]);
  const [{ commission, nominators, stakeOther, stakeOwn }, setStakingState] = useState<StakingState>({ nominators: [] });
  const [isVisible, setIsVisible] = useState(true);
  const [isNominating, setIsNominating] = useState(false);

  useEffect((): void => {
    if (stakingInfo) {
      const info = expandInfo(stakingInfo);

      setNominators && setNominators(info.nominators.map(([who]): string => who.toString()));
      setStakingState(info);
    }
  }, [setNominators, stakingInfo]);

  useEffect((): void => {
    setIsVisible(
      checkVisibility(api, address, filterName, accountInfo)
    );
  }, [api, accountInfo, address, filterName]);

  useEffect((): void => {
    !isMain && setIsNominating(
      allAccounts.includes(address) ||
      (nominatedBy || []).some(([address]) => allAccounts.includes(address))
    );
  }, [address, allAccounts, isMain, nominatedBy]);

  const _onQueryStats = useCallback(
    (): void => {
      window.location.hash = `/staking/query/${address}`;
    },
    [address]
  );

  return (
    <tr className={`${className} ${(isAuthor || isNominating) && 'isHighlight'} ${!isVisible && 'staking--hidden'}`}>
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
      {isMain
        ? (
          <StakeOther
            nominators={nominators}
            stakeOther={stakeOther}
          />
        )
        : <NominatedBy nominators={nominatedBy} />
      }
      <td className='number'>
        {stakeOwn?.gtn(0) && (
          <FormatBalance value={stakeOwn} />
        )}
      </td>
      <td className='number'>
        {commission}
      </td>
      <td className='number'>
        {points}
      </td>
      <td className='number'>
        {lastBlock}
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
