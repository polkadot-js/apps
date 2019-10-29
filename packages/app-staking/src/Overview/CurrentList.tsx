// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { EraPoints } from '@polkadot/types/interfaces';
import { ValidatorFilter } from '../types';

import React, { useState } from 'react';
import { Columar, Column, Dropdown, FilterOverlay } from '@polkadot/react-components';

import translate from '../translate';
import Address from './Address';

interface Props extends I18nProps {
  authorsMap: Record<string, string>;
  currentValidators: string[];
  eraPoints?: EraPoints;
  lastAuthor?: string;
  next: string[];
  recentlyOnline?: DerivedHeartbeats;
}

function renderColumn (addresses: string[], defaultName: string, withExpanded: boolean, filter: string, { authorsMap, eraPoints, lastAuthor, recentlyOnline }: Props): React.ReactNode {
  return addresses.map((address, index): React.ReactNode => (
    <Address
      address={address}
      authorsMap={authorsMap}
      defaultName={defaultName}
      filter={filter}
      lastAuthor={lastAuthor}
      key={address}
      points={
        withExpanded && eraPoints
          ? eraPoints.individual[index]
          : undefined
      }
      recentlyOnline={recentlyOnline}
      withNominations={withExpanded}
    />
  ));
}

function CurrentList (props: Props): React.ReactElement<Props> {
  const [filter, setFilter] = useState<ValidatorFilter>('all');
  const { currentValidators, next, t } = props;

  return (
    <div>
      <FilterOverlay>
        <Dropdown
          onChange={setFilter}
          options={[
            { text: t('Show all validators and intentions'), value: 'all' },
            { text: t('Show only my nominations'), value: 'iNominated' },
            { text: t('Show only with nominators'), value: 'hasNominators' },
            { text: t('Show only without nominators'), value: 'noNominators' },
            { text: t('Show only with warnings'), value: 'hasWarnings' },
            { text: t('Show only without warnings'), value: 'noWarnings' }
          ]}
          value={filter}
          withLabel={false}
        />
      </FilterOverlay>
      <Columar className='validator--ValidatorsList'>
        <Column
          emptyText={t('No addresses found')}
          headerText={t('validators')}
        >
          {renderColumn(currentValidators, t('validator'), true, filter, props)}
        </Column>
        <Column
          emptyText={t('No addresses found')}
          headerText={t('next up')}
        >
          {renderColumn(next, t('intention'), false, filter, props)}
        </Column>
      </Columar>
    </div>
  );
}

export default translate(CurrentList);
