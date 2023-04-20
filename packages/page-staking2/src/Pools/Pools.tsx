// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { OwnPool, Params } from './types.js';

import React, { useMemo, useState } from 'react';

import { Button, Table, ToggleGroup } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { arrayFlatten } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Create from './Create.js';
import Pool from './Pool.js';
import useMembers from './useMembers.js';

interface Props {
  className?: string;
  ids?: BN[];
  ownPools?: OwnPool[];
  params: Params;
}

function Pools ({ className, ids, ownPools, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
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
      ? typeIndex === 2
        ? ids.filter((id) => id.toNumber() >= 2 && id.toNumber() <= 11)
        : typeIndex === 1
          ? ids
          : ids.filter((id) => ownPools.some(({ poolId }) => id.eq(poolId)))
      : undefined,
    [ids, ownPools, typeIndex]
  );

  const header = useMemo<[React.ReactNode?, string?, number?][]>(
    () => [
      [t<string>('pools'), 'start', 2],
      [t<string>('state'), 'media--1100'],
      [t<string>('points')],
      [t<string>('claimable'), 'media--1400'],
      [undefined, undefined, 3]
    ],
    [t]
  );

  const poolTypes = useMemo(() => {
    const headers = [
      { text: t<string>('Own pools'), value: 'mine' },
      { text: t<string>('All pools'), value: 'all' }];

    if (!api.runtimeChain.toString().includes('Aleph Zero Testnet')) {
      headers.push({ text: t('Foundation pools'), value: 'all' });
    }

    return headers;
  },
  [api, t]);

  return (
    <>
      <Button.Group>
        <ToggleGroup
          onChange={setTypeIndex}
          options={poolTypes}
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
