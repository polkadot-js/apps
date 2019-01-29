// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AccountId, Balance } from '@polkadot/types';
import { HeaderExtended } from '@polkadot/types/Header';
import { withCall, withMulti } from '@polkadot/ui-api/with';
import { AddressMini, AddressRow } from '@polkadot/ui-app/index';
import { formatNumber } from '@polkadot/ui-app/util';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = I18nProps & {
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  chain_subscribeNewHead?: HeaderExtended,
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

    return (
      <>
        <h1>
          {t('validators', {
            replace: {
              count: current.length
            }
          })}
        </h1>
        {this.renderColumn(current, t('validator'))}
      </>
    );
  }

  private renderNext () {
    const { next, t } = this.props;

    return (
      <>
        <h1>{t('next up')}</h1>
        {this.renderColumn(next, t('intention'))}
      </>
    );
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
    const { balances, balanceArray, chain_subscribeNewHead, t } = this.props;

    if (addresses.length === 0) {
      return (
        <div>{t('no addresses found')}</div>
      );
    }

    let lastBlock: string = '';
    let lastAuthor: string;

    if (chain_subscribeNewHead) {
      lastBlock = `#${formatNumber(chain_subscribeNewHead.blockNumber)}`;
      lastAuthor = (chain_subscribeNewHead.author || '').toString();
    }

    return (
      <div>
        {addresses.map((address) => {
          const nominators = (balances[address] || {}).nominators || [];
          const children = nominators.length
            ? (
            <details>
              <summary>{t('Nominators ({{count}})', {
                replace: {
                  count: nominators.length
                }
              })}</summary>
              {nominators.map(({ accountId }) =>
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
                name={this.getDisplayName(address, defaultName)}
                value={address}
                withCopy={false}
                withNonce={false}
              >
                {children}
              </AddressRow>
              <div
                className={['blockNumber', lastAuthor === address ? 'latest' : ''].join(' ')}
                key='lastBlock'
              >
                {lastAuthor === address ? lastBlock : ''}
              </div>
            </article>
          );
        })}
      </div>
    );
  }
}

export default withMulti(
  CurrentList,
  translate,
  withCall('derive.chain.subscribeNewHead')
);
