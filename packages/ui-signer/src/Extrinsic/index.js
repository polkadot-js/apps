// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/api-rx/types';
import type { I18nProps } from '@polkadot/ui-app/types';
import type { QueueTx, QueueTx$Result } from './types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';

import translate from '../translate';
import Decoded from './Decoded';
import signMessage from './sign';
import submitExtrinsic from './submit';

type Props = I18nProps & {
  api: RxApiInterface,
  children: React$Node,
  cancelTx: () => void,
  sendTx: (submit: () => Promise<QueueTx$Status>) => Promise<void>,
  value: QueueTx
};

class Extrinsic extends React.PureComponent<Props> {
  render (): React$Node {
    const { children, t, value } = this.props;

    return [
      <Modal.Header key='header'>
        {t('extrinsic.header', {
          defaultValue: 'Extrinsic submission'
        })}
      </Modal.Header>,
      <Modal.Content className='ui--signer-Signer-Content' key='content'>
        <Decoded value={value} />
        {children}
      </Modal.Content>,
      <Modal.Actions key='actions'>
        {this.renderButtons()}
      </Modal.Actions>
    ];
  }

  renderButtons (): React$Node {
    const { cancelTx, t } = this.props;

    return (
      <Button.Group>
        <Button
          isNegative
          onClick={cancelTx}
          text={t('extrinsic.cancel', {
            defaultValue: 'Cancel'
          })}
        />
        <Button.Or />
        <Button
          isPrimary
          onClick={this.onSend}
          text={t('extrinsic.send', {
            defaultValue: 'Sign and Submit'
          })}
        />
      </Button.Group>
    );
  }

  onSend = (): void => {
    const { api, sendTx, value } = this.props;

    sendTx(async (): Promise<QueueTx$Result> => {
      const { data } = signMessage(value);

      return submitExtrinsic(api, [data]);
    });
  };
}

export default translate(Extrinsic);
