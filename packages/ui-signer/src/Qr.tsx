// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { IMMORTAL_ERA } from '@polkadot/types/ExtrinsicSignature';
import { QrDisplay, QrScan } from '@polkadot/ui-qr/index';

import translate from './translate';
import { isHex, hexToU8a } from '@polkadot/util';

type Props = I18nProps & {
  accountId: string,
  blockHash: Uint8Array,
  era?: Uint8Array,
  nonce: BN,
  onScan: (signature: Uint8Array) => void
};

type State = {
  isScanning: boolean
};

class Qr extends React.PureComponent<Props, State> {
  state = {
    isScanning: false
  };

  render () {
    const { isScanning } = this.state;

    return (
      <div className='ui--signer-Qr'>
        <div>{
          isScanning
            ? this.renderScan()
            : this.renderDisplay()
        }</div>
      </div>
    );
  }

  private renderDisplay () {
    const { accountId, blockHash, era = IMMORTAL_ERA, nonce } = this.props;

    return (
      <QrDisplay value={{
        accountId,
        blockHash,
        era,
        nonce
      }} />
    );
  }

  private renderScan () {
    return (
      <QrScan onScan={this.onScan} />
    );
  }

  private onScan = (value: string): void => {
    const { onScan } = this.props;

    // (64 * 2) + 2 - hex digits + 2 byte 0x
    if (!isHex(value) || value.length !== 130) {
      return;
    }

    onScan(hexToU8a(value));
  }
}

export default translate(Qr);
