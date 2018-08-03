// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-signer/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import { QueueConsumer } from '@polkadot/ui-signer/Context';

import Account from './Account';
import translate from './translate';

type Props = I18nProps & {
  intentions: Array<string>,
  validators: Array<string>
};

class StakeList extends React.PureComponent<Props> {
  render () {
    const { className, intentions, style, validators } = this.props;

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
          <div
            className={classes('staking--StakeList', className)}
            style={style}
          >
            {keyring.getAccounts().map((account) => {
              const address = account.address();
              const name = account.getMeta().name || '';

              return (
                <Account
                  address={address}
                  intentionPosition={intentions.indexOf(address)}
                  isIntending={intentions.includes(address)}
                  isValidator={validators.includes(address)}
                  key={address}
                  name={name}
                  queueExtrinsic={queueExtrinsic}
                  validators={validators}
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
