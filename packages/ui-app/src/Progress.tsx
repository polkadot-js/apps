// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIProgress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';

import classes from './util/classes';

type Colors = 'blue' | 'green' | 'red' | 'orange';

type Props = BareProps & {
  color?: Colors,
  percent: number
};

export default class Progress extends React.PureComponent<Props> {
  render () {
    const { className, color = 'blue', percent, style } = this.props;

    return (
      <SUIProgress
        className={classes('ui--Card', className)}
        color={color}
        percent={percent}
        size='tiny'
        style={style}
      />
    );
  }
}
