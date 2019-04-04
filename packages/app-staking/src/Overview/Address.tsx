// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { Nominators, RecentlyOfflineMap } from '../types';

import React from 'react';
import { AccountId, Balance, Option } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-api/with';
import { AddressMini, AddressRow } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

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
  staking_bonded?: Option<AccountId>
};

type State = {
  badgeExpanded: boolean;
};

class Address extends React.PureComponent<Props, State> {
  state: State = {
    badgeExpanded: false
  };

  private getDisplayName = (): string | undefined => {
    const { address, defaultName } = this.props;

    const pair = keyring.getAccount(address).isValid()
      ? keyring.getAccount(address)
      : keyring.getAddress(address);

    return pair.isValid()
      ? pair.getMeta().name
      : defaultName;
  }

  private onClickBadge = (): void => {
    const { badgeExpanded } = this.state;

    this.setState({ badgeExpanded: !badgeExpanded });
  }

  render () {
    const { address, balanceArray, isAuthor, lastBlock, nominators, recentlyOffline, staking_bonded, t } = this.props;
    const { badgeExpanded } = this.state;
    const myNominators = Object.keys(nominators).filter((nominator) =>
      nominators[nominator].indexOf(address) !== -1
    );
    const bondedId: string | null = staking_bonded && staking_bonded.isSome
      ? staking_bonded.unwrap().toString()
      : null;

    const hasNominators = !!myNominators.length;
    const isRecentlyOffline = bondedId && recentlyOffline[bondedId];

    const children = (hasNominators || isRecentlyOffline) ? (
      <>
        <details className='staking--Account-detail'>
          {myNominators.length && (
          <>
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
          </>
        )}
        </details>
        {(bondedId && recentlyOffline[bondedId]) && (() => {
          const { blockNumber, instances } = recentlyOffline[bondedId];

          return (
            <div
              onClick={this.onClickBadge}
              className={['recentlyOffline', badgeExpanded ? 'expand' : ''].join(' ')}
            >
              <div className='badge'>
                {instances.toString()}
              </div>
              <div className='detail'>
                {t('Reported offline {{instances}} times since block #{{blockNumber}}', {
                  replace: {
                    instances: instances.toString(),
                    blockNumber
                  }
                })}
              </div>
            </div>
          );
        })()}
      </>
    ) : undefined;

    return (
      <article key={address}>
        <AddressRow
          balance={balanceArray(address)}
          name={this.getDisplayName()}
          value={address}
          withCopy={false}
          withNonce={false}
        >
          {children}
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
}

export default withMulti(
  Address,
  translate,
  withCall('query.staking.bonded', { paramName: 'address' })
);
