// Copyright 2017-2019 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';
import { u8aConcat } from '@polkadot/util';
import { decodeAddress, xxhashAsHex } from '@polkadot/util-crypto';

import QrDisplay from './Display';

interface Props extends BaseProps {
  address: string;
  payload: Uint8Array;
}

interface State {
  data: Uint8Array | null;
  dataHash: string | null;
}

const SUBSTRATE = new Uint8Array([0x53]);
const CRYPTO_SR25519 = new Uint8Array([0x01]);
const SIGN_TX = new Uint8Array([0x00]);

export default class DisplayPayload extends React.PureComponent<Props, State> {
  public state: State = {
    data: null,
    dataHash: null
  };

  public getDerivedStateFromProps ({ address, payload }: Props, prevState: State): State | null {
    const data = u8aConcat(
      SUBSTRATE,
      CRYPTO_SR25519,
      SIGN_TX,
      decodeAddress(address),
      payload
    );
    const dataHash = xxhashAsHex(data);

    if (dataHash === prevState.dataHash) {
      return null;
    }

    return { data, dataHash };
  }

  public render (): React.ReactNode {
    const { className, style } = this.props;
    const { data } = this.state;

    if (!data) {
      return null;
    }

    return (
      <QrDisplay
        className={className}
        style={style}
        value={data}
      />
    );
  }
}
