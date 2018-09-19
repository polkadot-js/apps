// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const hasNoAccounts = (allAccounts?: Array<Object>): boolean =>
  !allAccounts || !Object.keys(allAccounts).length;

const isAccounts = (allAccounts?: Array<Object>): boolean =>
  !hasNoAccounts(allAccounts);

const accountsQty = (allAccounts?: Array<Object>): number =>
  isAccounts(allAccounts) && allAccounts ? Object.keys(allAccounts).length : 0;

export {
  accountsQty,
  isAccounts,
  hasNoAccounts
};
