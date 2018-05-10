// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from '../types';

import BN from 'bn.js';
import React from 'react';
import { Trans } from 'react-i18next';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';
import addressEncode from '@polkadot/util-keyring/address/encode';

import translate from '../translate';

type Props = I18nProps & {
  value: QueueTx
};

function Decoded ({ className, style, t, value: { extrinsic: { name, section }, nonce = new BN(0), publicKey, value } }: Props): React$Node {
  const from = addressEncode(publicKey);

  return (
    <div
      className={['extrinsics--Signer-Decoded', className].join(' ')}
      style={style}
    >
      <div className='expanded'>
        <p>
          <Trans i18nkey='decoded.short'>
            You are about to sign a message from <span className='code'>{from}</span> calling <span className='code'>{section}.{name}</span> with an index of <span className='code'>{nonce.toString()}</span>
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
  );
}

export default translate(Decoded);
