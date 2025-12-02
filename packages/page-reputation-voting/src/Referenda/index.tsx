// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import AddPreimage from '@polkadot/app-preimages/Preimages/Add';
import { Button, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import useReferenda from '../useReferenda.js';
import useTracks from '../useTracks.js';
import Referendum from './Referendum.js';
import Submit from './Submit/index.js';

interface Props {
  className?: string;
}

function Referenda ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const referenda = useReferenda();
  const tracks = useTracks();

  const headerRef = React.useRef<[string?, string?, number?][]>([
    [t('referenda'), 'start', 2],
    [t('status')],
    [t('tally')],
    [t('vote'), 'media--1000'],
    []
  ]);

  return (
    <>
      <Button.Group>
        <AddPreimage />
        <Submit tracks={tracks} />
      </Button.Group>
      <Table
        className={className}
        empty={referenda && !referenda.length && t('No active referenda')}
        header={headerRef.current}
      >
        {referenda?.map((ref) => (
          <Referendum
            key={ref.key}
            value={ref}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Referenda);
