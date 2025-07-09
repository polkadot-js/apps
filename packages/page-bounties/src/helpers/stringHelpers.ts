// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function insertSpaceBeforeCapitalLetter (str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export function truncateTitle (str: string, maxLength: number): string {
  return (str.length > maxLength)
    // ellipsis
    ? (str.substring(0, maxLength - 1) + String.fromCharCode(8230))
    : str;
}
