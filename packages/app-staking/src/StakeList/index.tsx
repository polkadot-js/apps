// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';
import { AccountId, Balance } from '@polkadot/types';

import React from 'react';
import keyring from '@polkadot/ui-keyring';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';

import Account from './Account';
import translate from '../translate';

type Props = I18nProps & {
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  intentions: Array<string>,
  validators: Array<string>
};

class StakeList extends React.PureComponent<Props> {
  render () {
    const { balances, balanceArray, intentions, validators } = this.props;

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
          <div className='staking--StakeList'>
            {keyring.getAccounts().map((account) => {
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
                  queueExtrinsic={queueExtrinsic}
                />
              );
            })}
          </div>
        )}
      </QueueConsumer>
    );
  }
}

export default translate(StakeList);
