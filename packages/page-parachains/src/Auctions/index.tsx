// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionInfo, Campaigns, OwnedId, Winning } from '../types.js';

import React from 'react';

import { Button } from '@polkadot/react-components';

import Auction from './Auction.js';
import Bid from './Bid.js';
import Summary from './Summary.js';

interface Props {
  auctionInfo?: AuctionInfo;
  campaigns: Campaigns;
  className?: string;
  ownedIds: OwnedId[];
  winningData?: Winning[];
}

function Auctions ({ auctionInfo, campaigns, className, ownedIds, winningData }: Props): React.ReactElement<Props> {
  const lastWinners = winningData?.[0];

  return (
    <div className={className}>
      <Summary
        auctionInfo={auctionInfo}
        lastWinners={lastWinners}
      />
      <Button.Group>
        <Bid
          auctionInfo={auctionInfo}
          lastWinners={lastWinners}
          ownedIds={ownedIds}
        />
      </Button.Group>
      <Auction
        auctionInfo={auctionInfo}
        campaigns={campaigns}
        winningData={winningData}
      />
    </div>
  );
}

export default React.memo(Auctions);
