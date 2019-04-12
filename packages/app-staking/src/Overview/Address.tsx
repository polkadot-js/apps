// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { RecentlyOfflineMap } from '../types';

import React from 'react';
import { AccountId, Balance, Option, StakingLedger, Exposure } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/ui-api/with';
import { AddressMini, AddressRow, RecentlyOffline } from '@polkadot/ui-app';
import { getAddrName } from '@polkadot/ui-app/util';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  address: string,
  balances: DerivedBalancesMap,
  defaultName: string,
  lastAuthor: string,
  lastBlock: string,
  recentlyOffline: RecentlyOfflineMap,
  session_nextKeyFor?: Option<AccountId>,
  staking_bonded?: Option<AccountId>,
  staking_ledger?: Option<StakingLedger>,
  staking_stakers?: Exposure,
  stashId?: string | null
};

type State = {
  controllerId: string,
  stashActive: string | null,
  stashTotal: string | null,
  sessionId: string | null,
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
      stashTotal: null,
      badgeExpanded: false
    };
  }

  static getDerivedStateFromProps ({ session_nextKeyFor, staking_bonded, staking_ledger }: Props, prevState: State): State | null {
    const ledger = staking_ledger
      ? staking_ledger.unwrapOr(null)
      : null;

    return {
      controllerId: !staking_bonded || staking_bonded.isNone
        ? prevState.controllerId
        : staking_bonded.unwrap().toString(),
      sessionId: !session_nextKeyFor || session_nextKeyFor.isNone
        ? prevState.sessionId
        : session_nextKeyFor.unwrap().toString(),
      stashActive: !ledger
        ? prevState.stashActive
        : formatBalance(ledger.active),
      stashTotal: !ledger
        ? prevState.stashTotal
        : formatBalance(ledger.total)
    } as State;
  }

  render () {
    const { address, lastAuthor, lastBlock, stashId, staking_stakers } = this.props;
    const { controllerId } = this.state;
    const isAuthor = [address, controllerId, stashId].includes(lastAuthor);
    const bonded = staking_stakers && !staking_stakers.own.isZero()
      ? [staking_stakers.own, staking_stakers.total.sub(staking_stakers.own)]
      : undefined;

    return (
      <article key={stashId || controllerId}>
        <AddressRow
          bonded={bonded}
          name={this.getDisplayName()}
          value={stashId || null}
          withBalance={false}
          withBonded
          withCopy={false}
          withNonce={false}
        >
          {this.renderKeys()}
          {this.renderNominators()}
          {this.renderOffline()}
        </AddressRow>
        {
          isAuthor && stashId
            ? <div className='blockNumber'>#{lastBlock}</div>
            : null
        }
      </article>
    );
  }

  private getDisplayName = (): string | undefined => {
    const { defaultName, stashId } = this.props;

    if (!stashId) {
      return defaultName;
    }

    return getAddrName(stashId) || defaultName;
  }

  private renderKeys () {
    const { t } = this.props;
    const { controllerId, sessionId } = this.state;
    const isSame = controllerId === sessionId;

    return (
      <div className='staking--accounts-info'>
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

  private renderNominators () {
    const { staking_stakers, t } = this.props;
    const nominators = staking_stakers
      ? staking_stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value])
      : [];

    if (!nominators.length) {
      return null;
    }

    return (
      <details className='staking--Account-detail'>
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
    const { recentlyOffline, stashId } = this.props;

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
  Address,
  translate,
  withCalls<Props>(
    ['query.staking.bonded', { paramName: 'address' }],
    ['query.session.nextKeyFor', { paramName: 'address' }],
    ['query.staking.ledger', { paramName: 'address' }],
    ['query.staking.ledger', {
      paramName: 'address',
      propName: 'stashId',
      transform: (ledger: Option<StakingLedger>) =>
        ledger.unwrapOr({ stash: { toString: () => { return null; } } }).stash.toString()
    }],
    ['query.staking.stakers', { paramName: 'stashId' }]
  )
);
