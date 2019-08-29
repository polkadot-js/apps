// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { QueryTypes } from './types';

import React from 'react';

import Query from './Query';

interface Props extends BareProps {
  onRemove: (id: number) => void;
  value?: QueryTypes[];
}

export default function Queries ({ onRemove, value }: Props): React.ReactElement<Props> | null {
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
