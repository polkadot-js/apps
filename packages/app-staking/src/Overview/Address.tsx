// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, Points } from '@polkadot/types/interfaces';
import { DerivedStaking, DerivedHeartbeats } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorFilter } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressCard, AddressMini, Badge, Expander, Icon } from '@polkadot/react-components';
import { classes } from '@polkadot/react-components/util';
import { trackStream, useApiContext } from '@polkadot/react-hooks';
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
  balanceOpts: { bonded: boolean | BN[] };
  controllerId?: string;
  hasNominators: boolean;
  isNominatorMe: boolean;
  nominators: [AccountId, Balance][];
  sessionId?: string;
  stashId?: string;
}

const WITH_VALIDATOR_PREFS = { validatorPayment: true };

function Address ({ address, authorsMap, className, defaultName, filter, hasQueries, isElected, isFavorite, lastAuthors, myAccounts, points, recentlyOnline, t, toggleFavorite, withNominations = true }: Props): React.ReactElement<Props> | null {
  const { api, isSubstrateV2 } = useApiContext();
  // FIXME Any horrors, caused by derive type mismatches
  const stakingInfo = trackStream<DerivedStaking>(api.derive.staking.info as any, [address]);
  const [extraInfo, setExtraInfo] = useState<[React.ReactNode, React.ReactNode][] | undefined>();
  const [hasActivity, setHasActivity] = useState(true);
  const [{ balanceOpts, controllerId, hasNominators, isNominatorMe, nominators, sessionId, stashId }, setStakingState] = useState<StakingState>({
    balanceOpts: { bonded: true },
    hasNominators: false,
    isNominatorMe: false,
    nominators: []
  });

  useEffect((): void => {
    if (points) {
      const formatted = formatNumber(points);

      if (!extraInfo || extraInfo[0][1] !== formatted) {
        setExtraInfo([[t('era points'), formatted]]);
      }
    }
  }, [extraInfo, points]);

  useEffect((): void => {
    if (stakingInfo) {
      const { controllerId, nextSessionIds, stakers, stashId } = stakingInfo;
      const nominators = withNominations && stakers
        ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value.unwrap()])
        : [];
      const stakersOwn = stakers && !stakers.own.isEmpty && stakers.own.unwrap();

      setStakingState({
        balanceOpts: stakers && stakersOwn
          ? { bonded: [stakersOwn, stakers.total.unwrap().sub(stakersOwn)] }
          : { bonded: true },
        controllerId: controllerId?.toString(),
        hasNominators: nominators.length !== 0,
        isNominatorMe: nominators.some(([who]): boolean =>
          myAccounts.includes(who.toString())
        ),
        nominators,
        sessionId: nextSessionIds && nextSessionIds[0]?.toString(),
        stashId: stashId?.toString()
      });
    }
  }, [stakingInfo]);

  useEffect((): void => {
    setHasActivity(
      recentlyOnline && recentlyOnline[stashId || '']
        ? recentlyOnline[stashId || ''].isOnline
        : true
    );
  }, [recentlyOnline, stashId]);

  if ((filter === 'hasNominators' && !hasNominators) ||
    (filter === 'noNominators' && hasNominators) ||
    (filter === 'hasWarnings' && hasActivity) ||
    (filter === 'noWarnings' && !hasActivity) ||
    (filter === 'iNominated' && !isNominatorMe) ||
    (filter === 'nextSet' && !isElected)) {
    return null;
  }

  if (!stashId) {
    return (
      <AddressCard
        className={className}
        defaultName={defaultName}
        isDisabled
        value={address}
        withBalance={false}
      />
    );
  }

  const lastBlockNumber = authorsMap[stashId];
  const isAuthor = lastAuthors && lastAuthors.includes(stashId);
  const _onFavorite = (): void => toggleFavorite(stashId);
  const _onQueryStats = (): void => {
    window.location.hash = `/staking/query/${stashId}`;
  };

  return (
    <AddressCard
      buttons={
        <div className='staking--Address-info'>
          {isSubstrateV2 && (
            <div className='extras'>
              {lastBlockNumber && (
                <div className={`blockNumberV${isSubstrateV2 ? '2' : '1'} ${isAuthor && 'isCurrent'}`}>#{lastBlockNumber}</div>
              )}
              <Icon
                className={`favorite ${isFavorite && 'isSelected'}`}
                name={isFavorite ? 'star' : 'star outline'}
                onClick={_onFavorite}
              />
            </div>
          )}
          {controllerId && (
            <div>
              <label className={classes('staking--label', isSubstrateV2 && !lastBlockNumber && 'controllerSpacer')}>{t('controller')}</label>
              <AddressMini value={controllerId} />
            </div>
          )}
          {!isSubstrateV2 && sessionId && (
            <div>
              <label className='staking--label'>{t('session')}</label>
              <AddressMini value={sessionId} />
            </div>
          )}
        </div>
      }
      className={className}
      defaultName={defaultName}
      extraInfo={extraInfo}
      iconInfo={
        <>
          {isElected && (
            <Badge
              hover={t('Selected for the next session')}
              info={<Icon name='chevron right' />}
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
              isTooltip
              type='online'
            />
          )}
        </>
      }
      isDisabled={isSubstrateV2 && !hasActivity}
      overlay={
        hasQueries && api.query.imOnline?.authoredBlocks && (
          <Icon
            className='staking--stats'
            name='line graph'
            onClick={_onQueryStats}
          />
        )
      }
      stakingInfo={stakingInfo}
      value={stashId}
      withBalance={balanceOpts}
      withValidatorPrefs={WITH_VALIDATOR_PREFS}
    >
      {withNominations && hasNominators && (
        <Expander
          summary={t('Nominators ({{count}})', {
            replace: {
              count: nominators.length
            }
          })}
        >
          {nominators.map(([who, bonded]): React.ReactNode =>
            <AddressMini
              bonded={bonded}
              key={who.toString()}
              value={who}
              withBonded
            />
          )}
        </Expander>
      )}
    </AddressCard>
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
      /* Small additional margin to take care of validator highlights */
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
