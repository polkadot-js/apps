// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { QueueTx } from '@polkadot/react-components/Status/types';

import React from 'react';
import { Output } from '@polkadot/react-components';
import { isUndefined } from '@polkadot/util';

interface Props extends BareProps {
  queue: QueueTx[];
}

export default function Results ({ queue = [] }: Props): React.ReactElement<Props> | null {
  const filtered = queue
    .filter(({ error, result }): boolean =>
      !isUndefined(error) || !isUndefined(result)
    )
    .reverse();

  if (!filtered.length) {
    return null;
  }

  return (
    <section className='rpc--Results'>
      {filtered.map(({ error, id, result, rpc: { section, method } }): React.ReactNode => (
        <Output
          isError={!!error}
          key={id}
          label={`${id}: ${section}.${method}`}
          value={
            error
              ? error.message
              : <pre>{JSON.stringify(result, null, 2)}</pre>
          }
        />
      ))}
    </section>
  );
}
