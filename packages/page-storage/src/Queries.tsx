// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryTypes } from './types';

import React from 'react';

import Query from './Query';

interface Props {
  onRemove: (id: number) => void;
  value?: QueryTypes[];
}

function Queries ({ onRemove, value }: Props): React.ReactElement<Props> | null {
  if (!value || !value.length) {
    return null;
  }

  return (
    <section className='storage--Queries'>
      {value.map((query): React.ReactNode =>
        <Query
          key={query.id}
          onRemove={onRemove}
          value={query}
        />
      )}
    </section>
  );
}

export default React.memo(Queries);
