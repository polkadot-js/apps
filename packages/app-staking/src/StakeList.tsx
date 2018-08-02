// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';

import Account from './Account';
import translate from './translate';

type Props = I18nProps & {
  intentions: Array<string>
};

class StakeList extends React.PureComponent<Props> {
  render () {
    const { className, intentions, style, t } = this.props;

    return (
      <div
        className={classes('staking--StakeList', className)}
        style={style}
      >
        {keyring
          .getAccounts()
          .map((a) =>
            a.address()
          )
          .map((address) => (
            <Account
              address={address}
              isIntending={intentions.includes(address)}
              key={address}
            />
          ))
        }
      </div>
    );
  }
}

export default translate(StakeList);
