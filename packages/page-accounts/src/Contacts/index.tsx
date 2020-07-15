// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from '../types';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Table } from '@polkadot/react-components';
import { useAddresses, useFavorites, useToggle } from '@polkadot/react-hooks';

import CreateModal from './modals/Create';
import Address from './Address';
import { useTranslation } from '../translate';

type SortedAddress = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAddresses } = useAddresses();
  const [isCreateOpen, toggleCreate] = useToggle(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[]>([]);
  const [filterOn, setFilter] = useState<string>('');

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

  const header = useMemo(() => [
    [t('contacts'), 'start', 2],
    [t('tags'), 'start'],
    [t('transactions'), 'ui--media-1500'],
    [t('balances')],
    [],
    [undefined, 'mini ui--media-1400']
  ], [t]);

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
        empty={t<string>('no addresses saved yet, add any existing address')}
        filter={filter}
        header={header}
      >
        {sortedAddresses.map(({ address, isFavorite }): React.ReactNode => (
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
