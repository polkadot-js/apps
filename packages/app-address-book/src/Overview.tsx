// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, InputTags, Table } from '@polkadot/react-components';
import { useAddresses, useFavorites, useToggle } from '@polkadot/react-hooks';

import CreateModal from './modals/Create';
import Address from './Address';
import translate from './translate';

interface Props extends ComponentProps, I18nProps {
}

type SortedAddress = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className, onStatusChange, t }: Props): React.ReactElement<Props> {
  const { hasAddresses, allAddresses } = useAddresses();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isCreateOpen, toggleCreate] = useToggle();

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
      <Button.Group>
        <Button
          icon='add'
          isPrimary
          label={t('Add contact')}
          onClick={toggleCreate}
        />
      </Button.Group>
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      {hasAddresses
        ? (
          <>
            <div className='filter--tags'>
              <InputTags
                allowAdd={false}
                label={t('filter by tags')}
                onChange={setTags}
                defaultValue={tags}
                value={tags}
              />
            </div>
            <Table>
              <Table.Body>
                {sortedAddresses.map(({ address, isFavorite }): React.ReactNode => (
                  <Address
                    address={address}
                    allowTags={tags}
                    isFavorite={isFavorite}
                    key={address}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </Table.Body>
            </Table>
          </>
        )
        : t('no contracts yet, add an existing contact')
      }
    </div>
  );
}

export default translate(
  styled(Overview)`
    .filter--tags {
      .ui--Dropdown {
        padding-left: 0;

        label {
          left: 1.55rem;
        }
      }
    }
  `
);
