// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { DerivedBalancesMap } from '@polkadot/ui-api/derive/types';

import React from 'react';
import { AccountId, Balance } from '@polkadot/types';
import { AddressMini, AddressRow } from '@polkadot/ui-app/index';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = I18nProps & {
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  current: Array<string>,
  next: Array<string>
};

class CurrentList extends React.PureComponent<Props> {
  render () {
    return (
      <div className='validator--ValidatorsList'>
        <div className='validator--current'>
          {this.renderCurrent()}
        </div>
        <div className='validator--next'>
          {this.renderNext()}
        </div>
      </div>
    );
  }

  private renderCurrent () {
    const { current, t } = this.props;

    return [
      <h1 key='header'>
        {t('list.current', {
          defaultValue: 'validators',
          replace: {
            count: current.length
          }
        })}
      </h1>,
      this.renderColumn(current, t('name.validator', { defaultValue: 'validator' }))
    ];
  }

  private renderNext () {
    const { next, t } = this.props;

    return [
      <h1 key='header'>
        {t('list.next', {
          defaultValue: 'next up'
        })}
      </h1>,
      this.renderColumn(next, t('name.intention', { defaultValue: 'intention' }))
    ];
  }

  private getDisplayName (address: string, defaultName: string) {
    const pair = keyring.getAccount(address).isValid()
      ? keyring.getAccount(address)
      : keyring.getAddress(address);

    return pair.isValid()
      ? pair.getMeta().name
      : defaultName;
  }

  private renderColumn (addresses: Array<string>, defaultName: string) {
    const { balances, balanceArray, t } = this.props;

    if (addresses.length === 0) {
      return (
        <div key='none'>{t('list.empty', {
          defaultValue: 'no addresses found'
        })}</div>
      );
    }

    return (
      <div key='list'>
        {addresses.map((address) => {
          const nominators = (balances[address] || {}).nominators || [];

          return (
            <article key={address}>
              <AddressRow
                balance={balanceArray(address)}
                name={this.getDisplayName(address, defaultName)}
                value={address}
                withCopy={false}
                withNonce={false}
              >
                {nominators.map(({ accountId }) =>
                  <AddressMini
                    key={accountId.toString()}
                    value={accountId}
                    withBalance
                  />
                )}
              </AddressRow>
            </article>
          );
        })}
      </div>
    );
  }
}

export default translate(CurrentList);
