// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';
import { BlockNumber, Hash, ReferendumIndex } from '@polkadot/types/interfaces';

import React from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import translate from '../translate';
import DispatchEntry from './DispatchEntry';

function DispatchQueue ({ className, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const queued = useCall<[BlockNumber, Hash, ReferendumIndex][]>(api.query.democracy.dispatchQueue, []);

  if (!queued?.length) {
    return null;
  }

  return (
    <div className={className}>
      <h1>{t('dispatch queue')}</h1>
      {queued?.length
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
      }
    </div>
  );
}

export default translate(DispatchQueue);
