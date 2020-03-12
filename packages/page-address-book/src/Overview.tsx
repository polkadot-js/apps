// Copyright 2017-2020 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from './types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Table } from '@polkadot/react-components';
import { useAddresses, useFavorites } from '@polkadot/react-hooks';

import CreateModal from './modals/Create';
import Address from './Address';
import { useTranslation } from './translate';

type SortedAddress = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAddresses, allAddresses } = useAddresses();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[]>([]);
  const [filter, setFilter] = useState<string>('');

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

  const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);

  return (
    <div className={className}>
      <Button.Group>
        <Button
          icon='add'
          isPrimary
          label={t('Add contact')}
          onClick={_toggleCreate}
        />
      </Button.Group>
      {isCreateOpen && (
        <CreateModal
          onClose={_toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      {hasAddresses
        ? (
          <>
            <div className='filter--tags'>
              <Input
                autoFocus
                isFull
                label={t('filter by name or tags')}
                onChange={setFilter}
                value={filter}
              />
            </div>
            <Table>
              <Table.Body>
                {sortedAddresses.map(({ address, isFavorite }): React.ReactNode => (
                  <Address
                    address={address}
                    filter={filter}
                    isFavorite={isFavorite}
                    key={address}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </Table.Body>
            </Table>
          </>
        )
        : t('no addresses saved yet, add any existing address')
      }
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
