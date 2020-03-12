// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Hash, ReferendumIndex } from '@polkadot/types/interfaces';

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
  const queued = useCall<[BlockNumber, Hash, ReferendumIndex][]>(api.query.democracy.dispatchQueue, []);

  if (!queued?.length) {
    return null;
  }

  return (
    <div className={className}>
      <h1>{t('dispatch queue')}</h1>
      {queued
        ? queued.length
          ? (
            <Table>
              <Table.Body>
                {queued.map(([blockNumber, hash, referendumIndex]): React.ReactNode => (
                  <DispatchEntry
                    blockNumber={blockNumber}
                    hash={hash}
                    key={referendumIndex.toString()}
                    referendumIndex={referendumIndex}
                  />
                ))}
              </Table.Body>
            </Table>
          )
          : t('nothing queued to be executed')
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(DispatchQueue);
