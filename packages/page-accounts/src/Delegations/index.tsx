// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props, SortedAccount } from '../types';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useFavorites, useToggle } from '@polkadot/react-hooks';
import { Voting } from '@polkadot/types/interfaces';

import CreateModal from './modals/Create';
import Address from './Address';
import { useTranslation } from '../translate';
import { sortAccounts } from '../util';

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [isCreateOpen, toggleCreate] = useToggle(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAccounts, setSortedAccounts] = useState<SortedAccount[]>([]);
  const [filterOn, setFilter] = useState<string>('');
  const delegatingAccounts = useCall<Voting[]>(api.query.democracy.votingOf.multi, [allAccounts]);

  console.log('allAccounts', allAccounts);

  (delegatingAccounts || []).forEach((delegatingAccount, index) => {
    console.log(allAccounts[index].toString());
    delegatingAccount.isDelegating
      ? console.log(
        delegatingAccount?.asDelegating.balance.toString(),
        delegatingAccount?.asDelegating.target.toString(),
        delegatingAccount?.asDelegating.conviction.toString()
      )
      : console.log('nop');
  }
  );

  useEffect((): void => {
    setSortedAccounts(
      sortAccounts(allAccounts, favorites)
    );
  }, [allAccounts, favorites]);

  const header = useMemo(() => [
    [t('account'), 'start', 2],
    [t('tags'), 'start'],
    [t('delegates'), 'start'],
    [t('amount'), 'ui--media-1500'],
    [t('conviction')],
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
        empty={t<string>('no delegation yet, add a new one')}
        filter={filter}
        header={header}
      >
        {sortedAccounts.map(({ account, isFavorite }): React.ReactNode => (
          <Address
            address={account.address}
            filter={filterOn}
            isFavorite={isFavorite}
            key={account.address}
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
