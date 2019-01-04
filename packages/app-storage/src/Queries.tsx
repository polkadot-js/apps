// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueryTypes } from './types';

import React from 'react';

import Query from './Query';

type Props = BareProps & {
  onRemove: (id: number) => void,
  value?: Array<QueryTypes>
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
