// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Size } from '../types';

import React from 'react';
import { Labelled } from '@polkadot/react-components';

import Bare from './Bare';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  isOuter?: boolean;
  label?: React.ReactNode;
  size?: Size;
  withLabel?: boolean;
}

function Base ({ children, className = '', isOuter, label, size = 'full', withLabel }: Props): React.ReactElement<Props> {
  return (
    <Bare className={className}>
      <Labelled
        className={size}
        isOuter
        label={label}
        withEllipsis
        withLabel={withLabel}
      >
        {!isOuter && children}
      </Labelled>
      {isOuter && children}
    </Bare>
  );
}

export default React.memo(Base);
