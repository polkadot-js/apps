// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx } from '@polkadot/react-components/Status/types';
import { Codec } from '@polkadot/types/types';

import React from 'react';
import { Output } from '@polkadot/react-components';
import { isUndefined } from '@polkadot/util';

interface Props {
  queue: QueueTx[];
}

function Results ({ queue = [] }: Props): React.ReactElement<Props> | null {
  const filtered = queue
    .filter(({ error, result }) => !isUndefined(error) || !isUndefined(result))
    .reverse();

  if (!filtered.length) {
    return null;
  }

  return (
    <section className='rpc--Results'>
      {filtered.map(({ error, id, result, rpc: { method, section } }): React.ReactNode => (
        <Output
          isError={!!error}
          key={id}
          label={`${id}: ${section}.${method}`}
          value={
            error
              ? error.message
              : <pre>{JSON.stringify((result as Codec).toHuman(), null, 2).replace(/"/g, '').replace(/\\/g, '').replace(/\],\[/g, '],\n[')}</pre>
          }
        />
      ))}
    </section>
  );
}

export default React.memo(Results);
