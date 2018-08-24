// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueTx } from './types';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';

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
        {available.map(({ rpc: { name, section }, id, status }) =>
          <div
            className={classes('ui--signer-Status-Item', status)}
            key={id}
          >
            <div className='header'>
              {section}.{name}
            </div>
            <div className='status'>
              {status}
            </div>
          </div>
        )}
      </div>
    );
  }
}
