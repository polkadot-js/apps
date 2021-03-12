// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useCall, useCallMulti } from '@polkadot/react-hooks';

import Auction from './Auction';
import Bid from './Bid';
import Summary from './Summary';

interface Props {
  className?: string;
}

interface QueryState {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  numAuctions: AuctionIndex | null;
}

const optionsMulti = {
  defaultValue: {
    auctionInfo: null,
    numAuctions: null
  },
  transform: ([numAuctions, optInfo]: [AuctionIndex, Option<ITuple<[LeasePeriodOf, BlockNumber]>>]) => ({
    auctionInfo: optInfo.unwrapOr(null),
    numAuctions
  })
};

function Auctions ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const { auctionInfo, numAuctions } = useCallMulti<QueryState>([
    api.query.auctions.auctionCounter,
    api.query.auctions.auctionInfo
  ], optionsMulti);

  return (
    <div className={className}>
      <Summary
        auctionInfo={auctionInfo}
        bestNumber={bestNumber}
        numAuctions={numAuctions}
      />
      <Button.Group>
        <Bid id={auctionInfo && numAuctions} />
      </Button.Group>
      <Auction
        auctionInfo={auctionInfo}
        bestNumber={bestNumber}
        numAuctions={numAuctions}
      />
    </div>
  );
}

export default React.memo(Auctions);
