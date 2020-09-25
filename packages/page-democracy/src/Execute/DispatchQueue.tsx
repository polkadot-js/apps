// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveDispatch } from '@polkadot/api-derive/types';

import React, { useRef } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import DispatchEntry from './DispatchEntry';

interface Props {
  className?: string;
}

function DispatchQueue ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const queued = useCall<DeriveDispatch[]>(api.derive.democracy.dispatchQueue);

  const headerRef = useRef([
    [t('dispatch queue'), 'start', 2],
    [t('enact')],
    [],
    [undefined, 'media--1000']
  ]);

  return (
    <Table
      className={className}
      empty={queued && t<string>('Nothing queued for execution')}
      header={headerRef.current}
    >
      {queued?.map((entry): React.ReactNode => (
        <DispatchEntry
          key={entry.index.toString()}
          value={entry}
        />
      ))}
    </Table>
  );
}

export default React.memo(DispatchQueue);
