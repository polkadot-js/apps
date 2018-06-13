// Copyright 2017-2018 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-app/types';
import type { QueueTx } from '@polkadot/ui-signer/types';

import React from 'react';

import Output from '@polkadot/ui-app/Output';
import classes from '@polkadot/ui-app/util/classes';
import isUndefined from '@polkadot/util/is/undefined';

import resultToText from './resultToText';

type Props = BareProps & {
  queue: Array<QueueTx>
};

export default function Results ({ className, queue = [], style }: Props): React$Node {
  const filtered = queue
    .filter(({ error, result }) =>
      !isUndefined(error) || !isUndefined(result)
    )
    .reverse();

  if (!filtered.length) {
    return null;
  }

  return (
    <div
      className={classes('rpc--Results', className)}
      style={style}
    >
      {filtered.map(({ error, id, result, rpc: { section, name } }) => (
        <Output
          isError={!!error}
          key={id}
          label={`${id}: ${section}.${name}`}
          value={
            error
              ? error.message
              : resultToText(result)
          }
        />
      ))}
    </div>
  );
}
