// Copyright 2017-2025 @polkadot/app-scheduler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveDispatch } from '@polkadot/api-derive/types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';

import DispatchEntry from './DispatchEntry.js';
import { useTranslation } from './translate.js';

interface Props {
  className?: string;
}

function DispatchQueue ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const queued = useCall<DeriveDispatch[]>(api.derive.democracy.dispatchQueue);

  const filtered = useMemo(
    () => bestNumber && queued?.filter(({ at }) => at.gte(bestNumber)).sort((a, b) => a.at.cmp(b.at)),
    [bestNumber, queued]
  );

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('dispatch queue'), 'start', 2],
    [t('enact')],
    [],
    [undefined, 'media--1000']
  ]);

  return (
    <Table
      className={className}
      empty={filtered && t('Nothing queued for execution')}
      header={headerRef.current}
    >
      {filtered?.map((entry): React.ReactNode => (
        <DispatchEntry
          key={entry.index.toString()}
          value={entry}
        />
      ))}
    </Table>
  );
}

export default React.memo(DispatchQueue);
