// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';

import './index.css';

import React from 'react';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';

import Modal from './Modal';

type Props = BareProps & {
  children: React.ReactNode
};

export default class Signer extends React.PureComponent<Props> {
  render () {
    const { children, className, style } = this.props;

    return (
      <>
        {children}
        <QueueConsumer>
          {({ txqueue, queueSetTxStatus }: QueueProps) => (
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
}
