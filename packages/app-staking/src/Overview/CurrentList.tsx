// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorFilter } from '../types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';
import { Columar, Column, Dropdown, FilterOverlay } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';
import Address from './Address';

interface Props extends I18nProps {
  authorsMap: Record<string, string>;
  lastAuthors?: string[];
  next: string[];
  recentlyOnline?: DerivedHeartbeats;
  stakingOverview?: DerivedStakingOverview;
}

function renderColumn (myAccounts: string[], addresses: AccountId[] | string[], defaultName: string, withOnline: boolean, filter: string, { authorsMap, lastAuthors, recentlyOnline, stakingOverview }: Props, pointIndexes?: number[]): React.ReactNode {
  return (addresses as AccountId[]).map((address, index): React.ReactNode => (
    <Address
      address={address}
      authorsMap={authorsMap}
      defaultName={defaultName}
      filter={filter}
      isElected={stakingOverview && stakingOverview.currentElected.some((accountId): boolean => accountId.eq(address))}
      lastAuthors={lastAuthors}
      key={address.toString()}
      myAccounts={myAccounts}
      points={
        stakingOverview && pointIndexes && pointIndexes[index] !== -1
          ? stakingOverview.eraPoints.individual[pointIndexes[index]]
          : undefined
      }
      recentlyOnline={
        withOnline
          ? recentlyOnline
          : undefined
      }
    />
  ));
}

function filterAccounts (list: string[] = [], without: AccountId[] | string[]): string[] {
  return list.filter((accountId): boolean => !without.includes(accountId as any));
}

function CurrentList (props: Props): React.ReactElement<Props> {
  const { isSubstrateV2 } = useContext(ApiContext);
  const [filter, setFilter] = useState<ValidatorFilter>('all');
  const [myAccounts] = useState(keyring.getAccounts().map(({ address }): string => address));
  const [{ electedFiltered, nextFiltered, pointIndexes }, setFiltered] = useState<{ electedFiltered: string[]; nextFiltered: string[]; pointIndexes: number[] }>({ electedFiltered: [], nextFiltered: [], pointIndexes: [] });
  const { next, stakingOverview, t } = props;

  useEffect((): void => {
    if (stakingOverview) {
      const elected = stakingOverview.currentElected.map((accountId): string => accountId.toString());

      setFiltered({
        electedFiltered: isSubstrateV2 ? filterAccounts(elected, stakingOverview.validators) : [],
        nextFiltered: filterAccounts(next, elected),
        pointIndexes: stakingOverview.validators.map((validator): number => elected.indexOf(validator.toString()))
      });
    }
  }, [next, stakingOverview]);

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
          {stakingOverview && renderColumn(myAccounts, stakingOverview.validators, t('validator'), true, filter, props, pointIndexes)}
        </Column>
        <Column
          emptyText={t('No addresses found')}
          headerText={t('next up')}
        >
          {(electedFiltered.length !== 0 || nextFiltered.length !== 0) && (
            <>
              {renderColumn(myAccounts, electedFiltered, t('intention'), false, filter, props)}
              {renderColumn(myAccounts, nextFiltered, t('intention'), false, filter, props)}
            </>
          )}
        </Column>
      </Columar>
    </div>
  );
}

export default translate(CurrentList);
