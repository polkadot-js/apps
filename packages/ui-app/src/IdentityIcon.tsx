// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IdentityProps } from '@polkadot/ui-identicon/types';

import React from 'react';
import BaseIdentityIcon from '@polkadot/ui-identicon/index';

export default class IdentityIcon extends React.PureComponent<IdentityProps> {
  render () {
    return (
      <BaseIdentityIcon
        {...this.props}
        onCopy={this.onCopy}
      />
    );
  }

  private onCopy = (address: string): void => {
    const { onCopy } = this.props;

    if (onCopy) {
      onCopy(address);
    }
  }
}
