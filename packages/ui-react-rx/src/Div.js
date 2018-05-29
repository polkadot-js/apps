// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps, BareProps } from './types';

import React from 'react';

type Props<T> = BaseProps<T>;

// FIXME Not 100% on how to push through the generic type when used
// flowlint-next-line unclear-type: off
const echoFormatter = (value?: any): any =>
  value;

export default function Div<T> ({ children, className = 'rx--Div', render = echoFormatter, rxUpdated = false, label = '', style, value }: Props<T>): React$Node {
  const props: BareProps = {
    className: [className, rxUpdated ? 'rx--updated' : undefined]
      .filter((c) => c)
      .join(' ') || undefined,
    style
  };

  return (
    <div {...props}>
      {label}{render(value) || ''}{children}
    </div>
  );
}
