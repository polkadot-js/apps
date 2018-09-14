// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps } from '../types';

import React from 'react';
import identicon from '@polkadot/ui-identicon/index';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import isHex from '@polkadot/util/is/hex';
import isU8a from '@polkadot/util/is/u8a';

type Props = BaseProps & {
  size: number,
  value: string | Uint8Array
};

type State = {
  address: string
};

export default class Substrate extends React.PureComponent<Props> {
  state: State = {} as State;

  static getDerivedStateFromProps ({ value }: Props, prevState: State): State | null {
    const address = isU8a(value) || isHex(value)
      ? encodeAddress(value)
      : value;

    return address === prevState.address
      ? null
      : { address };
  }

  render () {
    return (
      <div ref={this.appendIcon} />
    );
  }

  private appendIcon = (node: Element | null): void => {
    const { size } = this.props;
    const { address } = this.state;

    if (node) {
      node.appendChild(
        identicon(address, size)
      );
    }
  }
}
