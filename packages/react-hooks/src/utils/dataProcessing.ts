// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';

export function hexToBin (hex: string): string {
  return parseInt(hex, 16).toString(2);
}

export function processHexMask (mask: PalletBrokerScheduleItem['mask'] | undefined): string[] {
  if (!mask) {
    return [];
  }

  const trimmedHex: string = mask.toHex().slice(2);
  const arr: string[] = trimmedHex.split('');
  const buffArr: string[] = [];

  arr.forEach((bit) => {
    hexToBin(bit).split('').forEach((v) => buffArr.push(v));
  });
  buffArr.filter((v) => v === '1');

  return buffArr;
}
