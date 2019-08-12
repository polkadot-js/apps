// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { QueryTypes } from './types';

import './index.css';

import React from 'react';

import Queries from './Queries';
import Selection from './Selection';
import translate from './translate';

type Props = AppProps & I18nProps;

interface State {
  queue: QueryTypes[];
}

class StorageApp extends React.PureComponent<Props, State> {
  public state: State = {
    queue: []
  };

  public render (): React.ReactNode {
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
        queue: prevState.queue.filter((item): boolean => item.id !== id)
      })
    );
  }
}

export default translate(StorageApp);
