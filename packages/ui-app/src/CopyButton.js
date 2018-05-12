// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Button from 'semantic-ui-react/dist/es/elements/Button';

type Button$Sizes = 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';

type Props = BareProps & {
  icon?: string,
  isPrimary?: boolean,
  size?: Button$Sizes,
  value?: string
}

export default function CopyButton ({ className, icon = 'copy', isPrimary = true, size = 'tiny', style, value }: Props): React$Node {
  return (
    <CopyToClipboard text={value}>
      <Button
        className={className}
        icon={icon}
        primary={isPrimary}
        size={size}
        style={style}
      />
    </CopyToClipboard>
  );
}
