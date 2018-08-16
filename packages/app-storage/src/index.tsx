// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { StorageQuery } from './types';

import './index.css';

import React from 'react';
import Page from '@polkadot/ui-app/Page';
import classes from '@polkadot/ui-app/util/classes';

import Queries from './Queries';
import Selection from './Selection';
import translate from './translate';

type Props = I18nProps & {
  basePath: string
};

type State = {
  queue: Array<StorageQuery>
};

class StorageApp extends React.PureComponent<Props, State> {
  state: State = {
    queue: []
  };

  render () {
    const { className, style } = this.props;
    const { queue } = this.state;

    return (
      <Page
        className={classes('storage--App', className)}
        style={style}
      >
        <Selection onAdd={this.onAdd} />
        <Queries
          onRemove={this.onRemove}
          value={queue}
        />
      </Page>
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

export default translate(StorageApp);
