// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxBalanceMap } from '@polkadot/ui-react-rx/ApiObservable/types';

import BN from 'bn.js';
import React from 'react';
import AddressMini from '@polkadot/ui-app/AddressMini';
import AddressRow from '@polkadot/ui-app/AddressRow';

import translate from '../translate';

type Props = I18nProps & {
  balances: RxBalanceMap,
  current: Array<string>
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

  private renderRow (addresses: Array<string>, defaultName: string) {
    const { balances, t } = this.props;

    if (addresses.length === 0) {
      return (
        <div key='none'>{t('list.empty', {
          defaultValue: 'no addresses found'
        })}</div>
      );
    }

    return (
      <article key='list'>
        {addresses.map((address) => {
          const nominators = (balances[address] || {}).nominators || [];

          return (
            <AddressRow
              balance={this.balanceArray(address)}
              key={address}
              name={name || defaultName}
              value={address}
              withCopy={false}
              withNonce={false}
            >
              {nominators.map(({ address }) =>
                <AddressMini
                  key={address}
                  value={address}
                  withBalance
                />
              )}
            </AddressRow>
          );
        })}
      </article>
    );
  }

  private balanceArray (address: string): Array<BN> | undefined {
    const { balances } = this.props;

    return balances[address]
      ? [balances[address].stakingBalance, balances[address].nominatedBalance]
      : undefined;
  }
}

export default translate(CurrentList);
