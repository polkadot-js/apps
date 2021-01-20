// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function truncateTitle (str: string, maxLength: number): string {
  const ellipsis = String.fromCharCode(8230);

  return (str.length > maxLength) ? str.substr(0, maxLength - 1) + ellipsis : str;
}
