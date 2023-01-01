// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { OwnPool } from '../types';
import type { Params } from './types';

import React, { useMemo, useRef, useState } from 'react';

import { Button, Table, ToggleGroup } from '@polkadot/react-components';
import { arrayFlatten } from '@polkadot/util';

import { useTranslation } from '../translate';
import Create from './Create';
import Pool from './Pool';
import useMembers from './useMembers';

interface Props {
  className?: string;
  ids?: BN[];
  ownPools?: OwnPool[];
  params: Params;
}

function Pools ({ className, ids, ownPools, params }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const membersMap = useMembers();
  const [typeIndex, setTypeIndex] = useState(() => ownPools && ownPools.length ? 0 : 1);

  const ownAccounts = useMemo(
    () => ownPools && arrayFlatten(ownPools.map(({ members }) => Object.keys(members))),
    [ownPools]
  );

  const noCreate = useMemo(
    () => !ids || (!!params.maxPools && (ids.length > params.maxPools)),
    [ids, params]
  );

  const filtered = useMemo(
    () => ownPools && ids
      ? typeIndex
        ? ids
        : ids.filter((id) => ownPools.some(({ poolId }) => id.eq(poolId)))
      : undefined,
    [ids, ownPools, typeIndex]
  );

  const header = useMemo(() => [
    [t('pools'), 'start', 2],
    [t('state'), 'media--1100'],
    [t('points')],
    [t('claimable'), 'media--1400'],
    [undefined, undefined, 3]
  ], [t]);

  const poolTypes = useRef([
    { text: t('Own pools'), value: 'mine' },
    { text: t('All pools'), value: 'all' }
  ]);

  return (
    <>
      <Button.Group>
        <ToggleGroup
          onChange={setTypeIndex}
          options={poolTypes.current}
          value={typeIndex}
        />
        <Create
          isDisabled={noCreate}
          ownAccounts={ownAccounts}
          params={params}
        />
      </Button.Group>
      <Table
        className={className}
        empty={membersMap && filtered && t<string>('No available nomination pools')}
        emptySpinner={t<string>('Retrieving nomination pools')}
        header={header}
      >
        {membersMap && filtered && filtered.map((poolId) => (
          <Pool
            key={poolId.toString()}
            members={membersMap[poolId.toString()]}
            ownAccounts={ownAccounts}
            params={params}
            poolId={poolId}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Pools);
