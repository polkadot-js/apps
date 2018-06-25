// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const ACCOUNT_PREFIX = 'account:';
const ADDRESS_PREFIX = 'address:';

export const accountKey = (address: string): string =>
  `${ACCOUNT_PREFIX}${address}`;

export const addressKey = (address: string): string =>
  `${ADDRESS_PREFIX}${address}`;

export const accountRegex = new RegExp(`^${ACCOUNT_PREFIX}`, '');

export const addressRegex = new RegExp(`^${ADDRESS_PREFIX}`, '');
