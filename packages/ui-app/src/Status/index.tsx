// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '../types';
import { QueueStatus, QueueTx, QueueTx$Status } from './types';

import React from 'react';
import { Method } from '@polkadot/types';

import AddressMini from '../AddressMini';
import Icon from '../Icon';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  stqueue?: Array<QueueStatus>,
  txqueue?: Array<QueueTx>
};

class Status extends React.PureComponent<Props> {
  render () {
    const { stqueue = [], txqueue = [] } = this.props;
    const allst: Array<QueueStatus> = stqueue.filter(({ isCompleted }) => !isCompleted);
    const alltx: Array<QueueTx> = txqueue.filter(({ status }) =>
      !['completed', 'incomplete'].includes(status)
    );

    if (!allst.length && !alltx.length) {
      return null;
    }

    return (
      <div className='ui--Status'>
        {alltx.map(this.renderItem)}
        {allst.map(this.renderStatus)}
      </div>
    );
  }

  private renderStatus = ({ action, id, message, status, value }: QueueStatus) => {
    return (
      <div
        className={classes('item', status)}
        key={id}
      >
        <div className='wrapper'>
          <div className='container'>
            <div className='desc'>
              <div className='header'>
                {action}
              </div>
              <AddressMini value={value} />
              <div className='status'>
                {message}
              </div>
            </div>
            <div className='short'>
              <Icon name={this.iconName(status)} />
            </div>
          </div>
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
        className={classes('item', status)}
        key={id}
      >
        <div className='wrapper'>
          <div className='container'>
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
        </div>
      </div>
    );
  }

  private iconName = (status: string) => {
    switch (status) {
      case 'error':
        return 'ban';

      case 'received':
        return 'telegram plane';

      default:
        return 'check';
    }
  }

  private signerIconName = (status: QueueTx$Status) => {
    switch (status) {
      case 'cancelled':
        return 'ban';

      case 'completed':
      case 'finalised':
        return 'check';

      case 'dropped':
      case 'invalid':
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

export default translate(Status);
