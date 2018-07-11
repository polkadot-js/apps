// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps } from '../types';

import './IdentityIcon.css';

import React from 'react';

import appendIcon from './appendIcon';

type Props = BaseProps & {
  size?: number,
  value: string | Uint8Array
};
// { className, size = 64, style, value }:
export default class IdentityIcon extends React.PureComponent<Props> {
  render () {
    return (
      <div
        className={['ui--IdentityIcon', this.props.className].join(' ')}
        ref={appendIcon(this.props.value, this.props.size)}
        style={this.props.style}
      />
    );
  }
}
