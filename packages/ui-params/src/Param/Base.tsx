// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { Size } from '../types';

import React from 'react';
import { Labelled } from '@polkadot/ui-app';

import Bare from './Bare';

type Props = BareProps & {
  children: React.ReactNode,
  isDisabled?: boolean,
  label?: React.ReactNode,
  size?: Size,
  withLabel?: boolean
};

export default class Base extends React.PureComponent<Props> {
  render () {
    const { children, className, isDisabled, label, size = 'medium', style, withLabel } = this.props;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Labelled
          className={isDisabled ? 'full' : size}
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
