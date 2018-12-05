// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';

import './index.css';

import React from 'react';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';
import Queue, { Props as QueueComponentProps } from '@polkadot/ui-app/Status/Queue';

import Modal from './Modal';

type Props = BareProps & {
  children: React.ReactNode
};

export type SignerType = React.ComponentType<Props> & {
  Queue: React.ComponentType<QueueComponentProps>
};

class Signer extends React.PureComponent<Props> {
  static Queue = Queue;

  render () {
    const { children } = this.props;

    return (
      <Queue>
        {children}
        <QueueConsumer>
          {this.handleQueueProps}
        </QueueConsumer>
      </Queue>
    );
  }

  private handleQueueProps = ({ txqueue, queueSetTxStatus }: QueueProps) => {
    const { className, style } = this.props;

    return (
      <Modal
        className={className}
        key='signer-modal'
        queue={txqueue}
        queueSetTxStatus={queueSetTxStatus}
        style={style}
      />
    );
  }
}

export default (Signer as SignerType);
