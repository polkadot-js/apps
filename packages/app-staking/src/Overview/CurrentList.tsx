// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorFilter } from '../types';

import React, { useState } from 'react';
import { Columar, Column, Dropdown, FilterOverlay } from '@polkadot/react-components';

import translate from '../translate';
import Address from './Address';

interface Props extends I18nProps {
  currentValidators: string[];
  lastAuthor?: string;
  lastBlock: string;
  next: string[];
  recentlyOnline: Record<string, BlockNumber>;
}

function CurrentList ({ currentValidators, lastAuthor, lastBlock, next, recentlyOnline, t }: Props): React.ReactElement<Props> {
  const [filter, setFilter] = useState<ValidatorFilter>('all');

  const _renderColumn = (addresses: string[], defaultName: string, withNominations: boolean): React.ReactNode => {
    return addresses.map((address): React.ReactNode => (
      <Address
        address={address}
        defaultName={defaultName}
        key={address}
        filter={filter}
        lastAuthor={lastAuthor}
        lastBlock={lastBlock}
        recentlyOnline={recentlyOnline}
        withNominations={withNominations}
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
