import React, { useState, useEffect } from 'react';
import { useApi } from '@polkadot/react-hooks';
import Events from '../Events';

import { getSub, getQuery, extrinsicToPolkadot } from '../apollo-helpers';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const EXTRINSIC_QUERY = gql`
  query extrinsics {
    extrinsic(order_by: { block_number: desc }, where: {}, limit: 64) {
      block_number
      extrinsic_index
      is_signed
      signer
      section
      method
      hash
      success
    }
  }
`;

function ExtrinsicsList (): React.ReactElement<Props> {
  const { api } = useApi();
  const [lastEvents, setLastEvents] = useState([]);
  const [ eventsData, eventsError ] = getSub(EXTRINSIC_QUERY);

  useEffect(() => {
    if (eventsData) {
      const events = eventsData.extrinsic.map(async (event) => {
        return extrinsicToPolkadot(event, api);
      });

      Promise.all(events)
        .then(completed => {
          setLastEvents(completed);
        });
    }
  }, [eventsData]);

  return (
    <Events events={lastEvents} title="extrinsics" />
  );
}

export default React.memo(ExtrinsicsList);
