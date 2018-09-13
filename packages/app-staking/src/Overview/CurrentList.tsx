// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxBalanceMap } from '@polkadot/ui-react-rx/ApiObservable/types';

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

    if (current.length === 0) {
      return null;
    }

    return [
      <h1>
        {t('list.current', {
          defaultValue: 'validators',
          replace: {
            count: current.length
          }
        })}
      </h1>,
      ...this.renderRow(current, t('name.validator', { defaultValue: 'validator' }))
    ];
  }

  private renderNext () {
    const { next, t } = this.props;

    if (next.length === 0) {
      return null;
    }

    return [
      <h1>
        {t('list.next', {
          defaultValue: 'next up'
        })}
      </h1>,
      ...this.renderRow(next, t('name.intention', { defaultValue: 'intention' }))
    ];
  }

  private renderRow (addresses: Array<string>, defaultName: string) {
    const { balances } = this.props;

    return addresses.map((address) => {
      const nominators = (balances[address] || {}).nominators || [];

      return (
        <article key={address}>
          <AddressRow
            name={name || defaultName}
            value={address}
            withCopy={false}
            withNonce={false}
          >
            {nominators.map(({ address }) =>
              <AddressMini
                key={address}
                value={address}
              />
            )}
          </AddressRow>
        </article>
      );
    });
  }
}

export default translate(CurrentList);
