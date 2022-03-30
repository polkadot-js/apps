// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@polkadot/react-hooks/types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Bag from './Bag';
import Summary from './Summary';
import useBagsIds from './useBagsIds';
import useBagsList from './useBagsList';
import useBagsNodes from './useBagsNodes';

interface Props {
  ownStashes?: StakerState[];
}

function Bags ({ ownStashes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const ids = useBagsIds();
  const list = useBagsList(ids);
  const stashIds = useMemo(
    () => ownStashes
      ? ownStashes.map(({ stashId }) => stashId)
      : [],
    [ownStashes]
  );
  const nodes = useBagsNodes(stashIds);

  const headerRef = useRef([
    [t('bags')],
    [t('head'), 'address'],
    [t('tail'), 'address'],
    [t('mine'), 'address'],
    []
  ]);

  const sorted = useMemo(
    () => list && nodes
      ? [...list].sort((a, b) =>
        nodes[a[0]]
          ? nodes[b[0]]
            ? b[1].cmp(a[1])
            : -1
          : nodes[b[0]]
            ? 1
            : b[1].cmp(a[1])
      )
      : null,
    [list, nodes]
  );

  return (
    <>
      <Summary ids={ids} />
      <Table
        empty={nodes && list && list.length === 0 && t<string>('No available bags')}
        emptySpinner={t<string>('Retrieving all available bags, this will take some time')}
        header={headerRef.current}
      >
        {sorted && sorted.map(([key, id, info]) => (
          <Bag
            id={id}
            info={info}
            key={key}
            stashNodes={nodes[key]}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Bags);
