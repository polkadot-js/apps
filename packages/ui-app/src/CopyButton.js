// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Button$Sizes } from './Button';
import type { BareProps } from './types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Button from './Button';

type Props = BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  value?: mixed
}

export default function CopyButton ({ className, icon = 'copy', isCircular = true, isPrimary = true, size = 'tiny', style, value }: Props): React$Node {
  return (
    <CopyToClipboard text={value}>
      <Button
        className={className}
        icon={icon}
        isCircular={isCircular}
        isPrimary={isPrimary}
        size={size}
        style={style}
      />
    </CopyToClipboard>
  );
}
