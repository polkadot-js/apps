// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletBagsListListBag } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { ListNode, StashNode } from './types';

import React, { useEffect, useState } from 'react';

import { AddressMini, Spinner } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Stash from './Stash';
import useBagEntries from './useBagEntries';
import useBonded from './useBonded';

interface Props {
  index: number;
  info: PalletBagsListListBag;
  lower: BN;
  stashNodes?: StashNode[];
  upper: BN;
}

function getRebags (bonded: ListNode[], stashNodes: StashNode[], lower: BN, upper: BN): string[] {
  return bonded
    .filter(({ bonded, stashId }) =>
      (
        bonded.gt(upper) ||
        bonded.lt(lower)
      ) &&
      stashNodes.every((n) => n.stashId !== stashId)
    )
    .map(({ stashId }) => stashId);
}

function Bag ({ info, lower, stashNodes, upper }: Props): React.ReactElement<Props> {
  const [[headId, trigger], setHeadId] = useState<[AccountId32 | null, number]>([null, 0]);
  const [, setRebags] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isCompleted, list] = useBagEntries(headId, trigger);
  const bonded = useBonded(list);

  useEffect((): void => {
    info && stashNodes &&
      setHeadId(([, trigger]) => [info.head.unwrapOr(null), ++trigger]);
  }, [info, stashNodes]);

  useEffect((): void => {
    setLoading(
      stashNodes && stashNodes.length
        ? !isCompleted || !bonded
        : false
    );
  }, [bonded, isCompleted, stashNodes]);

  // TODO: Currently not used, but calculated. This is the list of stashes that
  // should be rebagged (need to provide a rebag modal to move all these at once)
  useEffect((): void => {
    // NOTE: There may be some issues if these are indeed rebagged - we need
    // the StashNode to see if this item is indeed still within this list
    !isLoading && bonded && stashNodes && setRebags(
      getRebags(bonded, stashNodes, lower, upper)
    );
  }, [bonded, isLoading, lower, stashNodes, upper]);

  return (
    <tr>
      <td className='number' />
      <td className='number'><FormatBalance value={upper} /></td>
      <td className='number'><FormatBalance value={lower} /></td>
      <td className='address'>{info.head.isSome && <AddressMini value={info.head} />}</td>
      <td className='address'>{info.tail.isSome && <AddressMini value={info.tail} />}</td>
      <td className='address'>
        {stashNodes?.map(({ stashId }) => (
          <Stash
            isLoading={isLoading}
            key={stashId}
            list={bonded}
            lower={lower}
            stashId={stashId}
            upper={upper}
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
