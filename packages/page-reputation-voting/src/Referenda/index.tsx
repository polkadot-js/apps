// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import AddPreimage from '@polkadot/app-preimages/Preimages/Add';
import { Button, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import useReferenda from '../useReferenda.js';
import useTallies from '../useTallies.js';
import useTracks from '../useTracks.js';
import Submit from './Submit/index.js';
import Referendum from './Referendum.js';

interface Props {
  className?: string;
}

function Referenda ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const referenda = useReferenda();
  const tracks = useTracks();

  // Extract all referendum IDs for batched tally query
  const referendumIds = useMemo(
    () => referenda?.map((ref) => ref.id),
    [referenda]
  );
  const { tallies } = useTallies(referendumIds);

  const headers = useMemo<[string?, string?, number?][]>(() => [
    [t('referenda'), 'start', 2],
    [t('status')],
    [t('tally')],
    [t('vote'), 'media--1000'],
    []
  ], [t]);

  return (
    <>
      <Button.Group>
        <AddPreimage />
        <Submit tracks={tracks} />
      </Button.Group>
      <Table
        className={className}
        empty={referenda && !referenda.length && t('No active referenda')}
        header={headers}
      >
        {referenda?.map((ref) => (
          <Referendum
            key={ref.key}
            tally={tallies.get(ref.id.toString())}
            value={ref}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Referenda);
