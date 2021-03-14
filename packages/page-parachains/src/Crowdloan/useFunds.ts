// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { FundInfo } from '@polkadot/types/interfaces';
import type { Campaign } from './types';

import BN from 'bn.js';
import { useEffect, useMemo, useState } from 'react';

import { useApi, useCall, useCallMulti } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import useFundIndexes from './useFundIndexes';

interface Result {
  funds: Campaign[] | null;
  totalCap: BN;
  totalRaised: BN;
}

const EMPTY = { funds: null, totalCap: BN_ZERO, totalRaised: BN_ZERO };

export default function useFunds (): Result {
  const { api } = useApi();
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const paraIds = useFundIndexes();
  const optFunds = useCallMulti<Option<FundInfo>[]>(paraIds.map((id) => [api.query.crowdloan.funds, id]));
  const [result, setResult] = useState<Result>(EMPTY);

  // we actually want to split this further info completed and ongoing
  const campaigns = useMemo(
    () => optFunds && paraIds.length === optFunds.length
      ? paraIds
        .map((paraId, i) => ({ info: optFunds[i].unwrapOr(null), paraId }))
        .filter((fund): fund is Campaign => !!fund.info)
      : null,
    [optFunds, paraIds]
  );

  // here we manually add the actual ending status and calculate the totals
  useEffect((): void => {
    bestNumber && campaigns && setResult((prev): Result => {
      const [totalRaised, totalCap] = campaigns.reduce(([r, c], { info: { cap, raised } }) => [r.iadd(raised), c.iadd(cap)], [new BN(0), new BN(0)]);
      const hasNewCap = !prev.totalCap.eq(totalCap);
      const hasNewRaised = !prev.totalRaised.eq(totalRaised);
      const hasChanged =
        !prev.funds || hasNewCap || hasNewRaised ||
        campaigns.some(({ info: { end }, isEnded }) => !isEnded && bestNumber.gt(end));

      if (!hasChanged) {
        return prev;
      }

      return {
        funds: campaigns.map((data): Campaign => {
          if (!data.isEnded && bestNumber.gt(data.info.end)) {
            data.isEnded = true;
          }

          return data;
        }),
        totalCap: hasNewCap ? totalCap : prev.totalCap,
        totalRaised: hasNewRaised ? totalRaised : prev.totalRaised
      };
    });
  }, [bestNumber, campaigns]);

  return result;
}
