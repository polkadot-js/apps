// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { Size } from '../types';

import React from 'react';
import { Labelled } from '@polkadot/react-components';

import Bare from './Bare';

interface Props extends BareProps {
  children: React.ReactNode;
  isDisabled?: boolean;
  label?: React.ReactNode;
  size?: Size;
  withLabel?: boolean;
}

export default class Base extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className, label, size = 'full', style, withLabel } = this.props;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Labelled
          className={size}
          label={label}
          withEllipsis
          withLabel={withLabel}
        >
          {children}
        </Labelled>
      </Bare>
    );
  }
}
