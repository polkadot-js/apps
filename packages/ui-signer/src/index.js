// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import Modal from './Modal';
import Status from './Status';
import Queue from './Queue';

type Props = BareProps;

function Signer ({ className, style }: Props): React$Node {
  return (
    <Queue>
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
    </Queue>
  );
}

Signer.Queue = Queue;

export default Signer;
