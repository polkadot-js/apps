// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Bid } from '@polkadot/types/interfaces';

import React from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import BidRow from './Bid';

interface Props {
  className?: string;
}

function Bids ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bids = useCall<Bid[]>(api.query.society.bids, []);

  return (
    <Table className={className}>
      <Table.Head>
        <th className='start'><h1>{t('bids')}</h1></th>
        <th>{t('kind')}</th>
        <th>{t('value')}</th>
      </Table.Head>
      <Table.Body empty={bids && t('No bids')}>
        {bids?.map((bid): React.ReactNode => (
          <BidRow
            key={bid.who.toString()}
            value={bid}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default React.memo(Bids);
