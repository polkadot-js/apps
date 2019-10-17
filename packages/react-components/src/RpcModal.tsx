// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueProps, QueueTx, QueueTxRpcAdd } from '@polkadot/react-components/Status/types';
import { StringOrNull } from './types';

import React, { useState } from 'react';
import { Modal } from '@polkadot/react-components';
import { QueueConsumer } from '@polkadot/react-components/Status/Context';
import { isUndefined } from '@polkadot/util';

export interface ControlsProps {
  queueRpc: QueueTxRpcAdd;
}

export interface ResultProps {
  key: string;
  result?: QueueTx;
}

export interface Props {
  accountId: StringOrNull;
  controls: React.ComponentType<ControlsProps>;
  isOpen: boolean;
  method: string;
  result: React.ComponentType<ResultProps>;
  section: string;
  title: React.ReactNode;
  onSubmit?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
  onSuccess?: () => void;
  onFailed?: () => void;
}

export interface State {
  accountId?: StringOrNull;
  isBusy: boolean;
}

function renderControls ({ controls: Controls }: Props, queueRpc: QueueTxRpcAdd): React.ReactNode {
  return (
    <Controls
      queueRpc={queueRpc}
    />
  );
}

function renderHeader ({ title }: Props): React.ReactNode {
  return title;
}

function renderResults ({ result: Result }: Props, results: QueueTx[]): React.ReactNode {
  return results.map(
    (result, index) => (
      <Result
        key={`rpc-result-${index}`}
        result={result}
      />
    )
  );
}

function filterQueue ({ section, method }: Props, queue: QueueTx[]): QueueTx[] {
  return queue
    .filter(({ error, result, rpc }): boolean =>
      ((!isUndefined(error) || !isUndefined(result)) &&
      section === rpc.section && method === rpc.method)
    )
    .reverse();
}

export default function RpcModal (props: Props): React.ReactElement<Props> {
  const { isOpen, onClose } = props;

  return (
    <QueueConsumer>
      {({ txqueue, queueRpc }: QueueProps): React.ReactNode => {
        const results = filterQueue(props, txqueue);
        return (
          <>
            <Modal
              className='ui--Modal'
              dimmer='inverted'
              onClose={onClose}
              open={isOpen}
            >
              <Modal.Header>
                {renderHeader(props)}
              </Modal.Header>
              <Modal.Content>
                {renderControls(props, queueRpc)}
                {renderResults(props, results)}
              </Modal.Content>
            </Modal>
          </>
        );
      }}
    </QueueConsumer>
  );
}
