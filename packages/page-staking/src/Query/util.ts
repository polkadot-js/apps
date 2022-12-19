// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartOptions } from 'chart.js';
import type { BN } from '@polkadot/util';

import { BN_THOUSAND, BN_ZERO, isBn, isFunction } from '@polkadot/util';

interface ToBN {
  toBn: () => BN;
}

export const chartOptions = {
  plugins: {
    crosshair: {
      line: {
        color: '#ff8c00',
        dashPattern: [5, 5],
        width: 2
      },
      snapping: {
        enabled: true
      },
      sync: {
        enabled: true,
        group: Date.now()
      },
      // this would be nice, but atm just doesn't quite
      // seem or feel intuitive...
      zoom: {
        enabled: false
      }
    },
    tooltip: {
      intersect: false
    }
  }
} as unknown as ChartOptions;

export function balanceToNumber (amount: BN | ToBN = BN_ZERO, divisor: BN): number {
  const value = isBn(amount)
    ? amount
    : isFunction(amount.toBn)
      ? amount.toBn()
      : BN_ZERO;

  return value.mul(BN_THOUSAND).div(divisor).toNumber() / 1000;
}
