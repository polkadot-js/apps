// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '../../types';
import { Size } from '../types';

import React from 'react';

import Labelled from '../../Labelled';
import Bare from './Bare';

type Props = BareProps & {
  children: React.ReactNode,
  isDisabled?: boolean,
  label?: string,
  size?: Size,
  withLabel?: boolean
};

export default function Base ({ children, className, isDisabled, label, size = 'medium', style, withLabel }: Props) {
  return (
    <Bare
      className={className}
      style={style}
    >
      <Labelled
        className={isDisabled ? 'full' : size}
        label={label}
        withLabel={withLabel}
      >
        {children}
      </Labelled>
    </Bare>
  );
}
