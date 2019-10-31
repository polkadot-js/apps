// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { EraPoints } from '@polkadot/types/interfaces';
import { ValidatorFilter } from '../types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';
import { Columar, Column, Dropdown, FilterOverlay } from '@polkadot/react-components';

import translate from '../translate';
import Address from './Address';

interface Props extends I18nProps {
  authorsMap: Record<string, string>;
  currentElected: string[];
  currentValidators: string[];
  eraPoints?: EraPoints;
  lastAuthors?: string[];
  next: string[];
  recentlyOnline?: DerivedHeartbeats;
}

function renderColumn (addresses: string[], defaultName: string, withPoints: boolean, filter: string, { authorsMap, currentElected, eraPoints, lastAuthors, recentlyOnline }: Props): React.ReactNode {
  return addresses.map((address, index): React.ReactNode => (
    <Address
      address={address}
      authorsMap={authorsMap}
      currentElected={currentElected}
      defaultName={defaultName}
      filter={filter}
      lastAuthors={lastAuthors}
      key={address}
      points={
        withPoints && eraPoints
          ? eraPoints.individual[index]
          : undefined
      }
      recentlyOnline={recentlyOnline}
    />
  ));
}

function filterAccounts (list: string[] = [], without: string[]): string[] {
  return list.filter((accountId): boolean => !without.includes(accountId));
}

function CurrentList (props: Props): React.ReactElement<Props> {
  const { isSubstrateV2 } = useContext(ApiContext);
  const [filter, setFilter] = useState<ValidatorFilter>('all');
  const [{ electedFiltered, nextFiltered }, setFiltered] = useState<{ electedFiltered: string[]; nextFiltered: string[] }>({ electedFiltered: [], nextFiltered: [] });
  const { currentElected, currentValidators, next, t } = props;

  useEffect((): void => {
    if (currentElected && currentValidators) {
      setFiltered({
        electedFiltered: isSubstrateV2 ? filterAccounts(currentElected, currentValidators) : [],
        nextFiltered: filterAccounts(next, currentElected)
      });
    }
  }, [currentElected, currentValidators, next]);

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
            { text: t('Show only without warnings'), value: 'noWarnings' },
            { text: t('Show only elected for next session'), value: 'nextSet' }
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
          {(electedFiltered.length !== 0 || nextFiltered.length !== 0) && (
            <>
              {renderColumn(electedFiltered, t('intention'), false, filter, props)}
              {renderColumn(nextFiltered, t('intention'), false, filter, props)}
            </>
          )}
        </Column>
      </Columar>
    </div>
  );
}

export default translate(CurrentList);
