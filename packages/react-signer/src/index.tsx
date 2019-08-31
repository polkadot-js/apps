// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { QueueProps } from '@polkadot/react-components/Status/types';

import './index.css';

import React from 'react';
import { QueueConsumer } from '@polkadot/react-components/Status/Context';

import Modal from './Modal';

interface Props extends BareProps {
  children: React.ReactNode;
}

export default function Signer ({ children, className, style }: Props): React.ReactElement<Props> {
  return (
    <>
      {children}
      <QueueConsumer>
        {({ txqueue, queueSetTxStatus }: QueueProps): React.ReactNode => (
          <Modal
            className={className}
            key='signer-modal'
            queue={txqueue}
            queueSetTxStatus={queueSetTxStatus}
            style={style}
          />
        )}
      </QueueConsumer>
    </>
  );
}
