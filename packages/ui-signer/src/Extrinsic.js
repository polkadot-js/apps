// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';
import type { QueueTx } from './types';

import BN from 'bn.js';
import React from 'react';
import { Trans } from 'react-i18next';

import extrinsics from '@polkadot/extrinsics-substrate';
import Modal from '@polkadot/ui-app/Modal';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';
import addressEncode from '@polkadot/util-keyring/address/encode';

import translate from './translate';

type Props = I18nProps & {
  children?: React$Node,
  value: QueueTx
};

function findExtrinsic (sectionId: number, methodId: number): { method: ?string, section: ?string } {
  const section = Object.keys(extrinsics).find((section) =>
    extrinsics[section].index[0] === sectionId
  );
  const methods = section
    ? extrinsics[section].methods.public
    : {};
  const method = Object.keys(methods).find((method) =>
    methods[method].index[1] === methodId
  );

  return {
    method,
    section
  };
}

function Extrinsic ({ children, className, style, t, value: { nonce = new BN(0), publicKey, value: [value] } }: Props): React$Node {
  const unknown = t('decoded.unknown', {
    defaultValue: 'unknown'
  });
  const { method, section } = findExtrinsic(value[0], value[1]);
  const from = addressEncode(publicKey);

  return [
    <Modal.Header key='header'>
      {t('extrinsic.header', {
        defaultValue: 'Extrinsic submission'
      })}
    </Modal.Header>,
    <Modal.Content className='ui--signer-Signer-Content' key='content'>
      <div className='ui--signer-Signer-Decoded'>
        <div className='expanded'>
          <p>
            <Trans i18nkey='decoded.short'>
              You are about to sign a message from <span className='code'>{from}</span> calling <span className='code'>{section || unknown}.{method || unknown}</span> with an index of <span className='code'>{nonce.toString()}</span>
            </Trans>
          </p>
          <p>
            {t('decoded.data', {
              defaultValue: 'The encoded parameters contains the data'
            })}
          </p>
          <p className='code'>
            {u8aToHexShort(value, 512)}
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

export default translate(Extrinsic);
