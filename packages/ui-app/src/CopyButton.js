// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Button from 'semantic-ui-react/dist/es/elements/Button';

type Props = BareProps & {
  value?: string
}

export default function CopyButton ({ className, style, value }: Props): React$Node {
  return (
    <CopyToClipboard text={value}>
      <Button
        className={className}
        icon='copy'
        primary
        size='tiny'
        style={style}
      />
    </CopyToClipboard>
  );
}
