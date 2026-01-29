// Copyright 2017-2025 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryTypes } from './types.js';

import React from 'react';

import Query from './Query.js';

interface Props {
  onRemove: (id: number) => void;
  value?: QueryTypes[];
}

function Queries ({ onRemove, value }: Props): React.ReactElement<Props> | null {
  if (!value?.length) {
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
