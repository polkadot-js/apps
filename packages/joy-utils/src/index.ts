import BN from 'bn.js';

export const ZERO = new BN(0);

// String, Numbers, Object
// --------------------------------------

export const isDefined = (x: any): boolean =>
  !notDefined(x);

export const isDef = isDefined;

export const notDefined = (x: any): boolean =>
  x === null || typeof x === 'undefined';

export const notDef = notDefined;

export const isObj = (x: any): boolean =>
  x !== null && typeof x === 'object';

export const isStr = (x: any): boolean =>
  typeof x === 'string';

export const isNum = (x: any): boolean =>
  typeof x === 'number';

export const isEmptyStr = (x: any): boolean =>
  notDefined(x) || isStr(x) && x.trim().length === 0;

export const nonEmptyStr = (x?: any) =>
  isStr(x) && x.trim().length > 0;

export const parseNumStr = (num: string): number | undefined => {
  try {
    return parseInt(num, undefined);
  } catch (err) {
    return undefined;
  }
};

export const nonEmptyArr = (x: any): boolean =>
  Array.isArray(x) && x.length > 0;

// Keyring stuff:
// --------------------------------------

import keyring from '@polkadot/ui-keyring';

export function findNameByAddress (address: string): string | undefined {
  try {
    return keyring.getAccount(address).getMeta().name;
  } catch (error) {
    try {
      return keyring.getAddress(address).getMeta().name;
    } catch (error) {
      // ok, we don't have account or address
      return undefined;
    }
  }
}

export function isKnownAddress (address: string): boolean {
  return isDefined(findNameByAddress(address));
}

// Joystream Stake utils
// --------------------------------------

import { Stake, Backer } from './types';

export function calcTotalStake (stakes: Stake | Stake[] | undefined): BN {
  if (typeof stakes === 'undefined') {
    return ZERO;
  }
  const total = (stake: Stake) => stake.new.add(stake.transferred);
  try {
    if (Array.isArray(stakes)) {
      return stakes.reduce((accum, stake) => {
        return accum.add(total(stake));
      }, ZERO);
    } else {
      return total(stakes);
    }
  } catch (err) {
    console.log('Failed to calculate a total stake', stakes, err);
    return ZERO;
  }
}

export function calcBackersStake (backers: Backer[]): BN {
  return backers.map(b => b.stake).reduce((accum, stake) => {
    return accum.add(stake);
  }, ZERO);
}

// Substrate/Polkadot API utils
// --------------------------------------

import { Options as QueryOptions } from '@polkadot/ui-api/with/types';

/** Example of apiQuery: 'query.councilElection.round' */
export function queryToProp (apiQuery: string): [string, QueryOptions] {
  const propName = apiQuery.split('.').slice(-1)[0];
  return [apiQuery, { propName }];
}

// Parse URLs
// --------------------------------------

import queryString from 'query-string';

export function getUrlParam (location: Location, paramName: string, deflt: string | undefined = undefined): string | undefined {
  const params = queryString.parse(location.search);
  return params[paramName] ? params[paramName] as string : deflt;
}
