// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

let accountsQty: (accountAll?: any[] | undefined) => number;
let isAccounts: (accountAll?: any[] | undefined) => boolean;
let isNoAccounts: (accountAll?: any[] | undefined) => boolean;
let showIsOrAre: (accountAll?: any[] | undefined) => string;
let showPlural: (accountAll?: any[] | undefined) => string;

accountsQty = (accountAll?: any[] | undefined): number => isAccounts(accountAll) && accountAll ? Object.keys(accountAll).length : 0;

isAccounts = (accountAll?: any[] | undefined): boolean => !isNoAccounts(accountAll);

isNoAccounts = (accountAll?: any[] | undefined): boolean => !accountAll || !Object.keys(accountAll).length;

showIsOrAre = (accountAll?: any[] | undefined): string => accountsQty(accountAll) === 0 || accountsQty(accountAll) > 1 ? 'are' : 'is';

showPlural = (accountAll?: any[] | undefined): string => accountsQty(accountAll) === 0 || accountsQty(accountAll) > 1 ? 's' : '';

export {
  accountsQty,
  isAccounts,
  isNoAccounts,
  showIsOrAre,
  showPlural
};
