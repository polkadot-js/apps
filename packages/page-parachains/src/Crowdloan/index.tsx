// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OwnedId } from '../types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useBestNumber } from '@polkadot/react-hooks';

import FundAdd from './FundAdd';
import Funds from './Funds';
import Summary from './Summary';
import useFunds from './useFunds';

interface Props {
  className?: string;
  ownedIds: OwnedId[];
}

function Crowdloan ({ className, ownedIds }: Props): React.ReactElement<Props> {
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
          bestNumber={bestNumber}
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
