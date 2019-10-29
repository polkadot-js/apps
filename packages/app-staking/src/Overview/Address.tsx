// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, BlockNumber } from '@polkadot/types/interfaces';
import { DerivedStaking, DerivedStakingOnlineStatus } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorFilter } from '../types';

import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiContext, withCalls, withMulti } from '@polkadot/react-api';
import { AddressCard, AddressMini, OnlineStatus } from '@polkadot/react-components';
import { classes } from '@polkadot/react-components/util';
import keyring from '@polkadot/ui-keyring';
import { formatBalance } from '@polkadot/util';
import { updateOnlineStatus } from '../util';

import translate from '../translate';

interface Props extends I18nProps {
  address: string;
  className?: string;
  defaultName: string;
  filter: ValidatorFilter;
  lastAuthor: string;
  lastBlock: string;
  recentlyOnline?: Record<string, BlockNumber>;
  stakingInfo?: DerivedStaking;
  withNominations?: boolean;
}

interface StakingState {
  balanceOpts: { bonded: boolean | BN[] };
  controllerId?: string;
  hasNominators: boolean;
  nominators: [AccountId, Balance][];
  stashActive: string | null;
  stashTotal: string | null;
  sessionId?: string;
  stashId?: string;
}

interface OnlineState {
  hasOfflineWarnings: boolean;
  onlineStatus: DerivedStakingOnlineStatus;
}

const WITH_VALIDATOR_PREFS = { validatorPayment: true };

function Address ({ address, className, defaultName, filter, lastAuthor, lastBlock, recentlyOnline, stakingInfo, t, withNominations }: Props): React.ReactElement<Props> | null {
  const { isSubstrateV2 } = useContext(ApiContext);
  const [isNominatorMe, seIsNominatorMe] = useState(false);
  const [{ hasOfflineWarnings, onlineStatus }, setOnlineStatus] = useState<OnlineState>({
    hasOfflineWarnings: false,
    onlineStatus: {}
  });
  const [{ balanceOpts, controllerId, hasNominators, nominators, sessionId, stashId }, setStakingState] = useState<StakingState>({
    balanceOpts: { bonded: true },
    hasNominators: false,
    nominators: [],
    stashActive: null,
    stashTotal: null
  });

  useEffect((): void => {
    if (stakingInfo) {
      const { controllerId, nextSessionId, stakers, stakingLedger, stashId } = stakingInfo;
      const nominators = stakers
        ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value.unwrap()])
        : [];
      const myAccounts = keyring.getAccounts().map(({ address }): string => address);

      seIsNominatorMe(nominators.some(([who]): boolean =>
        myAccounts.includes(who.toString())
      ));
      setStakingState({
        balanceOpts: {
          bonded: stakers && !stakers.own.isEmpty
            ? [stakers.own.unwrap(), stakers.total.unwrap().sub(stakers.own.unwrap())]
            : true
        },
        controllerId: controllerId && controllerId.toString(),
        hasNominators: nominators.length !== 0,
        nominators,
        sessionId: nextSessionId && nextSessionId.toString(),
        stashActive: stakingLedger
          ? formatBalance(stakingLedger.active)
          : null,
        stashId: stashId && stashId.toString(),
        stashTotal: stakingLedger
          ? formatBalance(stakingLedger.total)
          : null
      });
    }
  }, [stakingInfo]);

  useEffect((): void => {
    if (stakingInfo) {
      const { online, offline, sessionIds, stashId } = stakingInfo;
      const onlineStatus = updateOnlineStatus(recentlyOnline || {})(sessionIds, { offline, online });

      setOnlineStatus({
        hasOfflineWarnings: !!(stashId && onlineStatus.offline && onlineStatus.offline.length),
        onlineStatus
      });
    }
  }, [recentlyOnline, stakingInfo]);

  if (!stashId || (filter === 'hasNominators' && !hasNominators) ||
    (filter === 'noNominators' && hasNominators) ||
    (filter === 'hasWarnings' && !hasOfflineWarnings) ||
    (filter === 'noWarnings' && hasOfflineWarnings) ||
    (filter === 'iNominated' && !isNominatorMe)) {
    return null;
  }

  const isAuthor = !!lastBlock && !!lastAuthor && [address, controllerId, stashId].includes(lastAuthor);

  return (
    <AddressCard
      buttons={
        <div className='staking--Address-info'>
          {isAuthor && (
            <div className={classes(isSubstrateV2 ? 'blockNumberV2' : 'blockNumberV1')}>#{lastBlock}</div>
          )}
          {controllerId && (
            <div>
              <label className={classes('staking--label', isSubstrateV2 && !isAuthor && 'controllerSpacer')}>{t('controller')}</label>
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
      iconInfo={controllerId && onlineStatus && (
        <OnlineStatus
          accountId={controllerId}
          value={onlineStatus}
          tooltip
        />
      )}
      key={stashId}
      value={stashId}
      withBalance={balanceOpts}
      withValidatorPrefs={WITH_VALIDATOR_PREFS}
    >
      {withNominations && hasNominators && (
        <details>
          <summary>
            {t('Nominators ({{count}})', {
              replace: {
                count: nominators.length
              }
            })}
          </summary>
          {nominators.map(([who, bonded]): React.ReactNode =>
            <AddressMini
              bonded={bonded}
              key={who.toString()}
              value={who}
              withBonded
            />
          )}
        </details>
      )}
    </AddressCard>
  );
}

export default withMulti(
  styled(Address)`
    .blockNumberV1,
    .blockNumberV2 {
      background: #3f3f3f;
      border-radius: 0.25rem;
      box-shadow: 0 3px 3px rgba(0,0,0,.2);
      color: #eee;
      font-size: 1.5rem;
      font-weight: 100;
      line-height: 1.5rem;
      vertical-align: middle;
      z-index: 1;
    }

    .blockNumberV2 {
      display: inline-block;
      margin-bottom: 0.75rem;
      margin-right: -0.25rem;
      padding: 0.25rem 0.75rem;
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
      margin-top: 2.75rem;
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.staking.info', {
      paramName: 'address',
      propName: 'stakingInfo'
    }]
  )
);
