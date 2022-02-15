// Copyright 2017-2022 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentProps as Props } from '../types';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, FilterInput, SummaryBox, Table } from '@polkadot/react-components';
import { useAddresses, useFavorites, useLoadingDelay, useToggle } from '@polkadot/react-hooks';

import CreateModal from '../modals/Create';
import { useTranslation } from '../translate';
import Address from './Address';

type SortedAddress = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAddresses } = useAddresses();
  const [isCreateOpen, toggleCreate] = useToggle(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[] | undefined>();
  const [filterOn, setFilter] = useState<string>('');
  const isLoading = useLoadingDelay();

  const headerRef = useRef([
    [t('contacts'), 'start', 2],
    [t('transactions'), 'number media--1500'],
    [t('balances'), 'balances'],
    [undefined, 'media--1400'],
    []
  ]);

  useEffect((): void => {
    setSortedAddresses(
      allAddresses
        .map((address): SortedAddress => ({ address, isFavorite: favorites.includes(address) }))
        .sort((a, b): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : b.isFavorite
              ? 1
              : -1
        )
    );
  }, [allAddresses, favorites]);

  return (
    <div className={className}>
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      <SummaryBox className='summary-box-contacts'>
        <section>
          <FilterInput
            filterOn={filterOn}
            label={t<string>('filter by name or tags')}
            setFilter={setFilter}
          />
        </section>
        <Button.Group>
          <Button
            icon='plus'
            label={t<string>('Add contact')}
            onClick={toggleCreate}
          />
        </Button.Group>
      </SummaryBox>
      <Table
        empty={!isLoading && sortedAddresses && t<string>('no addresses saved yet, add any existing address')}
        header={headerRef.current}
        withCollapsibleRows
      >
        {!isLoading && sortedAddresses?.map(({ address, isFavorite }): React.ReactNode => (
          <Address
            address={address}
            filter={filterOn}
            isFavorite={isFavorite}
            key={address}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Overview)`
  .summary-box-contacts {
    align-items: center;
  }
`);
