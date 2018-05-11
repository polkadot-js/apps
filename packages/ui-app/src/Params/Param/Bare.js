// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../../types';

import React from 'react';

type Props = BareProps & {
  children: React$Node
};

export default function Bare ({ children, className, style }: Props): React$Node {
  return (
    <div
      className={['ui--row', className].join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}
