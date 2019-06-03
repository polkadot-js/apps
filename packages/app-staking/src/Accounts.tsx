// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { CardGrid } from '@polkadot/ui-app';
import { getAddrName } from '@polkadot/ui-app/util';
import keyring from '@polkadot/ui-keyring';
import createOption from '@polkadot/ui-keyring/options/item';

import Account from './Account';
import translate from './translate';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

type Props = I18nProps & ComponentProps;

class Accounts extends React.PureComponent<Props> {
  render () {
    const { balances, recentlyOffline, t, validators } = this.props;
    const accounts = keyring.getAccounts();
    const stashOptions = this.getStashOptions();

    return (
      <CardGrid>
        {accounts.map((account) => {
          const address = account.address();

          return (
            <Account
              accountId={address}
              balances={balances}
              isValidator={validators.includes(address)}
              key={address}
              recentlyOffline={recentlyOffline}
              stashOptions={stashOptions}
            />
          );
        })}
      </CardGrid>
    );
  }

  private getStashOptions (): Array<KeyringSectionOption> {
    const { stashes } = this.props;

    return stashes.map((stashId) =>
      createOption(stashId, getAddrName(stashId))
    );
  }
}

export default translate(Accounts);
