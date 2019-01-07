// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx } from '@polkadot/ui-app/Status/types';

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
    const { children, t, value: { accountId, accountNonce, extrinsic, isUnsigned } } = this.props;

    if (!extrinsic) {
      return null;
    }

    const { method, section } = Method.findFunction(extrinsic.callIndex);
    const header = isUnsigned
      ? (
        <Trans i18nKey='decoded.short-unsigned'>You are about to submit an (unsigned) inherent transaction calling <span className='code'>{section}.{method}</span></Trans>
      )
      : (
        <Trans i18nKey='decoded.short-signed'>You are about to sign a message from <span className='code'>{accountId}</span> calling <span className='code'>{section}.{method}</span> with an index of <span className='code'>{accountNonce.toString()}</span></Trans>
      );
    const icon = isUnsigned
      ? undefined
      : (
        <IdentityIcon
          className='icon'
          value={accountId}
        />
      );

    return [
      <Modal.Header key='header'>
        {t('extrinsic.header', {
          defaultValue: 'Submit Transaction'
        })}
      </Modal.Header>,
      <Modal.Content className='ui--signer-Signer-Content' key='content'>
        <div className='ui--signer-Signer-Decoded'>
          <div className='expanded'>
            <p>{header}</p>
            <Call value={extrinsic} />
          </div>
          {icon}
        </div>
        {children}
      </Modal.Content>
    ];
  }
}

export default translate(Transaction);
