// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { BareProps } from './types';

import React from 'react';

import classes from './util/classes';
import Button from './Button';

type Props = BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  value?: any
};

export default class UploadIcon extends React.PureComponent<Props> {
  render () {
    const { className, icon = 'cloud upload', isCircular = false, isPrimary = false, size = 'massive', style } = this.props;

    return (
      <Button
        className={classes('ui--UploadIcon', className)}
        icon={icon}
        isCircular={isCircular}
        isPrimary={isPrimary}
        size={size}
        style={style}
      />
    );
  }
}
