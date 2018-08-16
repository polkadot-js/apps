// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import Labelled from './Labelled';

type Props = BareProps & {
  children?: React.ReactNode,
  defaultValue?: any,
  isHidden?: boolean,
  label?: any, // node?
  value?: any, // node?
  withLabel?: boolean
};

export default class Static extends React.PureComponent<Props> {
  render () {
    const { className, children, defaultValue, isHidden, label, style, value, withLabel } = this.props;

    return (
      <Labelled
        className={className}
        isHidden={isHidden}
        label={label}
        style={style}
        withLabel={withLabel}
      >
        <div className='ui dropdown selection disabled'>
          {value || defaultValue}
          {children}
        </div>
      </Labelled>
    );
  }
}
