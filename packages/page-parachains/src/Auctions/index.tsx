// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionInfo, OwnedId } from '../types';

import React from 'react';

import { Button } from '@polkadot/react-components';

import Auction from './Auction';
import Bid from './Bid';
import Summary from './Summary';
import useWinningData from './useWinningData';

interface Props {
  auctionInfo: AuctionInfo;
  className?: string;
  ownedIds: OwnedId[];
}

function Auctions ({ auctionInfo, className, ownedIds }: Props): React.ReactElement<Props> {
  const winningData = useWinningData(auctionInfo);

  return (
    <div className={className}>
      <Summary
        auctionInfo={auctionInfo}
        lastWinner={winningData && winningData[0]}
      />
      <Button.Group>
        <Bid
          auctionInfo={auctionInfo}
          ownedIds={ownedIds}
        />
      </Button.Group>
      <Auction
        auctionInfo={auctionInfo}
        winningData={winningData}
      />
    </div>
  );
}

export default React.memo(Auctions);
