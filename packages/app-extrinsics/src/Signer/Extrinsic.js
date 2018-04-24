// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps, QueueTx } from '../types';

import React from 'react';
import { Trans, translate } from 'react-i18next';
import Modal from 'semantic-ui-react/dist/es/modules/Modal';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import u8aToHex from '@polkadot/util/u8a/toHex';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';

type Props = BaseProps & {
  value: QueueTx
};

function Extrinsic ({ className, style, t, value: { message, method, publicKey } }: Props): React$Node {
  const from = u8aToHexShort(publicKey);

  return (
    <Modal.Content
      className={['extrinsics--Signer-Extrinsic', className].join(' ')}
      style={style}
    >
      <div className='body'>
        <IdentityIcon
          className='icon'
          value={publicKey}
        />
        <div className='expanded'>
          <p>
            <Trans i18nkey='extrinsic.short'>
              You are about to sign a message from <span className='code'>{from}</span> calling <span className='code'>{method}</span>
            </Trans>
          </p>
          <p>
            {t('extrinsic.data', {
              defaultValue: 'The encoded message to be signed contains the data'
            })}
          </p>
          <p className='code'>{u8aToHex(message)}</p>
        </div>
      </div>
    </Modal.Content>
  );
}

export default translate(['extrinsics'])(Extrinsic);
