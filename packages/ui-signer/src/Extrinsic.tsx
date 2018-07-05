// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx } from './types';

import BN from 'bn.js';
import React from 'react';
import { Trans } from 'react-i18next';

import extrinsics from '@polkadot/extrinsics';
import Modal from '@polkadot/ui-app/Modal';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import u8aToHex from '@polkadot/util/u8a/toHex';
import addressEncode from '@polkadot/util-keyring/address/encode';

import translate from './translate';

type Props = I18nProps & {
  children?: any, // node?
  value: QueueTx
};

function findExtrinsic (sectionId: number, methodId: number): { method: string | undefined, section: string | undefined } {
  const section = Object.values(extrinsics).find(({ index }) =>
    index[0] === sectionId
  );
  const methods = section
    ? section.public
    : {};
  const method = Object.keys(methods).find((method) =>
    methods[method].index[1] === methodId
  );

  return {
    method,
    section: section
      ? section.name
      : undefined
  };
}

class Extrinsic extends React.PureComponent<Props> {
  render () {
    const { children, t, value: { nonce = new BN(0), publicKey, values: [_value] } } = this.props;

    const unknown = t('decoded.unknown', {
      defaultValue: 'unknown'
    });
    const value = _value as Uint8Array;
    const { method = unknown, section = unknown } = findExtrinsic(value[0], value[1]);
    const from = addressEncode(publicKey as Uint8Array);

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
                You are about to sign a message from <span className='code'>{from}</span> calling <span className='code'>{section}.{method}</span> with an index of <span className='code'>{nonce.toString()}</span>
              </Trans>
            </p>
            <p>
              {t('decoded.data', {
                defaultValue: 'The encoded parameters contains the data'
              })}
            </p>
            <p className='code'>
              {u8aToHex(value, 512)}
            </p>
          </div>
          <IdentityIcon
            className='icon'
            value={from}
          />
        </div>
        {children}
      </Modal.Content>
    ];
  }
}

export default translate(Extrinsic);
