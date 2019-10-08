/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, BlockNumber, Exposure } from '@polkadot/types/interfaces';
import { DerivedStaking, DerivedStakingOnlineStatus } from '@polkadot/api-derive/types';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorFilter } from '../types';

import React from 'react';
import styled from 'styled-components';
import { withCalls, withMulti } from '@polkadot/react-api/with';
import { AddressCard, AddressMini, OnlineStatus } from '@polkadot/react-components';
import { classes } from '@polkadot/react-components/util';
import keyring from '@polkadot/ui-keyring';
import { formatBalance } from '@polkadot/util';
import { updateOnlineStatus } from '../util';

import translate from '../translate';

interface Props extends ApiProps, I18nProps {
  address: string;
  className?: string;
  defaultName: string;
  filter: ValidatorFilter;
  lastAuthor: string;
  lastBlock: string;
  recentlyOnline?: Record<string, BlockNumber>;
  staking_info?: DerivedStaking;
}

interface State {
  controllerId: string | null;
  onlineStatus: DerivedStakingOnlineStatus;
  stashActive: string | null;
  stashTotal: string | null;
  sessionId: string | null;
  stakers?: Exposure;
  stashId: string | null;
  badgeExpanded: boolean;
}

class Address extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      controllerId: null,
      onlineStatus: {},
      sessionId: null,
      stashActive: null,
      stashId: null,
      stashTotal: null,
      badgeExpanded: false
    };
  }

  public static getDerivedStateFromProps ({ recentlyOnline = {}, staking_info }: Props, prevState: State): Pick<State, never> | null {
    if (!staking_info) {
      return null;
    }

    const { controllerId, nextSessionId, online, offline, stakers, stakingLedger, stashId } = staking_info;

    return {
      controllerId: controllerId && controllerId.toString(),
      onlineStatus: updateOnlineStatus(recentlyOnline)(staking_info.sessionIds || null, { offline, online }),
      sessionId: nextSessionId && nextSessionId.toString(),
      stashActive: stakingLedger
        ? formatBalance(stakingLedger.active)
        : prevState.stashActive,
      stakers,
      stashId: stashId && stashId.toString(),
      stashTotal: stakingLedger
        ? formatBalance(stakingLedger.total)
        : prevState.stashTotal
    };
  }

  public render (): React.ReactNode {
    const { address, className, defaultName, filter, isSubstrateV2, lastAuthor, lastBlock, t } = this.props;
    const { controllerId, onlineStatus, sessionId, stakers, stashId } = this.state;
    const bonded = stakers && !stakers.own.isEmpty
      ? [stakers.own.unwrap(), stakers.total.unwrap().sub(stakers.own.unwrap())]
      : true;

    if ((filter === 'hasNominators' && !this.hasNominators()) ||
      (filter === 'noNominators' && this.hasNominators()) ||
      (filter === 'hasWarnings' && !this.hasWarnings()) ||
      (filter === 'noWarnings' && this.hasWarnings()) ||
      (filter === 'iNominated' && !this.iNominated())) {
      return null;
    }

    const isAuthor = !!lastBlock && !!lastAuthor && [address, controllerId, stashId].includes(lastAuthor);
    const nominators = this.getNominators();

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
        key={stashId || controllerId || undefined}
        value={stashId || address}
        withBalance={{ bonded }}
        withValidatorPrefs={{ validatorPayment: true }}
      >
        {nominators.length !== 0 && (
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

  private getNominators (): [AccountId, Balance][] {
    const { stakers } = this.state;

    return stakers
      ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value.unwrap()])
      : [];
  }

  private iNominated (): boolean {
    const nominators = this.getNominators();
    const myAddresses = keyring.getAccounts().map(({ address }): string => address);

    return nominators.some(([who]): boolean =>
      myAddresses.includes(who.toString())
    );
  }

  private hasNominators (): boolean {
    const nominators = this.getNominators();

    return !!nominators.length;
  }

  private hasWarnings (): boolean {
    const { stashId, onlineStatus } = this.state;

    if (!stashId || !onlineStatus.offline || !onlineStatus.offline.length) {
      return false;
    }

    return true;
  }
}

export default withMulti(
  styled(Address as React.ComponentClass<Props>)`
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
    ['derive.staking.info', { paramName: 'address' }]
  )
);
