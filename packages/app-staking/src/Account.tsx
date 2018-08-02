// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import Button from '@polkadot/ui-app/Button';
import classes from '@polkadot/ui-app/util/classes';

import translate from './translate';

type Props = I18nProps & {
  address: string,
  isIntending: boolean
};

class Account extends React.PureComponent<Props> {
  render () {
    const { address, className, isIntending, style, t } = this.props;

    return (
      <div
        className={classes('staking--Account', className)}
        style={style}
      >
        <div className='staking--Account-address'>{address}</div>
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
    // nothing
  }
}

export default translate(Account);
