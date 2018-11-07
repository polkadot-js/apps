// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueTx, QueueTx$Status } from '@polkadot/ui-signer/types';
import { ActionStatus } from './types';

import React from 'react';
import { AddressMini, Icon } from '@polkadot/ui-app/index';
import classes from '@polkadot/ui-app/util/classes';
import { Method } from '@polkadot/types';

type Props = BareProps & {
  status: ActionStatus | null,
  queue: Array<QueueTx> | null
};

export default class Status extends React.PureComponent<Props> {
  render () {
    const { queue, status } = this.props;

    let available;

    if (queue) {
      available = queue.filter(({ status }) =>
        !['completed', 'incomplete'].includes(status)
      );
    }

    if (!status && !available) {
      return null;
    }

    return (
      <div className='app--account-Status'>
        {
          available
          ?
          available.map(this.renderItem)
          :
          this.renderStatus(status)
        }
      </div>
    );
  }

  private renderStatus = (status: ActionStatus) => {
    return (
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
    );
  }

  private renderItem = ({ id, extrinsic, rpc, status }: QueueTx) => {
    let { method, section } = rpc;

    if (extrinsic) {
      const found = Method.findFunction(extrinsic.callIndex);

      if (found.section !== 'unknown') {
        method = found.method;
        section = found.section;
      }
    }

    const icon = this.signerIconName(status);

    return (
      <div
        className={classes('ui--signer-Status-Item', status)}
        key={id}
      >
        <div className='desc'>
          <div className='header'>
            {section}.{method}
          </div>
          <div className='status'>
            {status}
          </div>
        </div>
        <div className='short'>
          <Icon
            loading={icon === 'spinner'}
            name={icon}
          />
        </div>
      </div>
    );
  }

  private iconName = (status: ActionStatus): any => {
    return status.success ? 'check' : 'ban';
  }

  private signerIconName = (status: QueueTx$Status): any => {
    switch (status) {
      case 'cancelled':
        return 'ban';

      case 'completed':
      case 'finalised':
        return 'check';

      case 'dropped':
      case 'usurped':
        return 'arrow down';

      case 'error':
        return 'warning sign';

      case 'queued':
        return 'random';

      default:
        return 'spinner';
    }
  }
}
