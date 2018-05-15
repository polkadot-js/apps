// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps as Props } from '@polkadot/ui-app/types';

import React from 'react';

import classes from '@polkadot/ui-app/src/util/classes';

import translate from './translate';

type State = {};

class Hash extends React.PureComponent<Props, State> {
  state: State = {};

  render (): React$Node {
    const { className, style } = this.props;

    return (
      <div
        className={classes('toolbox--Hash', className)}
        style={style}
      >
        Hashing goes here
      </div>
    );
  }
}

export default translate(Hash);
