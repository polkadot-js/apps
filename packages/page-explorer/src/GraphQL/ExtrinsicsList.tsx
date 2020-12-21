import React, { useState, useEffect } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { useParams } from 'react-router-dom';
import Events from '../Events';
import Query from '../Query';

import { getSub, getQuery, extrinsicToPolkadot } from '../apollo-helpers';
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
      args
    }
  }
`;

function ExtrinsicsList (): React.ReactElement<Props> {
  const { api } = useApi();
  const { value } = useParams<{ value: string }>();
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
    <>
      <Query
        redirectPath="/explorer/extrinsics/"
        placeholder="transaction hash to query" />
      <Events events={lastEvents} title="extrinsics" />
    </>
  );
}

export default React.memo(ExtrinsicsList);
