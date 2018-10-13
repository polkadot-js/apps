// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps } from '../types';

import React from 'react';
import Identicon from 'polkadot-identicon';

type Props = BaseProps & {
  size: number,
  value: string | Uint8Array | null
};

export default class Polkadot extends React.PureComponent<Props> {
  render () {
    const { size, value } = this.props;

    if (!value) {
      return null;
    }

    // @ts-ignore Published version does not match up with actual repo version
    return <Identicon account={value} size={size} />;
  }
}
