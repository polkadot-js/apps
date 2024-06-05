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

function RenewalPrice({ currentPrice, renewalBump }: Props): React.ReactElement<Props> | null {
  const percentage = renewalBump === undefined ? 0 : Number.parseInt(renewalBump) / 1000000000;

  console.log(percentage);

  const price = currentPrice === undefined ? 0 : Number.parseInt(currentPrice);

  console.log(currentPrice);

  const renewalPrice = price * percentage + price;

  console.log(renewalPrice);

  return (
    <div className='ui--balance-value'>
      {formatBalance(renewalPrice)}
    </div>

  );
}

export default React.memo(RenewalPrice);
