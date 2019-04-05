// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { Nominators, RecentlyOffline, RecentlyOfflineMap } from '../types';

import React from 'react';
import { AccountId, Balance, HeaderExtended } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/ui-api/with';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';
import Address from './Address';

type Props = I18nProps & {
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  chain_subscribeNewHead?: HeaderExtended,
  current: Array<string>,
  next: Array<string>,
  nominators: Nominators,
  staking_recentlyOffline?: RecentlyOffline
};

type State = {
  recentlyOffline: RecentlyOfflineMap
};

class CurrentList extends React.PureComponent<Props, State> {
  state: State = { recentlyOffline: {} };

  static getDerivedStateFromProps ({ staking_recentlyOffline = [] }: Props): State {
    return {
      recentlyOffline: staking_recentlyOffline.reduce(
        (result, [accountId, blockNumber, count]) => {
          const account = accountId.toString();

          if (!result[account]) {
            result[account] = [];
          }

          result[account].push({
            blockNumber,
            count
          });

          return result;
        }, {} as RecentlyOfflineMap)
    };
  }

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

  private renderColumn (addresses: Array<string>, defaultName: string) {
    const { balances, balanceArray, chain_subscribeNewHead, nominators, t } = this.props;
    const { recentlyOffline } = this.state;

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
        {addresses.map((address) => (
          <Address
            address={address}
            balances={balances}
            balanceArray={balanceArray}
            defaultName={defaultName}
            isAuthor={address === lastAuthor}
            key={address}
            lastBlock={lastBlock}
            nominators={nominators}
            recentlyOffline={recentlyOffline}
          />
        ))}
      </div>
    );
  }
}

export default withMulti(
  CurrentList,
  translate,
  withCalls<Props>(
    'derive.chain.subscribeNewHead',
    'query.staking.recentlyOffline'
  )
);
