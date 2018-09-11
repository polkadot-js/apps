// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const accountsQty = (allAccounts?: Array<any>): number =>
  isAccounts(allAccounts) && allAccounts ? Object.keys(allAccounts).length : 0;

const isAccounts = (allAccounts?: Array<any>): boolean =>
  !isNoAccounts(allAccounts);

const isNoAccounts = (allAccounts?: Array<any>): boolean =>
  !allAccounts || !Object.keys(allAccounts).length;

export {
  accountsQty,
  isAccounts,
  isNoAccounts
};
