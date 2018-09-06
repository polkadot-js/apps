// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

let accountsQty: (accountAll?: Array<any>) => number;
let isAccounts: (accountAll?: Array<any>) => boolean;
let isNoAccounts: (accountAll?: Array<any>) => boolean;
let showIsOrAre: (accountAll?: Array<any>) => string;
let showPlural: (accountAll?: Array<any>) => string;

accountsQty = (accountAll?: Array<any>): number =>
  isAccounts(accountAll) && accountAll ? Object.keys(accountAll).length : 0;

isAccounts = (accountAll?: Array<any>): boolean =>
  !isNoAccounts(accountAll);

isNoAccounts = (accountAll?: Array<any>): boolean =>
  !accountAll || !Object.keys(accountAll).length;

showIsOrAre = (accountAll?: Array<any>): string => accountsQty(accountAll) === 0 || accountsQty(accountAll) > 1 ? 'are' : 'is';

showPlural = (accountAll?: Array<any>): string => accountsQty(accountAll) === 0 || accountsQty(accountAll) > 1 ? 's' : '';

export {
  accountsQty,
  isAccounts,
  isNoAccounts,
  showIsOrAre,
  showPlural
};
