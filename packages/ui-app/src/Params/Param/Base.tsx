// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '../../types';
import { Size } from '../types';

import React from 'react';

import Labelled from '../../Labelled';
import Bare from './Bare';

type Props = BareProps & {
  children: any, // node?
  label?: string,
  size?: Size,
  withLabel?: boolean
};

export default function Base ({ children, className, label, size = 'medium', style, withLabel }: Props) {
  return (
    <Bare
      className={className}
      style={style}
    >
      <Labelled
        className={size}
        label={label}
        withLabel={withLabel}
      >
        {children}
      </Labelled>
    </Bare>
  );
}
