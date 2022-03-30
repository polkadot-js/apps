// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@polkadot/react-hooks/types';
import type { BagInfo, BagMap, StashNode } from './types';

import React, { useMemo, useRef, useState } from 'react';

import { Button, Table, ToggleGroup } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Bag from './Bag';
import Summary from './Summary';
import useBagsIds from './useBagsIds';
import useBagsList from './useBagsList';
import useBagsNodes from './useBagsNodes';

interface Props {
  ownStashes?: StakerState[];
}

function sortNodes (list: BagInfo[], nodes: BagMap, onlyMine: boolean): [BagInfo, StashNode[] | undefined][] {
  return list
    .map((b): [BagInfo, StashNode[] | undefined] => [b, nodes[b.key]])
    .filter(([, n]) => !onlyMine || !!n);
}

function Bags ({ ownStashes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const stashIds = useMemo(
    () => ownStashes
      ? ownStashes.map(({ stashId }) => stashId)
      : [],
    [ownStashes]
  );
  const [filterIndex, setFilterIndex] = useState(() => stashIds.length ? 0 : 1);
  const ids = useBagsIds();
  const list = useBagsList(ids);
  const nodes = useBagsNodes(stashIds);

  const headerRef = useRef([
    [t('bags')],
    [t('max'), 'number'],
    [t('min'), 'number'],
    [t('first'), 'address'],
    [t('last'), 'address'],
    [t('stashes'), 'address'],
    [t('count'), 'number']
  ]);

  const filterOptions = useRef([
    { text: t('My bags'), value: 'mine' },
    { text: t('All bags'), value: 'all' }
  ]);
  const filtered = useMemo(
    () => list && nodes && sortNodes(list, nodes, !filterIndex),
    [filterIndex, list, nodes]
  );

  return (
    <>
      <Summary
        ids={ids}
        nodes={nodes}
      />
      <Button.Group>
        <ToggleGroup
          onChange={setFilterIndex}
          options={filterOptions.current}
          value={filterIndex}
        />
      </Button.Group>
      <Table
        empty={filtered && t<string>('No available bags')}
        emptySpinner={t<string>('Retrieving all available bags, this will take some time')}
        header={headerRef.current}
      >
        {filtered?.map(([{ index, info, key, lower, upper }, nodes]) => (
          <Bag
            index={index}
            info={info}
            key={key}
            lower={lower}
            stashNodes={nodes}
            upper={upper}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Bags);
