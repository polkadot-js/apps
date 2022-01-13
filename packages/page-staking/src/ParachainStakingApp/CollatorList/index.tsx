// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import CollatorDetails, { CollatorInfo, CollatorState } from './CollatorDetails';

interface Props {
  allCollatorsSorted: CollatorState[]
  collatorInfo: CollatorInfo
}

function CollatorList ({ allCollatorsSorted, collatorInfo }: Props): React.ReactElement<Props> | null {
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
        allCollatorsSorted.map((collatorState): React.ReactNode => (
          <CollatorDetails
            collatorDetails={collatorState}
            collatorInfo={collatorInfo}
            key={collatorState.id}
          />
        )))}
    </Table>
  );
}

export default React.memo(CollatorList);
