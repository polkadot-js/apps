// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from './types';

import React from 'react';

export default class Empty extends React.PureComponent<Props> {
  render () {
    const { className, size, style } = this.props;

    return (
      <div
        className={`container ${className}`}
        style={style}
      >
        <svg
          height={size}
          viewBox='0 0 64 64'
          width={size}
        />
      </div>
    );
  }
}
