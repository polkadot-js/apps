// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';

type Props = BareProps & {
  label?: React$Node,
  children: React$Node
};

export default function Labelled ({ className, children, label, style }: Props): React$Node {
  console.log('label', label);

  return (
    <div
      className={className}
      style={style}
    >
      <Label>{
        typeof label === 'undefined'
          ? <div>&nbsp;</div>
          : label
      }</Label>
      {children}
    </div>
  );
}
