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

function CurrentList ({ authorsMap, currentValidators, eraPoints, lastAuthor, next, recentlyOnline, t }: Props): React.ReactElement<Props> {
  const [filter, setFilter] = useState<ValidatorFilter>('all');

  const _renderColumn = (addresses: string[], defaultName: string, withExpanded: boolean): React.ReactNode => {
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
            ? [eraPoints.individual[index], eraPoints.total]
            : undefined
        }
        recentlyOnline={recentlyOnline}
        withNominations={withExpanded}
      />
    ));
  };

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
          {_renderColumn(currentValidators, t('validator'), true)}
        </Column>
        <Column
          emptyText={t('No addresses found')}
          headerText={t('next up')}
        >
          {_renderColumn(next, t('intention'), false)}
        </Column>
      </Columar>
    </div>
  );
}

export default translate(CurrentList);
