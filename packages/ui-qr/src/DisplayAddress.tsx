// Copyright 2017-2019 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';
import { u8aConcat } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import { ADDRESS_PREFIX } from './constants';
import { encodeString } from './util';
import QrDisplay from './Display';

interface Props extends BaseProps {
  address: string;
}

interface State {
  data: Uint8Array | null;
  dataHash: string | null;
}

const PREFIX = encodeString(ADDRESS_PREFIX);

export default class DisplayExtrinsic extends React.PureComponent<Props, State> {
  public state: State = {
    data: null,
    dataHash: null
  };

  public getDerivedStateFromProps ({ address }: Props, prevState: State): State | null {
    const data = u8aConcat(
      PREFIX,
      encodeString(address)
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
