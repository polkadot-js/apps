// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxBalanceMap } from '@polkadot/api-observable/types';

import React from 'react';
import { AccountId, Balance } from '@polkadot/types';
import { AddressMini, AddressRow } from '@polkadot/ui-app/index';

import translate from '../translate';

type Props = I18nProps & {
  balances: RxBalanceMap,
  current: Array<AccountId>
  next: Array<AccountId>
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
      this.renderRow(current, t('name.validator', { defaultValue: 'validator' }))
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
      this.renderRow(next, t('name.intention', { defaultValue: 'intention' }))
    ];
  }

  private renderRow (addresses: Array<AccountId>, defaultName: string) {
    const { balances, t } = this.props;

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
          const nominators = (balances[address.toString()] || {}).nominators || [];

          return (
            <article key={address.toString()}>
              <AddressRow
                balance={this.balanceArray(address)}
                name={name || defaultName}
                value={address}
                withCopy={false}
                withNonce={false}
              >
                {nominators.map(({ address }) =>
                  <AddressMini
                    key={address.toString()}
                    value={address}
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

  // FIXME Duplicated in ../StakeList/Account
  private balanceArray (_address: AccountId | string): Array<Balance> | undefined {
    const { balances } = this.props;

    if (!_address) {
      return undefined;
    }

    const address = _address.toString();

    return balances[address]
      ? [balances[address].stakingBalance, balances[address].nominatedBalance]
      : undefined;
  }
}

export default translate(CurrentList);
