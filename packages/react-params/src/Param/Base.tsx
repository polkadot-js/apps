// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';
import { Size } from '../types';

import React from 'react';
import { Labelled } from '@canvas-ui/react-components';

import Bare from './Bare';

interface Props extends BareProps {
  children?: React.ReactNode;
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
