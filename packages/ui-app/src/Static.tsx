// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import Labelled from './Labelled';

interface Props extends BareProps {
  children?: React.ReactNode;
  defaultValue?: any;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isHidden?: boolean;
  label?: React.ReactNode;
  value?: React.ReactNode;
  withLabel?: boolean;
}

export default class Static extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, children, defaultValue, help, isHidden, label, style, value, withLabel } = this.props;

    return (
      <Labelled
        className={className}
        help={help}
        isHidden={isHidden}
        label={label}
        style={style}
        withLabel={withLabel}
      >
        <div className='ui--Static ui dropdown selection disabled'>
          {value || defaultValue}
          {children}
        </div>
      </Labelled>
    );
  }
}
