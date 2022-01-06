// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { AuctionInfo } from './types';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

const optionsMulti = {
  transform: ([numAuctions, optInfo]: [AuctionIndex, Option<ITuple<[LeasePeriodOf, BlockNumber]>>]): AuctionInfo => {
    const [leasePeriod, endBlock] = optInfo.unwrapOr([null, null]);

    return {
      endBlock,
      leasePeriod,
      numAuctions
    };
  }
};

function useAuctionInfoImpl (): AuctionInfo | undefined {
  const { api } = useApi();

  return useCallMulti<AuctionInfo>([
    api.query.auctions?.auctionCounter,
    api.query.auctions?.auctionInfo
  ], optionsMulti);
}

export default createNamedHook('useAuctionInfo', useAuctionInfoImpl);
