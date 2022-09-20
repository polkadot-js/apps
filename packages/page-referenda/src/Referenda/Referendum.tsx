// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';

import { formatNumber } from '@polkadot/util';

import Killed from './RefKilled';
import Ongoing from './RefOngoing';
import Tuple from './RefTuple';
import { getTrackName } from './util';

const Components: Record<string, React.ComponentType<Props>> = {
  Killed,
  Ongoing
};

function Referendum (props: Props): React.ReactElement<Props> {
  const { className, value: { id, info, track } } = props;

  const Component = useMemo(
    () => Components[info.type] || Tuple,
    [info]
  );

  const trackName = useMemo(
    () => track && getTrackName(track),
    [track]
  );

  return (
    <tr className={className}>
      <td className='number'>
        <h1>{formatNumber(id)}</h1>
      </td>
      <td className='number'>
        {trackName}
      </td>
      {/* <td>
        <textarea
          rows={8}
          style={{ width: 512 }}
        >{JSON.stringify(info.toHuman(), null, 2)}</textarea>
      </td> */}
      <Component {...props} />
    </tr>
  );
}

export default React.memo(Referendum);
