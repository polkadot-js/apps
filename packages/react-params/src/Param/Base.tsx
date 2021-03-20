// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Size } from '../types';

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
