// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Params } from './types';

import React, { useMemo, useRef, useState } from 'react';

import { Button, Table, ToggleGroup } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Create from './Create';
import Pool from './Pool';
import useMembers from './useMembers';

interface Props {
  className?: string;
  ids?: BN[];
  params: Params;
}

function Pools ({ className, ids, params }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const membersMap = useMembers();
  const [typeIndex, setTypeIndex] = useState(1);

  const noCreate = useMemo(
    () => !ids || (!!params.maxPools && (ids.length > params.maxPools)),
    [ids, params]
  );

  const filtered = useMemo(
    () => membersMap && allAccounts && ids
      ? typeIndex
        ? ids
        : ids.filter((id) =>
          (membersMap[id.toString()] || []).some(({ accountId }) =>
            allAccounts.some((a) => accountId.eq(a))
          )
        )
      : undefined,
    [allAccounts, ids, membersMap, typeIndex]
  );

  const header = useMemo(() => [
    [t('pools'), 'start', 2],
    [t('points')],
    [t('members')]
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
          params={params}
        />
      </Button.Group>
      <Table
        className={className}
        empty={filtered && t<string>('No available nomination pools')}
        emptySpinner={t<string>('Retrieving nomination pools')}
        header={header}
      >
        {membersMap && filtered && filtered.map((id) => (
          <Pool
            id={id}
            key={id.toString()}
            members={membersMap[id.toString()]}
            params={params}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Pools);
