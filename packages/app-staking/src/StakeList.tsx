// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import keyring from '@polkadot/ui-keyring';
import createOption from '@polkadot/ui-keyring/options/item';

import Account from './Account';
import translate from './translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

type Props = I18nProps & ComponentProps;

class StakeList extends React.PureComponent<Props> {
  render () {
    const { balances, balanceArray, controllers, nominators, recentlyOffline, stashes, validators } = this.props;
    const accounts = keyring.getAccounts();

    return (
      <div className='staking--StakeList'>
        {accounts.map((account) => {
          const address = account.address();
          const name = account.getMeta().name || '';

          return (
            <Account
              accountId={address}
              balances={balances}
              balanceArray={balanceArray}
              controllers={controllers}
              isValidator={validators.includes(address)}
              key={address}
              name={name}
              nominators={nominators}
              recentlyOffline={recentlyOffline}
              stashes={stashes}
              stashOptions={this.getStashOptions()}
              validators={validators}
            />
          );
        })}
        {this.renderSpacer(accounts.length)}
      </div>
    );
  }

  // HACK This is a hack of a dummy element to get the spacing right, i.e. the last
  // element in an oddly spaced list should still only take up a single column
  private renderSpacer (accountsLen: number) {
    if (accountsLen % 2 === 0) {
      return null;
    }

    return (
      <div className='spacer' />
    );
  }

  private getStashOptions (): Array<KeyringSectionOption> {
    const { stashes } = this.props;

    return stashes.map((stashId) => {
      const pair = keyring.getAccount(stashId).isValid()
        ? keyring.getAccount(stashId)
        : keyring.getAddress(stashId);
      const name = pair.isValid()
        ? pair.getMeta().name
        : undefined;

      return createOption(stashId, name);
    });
  }
}

export default translate(StakeList);
