// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import keyring from '@polkadot/ui-keyring';

import Account from './Account';
import translate from './translate';

type Props = I18nProps & ComponentProps;

class StakeList extends React.PureComponent<Props> {
  render () {
    const { balances, balanceArray, intentions, validators } = this.props;

    return (
      <div className='staking--StakeList'>
        {keyring.getAccounts().map((account, index) => {
          const address = account.address();
          const name = account.getMeta().name || '';

          return (
            <Account
              accountId={address}
              balances={balances}
              balanceArray={balanceArray}
              intentions={intentions}
              isValidator={validators.includes(address)}
              key={address}
              name={name}
              validators={validators}
            />
          );
        })}
      </div>
    );
  }
}

export default translate(StakeList);
