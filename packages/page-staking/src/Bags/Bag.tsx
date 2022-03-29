// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u64 } from '@polkadot/types';
import type { PalletBagsListListBag } from '@polkadot/types/lookup';
import type { StashNode } from './types';

import React, { useEffect, useMemo, useState } from 'react';

import { AddressMini, Spinner } from '@polkadot/react-components';
import { useIncrement } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import Stash from './Stash';
import useBagEntries from './useBagEntries';
import useBonded from './useBonded';

interface Props {
  id: u64;
  info: PalletBagsListListBag;
  stashNodes?: StashNode[];
}

export default function Bag ({ id, info, stashNodes }: Props): React.ReactElement<Props> {
  const [isLoading, setLoading] = useState(true);
  const [trigger, doRefresh] = useIncrement(1);
  const headId = useMemo(
    () => stashNodes && stashNodes.length
      ? info.head.unwrapOr(null)
      : null,
    [info, stashNodes]
  );
  const list = useBagEntries(headId, trigger);
  const bonded = useBonded(list);

  useEffect((): void => {
    setLoading(
      stashNodes && stashNodes.length
        ? list
          ? !bonded
          : true
        : false
    );
  }, [bonded, list, stashNodes]);

  return (
    <tr>
      <td className='number'>{formatNumber(id)}</td>
      <td className='address'>{info.head.isSome && <AddressMini value={info.head} />}</td>
      <td className='address'>{info.tail.isSome && <AddressMini value={info.tail} />}</td>
      <td className='address'>
        {stashNodes?.map(({ stashId }) => (
          <Stash
            doRefresh={doRefresh}
            isLoading={isLoading}
            key={stashId}
            list={bonded}
            stashId={stashId}
          />
        ))}
      </td>
      <td className='number'>
        {isLoading
          ? <Spinner noLabel />
          : list.length
            ? formatNumber(list.length)
            : null
        }
      </td>
    </tr>
  );
}
