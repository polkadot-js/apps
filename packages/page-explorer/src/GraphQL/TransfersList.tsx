import React, { useState, useEffect } from 'react';
import { useApi } from '@polkadot/react-hooks';
import Transfers from '../Transfers';

import { getSub, getQuery, transferToPolkadot } from '../apollo-helpers';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const TRANSFERS_QUERY = gql`
  query extrinsic {
    extrinsic(
      order_by: { block_number: desc }
      where: {
        section: { _eq: "balances" }
        method: { _eq: "transfer" }
      }
      limit: 64
    ) {
      block_number
      signer
      hash
      args
    }
  }
`;

function TransfersList (): React.ReactElement<Props> {
  const { api } = useApi();
  const [ lastTransfers, setLastTransfers ] = useState([]);
  const [ transfersData, transfersError ] = getQuery(TRANSFERS_QUERY);

  useEffect(() => {
    if (transfersData) {
      Promise.all(transfersData.extrinsic.map(async (event) => {
        return transferToPolkadot(event, api);
      }))
        .then(completed => {
          setLastTransfers(completed);
        });
    }
  }, [transfersData]);

  return (
    <Transfers headers={lastTransfers} title="transfers" />
  );
}

export default React.memo(TransfersList);
