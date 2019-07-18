// Copyright 2017-2019 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';
import { u8aConcat } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import QrDisplay from './Display';

interface Props extends BaseProps {
  address: string;
  payload: Uint8Array;
}

interface State {
  data: Uint8Array | null;
}

const SUBSTRATE = new Uint8Array([53]);
const CRYPTO_SR25519 = new Uint8Array([1]);
const SIGN_TX = new Uint8Array([0]);

export default class DisplayExtrinsic extends React.PureComponent<Props, State> {
  public state: State = {
    data: null
  };

  public getDerivedStateFromProps ({ address, payload }: Props, prevState: State): State | null {
    const data = u8aConcat(
      SUBSTRATE,
      CRYPTO_SR25519,
      SIGN_TX,
      decodeAddress(address),
      payload
    );

    if (data === prevState.data) {
      return null;
    }

    return { data };
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
        type='extrinsic'
        value={data}
      />
    );
  }
}
