// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { QueryTypes } from './types';

import './index.css';

import React from 'react';

import Queries from './Queries';
import Selection from './Selection/index';
import translate from './translate';

type Props = I18nProps & {
  basePath: string,
  onStatusChange: (status: ActionStatus) => void
};

type State = {
  queue: Array<QueryTypes>
};

class StorageApp extends React.PureComponent<Props, State> {
  state: State = {
    queue: []
  };

  render () {
    const { queue } = this.state;

    return (
      <main className='storage--App'>
        <Selection onAdd={this.onAdd} />
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
