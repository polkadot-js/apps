// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ApiProps } from '@polkadot/rx-react/types';
import type { BaseProps, QueueTx } from '../types';

import './Signer.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Modal from 'semantic-ui-react/dist/es/modules/Modal';
import withApi from '@polkadot/rx-react/with/api';
import withObservable from '@polkadot/rx-react/with/observable';

import { queueTx } from '../subjects';
import translate from '../translate';
import Extrinsic from './Extrinsic';
import submitExtrinsic from './submit';

type Props = BaseProps & ApiProps & {
  value?: QueueTx
};

function Signer ({ api, className, style, t, value }: Props): React$Node {
  if (!value) {
    return null;
  }

  const onClose = () => {
    queueTx.next();
  };
  const onSign = () => {
    submitExtrinsic(api, value.publicKey, value.message).then(onClose);
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
      <Extrinsic value={value} />
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
  withApi(
    withObservable(queueTx)(Signer)
  )
);
