// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from './types';

import React from 'react';

type Props = BareProps & {
  value: Array<QueueTx>
}

export default function Status ({ className, style, value }: Props): React$Node {
  const available = value.filter(({ isValid, status }) =>
    isValid && !['completed', 'incomplete'].includes(status)
  );

  if (!available.length) {
    return null;
  }

  return (
    <div
      className={['extrinsics--Status', className].join(' ')}
      style={style}
    >
      {available.map(({ extrinsic: { name, section }, status }) =>
        <div className={['extrinsics--Status-Item', status].join(' ')}>
          <div className='header'>
            {section}_{name}
          </div>
          <div className='status'>
            {status}
          </div>
        </div>
      )}
    </div>
  );
}
