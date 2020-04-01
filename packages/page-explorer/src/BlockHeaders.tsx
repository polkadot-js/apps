// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { Table } from '@polkadot/react-components';

import BlockHeader from './BlockHeader';
import { useTranslation } from './translate';

interface Props {
  headers: HeaderExtended[];
}

function BlockHeaders ({ headers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Table>
      <Table.Head>
        <th
          className='start'
          colSpan={3}
        >
          <h1>{t('recent blocks')}</h1>
        </th>
      </Table.Head>
      <Table.Body empty={t('No blocks available')}>
        {headers
          .filter((header) => !!header)
          .map((header): React.ReactNode => (
            <BlockHeader
              key={header.number.toString()}
              value={header}
            />
          ))}
      </Table.Body>
    </Table>
  );
}

export default React.memo(BlockHeaders);
