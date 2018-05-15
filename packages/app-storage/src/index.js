// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';
import type { StorageQuery } from './types';

import './index.css';

import React from 'react';

import classes from '@polkadot/ui-app/src/util/classes';

import Queries from './Queries';
import Selection from './Selection';
import translate from './translate';

type Props = I18nProps & {};

type State = {
  queue: Array<StorageQuery>
}

class App extends React.PureComponent<Props, State> {
  state: State = {
    queue: []
  };

  render (): React$Node {
    const { className, style } = this.props;
    const { queue } = this.state;

    return (
      <div
        className={classes('storage--App', className)}
        style={style}
      >
        <Selection onAdd={this.onAdd} />
        <Queries
          onRemove={this.onRemove}
          value={queue}
        />
      </div>
    );
  }

  onAdd = (query: StorageQuery): void => {
    this.setState(
      (prevState: State): State => ({
        queue: [query].concat(prevState.queue)
      })
    );
  }

  onRemove = (id: number): void => {
    this.setState(
      (prevState: State): State => ({
        queue: prevState.queue.filter((item) => item.id !== id)
      })
    );
  }
}

export default translate(App);
