// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueTx } from '@polkadot/ui-app/Status/types';

import React from 'react';
import { Output } from '@polkadot/ui-app';
import { isUndefined } from '@polkadot/util';

type Props = BareProps & {
  queue: Array<QueueTx>
};

export default class Results extends React.PureComponent<Props> {
  render () {
    const { queue = [] } = this.props;

    const filtered = queue
      .filter(({ error, result }) =>
        !isUndefined(error) || !isUndefined(result)
      )
      .reverse();

    if (!filtered.length) {
      return null;
    }

    return (
      <section className='rpc--Results'>
        {filtered.map(({ error, id, result, rpc: { section, method } }) => (
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
}
