// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes, Option } from '@polkadot/types';
import type { BlockNumber, Bounty as BountyType, BountyIndex } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { BountyDescription } from '@polkadot/app-bounties/types';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { StorageKey } from '@polkadot/types';

import Bounty from './Bounty';
import { useTranslation } from './translate';

type BountyEntry = [{ args: [BountyIndex] }, Option<BountyType>];
type BountyDescriptionEntry = [StorageKey, Option<Bytes>];

const transformBountyDescriptions = {
  transform: (entries: BountyDescriptionEntry[]): BountyDescription[] => {
    return entries.map(([key, description]) => ({ description: description.value.toHuman() as string, id: key.args[0] }));
  }
};

function Bounties (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

  const bounties = useCall<BountyEntry[]>(api.query.treasury.bounties.entries);
  const bountyDescriptions = useCall<BountyDescription[]>(api.query.treasury.bountyDescriptions.entries, undefined, transformBountyDescriptions);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);

  const headerRef = useRef([
    [t('bounties'), 'start'],
    [t('title'), 'start'],
    [],
    [t('value'), 'start'],
    [],
    [t('curator'), 'start'],
    [t('update due'), 'start'],
    [],
    []
  ]);

  return (
    <Table
      empty={bounties && t<string>('No open bounties')}
      header={headerRef.current}
    >
      {bounties && bountyDescriptions && bestNumber && bounties.map((bounty: BountyEntry, index: number): React.ReactNode => (
        <Bounty
          bestNumber={bestNumber}
          bounty={bounty[1].value}
          description={bountyDescriptions[index]}
          index={index}
          key={index}
        />
      ))}
    </Table>
  );
}

export default React.memo(Bounties);
