// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { Nominators } from '../types';

import React from 'react';
import { AccountId, Balance } from '@polkadot/types';
import { withMulti } from '@polkadot/ui-api/with';
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
  nominators: Nominators
};

class Address extends React.PureComponent<Props> {
  private getDisplayName () {
    const { address, defaultName } = this.props;

    const pair = keyring.getAccount(address).isValid()
      ? keyring.getAccount(address)
      : keyring.getAddress(address);

    return pair.isValid()
      ? pair.getMeta().name
      : defaultName;
  }

  render () {
    const { address, balanceArray, isAuthor, lastBlock, nominators, t } = this.props;
    const myNominators = Object.keys(nominators).filter((nominator) =>
      nominators[nominator].indexOf(address) !== -1
    );
    const children = myNominators.length
      ? (
      <details className='staking--Account-detail'>
        <summary>{t('Nominators ({{count}})', {
          replace: {
            count: myNominators.length
          }
        })}</summary>
        {myNominators.map((accountId) =>
          <AddressMini
            key={accountId.toString()}
            value={accountId}
            withBalance
          />
        )}
      </details>
    )
    : undefined;

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
  translate
);
