// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function hexToBin (hex: string): string {
  return parseInt(hex, 16).toString(2);
}
