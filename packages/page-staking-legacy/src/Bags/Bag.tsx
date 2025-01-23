// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletBagsListListBag } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { ListNode, StashNode } from './types.js';

import React, { useEffect, useState } from 'react';

import { AddressMini, Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import Rebag from './Rebag.js';
import Stash from './Stash.js';
import useBagEntries from './useBagEntries.js';
import useBonded from './useBonded.js';

interface Props {
  bagLower: BN;
  bagUpper: BN;
  index: number;
  info: PalletBagsListListBag;
  nodesOwn?: StashNode[];
}

function getRebags (bonded: ListNode[], bagUpper: BN, bagLower: BN): string[] {
  return bonded
    .filter(({ bonded }) =>
      bonded.gt(bagUpper) ||
      bonded.lt(bagLower)
    )
    .map(({ stashId }) => stashId);
}

function Bag ({ bagLower, bagUpper, info, nodesOwn }: Props): React.ReactElement<Props> {
  const [[headId, trigger], setHeadId] = useState<[AccountId32 | null, number]>([null, 0]);
  const [rebags, setRebags] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isCompleted, list] = useBagEntries(headId, trigger);
  const bonded = useBonded(list);

  useEffect((): void => {
    info && nodesOwn &&
      setHeadId(([, trigger]) => [info.head.unwrapOr(null), ++trigger]);
  }, [info, nodesOwn]);

  useEffect((): void => {
    setLoading(
      nodesOwn?.length
        ? !isCompleted || !bonded
        : false
    );
  }, [bonded, isCompleted, nodesOwn]);

  useEffect((): void => {
    !isLoading && bonded && setRebags(
      getRebags(bonded, bagUpper, bagLower)
    );
  }, [bagLower, bagUpper, bonded, isLoading]);

  return (
    <tr>
      <td className='number' />
      <Table.Column.Balance value={bagUpper} />
      <Table.Column.Balance value={bagLower} />
      <td className='address'>{info.head.isSome && <AddressMini value={info.head.unwrap()} />}</td>
      <td className='address'>{info.tail.isSome && <AddressMini value={info.tail.unwrap()} />}</td>
      <td className='address'>
        {nodesOwn?.map(({ stashId }) => (
          <Stash
            bagLower={bagLower}
            bagUpper={bagUpper}
            isLoading={isLoading}
            key={stashId}
            list={bonded}
            stashId={stashId}
          />
        ))}
      </td>
      <td className='number'>
        {isLoading
          ? <span className='--tmp'>99</span>
          : list.length
            ? formatNumber(list.length)
            : null
        }
      </td>
      <td className='button'>
        {!isLoading && (
          <Rebag
            bagLower={bagLower}
            bagUpper={bagUpper}
            stashIds={rebags}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Bag);
