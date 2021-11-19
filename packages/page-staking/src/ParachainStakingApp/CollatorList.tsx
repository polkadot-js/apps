// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import CollatorDetails from './CollatorDetails';
import { OwnerAmount } from './Summary';

interface Props {
  selectedCollatorCount: number;
  collators: OwnerAmount[]|undefined
  collatorInfo: {minNomination: string, maxNominatorsPerCollator: string}
  setActiveNominators: (input: {address: string, number: number}) => void
  setAllNominators: (input: {address: string, number: number}) => void
}

function CollatorList ({ collatorInfo, collators, selectedCollatorCount, setActiveNominators, setAllNominators }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const isLoading = useLoadingDelay();

  const headerRef = useRef(
    [
      [t('collators'), 'start'],
      [t('counted nominator stake'), 'media--1100'],
      [t('total nominator stake'), 'media--1100'],
      [t('# of nominators'), 'media--1100'],
      [t('own stake'), 'media--1100'],
      [t('min contribution'), 'media--1100']
    ]
  );

  return (
    <Table
      header={headerRef.current}
    >
      {!isLoading && (
        collators?.sort((a, b) => {
          return Number(b.amount.sub(a.amount));
        }).map(({ amount, owner }, i): React.ReactNode => (
          <CollatorDetails
            address={owner}
            collatorInfo={collatorInfo}
            collatorStake={amount}
            key={owner}
            rank={i}
            selectedCollatorCount={selectedCollatorCount}
            setActiveNominators={setActiveNominators}
            setAllNominators={setAllNominators}
          />
        )))}
    </Table>
  );
}

export default React.memo(CollatorList);
