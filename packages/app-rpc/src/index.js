// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';

import translate from './translate';

type Props = I18nProps & {};

type State = {
}

class App extends React.PureComponent<Props, State> {
  state: State = {};

  render (): React$Node {
    const { className, style } = this.props;

    return (
      <div
        className={classes('rpc--App', className)}
        style={style}
      >
        some app goes here
      </div>
    );
  }
}

export default translate(App);
