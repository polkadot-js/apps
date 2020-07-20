// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';
import { DeriveAccountInfo, DeriveStakingQuery } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { AddressSmall, Icon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { checkVisibility } from '../../util';
import Favorite from './Favorite';
import NominatedBy from './NominatedBy';
import Status from './Status';
import StakeOther from './StakeOther';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  hasQueries: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isMain?: boolean;
  lastBlock?: string;
  nominatedBy?: [string, number][];
  onlineCount?: false | number;
  onlineMessage?: boolean;
  points?: string;
  toggleFavorite: (accountId: string) => void;
  withIdentity: boolean;
}

interface StakingState {
  commission?: string;
  nominators: [string, Balance][];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

const PERBILL_PERCENT = 10_000_000;

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

function Address ({ address, className = '', filterName, hasQueries, isElected, isFavorite, isMain, lastBlock, nominatedBy, onlineCount, onlineMessage, points, toggleFavorite, withIdentity }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const accountInfo = useCall<DeriveAccountInfo>(api.derive.accounts.info, [address]);
  const stakingInfo = useCall<DeriveStakingQuery>(api.derive.staking.query, [address]);
  const [{ commission, nominators, stakeOther, stakeOwn }, setStakingState] = useState<StakingState>({ nominators: [] });
  const [isVisible, setIsVisible] = useState(true);

  useEffect((): void => {
    stakingInfo && setStakingState(expandInfo(stakingInfo));
  }, [stakingInfo]);

  useEffect((): void => {
    setIsVisible(
      checkVisibility(api, address, filterName, withIdentity, accountInfo)
    );
  }, [api, accountInfo, address, filterName, withIdentity]);

  const _onQueryStats = useCallback(
    (): void => {
      window.location.hash = `/staking/query/${address}`;
    },
    [address]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='badge together'>
        <Favorite
          address={address}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
        <Status
          isElected={isElected}
          numNominators={nominatedBy?.length}
          onlineCount={onlineCount}
          onlineMessage={onlineMessage}
        />
      </td>
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
      {isMain && (
        <>
          <td className='number'>
            {points}
          </td>
          <td className='number'>
            {lastBlock}
          </td>
        </>
      )}
      <td>
        {hasQueries && (
          <Icon
            icon='chart-line'
            onClick={_onQueryStats}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Address);
