// Copyright 2017-2023 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useEffect, useRef, useState } from 'react';

import { Button, FilterInput, styled, SummaryBox, Table } from '@polkadot/react-components';
import { useAddresses, useFavorites, useNextTick, useToggle } from '@polkadot/react-hooks';

import CreateModal from '../modals/Create.js';
import { useTranslation } from '../translate.js';
import Address from './Address.js';

interface SortedAddress { address: string; isFavorite: boolean }

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAddresses } = useAddresses();
  const [isCreateOpen, toggleCreate] = useToggle(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[] | undefined>();
  const [filterOn, setFilter] = useState<string>('');
  const isNextTick = useNextTick();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('contacts'), 'start', 4]
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
    <StyledDiv className={className}>
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      <SummaryBox className='summary-box-contacts'>
        <section>
          <FilterInput
            className='media--1000'
            filterOn={filterOn}
            label={t('filter by name or tags')}
            setFilter={setFilter}
          />
        </section>
        <Button.Group>
          <Button
            icon='plus'
            label={t('Add contact')}
            onClick={toggleCreate}
          />
        </Button.Group>
      </SummaryBox>
      <Table
        empty={isNextTick && sortedAddresses && t('no addresses saved yet, add any existing address')}
        header={headerRef.current}
        isSplit
      >
        {isNextTick && sortedAddresses?.map(({ address, isFavorite }): React.ReactNode => (
          <Address
            address={address}
            filter={filterOn}
            isFavorite={isFavorite}
            key={address}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </Table>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .summary-box-contacts {
    align-items: center;
  }
`;

export default React.memo(Overview);
