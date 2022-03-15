// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Params } from './types';

import React from 'react';

import { FormatBalance } from '@polkadot/react-query';
import { formatNumber, stringify } from '@polkadot/util';

import Join from './Join';
import usePoolInfo from './usePoolInfo';

interface Props {
  className?: string;
  id: BN;
  params: Params;
}

function Pool ({ className, id, params }: Props): React.ReactElement<Props> | null {
  const info = usePoolInfo(id);

  if (!info) {
    return null;
  }

  console.log(stringify(info, 2));

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='start'>{info.metadata?.length ? info.metadata?.toString() : null}</td>
      <td className='number'><FormatBalance value={info.bonded?.points} /></td>
      <td className='number'>{formatNumber(info.bonded?.delegatorCounter)}</td>
      <td className='button'>
        <Join
          id={id}
          isDisabled={!info.bonded?.state.isOpen}
          params={params}
        />
      </td>
    </tr>
  );
}

export default React.memo(Pool);
