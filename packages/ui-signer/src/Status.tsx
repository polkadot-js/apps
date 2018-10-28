// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueTx, QueueTx$Status } from './types';

import React from 'react';
import { Icon } from '@polkadot/ui-app/index';
import classes from '@polkadot/ui-app/util/classes';
import { Method } from '@polkadot/types';

type Props = BareProps & {
  queue: Array<QueueTx>
};

export default class Status extends React.PureComponent<Props> {
  render () {
    const { queue } = this.props;
    const available = queue.filter(({ status }) =>
      !['completed', 'incomplete'].includes(status)
    );

    if (!available.length) {
      return null;
    }

    return (
      <div className='ui--signer-Status'>
        {available.map(this.renderItem)}
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
          <Icon name={this.iconName(status)} />
        </div>
      </div>
    );
  }

  private iconName = (status: QueueTx$Status): any => {
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
        return 'loading spinner';
    }
  }
}
