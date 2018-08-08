// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps } from '../types';

import './IdentityIcon.css';

import React from 'react';
import Identicon from 'polkadot-identicon';

type Props = BaseProps & {
  size?: number,
  value: string | Uint8Array
};

const DEFAULT_SIZE = 64;

export default class IdentityIcon extends React.PureComponent<Props> {
  render () {
    const { className, size = DEFAULT_SIZE, style, value } = this.props;

    return (
      <div
        className={['ui--IdentityIcon', className].join(' ')}
        key={value.toString()}
        style={style}
      >
        <Identicon
          id={value}
          size={size}
        />
      </div>
    );
  }
}
