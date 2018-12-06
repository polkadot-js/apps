// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx } from '@polkadot/ui-app/Status/types';

import BN from 'bn.js';
import React from 'react';
import { Trans } from 'react-i18next';
import { Method } from '@polkadot/types';
import { Call, IdentityIcon, Modal } from '@polkadot/ui-app/index';

import translate from './translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  value: QueueTx
};

class Transaction extends React.PureComponent<Props> {
  render () {
    const { children, t, value: { accountId, accountNonce = new BN(0), extrinsic } } = this.props;

    if (!extrinsic) {
      return null;
    }

    const { method, section } = Method.findFunction(extrinsic.callIndex);

    return [
      <Modal.Header key='header'>
        {t('extrinsic.header', {
          defaultValue: 'Submit Transaction'
        })}
      </Modal.Header>,
      <Modal.Content className='ui--signer-Signer-Content' key='content'>
        <div className='ui--signer-Signer-Decoded'>
          <div className='expanded'>
            <p>
              <Trans i18nKey='decoded.short'>
                You are about to sign a message from <span className='code'>{accountId}</span> calling <span className='code'>{section}.{method}</span> with an index of <span className='code'>{accountNonce.toString()}</span>
              </Trans>
            </p>
            <Call value={extrinsic} />
          </div>
          <IdentityIcon
            className='icon'
            value={accountId}
          />
        </div>
        {children}
      </Modal.Content>
    ];
  }
}

export default translate(Transaction);
