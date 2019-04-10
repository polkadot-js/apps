// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { Nominators, RecentlyOfflineMap } from '../types';

import React from 'react';
import { AccountId, Balance } from '@polkadot/types';

import translate from '../translate';
import Address from './Address';

type Props = I18nProps & {
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  current: Array<string>,
  lastAuthor?: string,
  lastBlock: string,
  next: Array<string>,
  nominators: Nominators,
  recentlyOffline: RecentlyOfflineMap
};

class CurrentList extends React.PureComponent<Props> {
  render () {
    return (
      <div className='validator--ValidatorsList ui--flex-medium'>
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
        {this.renderColumn(current, t('validator (stash)'))}
      </>
    );
  }

  private renderNext () {
    const { next, t } = this.props;

    return (
      <>
        <h1>{t('next up')}</h1>
        {this.renderColumn(next, t('intention (stash)'))}
      </>
    );
  }

  private renderColumn (addresses: Array<string>, defaultName: string) {
    const { balances, balanceArray, lastAuthor, lastBlock, nominators, recentlyOffline, t } = this.props;

    if (addresses.length === 0) {
      return (
        <div>{t('no addresses found')}</div>
      );
    }

    return (
      <div>
        {addresses.map((address) => (
          <Address
            address={address}
            balances={balances}
            balanceArray={balanceArray}
            defaultName={defaultName}
            key={address}
            lastAuthor={lastAuthor}
            lastBlock={lastBlock}
            nominators={nominators}
            recentlyOffline={recentlyOffline}
          />
        ))}
      </div>
    );
  }
}

export default translate(CurrentList);
