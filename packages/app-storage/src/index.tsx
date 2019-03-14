// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { QueryTypes } from './types';

import './index.css';

import React from 'react';

import Queries from './Queries';
import Selection from './Selection';
import translate from './translate';

type Props = AppProps & I18nProps;

type State = {
  queue: Array<QueryTypes>
};

class StorageApp extends React.PureComponent<Props, State> {
  state: State = {
    queue: []
  };

  render () {
    const { basePath } = this.props;
    const { queue } = this.state;

    return (
      <main className='storage--App'>
        <Selection
          basePath={basePath}
          onAdd={this.onAdd}
        />
        <Queries
          onRemove={this.onRemove}
          value={queue}
        />
      </main>
    );
  }

  private onAdd = (query: QueryTypes): void => {
    this.setState(
      (prevState: State): State => ({
        queue: [query].concat(prevState.queue)
      })
    );
  }

  private onRemove = (id: number): void => {
    this.setState(
      (prevState: State): State => ({
        queue: prevState.queue.filter((item) => item.id !== id)
      })
    );
  }
}

export default translate(StorageApp);
