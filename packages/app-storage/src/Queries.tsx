// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { StorageQuery } from './types';

import React from 'react';

import Query from './Query';

type Props = BareProps & {
  onRemove: (id: number) => void,
  value?: Array<StorageQuery>
};

export default class Queries extends React.PureComponent<Props> {
  render () {
    const { onRemove, value } = this.props;

    if (!value || !value.length) {
      return null;
    }

    return (
      <section className='storage--Queries'>
        {value.map((query) =>
          <Query
            key={query.id}
            onRemove={onRemove}
            value={query}
          />
        )}
      </section>
    );
  }
}
