// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';
import { AccountId, Balance, AccountIndex, Address } from '@polkadot/types/interfaces';
import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import assetsRegistry, {SPENDING_ASSET_NAME, STAKING_ASSET_NAME} from './assetsRegistry';
import FormatBalance from './FormatBalance';
import BN from 'bn.js';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

export default function AvailableDisplay ({ children, className, label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  const cennzBalance = useCall<Balance>(api.query.genericAsset.freeBalance as any, [assetsRegistry.getStakingAssetId(), params]);
  const cpayBalance = useCall<Balance>(api.query.genericAsset.freeBalance as any, [assetsRegistry.getSpendingAssetId(), params]);
  const zeroBalance = new BN(0);

  // Show CENNZ balance unless it's 0 and CPAY is non-zero
  const [displayBalance, displaySymbol] =
    cennzBalance?.eq(zeroBalance) && cpayBalance?.gt(zeroBalance) ?
    [cpayBalance, SPENDING_ASSET_NAME]: [cennzBalance, STAKING_ASSET_NAME];

  return (
    <FormatBalance
      className={className}
      label={label}
      value={displayBalance}
      symbol={displaySymbol}
    >
      {children}
    </FormatBalance>
  );
}
