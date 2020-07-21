// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Bid } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
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

  const header = useMemo(() => [
    [t('bids'), 'start'],
    [t('kind')],
    [t('value')],
    []
  ], [t]);

  return (
    <Table
      className={className}
      empty={bids && t<string>('No bids')}
      header={header}
    >
      {bids?.map((bid, index): React.ReactNode => (
        <BidRow
          index={index}
          key={bid.who.toString()}
          value={bid}
        />
      ))}
    </Table>
  );
}

export default React.memo(Bids);
