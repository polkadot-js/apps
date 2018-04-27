// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';

type Props = {
  className?: string,
  children: React$Node,
  label?: string,
  size?: 'full' | 'large' | 'medium' | 'small',
  style?: {
    [string]: string
  }
};

export default function Base ({ children, className, label, size = 'medium', style }: Props): React$Node {
  return (
    <div
      className={['extrinsics--split', className].join(' ')}
      style={style}
    >
      <div className={size}>
        <Label>{label}</Label>
        {children}
      </div>
    </div>
  );
}
