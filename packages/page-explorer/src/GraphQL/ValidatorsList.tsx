import React, { useState, useEffect } from 'react';
import { useApi } from '@polkadot/react-hooks';
import Accounts from '../Accounts';
import { useTranslation } from '../translate';

import { getSub, getQuery, accountToPolkadot } from '../apollo-helpers';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const VALIDATORS_QUERY = gql`
  query validator {
    validator(
      order_by: { rank: asc }
    ) {
      account_id
      stash_id
      commission
      next_elected
      exposure_others
      exposure_own
      exposure_total
      produced_blocks
      rank
    }
  }
`;

function ValidatorsList (): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [ accounts, setAccounts ] = useState([]);
  const [ accountsData, accountsError ] = getQuery(VALIDATORS_QUERY);
  const headers = [
    [t('validators'), 'start', 5],
    [t('produced blocks'), 'expand'],
  ];

  useEffect(() => {
    if (accountsData) {
      const accounts = accountsData.validator.map(accountToPolkadot);
      setAccounts(accounts);
    }
  }, [accountsData]);

  return (
    <Accounts headers={accounts} tableHeaders={headers} useComplex={false} />
  );
}

export default React.memo(ValidatorsList);
