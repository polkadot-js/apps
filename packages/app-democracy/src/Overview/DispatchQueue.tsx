// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';
import { Hash, ReferendumIndex } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import React, { useState } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option, StorageKey, Vec } from '@polkadot/types';
import { u8aToHex } from '@polkadot/util';

import translate from '../translate';
import DispatchBlock from './DispatchBlock';

function DispatchQueue ({ className, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [keyPrefix] = useState(u8aToHex(api.query.democracy.dispatchQueue.creator.iterKey));
  const queued = useCall<[StorageKey, Option<Vec<Option<ITuple<[Hash, ReferendumIndex]>>>>
  ][]>(api.query.democracy.dispatchQueue.entries as any, []);

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
              {queued.map(([storageKey, entries]): React.ReactNode => (
                <DispatchBlock
                  entries={entries}
                  key={storageKey.toString()}
                  keyPrefix={keyPrefix}
                  storageKey={storageKey}
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
