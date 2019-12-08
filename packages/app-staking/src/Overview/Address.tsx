// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, Points, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import { DerivedStaking, DerivedHeartbeats } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorFilter } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressMini, AddressSmall, Badge, Icon } from '@polkadot/react-components';
import { useCall, useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  address: AccountId | string;
  authorsMap: Record<string, string>;
  className?: string;
  defaultName: string;
  filter: ValidatorFilter;
  hasQueries: boolean;
  isElected: boolean;
  isFavorite: boolean;
  lastAuthors?: string[];
  myAccounts: string[];
  points?: Points;
  recentlyOnline?: DerivedHeartbeats;
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
  stashId: string;
  validatorPayment?: BN;
}

function Address ({ address, authorsMap, className, filter, hasQueries, isElected, isFavorite, lastAuthors, myAccounts, points, recentlyOnline, t, toggleFavorite, withNominations = true }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  // FIXME Any horrors, caused by derive type mismatches
  const stakingInfo = useCall<DerivedStaking>(api.derive.staking.info as any, [address]);
  const [hasActivity, setHasActivity] = useState(true);
  const [{ commission, hasNominators, isNominatorMe, nominators, stashId, stakeOwn, stakeOther, validatorPayment }, setStakingState] = useState<StakingState>({
    hasNominators: false,
    isNominatorMe: false,
    nominators: [],
    stashId: address.toString()
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect((): void => {
    if (stakingInfo) {
      const { controllerId, nextSessionIds, stakers, stashId, validatorPrefs } = stakingInfo;
      const nominators = withNominations && stakers
        ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value.unwrap()])
        : [];
      const stakeTotal = (stakers && !stakers.total.isEmpty && stakers.total.unwrap()) || undefined;
      const stakeOwn = (stakers && !stakers.own.isEmpty && stakers.own.unwrap()) || undefined;
      const stakeOther = (stakeTotal && stakeOwn) ? stakeTotal.sub(stakeOwn) : undefined;
      const commission = validatorPrefs?.commission?.unwrap();

      setStakingState({
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
        stashId: (stashId || address).toString(),
        stakeOther,
        stakeOwn,
        stakeTotal,
        validatorPayment: (validatorPrefs as any as ValidatorPrefsTo196)?.validatorPayment?.unwrap()
      });
    }
  }, [stakingInfo]);

  useEffect((): void => {
    if (recentlyOnline && stashId && recentlyOnline[stashId]) {
      setHasActivity(recentlyOnline[stashId].isOnline);
    }
  }, [recentlyOnline, stashId]);

  if ((filter === 'hasNominators' && !hasNominators) ||
    (filter === 'noNominators' && hasNominators) ||
    (filter === 'hasWarnings' && hasActivity) ||
    (filter === 'noWarnings' && !hasActivity) ||
    (filter === 'iNominated' && !isNominatorMe) ||
    (filter === 'nextSet' && !isElected)) {
    return null;
  }

  const lastBlockNumber = authorsMap[stashId];
  const isAuthor = lastAuthors && lastAuthors.includes(stashId);
  const _onFavorite = (): void => toggleFavorite(stashId);
  const _onQueryStats = (): void => {
    window.location.hash = `/staking/query/${stashId}`;
  };
  const _toggleNominators = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(!isExpanded);
  };

  return (
    <tr className={`${className} ${isAuthor && 'isHighlight'}`}>
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
        {recentlyOnline && hasActivity && recentlyOnline[stashId] && (
          <Badge
            hover={t('Active with {{blocks}} blocks authored{{hasMessage}} heartbeat message', {
              replace: {
                blocks: formatNumber(recentlyOnline[stashId].blockCount),
                hasMessage: recentlyOnline[stashId].hasMessage ? ' and a' : ', no'
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
        <AddressSmall value={stashId} />
      </td>
      <td className='number'>
        {stakeOwn && <FormatBalance label={<label>{t('own stake')}</label>} value={stakeOwn} />}
      </td>
      <td className={'toggle number'} colSpan={isExpanded ? 5 : 1} onClick={_toggleNominators}>
        {stakeOther && (
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
            : <FormatBalance label={<label>{t('other stake')}</label>} value={stakeOther}>&nbsp;({formatNumber(nominators.length)})&nbsp;<Icon name='angle double right' /></FormatBalance>
        )}
      </td>
      {!isExpanded && (
        <>
          <td className='number'>
            {(commission || validatorPayment) && (
              commission
                ? <><label>{t('commission')}</label>{commission}</>
                : <FormatBalance label={<label>{t('commission')}</label>} value={validatorPayment} />
            )}
          </td>
          <td className='number'>
            {points && points.gtn(0) && (
              <><label>{t('points')}</label>{formatNumber(points)}</>
            )}
          </td>
          <td className='number'>
            {lastBlockNumber && <><label>{t('last #')}</label>{lastBlockNumber}</>}
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

export default translate(
  styled(Address)`
    .extras {
      display: inline-block;
      margin-bottom: 0.75rem;

      .favorite {
        cursor: pointer;
        display: inline-block;
        margin-left: 0.5rem;
        margin-right: -0.25rem;

        &.isSelected {
          color: darkorange;
        }
      }
    }

    .blockNumberV1,
    .blockNumberV2 {
      border-radius: 0.25rem;
      font-size: 1.5rem;
      font-weight: 100;
      line-height: 1.5rem;
      opacity: 0.5;
      vertical-align: middle;
      z-index: 1;

      &.isCurrent {
        background: #3f3f3f;
        box-shadow: 0 3px 3px rgba(0,0,0,.2);
        color: #eee;
        opacity: 1;
      }
    }

    .blockNumberV2 {
      display: inline-block;
      padding: 0.25rem 0;

      &.isCurrent {
        margin-right: -0.25rem;
        padding: 0.25rem 0.75rem;
      }
    }

    .blockNumberV1 {
      padding: 0.25rem 0.5rem;
      position: absolute;
      right: 0;
    }

    .staking--Address-info {
      margin-right: 0.25rem;
      text-align: right;

      .staking--label {
        margin: 0 2.25rem -0.75rem 0;
      }
    }

    .staking--label.controllerSpacer {
      margin-top: 0.5rem;
    }

    .staking--stats {
      bottom: 0.75rem;
      cursor: pointer;
      position: absolute;
      right: 0.5rem;
    }
  `
);
