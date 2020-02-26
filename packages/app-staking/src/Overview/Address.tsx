// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, RewardPoint } from '@polkadot/types/interfaces';
import { DeriveAccountInfo, DerivedStakingQuery, DerivedHeartbeatAuthor } from '@polkadot/api-derive/types';
import { ValidatorFilter } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import ApiPromise from '@polkadot/api/promise';
import { AddressMini, AddressSmall, Badge, Icon } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import keyring from '@polkadot/ui-keyring';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  address: string;
  className?: string;
  defaultName: string;
  filter: ValidatorFilter;
  filterName: string;
  hasQueries: boolean;
  heartbeat?: DerivedHeartbeatAuthor;
  isAuthor?: boolean;
  isElected: boolean;
  isFavorite: boolean;
  lastBlock?: string;
  myAccounts: string[];
  points?: RewardPoint;
  setNominators?: (nominators: string[]) => void;
  toggleFavorite: (accountId: string) => void;
  withNominations?: boolean;
}

interface StakingState {
  commission?: string;
  controllerId?: string;
  hasNominators: boolean;
  isNominatorMe: boolean;
  nominators: [AccountId, Balance][];
  sessionId?: string;
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

function expandInfo ({ controllerId, exposure, nextSessionIds, validatorPrefs }: DerivedStakingQuery, myAccounts: string[], withNominations = true): StakingState {
  const nominators = withNominations && exposure
    ? exposure.others.map(({ who, value }): [AccountId, Balance] => [who, value.unwrap()])
    : [];
  const stakeTotal = (exposure && !exposure.total.isEmpty && exposure.total.unwrap()) || undefined;
  const stakeOwn = (exposure && !exposure.own.isEmpty && exposure.own.unwrap()) || undefined;
  const stakeOther = (stakeTotal && stakeOwn) ? stakeTotal.sub(stakeOwn) : undefined;
  const commission = validatorPrefs?.commission?.unwrap();

  return {
    commission: commission
      ? `${(commission.toNumber() / 10000000).toFixed(2)}%`
      : undefined,
    controllerId: controllerId?.toString(),
    hasNominators: nominators.length !== 0,
    isNominatorMe: nominators.some(([who]): boolean =>
      myAccounts.includes(who.toString())
    ),
    nominators,
    sessionId: nextSessionIds && nextSessionIds[0]?.toString(),
    stakeOther,
    stakeOwn,
    stakeTotal
  };
}

function checkFilter (filter: string, hasNominators: boolean, isElected: boolean, isNominatorMe: boolean, heartbeat?: DerivedHeartbeatAuthor): boolean {
  return (filter === 'hasNominators' && !hasNominators) ||
    (filter === 'noNominators' && hasNominators) ||
    (filter === 'hasWarnings' && heartbeat?.isOnline) ||
    (filter === 'noWarnings' && !heartbeat?.isOnline) ||
    (filter === 'iNominated' && !isNominatorMe) ||
    (filter === 'nextSet' && !isElected);
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

export default function Address ({ address, className, filter, filterName, hasQueries, heartbeat, isAuthor, isElected, isFavorite, lastBlock, myAccounts, points, setNominators, toggleFavorite, withNominations }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  // FIXME Any horrors, caused by derive type mismatches
  const info = useCall<DeriveAccountInfo>(api.derive.accounts.info as any, [address]);
  const stakingInfo = useCall<DerivedStakingQuery>(api.derive.staking.query as any, [address]);
  const [{ commission, hasNominators, isNominatorMe, nominators, stakeOwn, stakeOther }, setStakingState] = useState<StakingState>({ hasNominators: false, isNominatorMe: false, nominators: [] });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect((): void => {
    if (stakingInfo) {
      const info = expandInfo(stakingInfo, myAccounts, withNominations);

      setNominators && setNominators(info.nominators.map(([who]): string => who.toString()));
      setStakingState(info);
    }
  }, [stakingInfo]);

  useEffect((): void => {
    setIsVisible(
      checkFilter(filter, hasNominators, isElected, isNominatorMe, heartbeat) ||
      checkVisibility(api, address, filterName, info)
    );
  }, [filter, filterName, heartbeat, info, hasNominators, isNominatorMe]);

  const _onFavorite = (): void => toggleFavorite(address);
  const _onQueryStats = (): void => {
    window.location.hash = `/staking/query/${address}`;
  };
  const _toggleNominators = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(!isExpanded);
  };

  return (
    <tr className={`${className} ${isAuthor && 'isHighlight'} ${!isVisible && 'staking--hidden'}`}>
      <td className='favorite'>
        <Icon
          className={`${isFavorite && 'isSelected'}`}
          name={isFavorite ? 'star' : 'star outline'}
          onClick={_onFavorite}
        />
      </td>
      <td className='together'>
        {isElected && (
          <Badge
            hover={t('Selected for the next session')}
            info={<Icon name='chevron right' />}
            isInline
            isTooltip
            type='next'
          />
        )}
        {heartbeat && (heartbeat.blockCount.gtn(0) || heartbeat.hasMessage) && (
          <Badge
            hover={t('Active with {{blocks}} blocks authored{{hasMessage}} heartbeat message', {
              replace: {
                blocks: formatNumber(heartbeat.blockCount),
                hasMessage: heartbeat.hasMessage ? ' and a' : ', no'
              }
            })}
            info={<Icon name='check' />}
            isInline
            isTooltip
            type='online'
          />
        )}
      </td>
      <td>
        <AddressSmall value={address} />
      </td>
      <td className='number'>
        {stakeOwn && (
          <FormatBalance
            label={<label>{t('own stake')}</label>}
            value={stakeOwn}
          />
        )}
      </td>
      <td className={'toggle number'} colSpan={isExpanded ? 5 : 1} onClick={_toggleNominators}>
        {stakeOther?.gtn(0) && (
          isExpanded
            ? (
              <div>
                {nominators.map(([who, bonded]): React.ReactNode =>
                  <AddressMini
                    bonded={bonded}
                    key={who.toString()}
                    value={who}
                    withBonded
                  />
                )}
              </div>
            )
            : (
              <FormatBalance
                label={<label>{t('other stake')}</label>}
                value={stakeOther}
              >
                &nbsp;({formatNumber(nominators.length)})&nbsp;<Icon name='angle double right' />
              </FormatBalance>
            )
        )}
      </td>
      {!isExpanded && (
        <>
          <td className='number'>
            {commission && (
              <><label>{t('commission')}</label>{commission}</>
            )}
          </td>
          <td className='number'>
            {points?.gtn(0) && (
              <><label>{t('points')}</label>{formatNumber(points)}</>
            )}
          </td>
          <td className='number'>
            {lastBlock && (
              <><label>{t('last #')}</label>{lastBlock}</>
            )}
          </td>
          <td>
            {hasQueries && api.query.imOnline?.authoredBlocks && (
              <Icon
                name='line graph'
                onClick={_onQueryStats}
              />
            )}
          </td>
        </>
      )}
    </tr>
  );
}
