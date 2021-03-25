// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionInfo, LeasePeriod, OwnedId } from '../types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useBestNumber } from '@polkadot/react-hooks';

import FundAdd from './FundAdd';
import Funds from './Funds';
import Summary from './Summary';
import useFunds from './useFunds';

interface Props {
  auctionInfo: AuctionInfo;
  className?: string;
  leasePeriod: LeasePeriod | null;
  ownedIds: OwnedId[];
}

function Crowdloan ({ auctionInfo, className, leasePeriod, ownedIds }: Props): React.ReactElement<Props> {
  const bestNumber = useBestNumber();
  const { activeCap, activeRaised, funds, totalCap, totalRaised } = useFunds();

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
        value={funds}
      />
    </div>
  );
}

export default React.memo(Crowdloan);
