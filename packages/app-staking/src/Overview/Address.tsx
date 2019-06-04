// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap, DerivedStaking } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ValidatorFilter, RecentlyOfflineMap } from '../types';

import React from 'react';
import styled from 'styled-components';
import { AccountId, Balance, Exposure } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/ui-api/with';
import { AddressCard, AddressMini, RecentlyOffline } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  address: string,
  balances: DerivedBalancesMap,
  className?: string,
  defaultName: string,
  lastAuthor: string,
  lastBlock: string,
  recentlyOffline: RecentlyOfflineMap,
  filter: ValidatorFilter,
  staking_info?: DerivedStaking
};

type State = {
  controllerId: string,
  stashActive: string | null,
  stashTotal: string | null,
  sessionId: string | null,
  stakers?: Exposure,
  stashId: string | null,
  badgeExpanded: boolean;
};

class Address extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      controllerId: props.address,
      sessionId: null,
      stashActive: null,
      stashId: null,
      stashTotal: null,
      badgeExpanded: false
    };
  }

  static getDerivedStateFromProps ({ staking_info }: Props, prevState: State): State | null {
    if (!staking_info) {
      return null;
    }

    const { controllerId, nextSessionId, stakers, stashId, stakingLedger } = staking_info;

    return {
      controllerId: controllerId && controllerId.toString(),
      sessionId: nextSessionId && nextSessionId.toString(),
      stashActive: stakingLedger
        ? formatBalance(stakingLedger.active)
        : prevState.stashActive,
      stakers,
      stashId: stashId && stashId.toString(),
      stashTotal: stakingLedger
        ? formatBalance(stakingLedger.total)
        : prevState.stashTotal
    } as State;
  }

  render () {
    const { address, className, defaultName, lastAuthor, lastBlock, filter } = this.props;
    const { controllerId, stakers, stashId } = this.state;
    const isAuthor = [address, controllerId, stashId].includes(lastAuthor);
    const bonded = stakers && !stakers.own.isZero()
      ? [stakers.own, stakers.total.sub(stakers.own)]
      : true;

    if ((filter === 'hasNominators' && !this.hasNominators())
        || (filter === 'noNominators' && this.hasNominators())
        || (filter === 'hasWarnings' && !this.hasWarnings())
        || (filter === 'noWarnings' && this.hasWarnings())
        || (filter === 'iNominated' && !this.iNominated())) {
      return null;
    }

    return (
      <AddressCard
        buttons={this.renderKeys()}
        className={className}
        defaultName={defaultName}
        key={stashId || controllerId}
        value={stashId}
        withBalance={{ bonded }}
      >
        {this.renderNominators()}
        {this.renderOffline()}
        {
          isAuthor && stashId
            ? <div className='blockNumber'>#{lastBlock}</div>
            : null
        }
      </AddressCard>
    );
  }

  private renderKeys () {
    const { t } = this.props;
    const { controllerId, sessionId } = this.state;
    const isSame = controllerId === sessionId;

    return (
      <div className='staking--Address-info'>
        {controllerId
          ? (
            <div>
              <label className='staking--label'>{
                isSame
                  ? t('controller/session')
                  : t('controller')
              }</label>
              <AddressMini value={controllerId} />
            </div>
          )
          : null
        }
        {!isSame && sessionId
          ? (
            <div>
              <label className='staking--label'>{t('session')}</label>
              <AddressMini value={sessionId} />
            </div>
          )
          : null
        }
      </div>
    );
  }

  private getNominators () {
    const { stakers } = this.state;

    return stakers
      ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value])
      : [];
  }

  private iNominated () {
    const nominators = this.getNominators();
    const myAddresses = keyring.getAccounts().map((acc) =>
      acc.address()
    );

    return nominators.some(([who]) =>
      myAddresses.includes(who.toString())
    );
  }

  private hasNominators () {
    const nominators = this.getNominators();

    return !!nominators.length;
  }

  private hasWarnings () {
    const { recentlyOffline } = this.props;
    const { stashId } = this.state;

    if (!stashId || !recentlyOffline[stashId]) {
      return false;
    }

    return true;
  }

  private renderNominators () {
    const { t } = this.props;
    const nominators = this.getNominators();

    if (!nominators.length) {
      return null;
    }

    return (
      <details>
        <summary>
          {t('Nominators ({{count}})', {
            replace: {
              count: nominators.length
            }
          })}
        </summary>
        {nominators.map(([who, bonded]) =>
          <AddressMini
            bonded={bonded}
            key={who.toString()}
            value={who}
            withBonded
          />
        )}
      </details>
    );
  }

  private renderOffline () {
    const { recentlyOffline } = this.props;
    const { stashId } = this.state;

    if (!stashId || !recentlyOffline[stashId]) {
      return null;
    }

    const offline = recentlyOffline[stashId];

    return (
      <RecentlyOffline
        accountId={stashId}
        offline={offline}
        tooltip
      />
    );
  }
}

export default withMulti(
  styled(Address as React.ComponentClass<Props>)`
    .blockNumber {
      background: #3f3f3f;
      border-radius: 0.25rem;
      bottom: 0.75rem;
      box-shadow: 0 3px 3px rgba(0,0,0,.2);
      color: #eee;
      font-size: 1.5rem;
      font-weight: 100;
      line-height: 1.5rem;
      padding: 0.25rem 0.5rem;
      position: absolute;
      right: -0.75rem;
      vertical-align: middle;
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.staking.info', { paramName: 'address' }]
  )
);
