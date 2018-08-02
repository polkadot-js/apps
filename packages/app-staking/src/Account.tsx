// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
// import apimethods from '@polkadot/jsonrpc';
import Button from '@polkadot/ui-app/Button';
import classes from '@polkadot/ui-app/util/classes';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import withApi from '@polkadot/ui-react-rx/with/api';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import translate from './translate';

type Props = ApiProps & I18nProps & {
  address: string,
  name: string,
  intentionPosition: number,
  isIntending: boolean,
  isValidator: boolean
};

class Account extends React.PureComponent<Props> {
  render () {
    const { address, className, isIntending, name, style, t } = this.props;
    const addrShort = `${address.slice(0, 7)}…${address.slice(-7)}`;

    return (
      <div
        className={classes('staking--Account', className)}
        style={style}
      >
        <IdentityIcon
          className='staking--Account-icon'
          size={32}
          value={address}
        />
        <div className='staking--Account-info'>
          <div className='staking--Account-name'>{name}</div>
          <div className='staking--Account-address'>{addrShort}</div>
        </div>
        <Button
          isDisabled={isIntending}
          isPrimary
          onClick={this.stake}
          text={t('account.stake', {
            defaultValue: 'stake'
          })}
        />
        <Button
          isDisabled={!isIntending}
          isNegative
          onClick={this.unstake}
          text={t('account.unstake', {
            defaultValue: 'unstake'
          })}
        />
      </div>
    );
  }

  stake = () => {
    // nothing
  }

  unstake = () => {
    const { api } = this.props;

    // api.staking.unstake()
    // nothing
  }
}

export default withMulti(
  Account,
  translate,
  withApi
);
