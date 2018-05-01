// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ApiProps } from '@polkadot/rx-react/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from '../types';

import './Signer.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Modal from 'semantic-ui-react/dist/es/modules/Modal';
import withApi from '@polkadot/rx-react/with/api';

import translate from '../translate';
import Decoded from './Decoded';
import submitExtrinsic from './submit';

type Props = I18nProps & ApiProps & {
  subject: rxjs$BehaviorSubject<QueueTx>,
  value: QueueTx
};

function Signer ({ api, className, subject, style, t, value }: Props): React$Node {
  if (value.status !== 'queued') {
    return null;
  }

  const onClose = (): void => {
    subject.next({
      ...value,
      status: 'cancelled'
    });
  };
  const onSign = (): void => {
    submitExtrinsic(api, value, subject);
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
      <Decoded value={value} />
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
