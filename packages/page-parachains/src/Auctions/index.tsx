// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useCallMulti } from '@polkadot/react-hooks';

import Auction from './Auction';
import Bid from './Bid';
import Summary from './Summary';
import useWinningData from './useWinningData';

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
  const { auctionInfo, numAuctions } = useCallMulti<QueryState>([
    api.query.auctions.auctionCounter,
    api.query.auctions.auctionInfo
  ], optionsMulti);
  const winningData = useWinningData(auctionInfo);

  return (
    <div className={className}>
      <Summary
        auctionInfo={auctionInfo}
        lastWinner={winningData && winningData[0]}
        numAuctions={numAuctions}
      />
      <Button.Group>
        <Bid
          auctionInfo={auctionInfo}
          id={ numAuctions}
        />
      </Button.Group>
      <Auction
        auctionInfo={auctionInfo}
        numAuctions={numAuctions}
        winningData={winningData}
      />
    </div>
  );
}

export default React.memo(Auctions);
