// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { ActionStatus } from './types';

import React from 'react';
import { AddressMini, Icon } from '@polkadot/ui-app/index';
import classes from '@polkadot/ui-app/util/classes';

type Props = BareProps & {
  status: ActionStatus | null
};

export default class Status extends React.PureComponent<Props> {
  render () {
    const { status } = this.props;

    if (!status) {
      return null;
    }

    debugger;

    return (
      <div className='app--account-Status'>
        <div
          className={classes('app--account-Status-Item', status.success ? 'success' : 'error')}
        >
          <div className='desc'>
            <div className='header'>
              {status.success ? 'Success' : 'Failed'}
            </div>
            <AddressMini value={status.value} />
            <div className='status'>
              {status.message}
            </div>
          </div>
          <div className='short'>
            <Icon name={this.iconName(status)} />
          </div>
        </div>
      </div>
    );
  }

  private iconName = (status: ActionStatus): any => {
    return status.success ? 'check' : 'ban';
  }
}
