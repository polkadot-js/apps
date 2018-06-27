// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueProps } from './types';

import './index.css';

import React from 'react';

import { QueueConsumer } from './Context';
import Modal from './Modal';
import Status from './Status';
import Queue, { Props as QueueComponentProps } from './Queue';

type Props = BareProps & {
  children: any // node?
};

export type SignerType = React.ComponentType<Props> & {
  Queue: React.ComponentType<QueueComponentProps>
};

function Signer ({ children, className, style }: Props) {
  return (
    <Queue>
      {children}
      <QueueConsumer>
        {({ queue, queueSetStatus }: QueueProps) => [
          <Modal
            className={className}
            key='signer-modal'
            queue={queue}
            queueSetStatus={queueSetStatus}
            style={style}
          />,
          <Status
            key='signer-status'
            queue={queue}
          />
        ]}
      </QueueConsumer>
    </Queue>
  );
}

(Signer as SignerType).Queue = Queue;

export default (Signer as SignerType);
