// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyedEvent } from '@polkadot/react-query/types';
import styled from 'styled-components';
import { useTranslation } from './translate';

import React, { useState, useEffect, useRef } from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { Columar, Column, Table } from '@polkadot/react-components';
import { registry } from '@polkadot/react-api';
import { useApi } from '@polkadot/react-hooks';

import BlockHeaders from './BlockHeaders';
import Events from './Events';
import Transfers from './Transfers';
import Accounts from './Accounts';
import Epoch from './Epoch';

import { getSub, getQuery, blockToPolkadotBlock, eventToPolkadot, transferToPolkadot, accountToPolkadot } from './apollo-helpers';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

import { asDockAddress } from '@docknetwork/sdk/utils/codec';


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

function EpochDetails (props: Props): React.ReactElement<Props> {
  const epochId = props.match ? props.match.params.value : 1;

  const { api } = useApi();
  const { t } = useTranslation();
  const [ accounts, setAccounts ] = useState([]);

  const validatorHeaders = [
    [t('validators'), 'start', 4],
    [t('locked rewards')],
    [t('unlocked rewards')],
    [t('produced blocks'), 'expand', 2],
  ];

  const epochHeaders = useRef([
    [t('epoch'), 'start'],
    [t('validator count')],
    [t('starting slot')],
    [t('expected ending slot')],
    [t('ending slot')],
    [t('total emission')],
    [t('treasury rewards')],
    [t('validator rewards'), 'expand'],
    [],
  ]);

  async function loadValidatorStats() {
      const validatorStats = await api.query.poAModule.validatorStats.entries(epochId);
      setAccounts(validatorStats.map(element => {
        const validatorArgs = element[0].toHuman();
        const validatorId = validatorArgs[1]; // asDockAddress(validatorArgs[1], 'test');

        let locked = 0;
        let unlocked = 0;
        if (element[1].locked_reward.isSome) {
          locked = element[1].locked_reward.unwrap();
          unlocked = element[1].unlocked_reward.unwrap();
        }

        return {
          account: validatorId,
          produced_blocks: element[1].block_count,
          locked_reward: locked,
          unlocked_reward: unlocked,
        };
      }));
  }

  useEffect(() => {
    if (!accounts.length) {
      loadValidatorStats();
    }
  }, []);

  return (
    <>
      <Table
        empty={t<string>('No data available')}
        header={epochHeaders.current}
      >
        <Epoch key={epochId} value={{index: epochId}} />
      </Table>
      <Accounts headers={accounts} tableHeaders={validatorHeaders} useComplex={false} />
    </>
  );
}

export default React.memo(styled(EpochDetails)`
  .explorer--query {
    width: 20em;
  }
`);
