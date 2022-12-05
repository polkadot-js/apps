// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';

import { LinkExternal } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import Killed from './RefKilled';
import Ongoing from './RefOngoing';
import Tuple from './RefTuple';

const Components: Record<string, React.ComponentType<Props>> = {
  Killed,
  Ongoing
};

function Referendum (props: Props): React.ReactElement<Props> {
  const { className, palletReferenda, value: { id, info } } = props;

  const Component = useMemo(
    () => Components[info.type] || Tuple,
    [info]
  );

  return (
    <tr className={className}>
      <td className='number'>
        <h1>{formatNumber(id)}</h1>
      </td>
      <Component {...props} />
      <td className='links media--1000'>
        <LinkExternal
          data={id}
          type={palletReferenda}
        />
      </td>
    </tr>
  );
}

export default React.memo(Referendum);
