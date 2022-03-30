// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u64 } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletBagsListListBag } from '@polkadot/types/lookup';
import type { StashNode } from './types';

import React, { useEffect, useState } from 'react';

import { AddressMini, Spinner } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Stash from './Stash';
import useBagEntries from './useBagEntries';
import useBonded from './useBonded';

interface Props {
  id: u64;
  info: PalletBagsListListBag;
  stashNodes?: StashNode[];
}

function Bag ({ id, info, stashNodes }: Props): React.ReactElement<Props> {
  const [[headId, trigger], setHeadId] = useState<[AccountId32 | null, number]>([null, 0]);
  const [isLoading, setLoading] = useState(true);
  const list = useBagEntries(headId, trigger);
  const bonded = useBonded(list);

  useEffect((): void => {
    info && stashNodes &&
      setHeadId(([, trigger]) => [info.head.unwrapOr(null), ++trigger]);
  }, [info, stashNodes]);

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
      <td className='number'><FormatBalance value={id} /></td>
      <td className='address'>{info.head.isSome && <AddressMini value={info.head} />}</td>
      <td className='address'>{info.tail.isSome && <AddressMini value={info.tail} />}</td>
      <td className='address'>
        {stashNodes?.map(({ stashId }) => (
          <Stash
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

export default React.memo(Bag);
