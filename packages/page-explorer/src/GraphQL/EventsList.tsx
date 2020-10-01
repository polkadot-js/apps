import React, { useState, useEffect } from 'react';
import { useApi } from '@polkadot/react-hooks';
import Events from '../Events';

import { getSub, getQuery, blockToPolkadotBlock, eventToPolkadot } from '../apollo-helpers';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const EVENT_QUERY = gql`
  query events {
    event(order_by: { block_number: desc }, where: {}, limit: 64) {
      block_number
      event_index
      data
      method
      phase
      section
    }
  }
`;

function EventsList (): React.ReactElement<Props> {
  const { api } = useApi();
  const [lastEvents, setLastEvents] = useState([]);
  const [ eventsData, eventsError ] = getSub(EVENT_QUERY);

  useEffect(() => {
    if (eventsData) {
      const events = eventsData.event.map(async (event) => {
        return eventToPolkadot(event, api);
      });

      Promise.all(events)
        .then(completed => {
          setLastEvents(completed);
        });
    }
  }, [eventsData]);

  return (
    <Events events={lastEvents} title="events" />
  );
}

export default React.memo(EventsList);
