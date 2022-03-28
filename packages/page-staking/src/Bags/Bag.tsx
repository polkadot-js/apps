// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u64 } from '@polkadot/types';
import type { PalletBagsListListBag } from '@polkadot/types/lookup';
import type { StashNode } from './types';

import React from 'react';

import { AddressMini } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

// import useBagEntries from './useBagEntries';

interface Props {
  id: u64;
  info: PalletBagsListListBag;
  stashNodes?: StashNode[];
}

export default function Bag ({ id, info, stashNodes = [] }: Props): React.ReactElement<Props> {
  // const entries = useBagEntries(stashNodes.length ? info.head.unwrapOr(null) : null);

  return (
    <tr>
      <td className='number'>{formatNumber(id)}</td>
      <td className='address'>{info.head.isSome && <AddressMini value={info.head} />}</td>
      <td className='address'>{info.tail.isSome && <AddressMini value={info.tail} />}</td>
      <td className='address'>
        {stashNodes?.map(({ stashId }) => (
          <AddressMini
            key={stashId}
            value={stashId}
            withBonded
          />
        ))}
      </td>
    </tr>
  );
}
