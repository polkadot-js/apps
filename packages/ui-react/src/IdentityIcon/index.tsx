// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps } from '../types';

import './IdentityIcon.css';

import React from 'react';
import identicon from '@polkadot/ui-identicon/index';

type Props = BaseProps & {
  size?: number,
  value: string | Uint8Array
};

const DEFAULT_SIZE = 64;

export default class IdentityIcon extends React.PureComponent<Props> {
  render () {
    const { className, style } = this.props;

    return (
      <div
        className={['ui--IdentityIcon', className].join(' ')}
        ref={this.appendIcon}
        style={style}
      />
    );
  }

  appendIcon = (node: Element | null): void => {
    const { size = DEFAULT_SIZE, value } = this.props;

    // https://stackoverflow.com/a/22966637
    if (node && node.parentNode) {
      const cloned = node.cloneNode(false);

      cloned.appendChild(
        identicon(value, size)
      );

      node.parentNode.replaceChild(cloned, node);
    }
  }
}
