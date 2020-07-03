// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props, SortedAccount } from '../types';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useFavorites, useToggle } from '@polkadot/react-hooks';
import { AccountId, Balance, Conviction, Voting } from '@polkadot/types/interfaces';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import DelegateModal from './modals/Delegate';
import Address from './Address';
import { useTranslation } from '../translate';
import { sortAccounts } from '../util';

const STORE_FAVS = 'accounts:favorites';

interface DelegatingAccount {
  accountDelegated: AccountId
  accountDelegating: KeyringAddress
  amount: Balance
  conviction: Conviction
  isFavorite: boolean
}

function Overview ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [isDelegateOpen, toggleDelegate] = useToggle(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAccounts, setSortedAccounts] = useState<SortedAccount[]>([]);
  const [delegatingAccounts, setDelegatingAccounts] = useState<DelegatingAccount[] | undefined>(undefined);
  const [sortedAddresses, setSortedAddresses] = useState<string[]>([]);

  const delegations = useCall<Voting[]>(api.query.democracy.votingOf.multi, [sortedAddresses]);

  useEffect((): void => {
    setSortedAccounts(
      sortAccounts(allAccounts, favorites)
    );
  }, [allAccounts, favorites]);

  useEffect(() => {
    setSortedAddresses(sortedAccounts.map((a) => a.account.address));
  }, [sortedAccounts]);

  useEffect(() => {
    const result = delegations?.map((delegation, index) => ({
      accountDelegating: sortedAccounts[index].account,
      delegation,
      isFavorite: sortedAccounts[index].isFavorite
    }))
    .filter(({ delegation }) => delegation.isDelegating)
    .map((account) => (
      {
        accountDelegated: account.delegation.asDelegating.target,
        amount: account.delegation.asDelegating.balance,
        conviction: account.delegation.asDelegating.conviction,
        ...account
      }
    ), [delegations]);

    setDelegatingAccounts(result);
  }, [delegations, sortedAccounts]);

  const header = useMemo(() => [
    [t('account'), 'start', 2],
    [t('delegates'), 'start'],
    [t('amount'), 'start'],
    [t('conviction'), 'start'],
    [undefined, 'mini ui--media-1400']
  ], [t]);

  return (
    <div className={className}>
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Add delegation')}
          onClick={toggleDelegate}
        />
      </Button.Group>
      {isDelegateOpen && (
        <DelegateModal
          onClose={toggleDelegate}
        />
      )}
      <Table
        empty={t<string>('no delegation yet, add a new one')}
        header={header}
      >
        {(delegatingAccounts || []).map(({ accountDelegated, accountDelegating, amount, conviction, isFavorite }, index): React.ReactNode => (
          <Address
            accountDelegated={accountDelegated}
            accountDelegating={accountDelegating}
            amount={amount}
            conviction={conviction}
            isFavorite={isFavorite}
            key={accountDelegating.address}
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
