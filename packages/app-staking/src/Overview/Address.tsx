// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { Nominators, RecentlyOfflineMap } from '../types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Balance, Option, StakingLedger } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-api/with';
import { AddressMini, AddressRow } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  address: string,
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  defaultName: string,
  isAuthor: boolean,
  lastBlock: string,
  nominators: Nominators,
  recentlyOffline: RecentlyOfflineMap,
  staking_ledger?: Option<StakingLedger>
};

type State = {
  stashId: string | null,
  badgeExpanded: boolean;
};

class Address extends React.PureComponent<Props, State> {
  state: State = {
    stashId: null,
    badgeExpanded: false
  };

  static getDerivedStateFromProps ({ staking_ledger }: Props): State | null {
    if (!staking_ledger || staking_ledger.isNone) {
      return null;
    }

    return {
      stashId: staking_ledger.unwrap().stash.toString()
    } as State;
  }

  render () {
    const { balanceArray, isAuthor, lastBlock } = this.props;
    const { stashId } = this.state;

    if (!stashId) {
      return null;
    }

    return (
      <article key={stashId}>
        <AddressRow
          balance={balanceArray(stashId)}
          name={this.getDisplayName()}
          value={stashId}
          withCopy={false}
          withNonce={false}
        >
          {this.renderNominators()}
          {this.renderOffline()}
        </AddressRow>
        <div
          className={['blockNumber', isAuthor ? 'latest' : ''].join(' ')}
          key='lastBlock'
        >
          {isAuthor ? lastBlock : ''}
        </div>
      </article>
    );
  }

  private getDisplayName = (): string | undefined => {
    const { defaultName } = this.props;
    const { stashId } = this.state;

    if (!stashId) {
      return defaultName;
    }

    const pair = keyring.getAccount(stashId).isValid()
      ? keyring.getAccount(stashId)
      : keyring.getAddress(stashId);

    return pair.isValid()
      ? pair.getMeta().name
      : defaultName;
  }

  private toggleBadge = (): void => {
    const { badgeExpanded } = this.state;

    this.setState({ badgeExpanded: !badgeExpanded });
  }

  private renderNominators () {
    const { address, nominators, t } = this.props;
    const myNominators = Object.keys(nominators).filter((nominator) =>
      nominators[nominator].indexOf(address) !== -1
    );

    if (!myNominators.length) {
      return null;
    }

    return (
      <details className='staking--Account-detail'>
        <summary>
          {t('Nominators ({{count}})', {
            replace: {
              count: myNominators.length
            }
          })}
        </summary>
        {myNominators.map((accountId) =>
          <AddressMini
            key={accountId.toString()}
            value={accountId}
            withBalance
          />
        )}
      </details>
    );
  }

  private renderOffline () {
    const { recentlyOffline, t } = this.props;
    const { badgeExpanded, stashId } = this.state;

    if (!stashId || !recentlyOffline[stashId]) {
      return null;
    }

    const offline = recentlyOffline[stashId];
    const count = offline.reduce((total, { count }) => total.add(count), new BN(0));
    const blockNumbers = offline.map(({ blockNumber }) => `#${formatNumber(blockNumber)}`);

    return (
      <div
        className={['recentlyOffline', badgeExpanded ? 'expand' : ''].join(' ')}
        onClick={this.toggleBadge}
      >
        <div className='badge'>
          {count.toString()}
        </div>
        <div className='detail'>
          {t('Reported offline {{count}} times, at {{blockNumbers}}', {
            replace: {
              count: count.toString(),
              blockNumbers: blockNumbers.join(', ')
            }
          })}
        </div>
      </div>
    );
  }
}

export default withMulti(
  Address,
  translate,
  withCall('query.staking.ledger', { paramName: 'address' })
);
