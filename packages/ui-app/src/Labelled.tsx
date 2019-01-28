// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import classes from './util/classes';

type Props = BareProps & {
  isHidden?: boolean,
  isSmall?: boolean,
  label?: React.ReactNode,
  children: React.ReactNode,
  withLabel?: boolean
};

const defaultLabel: any = (// node?
  <div>&nbsp;</div>
);

export default class Labelled extends React.PureComponent<Props> {
  render () {
    const { className, children, isSmall, isHidden, label = defaultLabel, style, withLabel = true } = this.props;

    if (isHidden) {
      return null;
    } else if (!withLabel) {
      return (
        <div className={className}>{children}</div>
      );
    }

    return (
      <div
        className={classes('ui--Labelled', isSmall ? 'label-small' : '', className)}
        style={style}
      >
        <label>{label}</label>
        <div className='ui--Labelled-content'>
          {children}
        </div>
      </div>
    );
  }
}
