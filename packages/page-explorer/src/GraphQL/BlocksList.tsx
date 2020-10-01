import React, { useState, useEffect } from 'react';
import BlockHeaders from '../BlockHeaders';

import { getSub, getQuery, blockToPolkadotBlock } from '../apollo-helpers';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const BLOCK_QUERY = gql`
  query block {
    block(limit: 64, order_by: { timestamp: desc }) {
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

function BlocksList (): React.ReactElement<Props> {
  const [blocks, setBlocks] = useState([]);
  const [ data, error, loading ] = getSub(BLOCK_QUERY);

  useEffect(() => {
    if (data) {
      const blocks = data.block.map(blockToPolkadotBlock);
      setBlocks(blocks);
    }
  }, [data]);

  return (
    <BlockHeaders headers={blocks} title="blocks" />
  );
}

export default React.memo(BlocksList);
