// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { BareProps } from './types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Button from './Button';
import classes from './util/classes';

type Props = BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  value?: any
};

export default class CopyButton extends React.PureComponent<Props> {
  render () {
    const { className, icon = 'copy', isCircular = true, isPrimary = true, size = 'tiny', style, value } = this.props;

    return (
      <CopyToClipboard text={value}>
        <Button
          className={classes('ui--CopyButton', className)}
          icon={icon}
          isCircular={isCircular}
          isPrimary={isPrimary}
          size={size}
          style={style}
        />
      </CopyToClipboard>
    );
  }
}
