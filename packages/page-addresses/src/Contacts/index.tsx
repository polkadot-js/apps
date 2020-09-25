// Copyright 2017-2020 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from '../types';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Table } from '@polkadot/react-components';
import { useAddresses, useFavorites, useLoadingDelay, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import CreateModal from '../modals/Create';
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
    [t('tags'), 'start'],
    [t('transactions'), 'media--1500'],
    [t('balances'), 'expand'],
    [],
    [undefined, 'media--1400']
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

  const filter = useMemo(() => (
    <div className='filter--tags'>
      <Input
        autoFocus
        isFull
        label={t<string>('filter by name or tags')}
        onChange={setFilter}
        value={filterOn}
      />
    </div>
  ), [filterOn, t]);

  return (
    <div className={className}>
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Add contact')}
          onClick={toggleCreate}
        />
      </Button.Group>
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      <Table
        empty={!isLoading && sortedAddresses && t<string>('no addresses saved yet, add any existing address')}
        filter={filter}
        header={headerRef.current}
      >
        {isLoading ? undefined : sortedAddresses?.map(({ address, isFavorite }): React.ReactNode => (
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
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
