// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionInfo, Campaigns, OwnedId, Winning } from '../types';

import React from 'react';

import { Button } from '@polkadot/react-components';

import Auction from './Auction';
import Bid from './Bid';
import Summary from './Summary';

interface Props {
  auctionInfo?: AuctionInfo;
  campaigns: Campaigns;
  className?: string;
  ownedIds: OwnedId[];
  winningData?: Winning[];
}

function Auctions ({ auctionInfo, campaigns, className, ownedIds, winningData }: Props): React.ReactElement<Props> {
  const lastWinners = winningData && winningData[0];

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
