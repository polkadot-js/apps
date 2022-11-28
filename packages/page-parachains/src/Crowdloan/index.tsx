// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionInfo, Campaigns, LeasePeriod, OwnedId } from '../types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useBestNumber } from '@polkadot/react-hooks';

import FundAdd from './FundAdd';
import Funds from './Funds';
import Summary from './Summary';

interface Props {
  auctionInfo?: AuctionInfo;
  campaigns: Campaigns;
  className?: string;
  leasePeriod?: LeasePeriod;
  ownedIds: OwnedId[];
}

function Crowdloan ({ auctionInfo, campaigns: { activeCap, activeRaised, funds, totalCap, totalRaised }, className, leasePeriod, ownedIds }: Props): React.ReactElement<Props> {
  const bestNumber = useBestNumber();

  return (
    <div className={className}>
      <Summary
        activeCap={activeCap}
        activeRaised={activeRaised}
        fundCount={funds ? funds.length : 0}
        totalCap={totalCap}
        totalRaised={totalRaised}
      />
      <Button.Group>
        <FundAdd
          auctionInfo={auctionInfo}
          bestNumber={bestNumber}
          leasePeriod={leasePeriod}
          ownedIds={ownedIds}
        />
      </Button.Group>
      <Funds
        bestNumber={bestNumber}
        leasePeriod={leasePeriod}
        value={funds}
      />
    </div>
  );
}

export default React.memo(Crowdloan);
