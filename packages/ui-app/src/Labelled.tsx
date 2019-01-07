// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

import classes from './util/classes';

type Props = BareProps & {
  isHidden?: boolean,
  label?: any,
  children: any, // node?
  withLabel?: boolean
};

const defaultLabel: any = (// node?
  <div>&nbsp;</div>
);

export default class Labelled extends React.PureComponent<Props> {
  render () {
    const { className, children, isHidden = false, label = defaultLabel, style, withLabel = true } = this.props;

    if (isHidden) {
      return null;
    }

    return (
      <div
        className={classes('ui--Labelled', className)}
        style={style}
      >
        {
          withLabel
            ? <Label>{label}</Label>
            : null
        }
        {children}
      </div>
    );
  }
}
