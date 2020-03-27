// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveDispatch } from '@polkadot/api-derive/types';

import React from 'react';
import { Spinner, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import DispatchEntry from './DispatchEntry';

interface Props {
  className?: string;
}

function DispatchQueue ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const queued = useCall<DeriveDispatch[]>(api.derive.democracy.dispatchQueue as any, []);

  return (
    <div className={className}>
      <h1>{t('dispatch queue')}</h1>
      {queued
        ? queued.length
          ? (
            <Table>
              <Table.Body>
                {queued.map((entry): React.ReactNode => (
                  <DispatchEntry
                    key={entry.index.toString()}
                    value={entry}
                  />
                ))}
              </Table.Body>
            </Table>
          )
          : t('nothing queued for execution')
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(DispatchQueue);
