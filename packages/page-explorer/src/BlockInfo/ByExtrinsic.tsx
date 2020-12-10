// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { BlockNumber } from '@polkadot/types/interfaces';
import { useApi, useCall } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import Query from '../Query';
import ByTxHash from './ByTxHash';

import { useLazyQuery } from 'react-apollo';

import { getQuery } from '../apollo-helpers';
import gql from 'graphql-tag';

const EXTRINSIC_QUERY = gql`
  query ExtrinsicSearchQuery($filter: String!) {
    extrinsic(order_by: { block_number: desc }, where: {
      hash: { _eq: $filter }
    }, limit: 64) {
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

function Entry (): React.ReactElement | null {
  const { api } = useApi();
  const { value } = useParams<{ value: string }>();
  const [stateValue, setStateValue] = useState<array>([]);
  const [executeSearch, queryResult] = useLazyQuery(
    EXTRINSIC_QUERY
  );

  function getExtrinsics() {
    const { data } = queryResult;
    if (!data) {
      return false;
    }

    const extrinsics = data.extrinsic;
    if (!extrinsics || extrinsics.length === 0) {
      return false;
    }

    return extrinsics;
  }

  function getExtrinsicIndex(index) {
    const extrinsics = getExtrinsics();
    if (!extrinsics) {
      return;
    }
    return extrinsics[index] && extrinsics[index].extrinsic_index;
  }

  useEffect((): void => {
    const extrinsics = getExtrinsics();
    if (!extrinsics) {
      return;
    }

    // TODO: Store block hash in database to remove need for this lookup
    const promises = extrinsics.map(extrinsic => api.rpc.chain.getBlockHash(extrinsic.block_number));
    Promise.all(promises)
      .then(result => {
        setStateValue(result);
      });
  }, [queryResult]);

  useEffect((): void => {
    if (value) {
      executeSearch({
        variables: { filter: value }
      });
    }
  }, [value]);

  if (!stateValue) {
    return null;
  }

  return (
    <>
      <Query
        redirectPath="/explorer/extrinsics/"
        placeholder="transaction hash to query" />
      {stateValue.map((txBlockHash, index) => (
        <ByTxHash
          key={txBlockHash}
          value={txBlockHash}
          extrinsicIndex={getExtrinsicIndex(index)}
        />
      ))}
    </>
  );
}

export default React.memo(Entry);
