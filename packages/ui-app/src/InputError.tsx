// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

import classes from './util/classes';

type Props = BareProps & {
  label?: React.ReactNode
};

const defaultLabel: React.ReactNode = (
  <div>&nbsp;</div>
);

export default class InputError extends React.PureComponent<Props> {
  render () {
    const { className, label = defaultLabel, style } = this.props;

    return (
      <div
        className={classes('ui--InputError', className)}
        style={style}
      >
        <Label color='red' pointing='left'>{label}</Label>
      </div>
    );
  }
}
