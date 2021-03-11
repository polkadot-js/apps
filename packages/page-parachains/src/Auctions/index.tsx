// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

import React from 'react';

import { useApi, useCallMulti } from '@polkadot/react-hooks';

import Auction from './Auction';
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
  const { auctionInfo, numAuctions } = useCallMulti<QueryState>([
    api.query.auctions.auctionCounter,
    api.query.auctions.auctionInfo
  ], optionsMulti);

  return (
    <div className={className}>
      <Summary numAuctions={numAuctions} />
      <Auction
        auctionInfo={auctionInfo}
        numAuctions={numAuctions}
      />
    </div>
  );
}

export default React.memo(Auctions);
