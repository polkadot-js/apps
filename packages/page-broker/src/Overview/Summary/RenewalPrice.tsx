// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useBrokerSalesInfo } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

interface Props {
  className?: string;
  children?: React.ReactNode;
  renewalBump?: string;
  currentPrice?: string;
}

function RenewalPrice (): React.ReactElement<Props> | null {
  const salesInfo = useBrokerSalesInfo();

  return (
    <div className='ui--balance-value'>
      {formatBalance(salesInfo?.endPrice) || '-'}
    </div>
  );
}

export default React.memo(RenewalPrice);
