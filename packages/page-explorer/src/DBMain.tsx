// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyedEvent } from '@polkadot/react-query/types';

import React, { useState, useEffect } from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { Columar, Column } from '@polkadot/react-components';
import { registry } from '@polkadot/react-api';
import { useApi } from '@polkadot/react-hooks';

import BlockHeaders from './BlockHeaders';
import Events from './Events';
import Transfers from './Transfers';
import Accounts from './Accounts';

import { getSub, getQuery, blockToPolkadotBlock, eventToPolkadot, transferToPolkadot, accountToPolkadot } from './apollo-helpers';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const BLOCK_QUERY = gql`
  query block {
    block(limit: 10, order_by: { timestamp: desc }) {
      block_author
      block_hash
      block_number
      timestamp
      parent_hash
      state_root
      extrinsics_root
    }
  }
`;

const EVENT_QUERY = gql`
  query events {
    event(order_by: { block_number: desc }, where: {
      section: { _neq: "system" }
      method: { _neq: "ExtrinsicSuccess" }
    }, limit: 10) {
      block_number
      event_index
      data
      method
      phase
      section
    }
  }
`;

const TRANSFERS_QUERY = gql`
  query extrinsic {
    extrinsic(
      order_by: { block_number: desc }
      where: {
        section: { _eq: "balances" }
        method: { _eq: "transfer" }
      }
      limit: 10
    ) {
      block_number
      signer
      hash
      args
    }
  }
`;

const ACCOUNTS_QUERY = gql`
  query accounts {
    account(order_by: { free_balance: desc }, where: {}, limit: 10) {
      account_id
      free_balance
      nonce
    }
  }
`;

function DBMain (): React.ReactElement<Props> {
  const { api } = useApi();
  const [lastBlocks, setLastBlocks] = useState([]);
  const [lastEvents, setLastEvents] = useState([]);
  const [lastTransfers, setLastTransfers] = useState([]);
  const [richAccounts, setRichAccounts] = useState([]);

  const [ data, error ] = getQuery(BLOCK_QUERY);
  const [ eventsData, eventsError ] = getQuery(EVENT_QUERY);
  const [ transfersData, transfersError ] = getQuery(TRANSFERS_QUERY);
  const [ richAccountsData, richAccountsError ] = getQuery(ACCOUNTS_QUERY);

  useEffect(() => {
    if (eventsData) {
      Promise.all(eventsData.event.map(async (event) => {
        return eventToPolkadot(event, api);
      }))
        .then(completed => {
          setLastEvents(completed);
        });
    }
  }, [eventsData]);

  useEffect(() => {
    if (richAccountsData) {
      const richAccounts = richAccountsData.account.map(accountToPolkadot);
      setRichAccounts(richAccounts);
    }
  }, [richAccountsData]);

  useEffect(() => {
    if (data) {
      const blocks = data.block.map(blockToPolkadotBlock);
      setLastBlocks(blocks);
    }
  }, [data]);

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
    <>
      <Columar>
        <Column>
          <BlockHeaders headers={lastBlocks} title="last blocks" hideLongFields={true} />
        </Column>
        <Column>
          <Events events={lastEvents} title="last events" hideLongFields={true} />
        </Column>
      </Columar>
      <Columar>
        <Column>
          <Transfers headers={lastTransfers} title="last transfers" hideLongFields={true} />
        </Column>
        <Column>
          <Accounts headers={richAccounts} title="top 10 rich accounts" hideLongFields={true} useComplex={false} />
        </Column>
      </Columar>
    </>
  );
}

export default React.memo(DBMain);
