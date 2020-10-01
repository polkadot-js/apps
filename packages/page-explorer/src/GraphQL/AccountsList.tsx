import React, { useState, useEffect } from 'react';
import { useApi } from '@polkadot/react-hooks';
import Accounts from '../Accounts';
import { useTranslation } from '../translate';

import { getSub, getQuery, accountToPolkadot } from '../apollo-helpers';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const ACCOUNTS_QUERY = gql`
  query accounts {
    account(order_by: { free_balance: desc }, where: {}, limit: 64) {
      account_id
      free_balance
      locked_balance
      available_balance
      nonce
    }
  }
`;

function AccountsList (): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [ accounts, setAccounts ] = useState([]);
  const [ accountsData, accountsError ] = getQuery(ACCOUNTS_QUERY);
  const headers = [
    [t('active accounts'), 'start', 3],
    [t('type'), 'address media--1400'],
    [t('tags'), 'start'],
    [t('transactions'), 'media--1500'],
    [t('balances'), 'expand'],
    [],
  ];

  useEffect(() => {
    if (accountsData) {
      const accounts = accountsData.account.map(accountToPolkadot);
      setAccounts(accounts);
    }
  }, [accountsData]);

  return (
    <Accounts headers={accounts} tableHeaders={headers} />
  );
}

export default React.memo(AccountsList);
