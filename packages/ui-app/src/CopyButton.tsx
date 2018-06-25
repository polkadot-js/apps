// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { BareProps } from './types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Button from './Button';

type Props = BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  value?: any
}

export default function CopyButton ({ className, icon = 'copy', isCircular = true, isPrimary = true, size = 'tiny', style, value }: Props) {
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
