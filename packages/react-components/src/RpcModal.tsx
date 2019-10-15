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
  accountId: StringOrNull;
  onChangeAccountId: (accountId: StringOrNull) => void;
  queueRpc: QueueTxRpcAdd;
}

export interface ResultProps {
  key: string;
  result?: QueueTx;
}

export interface TriggerProps {
  onShow: () => void;
}

export interface Props {
  controls: React.ComponentType<ControlsProps>;
  method: string;
  result: React.ComponentType<ResultProps>;
  section: string;
  title: React.ReactNode;
  trigger?: React.ComponentType<TriggerProps>;
  onChangeAccountId?: (accountId: StringOrNull) => void;
  onSubmit?: () => void;
  onHide?: () => void;
  onShow?: () => void;
  onSuccess?: () => void;
  onFailed?: () => void;
  queue: QueueTx[];
}

export interface State {
  accountId?: StringOrNull;
  isBusy: boolean;
  isOpen: boolean;
}

function onChangeAccountId ({ onChangeAccountId }: Props, setAccountId: React.Dispatch<React.SetStateAction<StringOrNull>>): (accountId: StringOrNull) => void {
  return (accountId: StringOrNull): void => {
    setAccountId(accountId);

    onChangeAccountId && onChangeAccountId(accountId);
  };
}

function onHide ({ onHide }: Props, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>): () => void {
  return (): void => {
    setIsOpen(false);

    onHide && onHide();
  };
}

function onShow ({ onShow }: Props, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>): () => void {
  return (): void => {
    setIsOpen(true);

    onShow && onShow();
  };
}

function renderControls (props: Props, accountId: StringOrNull, setAccountId: React.Dispatch<React.SetStateAction<StringOrNull>>, queueRpc: QueueTxRpcAdd): React.ReactNode {
  return (
    <props.controls
      accountId={accountId}
      onChangeAccountId={onChangeAccountId(props, setAccountId)}
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

function renderTrigger (props: Props, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>): React.ReactNode {
  if (!props.trigger) {
    return null;
  }

  return (
    <props.trigger onShow={onShow(props, setIsOpen)} />
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
  const { trigger } = props;
  const [accountId, setAccountId] = useState<StringOrNull>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <QueueConsumer>
      {({ txqueue, queueRpc }: QueueProps): React.ReactNode => {
        const results = filterQueue(props, txqueue);
        return (
          <>
            {trigger && renderTrigger(props, setIsOpen)}
            <Modal
              className='ui--Modal'
              dimmer='inverted'
              onClose={onHide(props, setIsOpen)}
              open={isOpen}
            >
              <Modal.Header>
                {renderHeader(props)}
              </Modal.Header>
              <Modal.Content>
                {renderControls(props, accountId, setAccountId, queueRpc)}
                {renderResults(props, results)}
              </Modal.Content>
            </Modal>
          </>
        );
      }}
    </QueueConsumer>
  );
}
