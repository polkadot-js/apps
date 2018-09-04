// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

let accountsQty: (accountAll?: any[]) => number;
let isAccounts: (accountAll?: any[]) => boolean;
let isNoAccounts: (accountAll?: any[]) => boolean;
let showIsOrAre: (accountAll?: any[]) => string;
let showPlural: (accountAll?: any[]) => string;

accountsQty = (accountAll?: any[]): number => isAccounts(accountAll) && accountAll ? Object.keys(accountAll).length : 0;

isAccounts = (accountAll?: any[]): boolean => !isNoAccounts(accountAll);

isNoAccounts = (accountAll?: any[]): boolean => !accountAll || !Object.keys(accountAll).length;

showIsOrAre = (accountAll?: any[]): string => accountsQty(accountAll) === 0 || accountsQty(accountAll) > 1 ? 'are' : 'is';

showPlural = (accountAll?: any[]): string => accountsQty(accountAll) === 0 || accountsQty(accountAll) > 1 ? 's' : '';

export {
  accountsQty,
  isAccounts,
  isNoAccounts,
  showIsOrAre,
  showPlural
};
