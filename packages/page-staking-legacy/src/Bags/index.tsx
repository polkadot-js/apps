// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@polkadot/react-hooks/types';
import type { BagInfo, BagMap, StashNode } from './types.js';

import React, { useMemo, useRef, useState } from 'react';

import { Button, MarkWarning, Table, ToggleGroup } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Bag from './Bag.js';
import Summary from './Summary.js';
import useBagsList from './useBagsList.js';
import useBagsNodes from './useBagsNodes.js';

interface Props {
  className?: string;
  ownStashes?: StakerState[];
}

function sortNodes (list: BagInfo[], nodes: BagMap, onlyMine: boolean): [BagInfo, StashNode[] | undefined][] {
  return list
    .map((b): [BagInfo, StashNode[] | undefined] => [b, nodes[b.key]])
    .filter(([, n]) => !onlyMine || !!n);
}

function Bags ({ className, ownStashes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const stashIds = useMemo(
    () => ownStashes
      ? ownStashes.map(({ stashId }) => stashId)
      : [],
    [ownStashes]
  );
  const [filterIndex, setFilterIndex] = useState(() => stashIds.length ? 0 : 1);
  const bags = useBagsList();
  const mapOwn = useBagsNodes(stashIds);

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('bags')],
    [t('max'), 'number'],
    [t('min'), 'number'],
    [t('first'), 'address'],
    [t('last'), 'address'],
    [t('stashes'), 'address'],
    [t('nodes'), 'number'],
    [undefined, 'mini']
  ]);

  const filterOptions = useMemo(
    () => [
      { isDisabled: !stashIds.length, text: t('My bags'), value: 'mine' },
      { text: t('All bags'), value: 'all' }
    ],
    [stashIds, t]
  );
  const filtered = useMemo(
    () => bags && mapOwn && sortNodes(bags, mapOwn, !filterIndex),
    [bags, filterIndex, mapOwn]
  );

  return (
    <div className={className}>
      <Summary
        bags={bags}
        mapOwn={mapOwn}
      />
      <Button.Group>
        <ToggleGroup
          onChange={setFilterIndex}
          options={filterOptions}
          value={filterIndex}
        />
      </Button.Group>
      <MarkWarning
        className='warning centered'
        withIcon={false}
      >
        <p>{t('The All bags list is composed of bags that each describe a range of active bonded funds of the nominators. In each bag is a list of nodes that correspond to a nominator and their staked funds.')}</p>
        <p>{t('Within the context of a single bag, nodes are not sorted by their stake, but instead placed in insertion order. In other words, the most recently inserted node will be the last node in the bag, regardless of stake. Events like staking rewards or slashes do not automatically put you in a different bag. The bags-list pallet comes with an important permissionless extrinsic: rebag. This allows anyone to specify another account that is in the wrong bag, and place it in the correct one.')}</p>
      </MarkWarning>
      <Table
        empty={filtered && t('No available bags')}
        emptySpinner={t('Retrieving all available bags, this will take some time')}
        header={headerRef.current}
      >
        {filtered?.map(([{ bagLower, bagUpper, index, info, key }, nodesOwn]) => (
          <Bag
            bagLower={bagLower}
            bagUpper={bagUpper}
            index={index}
            info={info}
            key={key}
            nodesOwn={nodesOwn}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Bags);
