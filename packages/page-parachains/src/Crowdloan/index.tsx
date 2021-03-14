// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { FundInfo } from '@polkadot/types/interfaces';
import type { Campaign } from './types';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useCall, useCallMulti } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import FundAdd from './FundAdd';
import Funds from './Funds';
import Summary from './Summary';
import useFundIndexes from './useFundIndexes';

interface Props {
  className?: string;
}

function Crowdloan ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const paraIds = useFundIndexes();
  const optFunds = useCallMulti<Option<FundInfo>[]>(paraIds.map((id) => [api.query.crowdloan.funds, id]));

  // we actually want to split this further info completed and ongoing
  const campaigns = useMemo(
    () => optFunds && paraIds.length === optFunds.length
      ? paraIds
        .map((paraId, i) => ({ info: optFunds[i].unwrapOr(null), paraId }))
        .filter((fund): fund is Campaign => !!fund.info)
      : null,
    [optFunds, paraIds]
  );

  const totals = useMemo(
    (): [BN, BN] => campaigns
      ? campaigns.reduce(([r, c], { info: { cap, raised } }) => [r.iadd(raised), c.iadd(cap)], [new BN(0), new BN(0)])
      : [BN_ZERO, BN_ZERO],
    [campaigns]
  );

  return (
    <div className={className}>
      <Summary
        fundCount={paraIds.length}
        totals={totals}
      />
      <Button.Group>
        <FundAdd bestNumber={bestNumber} />
      </Button.Group>
      <Funds
        bestNumber={bestNumber}
        value={campaigns}
      />
    </div>
  );
}

export default React.memo(Crowdloan);
