// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveDispatch } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
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
  const queued = useCall<DeriveDispatch[]>(api.derive.democracy.dispatchQueue, []);

  const header = useMemo(() => [
    [t('dispatch queue'), 'start', 2],
    [t('enact')],
    [],
    [undefined, 'mini ui--media-1000']
  ], [t]);

  return (
    <Table
      className={className}
      empty={queued && t<string>('Nothing queued for execution')}
      header={header}
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
