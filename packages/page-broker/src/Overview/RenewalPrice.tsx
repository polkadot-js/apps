// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { formatBalance } from '@polkadot/util';

interface Props {
  className?: string;
  children?: React.ReactNode;
  renewalBump?: string;
  currentPrice?: string;
}

function RenewalPrice ({ currentPrice, renewalBump }: Props): React.ReactElement<Props> | null {
  const percentage = renewalBump ? Number.parseInt(renewalBump) / 1000000000 : 0;

  const price = currentPrice ? Number.parseInt(currentPrice) : 0;

  const renewalPrice = price * percentage + price;

  return (
    <div className='ui--balance-value'>
      {formatBalance(renewalPrice)}
    </div>

  );
}

export default React.memo(RenewalPrice);
