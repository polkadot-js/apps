// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ApiProps } from '@polkadot/ui-react-rx/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from '../types';

import './Signer.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Modal from 'semantic-ui-react/dist/es/modules/Modal';
import withApi from '@polkadot/ui-react-rx/with/api';

import translate from '../translate';
import Decoded from './Decoded';
import submitExtrinsic from './submit';

type Props = I18nProps & ApiProps & {
  onSetStatus: (id: number, status: string) => void,
  queue: Array<QueueTx>
};

function Signer ({ api, className, onSetStatus, queue, style, t }: Props): React$Node {
  const first = queue.find(({ status }) => status === 'queued');

  if (!first) {
    return null;
  }

  const onClose = (): void =>
    onSetStatus(first.id, 'cancelled');
  const onSign = async (): Promise<void> => {
    const status = await submitExtrinsic(api, first);

    onSetStatus(first.id, status);
  };

  return (
    <Modal
      className={['extrinsics--Signer', className].join(' ')}
      dimmer='inverted'
      open
      style={style}
    >
      <Modal.Header>
        {t('signer.header', {
          defaultValue: 'Sign and submit'
        })}
      </Modal.Header>
      <Decoded value={first} />
      <Modal.Actions>
        <Button onClick={onClose}>
          {t('signer.cancel', {
            defaultValue: 'Cancel'
          })}
        </Button>
        <Button
          onClick={onSign}
          primary
        >
          {t('signer.send', {
            defaultValue: 'Sign and Submit'
          })}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
  withApi(Signer)
);
