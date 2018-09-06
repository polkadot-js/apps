// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

let accountsQty: (accountAll?: Array<any>) => number;
let isAccounts: (accountAll?: Array<any>) => boolean;
let isNoAccounts: (accountAll?: Array<any>) => boolean;

accountsQty = (accountAll?: Array<any>): number =>
  isAccounts(accountAll) && accountAll ? Object.keys(accountAll).length : 0;

isAccounts = (accountAll?: Array<any>): boolean =>
  !isNoAccounts(accountAll);

isNoAccounts = (accountAll?: Array<any>): boolean =>
  !accountAll || !Object.keys(accountAll).length;

export {
  accountsQty,
  isAccounts,
  isNoAccounts
};
