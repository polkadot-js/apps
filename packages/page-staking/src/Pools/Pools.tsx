// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { Params } from './types';

import React, { useMemo } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Pool from './Pool';

interface Props {
  className?: string;
  ids?: AccountId[];
  params: Params;
}

function Pools ({ className, ids, params }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [t('pools'), 'start', 3]
  ], [t]);

  return (
    <Table
      className={className}
      empty={ids && t<string>('No available nomination pools')}
      emptySpinner={t<string>('Retrieving nomination pools')}
      header={header}
    >
      {ids?.map((id) => (
        <Pool
          id={id}
          key={id.toString()}
          params={params}
        />
      ))}
    </Table>
  );
}

export default React.memo(Pools);
